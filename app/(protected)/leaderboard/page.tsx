import { getLeaderboard } from "@/actions/getLeaderboard";
import { Award, Medal, Trophy } from "lucide-react";
import Image from "next/image";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  if (!leaderboard) return null;
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-white" />;
      case 2:
        return <Medal className="w-7 h-7 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  };

  return null;
}
