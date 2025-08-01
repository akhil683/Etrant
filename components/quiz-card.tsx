"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Trophy, Clock } from "lucide-react"

interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

interface Quiz {
  question: string
  options: QuizOption[]
  article: {
    title: string
    topic: string
  }
  points: number
}

interface QuizCardProps {
  quiz: Quiz
  onComplete: (isCorrect: boolean, points: number) => void
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isCorrect, setIsCorrect] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      // Time's up - auto submit
      handleSubmit()
    }
  }, [timeLeft, showResult])

  const handleOptionSelect = (optionId: string) => {
    if (!showResult) {
      setSelectedOption(optionId)
    }
  }

  const handleSubmit = () => {
    if (selectedOption || timeLeft === 0) {
      const correctOption = quiz.options.find((opt) => opt.isCorrect)
      const selectedIsCorrect = selectedOption === correctOption?.id
      setIsCorrect(selectedIsCorrect)
      setShowResult(true)

      // Auto close after 3 seconds
      setTimeout(() => {
        onComplete(selectedIsCorrect, selectedIsCorrect ? quiz.points : 0)
      }, 3000)
    }
  }

  const getOptionStyle = (option: QuizOption) => {
    if (!showResult) {
      return selectedOption === option.id
        ? "bg-blue-600 border-blue-500 text-white"
        : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
    }

    if (option.isCorrect) {
      return "bg-green-600 border-green-500 text-white"
    }

    if (selectedOption === option.id && !option.isCorrect) {
      return "bg-red-600 border-red-500 text-white"
    }

    return "bg-gray-800 border-gray-600 text-gray-400"
  }

  return (
    <div className="h-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50">
      <Card className="w-full max-w-md bg-black/80 border-gray-700 text-white">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Quiz Time!</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className={`text-sm font-mono ${timeLeft <= 5 ? "text-red-400" : "text-gray-400"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Article Info */}
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">About: {quiz.article.topic}</p>
            <p className="text-sm font-medium">{quiz.article.title}</p>
          </div>

          {/* Question */}
          <h3 className="text-lg font-semibold mb-6 leading-tight">{quiz.question}</h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {quiz.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showResult}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${getOptionStyle(option)}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  {showResult && option.isCorrect && <CheckCircle className="w-5 h-5" />}
                  {showResult && selectedOption === option.id && !option.isCorrect && <XCircle className="w-5 h-5" />}
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button or Result */}
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Answer
            </Button>
          ) : (
            <div className="text-center">
              <div
                className={`flex items-center justify-center space-x-2 mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}
              >
                {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                <span className="text-lg font-semibold">{isCorrect ? "Correct!" : "Wrong Answer"}</span>
              </div>
              <p className="text-sm text-gray-400">
                {isCorrect ? `+${quiz.points} points!` : "Better luck next time!"}
              </p>
              <p className="text-xs text-gray-500 mt-2">Continuing in 3 seconds...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
