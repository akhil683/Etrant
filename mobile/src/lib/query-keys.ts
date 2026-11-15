export const queryKeys = {
  me: ["me"] as const,
  subscription: ["subscription"] as const,
  digest: ["digest"] as const,
  digestDetail: (id: number | string) => ["digest", String(id)] as const,
  questions: (from: string, to: string, offset: number) =>
    ["questions", from, to, offset] as const,
  questionDates: (from: string, to: string) =>
    ["question-dates", from, to] as const,
  leaderboard: ["leaderboard"] as const,
};
