import { getLeaderboard } from "@/actions/getLeaderboard";
import { leaderboardMeta } from "@/lib/config/site";
import { Metadata } from "next";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = leaderboardMeta;
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  if (!leaderboard) return null;
  const remaining = leaderboard.slice(0);

  return (
    <div className="page-shell-narrow">
      <div className="page-header">
        <p className="eyebrow">This month</p>
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-description">
          Consistency, ranked. Keep showing up.
        </p>
      </div>

      <div className="surface overflow-hidden">
        {remaining.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b border-border px-4 py-4 last:border-b-0 md:px-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div
                className={cn(
                  "tabular flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  index === 0
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : index < 3
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground",
                )}
              >
                {index === 0 ? <Trophy className="h-4 w-4" /> : index + 1}
              </div>
              <Image
                src={user.image || "/placeholder.svg"}
                alt={user.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-border object-cover"
              />
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 truncate font-semibold text-foreground">
                  {user.name}
                  {user.subscriptionActive && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {user.plan}
                    </span>
                  )}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <div className="tabular text-lg font-bold text-foreground md:text-xl">
                {user.points.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
