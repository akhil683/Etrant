import { NextResponse } from "next/server";
import { rotateMobileSession } from "@/lib/auth/mobile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken, deviceId } = body ?? {};

    if (typeof refreshToken !== "string" || typeof deviceId !== "string") {
      return NextResponse.json(
        { error: "Invalid request.", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const session = await rotateMobileSession({ refreshToken, deviceId });

    if (!session) {
      return NextResponse.json(
        { error: "Session expired.", code: "SESSION_EXPIRED" },
        { status: 401 },
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Mobile refresh failed:", error);
    return NextResponse.json(
      { error: "Could not refresh the session.", code: "REFRESH_FAILED" },
      { status: 500 },
    );
  }
}
