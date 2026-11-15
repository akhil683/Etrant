import { z } from "zod";

export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(),
  plan: z.string().nullable(),
  subscriptionActive: z.boolean().nullable(),
  points: z.number().nullable(),
  streak: z.number().nullable(),
});

export const mobileSessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
  user: sessionUserSchema,
});

export const digestArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  topic: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  date: z.string(),
});

export const digestResponseSchema = z.object({
  date: z.string().nullable(),
  articles: z.array(digestArticleSchema),
});

export const digestDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  relevantQuestions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .nullable()
    .optional(),
  sourceUrl: z.string().nullable(),
  topic: z.string().nullable(),
  date: z.string(),
});

export const questionOptionSchema = z.object({
  name: z.string(),
  isCorrect: z.boolean(),
});

export const questionSchema = z.object({
  id: z.string(),
  digestDate: z.string(),
  position: z.number(),
  question: z.string(),
  difficulty: z.string(),
  category: z.string(),
  tags: z.array(z.string()).nullable(),
  context: z.string().nullable(),
  estimatedTime: z.number().nullable(),
  options: z.array(questionOptionSchema),
  correctAnswer: z.number(),
  explanation: z.string(),
  metadata: z.unknown().nullable(),
});

export const questionsResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  limit: z.number(),
  offset: z.number(),
  count: z.number(),
  questions: z.array(questionSchema),
});

export const questionDatesResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  dates: z.array(z.string()),
});

export const attemptResponseSchema = z.object({
  isCorrect: z.boolean(),
  correctIndex: z.number(),
  explanation: z.string().optional(),
  pointsAwarded: z.number(),
  totalPoints: z.number(),
  duplicate: z.boolean().optional(),
});

export const leaderboardEntrySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  interest: z.string().nullable().optional(),
  points: z.number().nullable(),
  streak: z.number().nullable(),
  lastActiveDate: z.string().nullable().optional(),
});

export const leaderboardMeSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  points: z.number().nullable(),
  streak: z.number().nullable(),
  rank: z.number().nullable(),
});

export const leaderboardResponseSchema = z.object({
  leaderboard: z.array(leaderboardEntrySchema),
  me: leaderboardMeSchema.nullable(),
});

export const subscriptionStatusSchema = z.object({
  active: z.boolean(),
  plan: z.string(),
  subscriptionEnd: z.string().nullable(),
});

export const userResponseSchema = z.object({
  user: sessionUserSchema,
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type MobileSession = z.infer<typeof mobileSessionSchema>;
export type DigestArticle = z.infer<typeof digestArticleSchema>;
export type DigestResponse = z.infer<typeof digestResponseSchema>;
export type DigestDetail = z.infer<typeof digestDetailSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionsResponse = z.infer<typeof questionsResponseSchema>;
export type QuestionDatesResponse = z.infer<typeof questionDatesResponseSchema>;
export type AttemptResponse = z.infer<typeof attemptResponseSchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
