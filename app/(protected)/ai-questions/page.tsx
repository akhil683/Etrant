"use client";
import { QuestionReel } from "@/components/question-reel";
import { useAppState } from "@/hooks/use-app-state";

export default function AiQuestionPage() {
  const { selectedInterests, setCurrentView, resetState } = useAppState();

  const handleBackToInterests = () => {
    resetState();
  };

  const handleShowLeaderboard = () => {
    setCurrentView("leaderboard");
  };

  return (
    <div>
      <QuestionReel
        interests={selectedInterests}
        onBack={handleBackToInterests}
        onShowLeaderboard={handleShowLeaderboard}
      />
    </div>
  );
}
