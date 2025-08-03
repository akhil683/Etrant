import { type NextRequest, NextResponse } from "next/server";
import { WikipediaRepository } from "@/lib/repositories/wikipedia-repository";
import { ValidationError } from "@/lib/errors/custom-errors";

export async function POST(request: NextRequest) {
  try {
    const wikipediaRepository = WikipediaRepository.getInstance();
    const articles = await wikipediaRepository.getArticlesByInterests();

    console.log("articles", articles);

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
