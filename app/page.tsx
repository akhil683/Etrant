"use client";

import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAppState } from "@/hooks/use-app-state";

export default function Home() {
  const { selectedInterests, setCurrentView, resetState } = useAppState();

  const handleBackToInterests = () => {
    resetState();
  };

  const handleShowLeaderboard = () => {
    setCurrentView("leaderboard");
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black">
        <InfiniteReel
          interests={selectedInterests}
          onBack={handleBackToInterests}
          onShowLeaderboard={handleShowLeaderboard}
        />
      </main>
    </ErrorBoundary>
  );
}
