import { Brain, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { getDifficultyColor } from "@/lib/utils";
import { IAnalysisResult } from "@/types";

interface IMCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface FileAnalysisProps {
  analysisResult: IAnalysisResult | null;
}

export default function FileAnalysis({ analysisResult }: FileAnalysisProps) {
  const [isGeneratingMCQ, setIsGeneratingMCQ] = useState(false);
  const generateMCQQuestions = async () => {
    if (!analysisResult) return;

    setIsGeneratingMCQ(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
    } catch (error) {
      toast({
        title: "Generation failed",
        description:
          "There was an error generating questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMCQ(false);
    }
  };
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground md:text-xl">
          <Brain className="h-5 w-5 text-primary" />
          AI analysis results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div>
          <h3 className="mb-2 font-semibold text-foreground">Summary</h3>
          <p className="reading-prose text-base">{analysisResult?.summary}</p>
        </div>

        {/* Key Points */}
        <div>
          <h3 className="mb-2 font-semibold text-foreground">Key points</h3>
          <ul className="space-y-2">
            {analysisResult?.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics and Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-foreground">
              Topics covered
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {analysisResult?.topics?.map((topic, index) => (
                <Badge key={index} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Difficulty level
              </span>
              <Badge
                className={getDifficultyColor(
                  analysisResult?.difficulty as string,
                )}
              >
                {analysisResult?.difficulty}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Word count</span>
              <span className="tabular font-medium text-foreground">
                {analysisResult?.wordCount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Generate MCQ Button */}
        <div className="border-t border-border pt-4">
          <Button
            onClick={generateMCQQuestions}
            disabled={isGeneratingMCQ}
            className="w-full"
          >
            {isGeneratingMCQ ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Generating questions...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate MCQ questions
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
