import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { dailyDigest } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/request-user";

export const dynamic = "force-dynamic";

/**
 * Latest digest day for the mobile app. The `date` column is stored as
 * `dd-mm-yyyy` text, so we find the latest day by insertion id instead of
 * sorting the text.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireUser(request);
    if ("response" in authResult) return authResult.response;

    const [latest] = await db
      .select({ date: dailyDigest.date })
      .from(dailyDigest)
      .orderBy(desc(dailyDigest.id))
      .limit(1);

    if (!latest) {
      return NextResponse.json({ date: null, articles: [] });
    }

    const articles = await db
      .select({
        id: dailyDigest.id,
        title: dailyDigest.title,
        summary: dailyDigest.summary,
        topic: dailyDigest.topic,
        sourceUrl: dailyDigest.sourceUrl,
        date: dailyDigest.date,
      })
      .from(dailyDigest)
      .where(eq(dailyDigest.date, latest.date))
      .orderBy(desc(dailyDigest.id));

    return NextResponse.json({ date: latest.date, articles });
  } catch (error) {
    console.error("Failed to load digest:", error);
    return NextResponse.json(
      { error: "Could not load the digest." },
      { status: 500 },
    );
  }
}
