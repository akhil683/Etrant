"use client";

import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAppState } from "@/hooks/use-app-state";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();
  const { selectedInterests, setCurrentView, resetState } = useAppState();
  console.log(data);
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
