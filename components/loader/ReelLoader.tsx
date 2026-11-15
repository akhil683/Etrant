"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WikipediaAILoaderProps {
  totalArticles: number;
  loadingTime: number;
}

const loadingMessages = [
  "Searching...",
  "Fetching content...",
  "Processing with AI...",
  "Summarizing...",
];

export function AILoader({
  totalArticles,
  loadingTime,
}: WikipediaAILoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [articleNumber, setArticleNumber] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(
      () => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      },
      (loadingTime * 1000) / 2,
    );

    const articleNumberInterval = setInterval(
      () => {
        setArticleNumber((prev) => prev + 1);
      },
      (loadingTime * 1000) / totalArticles,
    );

    const progressInterval = setInterval(
      () => {
        setProgress((prev) => Math.min(prev + Math.random() * 5, 95));
      },
      (loadingTime * 1000) / 30,
    );

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(articleNumberInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <Card className="w-full max-w-md space-y-6 border-border bg-card p-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Preparing {totalArticles} reels
          </h2>
          <p className="text-sm text-muted-foreground">
            Estimated time: {loadingTime}s
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <p className="tabular w-full text-right text-sm text-foreground">
            {articleNumber > totalArticles ? totalArticles - 1 : articleNumber}\
            {totalArticles}
          </p>
          <div className="relative">
            <Progress value={progress} className="h-2 bg-secondary" />
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-3">
          <div className="text-center text-sm font-medium text-muted-foreground transition-all duration-300">
            {loadingMessages[currentMessageIndex]}
          </div>
        </div>
      </Card>
    </div>
  );
}
