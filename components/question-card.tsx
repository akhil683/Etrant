"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface McqQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  explanation: string;
}

export function McqCard({ currentQuestion }: { currentQuestion: McqQuestion }) {
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  // Confetti effects
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
      (opt) => opt.id === optionId,
    );
    const isCorrect = selectedOption?.isCorrect || false;
    setIsAnswered(true);
    setSelectedAnswer(optionId);
    // Trigger confetti
    if (isCorrect) {
      triggerCorrectConfetti();
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
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-white/30 text-xs"
            >
              {currentQuestion.topic}
            </Badge>
          </div>

          <h2 className="text-2xl font-semibold leading-relaxed">
            {currentQuestion.question}
          </h2>

          {isAnswered && (
            <div className="flex items-center space-x-2 text-sm opacity-90">
              {selectedAnswer ===
              currentQuestion.options.find((opt) => opt.isCorrect)?.id ? (
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
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.isCorrect;
            const showResult = isAnswered;

            let buttonClass =
              "w-full p-4 text-left bg-gray-900 hover:bg-gray-800 rounded-xl transition-all duration-300 transform";

            if (showResult) {
              if (isCorrect) {
                buttonClass +=
                  " bg-green-50 border-green-400 text-green-800 shadow-green-100";
              } else if (isSelected && !isCorrect) {
                buttonClass +=
                  " bg-red-50 border-red-400 text-red-800 shadow-red-100";
              } else {
                buttonClass += " bg-gray-50 border-gray-200 text-gray-600";
              }
            } else if (isSelected) {
              buttonClass +=
                " bg-purple-50 border-purple-400 text-purple-800 shadow-purple-100";
            } else {
              buttonClass +=
                " bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => !isAnswered && handleAnswerSelect(option.id)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center text-sm font-bold text-purple-700">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-white">
                      {option.text}
                    </span>
                  </div>

                  {showResult && isCorrect && (
                    <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
