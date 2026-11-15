"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { QuestionData } from "@/types";
import confetti from "canvas-confetti";
import { useUserStore } from "@/lib/store/useUserStore";
import ShowExplanation from "./show-explanation";
import { getDifficultyColor, cn } from "@/lib/utils";

export function McqCard({
  currentQuestion,
}: {
  currentQuestion: QuestionData;
}) {
  const { user, updateStats } = useUserStore();
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const triggerCorrectConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#2563EB", "#60A5FA", "#FFFFFF"],
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
        updateStats(isCorrect);
      }
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-background px-5 pb-10 pt-24 md:px-8 md:py-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-0">
          <div className="border-b border-border p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <Badge
                className={cn(
                  getDifficultyColor(currentQuestion.difficulty),
                  "capitalize",
                )}
              >
                {currentQuestion.difficulty}
              </Badge>
              <div className="flex flex-wrap justify-end gap-1.5">
                <Badge variant="outline">{currentQuestion.tags[0]}</Badge>

                {currentQuestion.previousYearQuestion !== "" && (
                  <Badge>{currentQuestion.previousYearQuestion}</Badge>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold leading-relaxed tracking-tight text-foreground md:text-2xl">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-2.5 p-6 md:p-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option.name;
              const isCorrect = option.isCorrect;

              return (
                <button
                  key={`${option.name}-${index}`}
                  onClick={() => !isAnswered && handleAnswerSelect(option.name)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full rounded-lg border text-left transition-colors duration-200",
                    !isAnswered &&
                      "border-border bg-card hover:border-primary/50 hover:bg-accent/60",
                    isAnswered &&
                      isCorrect &&
                      "border-success/40 bg-success/10",
                    isAnswered &&
                      isSelected &&
                      !isCorrect &&
                      "border-destructive/40 bg-destructive/10",
                    isAnswered &&
                      !isCorrect &&
                      !isSelected &&
                      "border-border bg-background opacity-70",
                  )}
                >
                  <div className="flex items-center justify-between p-3.5 md:p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold md:h-8 md:w-8",
                          isAnswered && isCorrect
                            ? "border-success bg-success text-success-foreground"
                            : isAnswered && isSelected && !isCorrect
                              ? "border-destructive bg-destructive text-destructive-foreground"
                              : "border-border bg-secondary text-secondary-foreground",
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-sm font-medium text-foreground md:text-base">
                        {option.name}
                      </span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}

            <div
              className={cn(
                "flex w-full justify-end pt-2",
                isAnswered ? "flex" : "invisible",
              )}
            >
              <ShowExplanation explanation={currentQuestion.explanation} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
