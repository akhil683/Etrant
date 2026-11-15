import { createHash, randomBytes } from "crypto";
import { createRemoteJWKSet, jwtVerify, SignJWT } from "jose";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { accounts, mobileRefreshTokens, users } from "@/lib/db/schema";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_DAYS = 60;

const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export type PublicUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  plan: string | null;
  subscriptionActive: boolean | null;
  points: number | null;
  streak: number | null;
};

export type MobileSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: PublicUser;
};

export type GoogleIdentity = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
  nonce?: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return new TextEncoder().encode(secret);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function signAccessToken(user: PublicUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    image: user.image,
    typ: "mobile-access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });

    if (payload.typ !== "mobile-access" || typeof payload.sub !== "string") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleIdentity> {
  const configuredAudiences = [
    process.env.GOOGLE_MOBILE_CLIENT_IDS,
    process.env.GOOGLE_CLIENT_ID,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredAudiences.length === 0) {
    throw new Error("GOOGLE_MOBILE_CLIENT_IDS is not configured.");
  }

  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: configuredAudiences,
  });

  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    payload.email_verified !== true
  ) {
    throw new Error("Google token is missing a verified email.");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: true,
    name: typeof payload.name === "string" ? payload.name : null,
    picture: typeof payload.picture === "string" ? payload.picture : null,
    nonce: typeof payload.nonce === "string" ? payload.nonce : undefined,
  };
}

export async function upsertGoogleUser(identity: GoogleIdentity) {
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, identity.email));

  let user = existing;

  if (user) {
    const [updated] = await db
      .update(users)
      .set({
        name: identity.name ?? user.name,
        image: identity.picture ?? user.image,
        emailVerified: user.emailVerified ?? new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();
    user = updated;
  } else {
    const [created] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name: identity.name,
        email: identity.email,
        emailVerified: new Date(),
        image: identity.picture,
        joinDate: new Date().toISOString().slice(0, 10),
      })
      .returning();
    user = created;
  }

  await db
    .insert(accounts)
    .values({
      userId: user.id,
      type: "oidc",
      provider: "google",
      providerAccountId: identity.sub,
    })
    .onConflictDoNothing();

  return user;
}

export async function getPublicUser(userId: string): Promise<PublicUser> {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      plan: users.plan,
      subscriptionActive: users.subscriptionActive,
      points: users.points,
      streak: users.streak,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export async function issueMobileSession(input: {
  userId: string;
  deviceId: string;
  platform: "ios" | "android";
}): Promise<MobileSession> {
  const user = await getPublicUser(input.userId);
  const accessToken = await signAccessToken(user);
  const refreshToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  );

  await db.insert(mobileRefreshTokens).values({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    deviceId: input.deviceId,
    platform: input.platform,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
    expiresAt: expiresAt.getTime(),
    user,
  };
}

export async function rotateMobileSession(input: {
  refreshToken: string;
  deviceId: string;
}): Promise<MobileSession | null> {
  const tokenHash = hashToken(input.refreshToken);
  const [stored] = await db
    .select()
    .from(mobileRefreshTokens)
    .where(
      and(
        eq(mobileRefreshTokens.tokenHash, tokenHash),
        eq(mobileRefreshTokens.deviceId, input.deviceId),
        isNull(mobileRefreshTokens.revokedAt),
        gt(mobileRefreshTokens.expiresAt, new Date()),
      ),
    );

  if (!stored) {
    return null;
  }

  await db
    .update(mobileRefreshTokens)
    .set({ revokedAt: new Date(), lastUsedAt: new Date() })
    .where(eq(mobileRefreshTokens.id, stored.id));

  return issueMobileSession({
    userId: stored.userId,
    deviceId: stored.deviceId,
    platform: stored.platform === "ios" ? "ios" : "android",
  });
}

export async function revokeMobileSession(refreshToken: string) {
  await db
    .update(mobileRefreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(mobileRefreshTokens.tokenHash, hashToken(refreshToken)));
}
