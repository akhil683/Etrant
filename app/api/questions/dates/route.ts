import { NextRequest, NextResponse } from "next/server";
import { and, desc, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { questions } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/request-user";
import { getSubscriptionStatus } from "@/lib/subscription";

export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function localIsoDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Dates that have a question set. Used by the date range picker so the app
 * never offers a day with no questions.
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") ?? localIsoDate(365);
    const to = searchParams.get("to") ?? localIsoDate();

    if (!ISO_DATE.test(from) || !ISO_DATE.test(to)) {
      return NextResponse.json(
        { error: "from and to must use YYYY-MM-DD." },
        { status: 400 },
      );
    }

    const rows = await db
      .selectDistinct({ date: questions.digestDate })
      .from(questions)
      .where(
        and(gte(questions.digestDate, from), lte(questions.digestDate, to)),
      )
      .orderBy(desc(questions.digestDate));

    return NextResponse.json({
      from,
      to,
      dates: rows.map((row) => row.date),
    });
  } catch (error) {
    console.error("Failed to load question dates:", error);
    return NextResponse.json(
      { error: "Could not load question dates." },
      { status: 500 },
    );
  }
}
