import { getLeaderboard } from "@/actions/getLeaderboard";
import { auth } from "@/auth";
import Header from "@/components/header";
import { leaderboardMeta } from "@/lib/config/site";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = leaderboardMeta;

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth");
  }
  const leaderboard = await getLeaderboard();

  if (!leaderboard) return null;
  const remaining = leaderboard.slice(0);

  return (
    <div className="min-h-screen bg-black text-white text-5xl">
      <Header />
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

        {/* Footer Stats */}
        {/* <div className="mt-16 text-center"> */}
        {/*   <div className="inline-flex items-center gap-8 bg-gray-900 rounded-xl p-6 border border-gray-800"> */}
        {/*     <div> */}
        {/*       <div className="text-2xl font-bold">{leaderboard.length}</div> */}
        {/*       <div className="text-gray-400 text-sm">Total Players</div> */}
        {/*     </div> */}
        {/*     <div className="w-px h-12 bg-gray-700"></div> */}
        {/*     <div> */}
        {/*       <div className="text-2xl font-bold"> */}
        {/*         {leaderboard */}
        {/*           .reduce((sum, user) => sum + user.points, 0) */}
        {/*           .toLocaleString()} */}
        {/*       </div> */}
        {/*       <div className="text-gray-400 text-sm">Total Points</div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}
