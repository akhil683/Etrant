"use client"

import { useState, useCallback } from "react"
import type { Quiz, QuizResult, Article } from "@/types"
import { QuizRepository } from "@/lib/repositories/quiz-repository"
import { UserService } from "@/lib/services/user-service"
import { APP_CONFIG } from "@/lib/config/constants"

export function useQuiz() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(false)

  const quizRepository = QuizRepository.getInstance()
  const userService = UserService.getInstance()

  const generateQuiz = useCallback(
    async (articles: Article[]) => {
      if (articles.length < APP_CONFIG.QUIZ_TRIGGER_INTERVAL) return

      setLoading(true)
      try {
        const quiz = await quizRepository.generateQuiz(articles)
        setCurrentQuiz(quiz)
        setShowQuiz(true)
      } catch (error) {
        console.error("Failed to generate quiz:", error)
      } finally {
        setLoading(false)
      }
    },
    [quizRepository],
  )

  const submitQuizResult = useCallback(
    (result: QuizResult) => {
      if (currentQuiz) {
        userService.updateUserPoints(result.points)
        userService.updateUserStreak(result.isCorrect)

        setShowQuiz(false)
        setCurrentQuiz(null)
      }
    },
    [currentQuiz, userService],
  )

  const closeQuiz = useCallback(() => {
    setShowQuiz(false)
    setCurrentQuiz(null)
  }, [])

  return {
    currentQuiz,
    showQuiz,
    loading,
    generateQuiz,
    submitQuizResult,
    closeQuiz,
  }
}
