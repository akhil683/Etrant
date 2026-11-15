import { getDifficultyColor, cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { QuestionData } from "@/types";

interface McqQuestionProps {
  question: QuestionData;
  questionIndex: number;
  userAnswers: { [key: string]: number };
  showResults: boolean;
  handleAnswerSelect: (question: string, answerIndex: number) => void;
}

export default function McqQuestion({
  question,
  questionIndex,
  userAnswers,
  showResults,
  handleAnswerSelect,
}: McqQuestionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row">
        <h3 className="text-base font-medium leading-relaxed text-foreground md:text-lg">
          {questionIndex + 1}. {question.question}
        </h3>
        <Badge className={cn(getDifficultyColor(question.difficulty), "capitalize")}>
          {question.difficulty}
        </Badge>
      </div>

      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = userAnswers[question.question] === optionIndex;
          const isCorrect = optionIndex === question.correctAnswer;
          const isWrong = showResults && isSelected && !isCorrect;
          const shouldHighlight = showResults && isCorrect;

          return (
            <button
              key={optionIndex}
              onClick={() => handleAnswerSelect(question.question, optionIndex)}
              disabled={showResults}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                isSelected && !showResults
                  ? "border-primary bg-primary/10"
                  : shouldHighlight
                    ? "border-success/40 bg-success/10"
                    : isWrong
                      ? "border-destructive/40 bg-destructive/10"
                      : "border-border bg-card hover:border-primary/50 hover:bg-accent/60",
                showResults ? "cursor-default" : "cursor-pointer",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold",
                    shouldHighlight
                      ? "border-success bg-success text-success-foreground"
                      : isWrong
                        ? "border-destructive bg-destructive text-destructive-foreground"
                        : isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground",
                  )}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="flex-1 text-sm text-muted-foreground">
                  {option.name}
                </span>
                {showResults && shouldHighlight && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
                {showResults && isWrong && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResults && (
        <div className="mt-4 rounded-lg border-l-2 border-primary bg-primary/5 p-3">
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong>Explanation:</strong> {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
