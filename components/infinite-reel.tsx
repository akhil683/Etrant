"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArticleCard } from "@/components/article-card";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trophy } from "lucide-react";
import { UserMenu } from "./auth/user-menu";

interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  url: string;
  topic: string;
}

interface InfiniteReelProps {
  interests: string[];
  onBack: () => void;
  onShowLeaderboard: () => void;
}

export function InfiniteReel({
  interests,
  onBack,
  onShowLeaderboard,
}: InfiniteReelProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedArticles, setViewedArticles] = useState<Article[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const maxRetries = 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();
  const isScrolling = useRef(false);

  // Load user points from localStorage
  useEffect(() => {
    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) {
      setUserPoints(Number.parseInt(savedPoints));
    }
  }, []);

  // Save points to localStorage
  useEffect(() => {
    localStorage.setItem("userPoints", userPoints.toString());
  }, [userPoints]);

  const lastArticleElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Number.parseInt(
                entry.target.getAttribute("data-index") || "0",
              );
              setCurrentIndex(index);

              // Track viewed articles for quiz
              if (
                articles[index] &&
                !viewedArticles.find((a) => a.id === articles[index].id)
              ) {
                setViewedArticles((prev) => [...prev, articles[index]]);
              }

              // Show quiz after every 5 articles
              if (viewedArticles.length >= 1 && !showQuiz) {
                generateQuiz();
              }

              // Load more articles when approaching the end
              if (index >= articles.length - 2 && hasMore && !loading) {
                loadMoreArticles();
              }
            }
          });
        },
        [loading, hasMore, viewedArticles, showQuiz],
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, viewedArticles, showQuiz],
  );

  const generateQuiz = async () => {
    if (viewedArticles.length < 5) return;

    try {
      const recentArticles = viewedArticles.slice(-5);
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articles: recentArticles }),
      });

      if (response.ok) {
        const quiz = await response.json();
        setQuizData(quiz);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleQuizComplete = (isCorrect: boolean, points: number) => {
    if (isCorrect) {
      setUserPoints((prev) => prev + points);
    }
    setShowQuiz(false);
    setQuizData(null);
  };

  const loadMoreArticles = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/wikipedia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests, count: 5 }),
      });

      if (response.ok) {
        const newArticles = await response.json();
        if (newArticles && newArticles.length > 0) {
          setArticles((prev) => [...prev, ...newArticles]);
          setRetryCount(0);
        } else {
          console.warn("No articles returned from API");
          if (retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1);
            setTimeout(() => loadMoreArticles(), 2000);
          } else {
            setHasMore(false);
          }
        }
      } else {
        console.error(
          "API response not ok:",
          response.status,
          response.statusText,
        );
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => loadMoreArticles(), 2000);
        }
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => loadMoreArticles(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll events to ensure snap behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrolling.current || showQuiz) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const windowHeight = window.innerHeight - 73; // Account for header
        const targetIndex = Math.round(scrollTop / windowHeight);

        if (targetIndex !== currentIndex) {
          isScrolling.current = true;
          container.scrollTo({
            top: targetIndex * windowHeight,
            behavior: "smooth",
          });

          setTimeout(() => {
            isScrolling.current = false;
          }, 500);
        }
      }, 100);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentIndex, showQuiz]);

  useEffect(() => {
    loadMoreArticles();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-gray-900">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-gray-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Wikipedia Reel</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-yellow-600/20 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                {userPoints}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowLeaderboard}
              className="text-white hover:bg-gray-800"
            >
              <Trophy className="w-4 h-4" />
            </Button>
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Quiz Overlay */}
      {showQuiz && quizData && (
        <div className="fixed inset-0 z-50 bg-black">
          <QuizCard quiz={quizData} onComplete={handleQuizComplete} />
        </div>
      )}

      {/* Articles Container */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-73px)] overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {articles.map((article, index) => (
          <div
            key={`${article.id}-${index}`}
            data-index={index}
            ref={index === articles.length - 1 ? lastArticleElementRef : null}
            className="h-full snap-start snap-always flex-shrink-0"
          >
            <ArticleCard article={article} />
          </div>
        ))}

        {loading && (
          <div className="h-full snap-start flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
