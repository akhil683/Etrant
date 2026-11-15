import { apiFetch } from "./client";
import { leaderboardResponseSchema } from "./schemas";

export function getLeaderboard() {
  return apiFetch("/api/leaderboard", undefined, {
    schema: leaderboardResponseSchema,
  });
}
