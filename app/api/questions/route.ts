import { AIQuestions } from "@/lib/repositories/question-repository";
import { InterestCategory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { interests: category } = await request.json();
    if (!category || typeof category !== "string") {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Category is required and must be a string",
        },
        { status: 400 },
      );
    }

    const questions = await AIQuestions.getAIQuestions(
      category as InterestCategory,
    );

    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
      category: category,
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
