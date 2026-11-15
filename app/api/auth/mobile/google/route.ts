import { NextResponse } from "next/server";
import {
  issueMobileSession,
  upsertGoogleUser,
  verifyGoogleIdToken,
} from "@/lib/auth/mobile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idToken, nonce, deviceId, platform } = body ?? {};

    if (
      typeof idToken !== "string" ||
      typeof deviceId !== "string" ||
      (platform !== "ios" && platform !== "android")
    ) {
      return NextResponse.json(
        { error: "Invalid request.", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const identity = await verifyGoogleIdToken(idToken);

    if (nonce && identity.nonce !== nonce) {
      return NextResponse.json(
        { error: "Invalid nonce.", code: "INVALID_NONCE" },
        { status: 401 },
      );
    }

    const user = await upsertGoogleUser(identity);
    const session = await issueMobileSession({
      userId: user.id,
      deviceId,
      platform,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Mobile Google auth failed:", error);
    return NextResponse.json(
      { error: "Authentication failed.", code: "AUTH_FAILED" },
      { status: 401 },
    );
  }
}
