"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { QuestionData } from "@/lib/repositories/question-repository";
import confetti from "canvas-confetti";
import { useUser } from "./providers/UserProvider";

export function McqCard({
  currentQuestion,
}: {
  currentQuestion: QuestionData;
}) {
  const { user, updateUserHandler } = useUser();
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const triggerCorrectConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0"],
    });
  };

  const handleAnswerSelect = async (optionId: string) => {
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.name === optionId,
    );
    const isCorrect = selectedOption?.isCorrect || false;
    setIsAnswered(true);
    setSelectedAnswer(optionId);
    if (isCorrect) {
      triggerCorrectConfetti();
      if (user) {
        updateUserHandler({ ...user, points: user?.points + 10 });
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="border-0 overflow-hidden bg-black h-full flex justify-center items-center">
      <CardContent className="p-0 w-full">
        {/* Question Header */}
        <div className="bg-black text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge
              className={`${getDifficultyColor(currentQuestion.difficulty)} text-xs font-medium`}
            >
              {currentQuestion.difficulty.toUpperCase()}
            </Badge>
            <div className="flex justify-center gap-2">
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30 text-xs"
              >
                {currentQuestion.tags[0]}
              </Badge>

              {currentQuestion.previousYearQuestion !== "" && (
                <Badge
                  variant="outline"
                  className="bg-red-800/20 text-white border-white/30 text-xs"
                >
                  {currentQuestion.previousYearQuestion}
                </Badge>
              )}
            </div>
          </div>

          <h2 className="md:text-2xl text-xl font-semibold leading-relaxed">
            {currentQuestion.question}
          </h2>

          {isAnswered && (
            <div className="flex items-center space-x-2 text-sm opacity-90">
              {selectedAnswer ===
              currentQuestion.options.find((opt) => opt.isCorrect)?.name ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Incorrect</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="p-6 space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option.name;
            const isCorrect = option.isCorrect;
            const showResult = isAnswered;

            let buttonClass =
              "w-full text-left rounded-xl transition-all duration-300 transform rounded-full";

            if (showResult) {
              if (isCorrect) {
                buttonClass +=
                  " bg-green-500 border-green-400 text-green-800 shadow-green-100";
              } else if (isSelected && !isCorrect) {
                buttonClass +=
                  " bg-red-500 border-red-400 text-red-800 shadow-red-100";
              } else {
                buttonClass += " bg-gray-50 border-gray-200 text-gray-600";
              }
            } else if (isSelected) {
              buttonClass +=
                " bg-purple-500 border-purple-400 text-purple-800 shadow-purple-100";
            } else {
              buttonClass +=
                " bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50";
            }

            return (
              <div className="rounded-full overflow-hidden">
                <button
                  key={`${option.name}-${index}`}
                  onClick={() => !isAnswered && handleAnswerSelect(option.name)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex p-4 bg-black/80 items-center justify-between md:text-lg">
                    <div className="flex items-center space-x-3">
                      <div className="min-w-6 min-h-6 md:min-w-8 md:min-h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-sm font-bold text-gray-800">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium text-white">
                        {option.name}
                      </span>
                    </div>

                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-200 animate-pulse" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-200 animate-pulse" />
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
