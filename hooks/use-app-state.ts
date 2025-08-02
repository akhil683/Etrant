"use client";

import { useState, useCallback } from "react";
import type { AppState, Article, ViewType, InterestCategory } from "@/types";
import { Logger } from "@/lib/logger/logger";

const initialState: AppState = {
  user: null,
  articles: [],
  viewedArticles: [],
  currentIndex: 0,
  loading: false,
  error: null,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);
  const [currentView, setCurrentView] = useState<ViewType>("interests");
  const [selectedInterests, setSelectedInterests] = useState<
    InterestCategory[]
  >([]);
  const logger = Logger.getInstance();

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setLoading = useCallback(
    (loading: boolean) => {
      updateState({ loading });
    },
    [updateState],
  );

  const setError = useCallback(
    (error: string | null) => {
      updateState({ error });
      if (error) {
        logger.error("App state error", { error });
      }
    },
    [updateState, logger],
  );

  const addArticles = useCallback(
    (newArticles: Article[]) => {
      updateState({
        articles: [...state.articles, ...newArticles],
      });
    },
    [state.articles, updateState],
  );

  const addViewedArticle = useCallback(
    (article: Article) => {
      if (!state.viewedArticles.find((a) => a.id === article.id)) {
        updateState({
          viewedArticles: [...state.viewedArticles, article],
        });
      }
    },
    [state.viewedArticles, updateState],
  );

  const setCurrentIndex = useCallback(
    (index: number) => {
      updateState({ currentIndex: index });
    },
    [updateState],
  );

  const resetState = useCallback(() => {
    setState(initialState);
    setCurrentView("interests");
    setSelectedInterests([]);
  }, []);

  return {
    state,
    currentView,
    selectedInterests,
    setCurrentView,
    setSelectedInterests,
    setLoading,
    setError,
    addArticles,
    addViewedArticle,
    setCurrentIndex,
    resetState,
  };
}
