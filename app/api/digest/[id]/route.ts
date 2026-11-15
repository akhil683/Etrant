import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { dailyDigest } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/request-user";
import { getSubscriptionStatus } from "@/lib/subscription";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireUser(request);
    if ("response" in authResult) return authResult.response;

    const status = await getSubscriptionStatus(authResult.user.id);
    if (!status.active) {
      return NextResponse.json(
        { error: "Subscription required.", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const digestId = Number(id);

    if (!Number.isInteger(digestId) || digestId <= 0) {
      return NextResponse.json({ error: "Invalid digest id." }, { status: 400 });
    }

    const [article] = await db
      .select()
      .from(dailyDigest)
      .where(eq(dailyDigest.id, digestId));

    if (!article) {
      return NextResponse.json({ error: "Digest not found." }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to load digest detail:", error);
    return NextResponse.json(
      { error: "Could not load the digest." },
      { status: 500 },
    );
  }
}
