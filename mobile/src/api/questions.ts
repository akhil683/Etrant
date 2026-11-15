import { apiFetch } from "./client";
import {
  attemptResponseSchema,
  questionDatesResponseSchema,
  questionsResponseSchema,
} from "./schemas";

export function getQuestions(params: {
  from: string;
  to: string;
  limit?: number;
  offset?: number;
}) {
  const search = new URLSearchParams({
    from: params.from,
    to: params.to,
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
  });

  return apiFetch(`/api/questions?${search.toString()}`, undefined, {
    schema: questionsResponseSchema,
  });
}

export function getQuestionDates(params: { from: string; to: string }) {
  const search = new URLSearchParams({
    from: params.from,
    to: params.to,
  });

  return apiFetch(`/api/questions/dates?${search.toString()}`, undefined, {
    schema: questionDatesResponseSchema,
  });
}

export function submitAttempt(input: {
  questionId: string;
  selectedIndex: number;
  idempotencyKey: string;
}) {
  return apiFetch(
    "/api/questions/attempt",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    { schema: attemptResponseSchema },
  );
}
