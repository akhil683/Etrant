import { NextResponse } from "next/server";
import { revokeMobileSession } from "@/lib/auth/mobile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body ?? {};

    if (typeof refreshToken !== "string") {
      return NextResponse.json(
        { error: "Invalid request.", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    await revokeMobileSession(refreshToken);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mobile logout failed:", error);
    return NextResponse.json(
      { error: "Could not sign out.", code: "LOGOUT_FAILED" },
      { status: 500 },
    );
  }
}
