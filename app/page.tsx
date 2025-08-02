"use client";

import { InterestSelector } from "@/components/interest-selector";
import { InfiniteReel } from "@/components/infinite-reel";
import { Leaderboard } from "@/components/leaderboard";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAppState } from "@/hooks/use-app-state";
import type { InterestCategory } from "@/types";
import { storeInterests } from "@/actions/setInterest";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();
  const {
    currentView,
    selectedInterests,
    setCurrentView,
    setSelectedInterests,
    resetState,
  } = useAppState();
  console.log(data);
  const handleInterestsSelected = async (interests: InterestCategory[]) => {
    setSelectedInterests(interests);
    storeInterests(interests, data?.user?.email as string);
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
