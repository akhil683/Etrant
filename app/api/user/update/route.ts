import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import {
  dailyPoints,
  userBadges,
  users,
  userStats,
  weeklyActivity,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  streak: number;
  interest: string | null;
  points: number;
  lastActiveDate: string | null;
  rank: string | null;
  stats: {
    totalReels: number;
    totalQuizzes: number;
    averageScore: number;
    studyTime: number;
    globalRank: number | null;
  };
  dailyPoints: { day: string; date: Date; points: number }[];
  weeklyActivity: {
    week: string;
    reels: number;
    quizzes: number;
    hours: number;
  }[];
  badges: {
    id: number;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    dateUnlocked: Date;
  }[];
}
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as User;
    const user = body;
    if (!body?.id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    await db
      .update(users)
      .set({
        name: user.name,
        email: user.email,
        image: user.image,
        streak: user.streak,
        interest: user.interest,
        points: user.points,
        lastActiveDate: user.lastActiveDate,
        rank: user.rank,
      })
      .where(eq(users.id, user.id));

    // 2. Update user_stats (upsert style)
    await db
      .insert(userStats)
      .values({
        userId: user.id,
        totalReels: user.stats.totalReels,
        totalQuizzes: user.stats.totalQuizzes,
        averageScore: user.stats.averageScore,
        studyTime: user.stats.studyTime,
        globalRank: user.stats.globalRank ?? null,
      })
      .onConflictDoUpdate({
        target: userStats.userId,
        set: {
          totalReels: user.stats.totalReels,
          totalQuizzes: user.stats.totalQuizzes,
          averageScore: user.stats.averageScore,
          studyTime: user.stats.studyTime,
          globalRank: user.stats.globalRank ?? null,
        },
      });

    // 3. Replace daily_points
    await db.delete(dailyPoints).where(eq(dailyPoints.userId, user.id));
    if (user.dailyPoints?.length) {
      await db.insert(dailyPoints).values(
        user.dailyPoints.map((dp) => ({
          userId: user.id,
          day: dp.day,
          date: dp.date ? new Date(dp.date).toISOString() : null,
          points: dp.points,
        })),
      );
    }

    // 4. Replace weekly_activity
    await db.delete(weeklyActivity).where(eq(weeklyActivity.userId, user.id));
    if (user.weeklyActivity?.length) {
      await db.insert(weeklyActivity).values(
        user.weeklyActivity.map((wa) => ({
          userId: user.id,
          week: wa.week,
          reels: wa.reels,
          quizzes: wa.quizzes,
          hours: wa.hours,
        })),
      );
    }

    // 5. Sync user_badges (avoid duplicates)
    if (user.badges?.length) {
      for (const badge of user.badges) {
        await db
          .insert(userBadges)
          .values({
            userId: user.id,
            badgeId: badge.id,
            dateUnlocked: badge.dateUnlocked
              ? new Date(badge.dateUnlocked).toISOString()
              : null,
          })
          .onConflictDoNothing();
      }
    }

    // ✅ Return updated user
    return NextResponse.json({ success: true, user: body });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
