import { type NextRequest, NextResponse } from "next/server"
import { QuizRepository } from "@/lib/repositories/quiz-repository"
import { ValidationError } from "@/lib/errors/custom-errors"
import type { Article } from "@/types"

interface QuizData {
  question: string
  options: { id: string; text: string; isCorrect: boolean }[]
  article: { title: string; topic: string }
  points: number
}

export async function POST(request: NextRequest) {
  try {
    const { articles } = await request.json()

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      throw new ValidationError("No articles provided")
    }

    const quizRepository = QuizRepository.getInstance()
    const quiz = await quizRepository.generateQuiz(articles as Article[])

    return NextResponse.json(quiz)
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    console.error("Error in Quiz API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
