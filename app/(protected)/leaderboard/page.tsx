import { getLeaderboard } from "@/actions/getLeaderboard";
import { leaderboardMeta } from "@/lib/config/site";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = leaderboardMeta;

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  if (!leaderboard) return null;
  const remaining = leaderboard.slice(0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center md:mb-12 mb-6">
        <h1 className="text-3xl md:text-5xl font-bold md:mb-4 mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-400 md:text-lg">Top performers this month</p>
      </div>

      {/* Remaining Rankings */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          {remaining.map((user, index) => (
            <div
              key={user.id}
              className="bg-gray-900 rounded-xl p-4 flex items-center justify-between border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="md:w-12 md:h-12 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold md:text-lg">
                  {/* {index + 4} */}
                  {index + 1}
                </div>
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-gray-600"
                />
                <div>
                  <h3 className="font-semibold md:text-lg">{user.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="md:text-xl text-lg font-bold">
                  {user.points.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
