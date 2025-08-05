import { digestService } from "@/lib/repositories/daily-digest-repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("hello");
    const articles = digestService.generateDailyDigest();
    console.log("articles", articles);
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
