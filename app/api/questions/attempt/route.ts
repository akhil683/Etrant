import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { questions, quizAttempts, users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/request-user";
import { getSubscriptionStatus } from "@/lib/subscription";

function localIsoDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Scores one answer on the server. The client sends the selected index, never
 * the points. The endpoint is idempotent on `idempotencyKey`.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireUser(request);
    if ("response" in authResult) return authResult.response;
    const { user } = authResult;

    const status = await getSubscriptionStatus(user.id);
    if (!status.active) {
      return NextResponse.json(
        { error: "Subscription required.", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { questionId, selectedIndex, idempotencyKey } = body ?? {};

    if (
      typeof questionId !== "string" ||
      !Number.isInteger(selectedIndex) ||
      selectedIndex < 0 ||
      selectedIndex > 3 ||
      typeof idempotencyKey !== "string" ||
      idempotencyKey.length < 8
    ) {
      return NextResponse.json(
        { error: "Invalid attempt.", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.idempotencyKey, idempotencyKey));

    if (existing) {
      const [current] = await db
        .select({ points: users.points })
        .from(users)
        .where(eq(users.id, user.id));

      return NextResponse.json({
        isCorrect: existing.isCorrect,
        correctIndex: existing.correctIndex,
        pointsAwarded: existing.pointsAwarded,
        totalPoints: current?.points ?? 0,
        duplicate: true,
      });
    }

    const [question] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId));

    if (!question) {
      return NextResponse.json(
        { error: "Question not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const isCorrect = selectedIndex === question.correctAnswer;
    const pointsAwarded = isCorrect ? 10 : 2;

    await db.insert(quizAttempts).values({
      userId: user.id,
      questionId,
      selectedIndex,
      correctIndex: question.correctAnswer,
      isCorrect,
      pointsAwarded,
      idempotencyKey,
    });

    const [updated] = await db
      .update(users)
      .set({
        points: sql`coalesce(${users.points}, 0) + ${pointsAwarded}`,
      })
      .where(eq(users.id, user.id))
      .returning({
        points: users.points,
        streak: users.streak,
        lastActiveDate: users.lastActiveDate,
      });

    const today = localIsoDate();
    if (updated?.lastActiveDate !== today) {
      const yesterday = localIsoDate(1);
      const nextStreak =
        updated?.lastActiveDate === yesterday ? (updated?.streak ?? 0) + 1 : 1;

      await db
        .update(users)
        .set({ streak: nextStreak, lastActiveDate: today })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({
      isCorrect,
      correctIndex: question.correctAnswer,
      explanation: question.explanation,
      pointsAwarded,
      totalPoints: updated?.points ?? 0,
      duplicate: false,
    });
  } catch (error) {
    console.error("Failed to score attempt:", error);
    return NextResponse.json(
      { error: "Could not score the answer.", code: "ATTEMPT_FAILED" },
      { status: 500 },
    );
  }
}
