"use client";
import { useState } from "react";

import { BookOpen, RotateCcw } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import McqQuestion from "./mcq-question";
import { Button } from "../ui/button";
import { QuestionData } from "@/types";

export default function FileMCQ({
  questions,
  file,
}: {
  questions: QuestionData[];
  file: string;
}) {
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Handle answer selection
  const handleAnswerSelect = (question: string, answerIndex: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [question]: answerIndex,
    }));
  };

  // Calculate and show results
  const showQuizResults = () => {
    const correctAnswers = questions.filter(
      (q) => userAnswers[q.question] === q.correctAnswer,
    ).length;
    setScore(correctAnswers);
    setShowResults(true);
  };

  // Reset quiz
  const resetQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex max-md:flex-col md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground md:text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            {file}
          </CardTitle>
          <div className="flex gap-2">
            {showResults && (
              <Badge variant="success">
                Score: {score}/{questions.length}
              </Badge>
            )}
            {Object.keys(userAnswers).length === questions.length &&
              !showResults && (
                <Button
                  onClick={showQuizResults}
                  size="sm"
                >
                  Show results
                </Button>
              )}
            {showResults && (
              <Button
                onClick={resetQuiz}
                size="sm"
                variant="outline"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          Test your understanding with AI-generated questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, questionIndex) => (
            <McqQuestion
              key={questionIndex}
              handleAnswerSelect={handleAnswerSelect}
              question={question}
              userAnswers={userAnswers}
              showResults={showResults}
              questionIndex={questionIndex}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
