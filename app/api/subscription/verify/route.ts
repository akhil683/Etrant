import { NextRequest, NextResponse } from "next/server";
import { getSubscriptionStatus } from "@/lib/subscription";
import { requireUser } from "@/lib/auth/request-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireUser(request);
    if ("response" in authResult) return authResult.response;
    const { user } = authResult;

    const status = await getSubscriptionStatus(user.id);

    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Failed to read subscription status:", error);
    return NextResponse.json(
      { error: "Could not load subscription status." },
      { status: 500 },
    );
  }
}
