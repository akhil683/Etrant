import { db } from "@/lib/db/db";
import { questions } from "@/lib/db/schema";
import { AIQuestions } from "@/lib/repositories/question-repository";
import {
  digestToQuestionsPrompt,
  type DigestQuestionSource,
} from "@/lib/prompts/digest-to-questions";

export const DAILY_QUESTION_COUNT = 10;

export type GeneratedDailyQuestions = {
  digestDate: string;
  inserted: number;
  questions: {
    id: string;
    question: string;
    difficulty: string;
    correctAnswer: number;
  }[];
};

/**
 * Generates the question set for one day's digest and stores it in the
 * `questions` table. Safe to run twice: `question_key` is unique and duplicates
 * are ignored.
 */
export async function generateDailyQuestions(
  articles: DigestQuestionSource[],
  digestDate: string,
): Promise<GeneratedDailyQuestions> {
  if (articles.length === 0) {
    return { digestDate, inserted: 0, questions: [] };
  }

  const prompt = digestToQuestionsPrompt(articles);
  const generated = await AIQuestions.getAIQuestions(prompt);
  const selected = generated.slice(0, DAILY_QUESTION_COUNT);

  if (selected.length === 0) {
    return { digestDate, inserted: 0, questions: [] };
  }

  const rows = selected.map((question, position) => ({
    digestDate,
    position,
    questionKey: `${digestDate}-${position}`,
    question: question.question,
    difficulty: question.difficulty,
    category: question.category || "Daily Digest",
    tags: question.tags ?? [],
    context: question.context ?? "",
    estimatedTime: question.estimatedTime ?? 2,
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation ?? "",
    metadata: question.metadata ?? null,
  }));

  const inserted = await db
    .insert(questions)
    .values(rows)
    .onConflictDoNothing({ target: questions.questionKey })
    .returning({
      id: questions.id,
      question: questions.question,
      difficulty: questions.difficulty,
      correctAnswer: questions.correctAnswer,
    });

  return {
    digestDate,
    inserted: inserted.length,
    questions: inserted,
  };
}
