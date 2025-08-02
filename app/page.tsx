"use client";

import { InterestSelector } from "@/components/interest-selector";
import { InfiniteReel } from "@/components/infinite-reel";
import { Leaderboard } from "@/components/leaderboard";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAppState } from "@/hooks/use-app-state";
import type { InterestCategory } from "@/types";

export default function Home() {
  const {
    currentView,
    selectedInterests,
    setCurrentView,
    setSelectedInterests,
    resetState,
  } = useAppState();

  const handleInterestsSelected = (interests: string[]) => {
    setSelectedInterests(interests);
    setCurrentView("reel");
  };

  const handleBackToInterests = () => {
    resetState();
  };

  const handleShowLeaderboard = () => {
    setCurrentView("leaderboard");
  };

  const handleBackFromLeaderboard = () => {
    setCurrentView("reel");
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black">
        {currentView === "interests" && (
          <InterestSelector onInterestsSelected={handleInterestsSelected} />
        )}
        {currentView === "reel" && (
          <InfiniteReel
            interests={selectedInterests}
            onBack={handleBackToInterests}
            onShowLeaderboard={handleShowLeaderboard}
          />
        )}
        {currentView === "leaderboard" && (
          <Leaderboard onBack={handleBackFromLeaderboard} />
        )}
      </main>
    </ErrorBoundary>
  );
}
