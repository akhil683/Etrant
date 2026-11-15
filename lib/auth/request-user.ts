import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAccessToken } from "@/lib/auth/mobile";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
};

export async function getRequestUser(req: Request): Promise<AuthUser | null> {
  const header = req.headers.get("authorization");

  if (header?.startsWith("Bearer ")) {
    const claims = await verifyAccessToken(header.slice(7).trim());
    if (claims) {
      return {
        id: claims.sub as string,
        email: typeof claims.email === "string" ? claims.email : null,
        name: typeof claims.name === "string" ? claims.name : null,
        image: typeof claims.image === "string" ? claims.image : null,
      };
    }
  }

  try {
    const session = await auth();
    if (session?.user?.id) {
      return {
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function requireUser(
  req: Request,
): Promise<{ user: AuthUser } | { response: NextResponse }> {
  const user = await getRequestUser(req);

  if (!user) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      ),
    };
  }

  return { user };
}
