"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileText,
  Brain,
  RotateCcw,
  BookOpen,
  HistoryIcon,
} from "lucide-react";
import { toast } from "sonner";
import { IAnalysisResult } from "@/types";
import McqQuestion from "@/components/file-analyzer/mcq-question";
import FileAnalysis from "@/components/file-analyzer/Analysis";
import { useUserStore } from "@/lib/store/useUserStore";
import { QuestionData } from "@/types";
import Link from "next/link";

export default function FileAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IAnalysisResult | null>(
    null,
  );
  const [mcqQuestions, setMcqQuestions] = useState<QuestionData[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserStore();

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Invalid file type");
        return;
      }
      if (selectedFile.size > maxSize) {
        toast.error("File too large");
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);
      setMcqQuestions([]);
      setUserAnswers({});
      setShowResults(false);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", user?.interest!);
    formData.append("language", user?.language || "English");
    formData.append("userId", user?.id!);
    formData.append("fileName", file.name);

    try {
      const res = await fetch("/api/file-analyzer", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to analyze file");
      }

      const data = await res.json();

      if (data.success && data.questions) {
        setMcqQuestions(data.questions);
        toast.success("Your file has been successfully analyzed!");
      } else {
        toast.error("No questions generated. Try again with another file.");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error analyzing your file. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    const correctAnswers = mcqQuestions.filter(
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
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section with Geometric Background */}
      <div className="relative overflow-hidden pb-8 pt-24 md:pt-12">
        <div className="mb-6 flex justify-end px-6 md:px-0">
          <Link
            href={"file-analyzer/files"}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <HistoryIcon className="h-4 w-4" />
            <span className="max-md:hidden">File history</span>
          </Link>
        </div>
        <div className="relative mx-auto max-w-4xl space-y-4 border-b border-border px-6 pb-6 md:px-0">
          <p className="eyebrow">Study tools</p>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="icon-tile">
              <Brain className="h-5 w-5" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              AI File Analyzer
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Upload your notes or books and get AI-powered analysis with custom
            MCQ questions to test your knowledge.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-6 pb-16 md:px-0">
        {/* File Upload Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground md:text-xl">
              <Upload className="h-5 w-5 text-primary" />
              Upload your file
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Text files, PDFs, or Word documents (max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="mx-auto mb-4 h-10 w-10 text-primary" />
                <p className="mb-2 text-sm text-foreground">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports TXT, PDF, DOC, DOCX
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {file && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/25 bg-primary/5 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={analyzeFile}
                    disabled={isAnalyzing}
                    className="w-full md:w-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && <FileAnalysis analysisResult={analysisResult} />}

        {/* MCQ Questions */}
        {mcqQuestions.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex max-md:flex-col md:items-center md:justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground md:text-xl">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Practice questions ({mcqQuestions.length})
                </CardTitle>
                <div className="flex gap-2">
                  {showResults && (
                    <Badge variant="success">
                      Score: {score}/{mcqQuestions.length}
                    </Badge>
                  )}
                  {Object.keys(userAnswers).length === mcqQuestions.length &&
                    !showResults && (
                      <Button onClick={showQuizResults} size="sm">
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
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {mcqQuestions.map((question, questionIndex) => (
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
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
