import { db } from "@/lib/db/db";
import { digestService } from "@/lib/repositories/daily-digest-repository";
import { NextRequest, NextResponse } from "next/server";
import { dailyDigest } from "@/lib/db/schema";

function getTodayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const articles = await digestService.generateDailyDigest();
    console.log("articles", articles);
    for (const article of articles) {
      if (!article.is_relevant) return;
      await db
        .insert(dailyDigest)
        .values({
          title: article.title,
          isRelevant: article.is_relevant,
          summary: article.summary,
          sourceUrl: article.source_url,
          topic: article.topic,
          relevantQuestions: article.relevant_questions,
          date: getTodayDate(),
        })
        .returning();
    }
    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
