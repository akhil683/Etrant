import { getLeaderboard } from "@/actions/getLeaderboard";
import { leaderboardMeta } from "@/lib/config/site";
import { Award, Medal, Trophy } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = leaderboardMeta;

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  if (!leaderboard) return null;
  const topThree = leaderboard.slice(0, 3);
  // const remaining = leaderboard.slice(3);
  const remaining = leaderboard.slice(0);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center md:mb-12 mb-6">
          <h1 className="text-3xl md:text-5xl font-bold md:mb-4 mb-2">
            Leaderboard
          </h1>
          <p className="text-gray-400 md:text-lg">Top performers this month</p>
        </div>

        {/* Top 3 Podium */}
        {/* <div className="mb-16"> */}
        {/*   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end"> */}
        {/*     <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-full p-6 text-center border-2 border-amber-600 transition-all duration-300 hover:scale-105 h-56 flex flex-col justify-between md:order-1"> */}
        {/*       <div className="flex flex-col items-center"> */}
        {/*         <div className="mb-3">{getRankIcon(2)}</div> */}
        {/*         <div className="relative mb-3"> */}
        {/*           <Image */}
        {/*             src={topThree[1]?.image || "/placeholder.svg"} */}
        {/*             alt={topThree[1]?.name || ""} */}
        {/*             width={70} */}
        {/*             height={70} */}
        {/*             className="rounded-full border-4 border-amber-500" */}
        {/*           /> */}
        {/*           <div className="absolute -top-2 -right-2 bg-slate-400 text-black rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm"> */}
        {/*             2 */}
        {/*           </div> */}
        {/*         </div> */}
        {/*         <h3 className="font-bold text-base mb-2"> */}
        {/*           {topThree[1]?.name} */}
        {/*         </h3> */}
        {/*       </div> */}
        {/*       <div className="text-lg font-bold text-white"> */}
        {/*         {topThree[1]?.points.toLocaleString()} pts */}
        {/*       </div> */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full p-6 text-center border-2 border-yellow-400 transition-all duration-300 hover:scale-105 h-72 flex flex-col justify-between md:order-2"> */}
        {/*       <div className="flex flex-col items-center"> */}
        {/*         <div className="mb-4">{getRankIcon(1)}</div> */}
        {/*         <div className="relative mb-4"> */}
        {/*           <Image */}
        {/*             src={topThree[0]?.image || "/placeholder.svg"} */}
        {/*             alt={topThree[0]?.name || ""} */}
        {/*             width={90} */}
        {/*             height={90} */}
        {/*             className="rounded-full border-4 border-yellow-400" */}
        {/*           /> */}
        {/*           <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"> */}
        {/*             1 */}
        {/*           </div> */}
        {/*         </div> */}
        {/*         <h3 className="font-bold text-xl mb-2 text-black"> */}
        {/*           {topThree[0]?.name} */}
        {/*         </h3> */}
        {/*       </div> */}
        {/*       <div className="text-2xl font-bold text-black"> */}
        {/*         {topThree[0]?.points.toLocaleString()} pts */}
        {/*       </div> */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-full p-6 text-center border-2 border-orange-600 transition-all duration-300 hover:scale-105 h-56 flex flex-col justify-between md:order-3"> */}
        {/*       <div className="flex flex-col items-center"> */}
        {/*         <div className="mb-3">{getRankIcon(3)}</div> */}
        {/*         <div className="relative mb-3"> */}
        {/*           <Image */}
        {/*             src={topThree[2]?.image || "/placeholder.svg"} */}
        {/*             alt={topThree[2]?.name || ""} */}
        {/*             width={70} */}
        {/*             height={70} */}
        {/*             className="rounded-full border-4 border-amber-500" */}
        {/*           /> */}
        {/*           <div className="absolute -top-2 -right-2 bg-amber-400 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs"> */}
        {/*             3 */}
        {/*           </div> */}
        {/*         </div> */}
        {/*         <h3 className="font-bold text-base mb-2"> */}
        {/*           {topThree[2]?.name} */}
        {/*         </h3> */}
        {/*       </div> */}
        {/*       <div className="text-lg font-bold text-white"> */}
        {/*         {topThree[2]?.points.toLocaleString()} pts */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

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
