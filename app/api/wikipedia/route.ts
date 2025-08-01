import { type NextRequest, NextResponse } from "next/server";
import { WikipediaRepository } from "@/lib/repositories/wikipedia-repository";
import { ValidationError } from "@/lib/errors/custom-errors";
import type { InterestCategory } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { interests, count = 5 } = await request.json();

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      throw new ValidationError("Invalid interests provided");
    }

    const wikipediaRepository = WikipediaRepository.getInstance();
    const articles = await wikipediaRepository.getArticlesByInterests(
      interests as InterestCategory[],
      count,
    );

    return NextResponse.json(articles);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Error in Wikipedia API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
