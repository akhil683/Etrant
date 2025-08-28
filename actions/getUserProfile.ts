"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db/schema";
import {
  users,
  userStats,
  dailyPoints,
  weeklyActivity,
  subjectProgress,
  userBadges,
  badges,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserProfile() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  console.log(userId, user);

  if (!user) return null;

  const [stats] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));
  // const dPoints = await db
  //   .select()
  //   .from(dailyPoints)
  //   .where(eq(dailyPoints.userId, userId));
  // const wActivity = await db
  //   .select()
  //   .from(weeklyActivity)
  //   .where(eq(weeklyActivity.userId, userId));
  // const sProgress = await db
  //   .select()
  //   .from(subjectProgress)
  //   .where(eq(subjectProgress.userId, userId));

  // const userBadgesList = await db
  //   .select()
  //   .from(userBadges)
  //   .leftJoin(badges, eq(userBadges.badgeId, badges.id))
  //   .where(eq(userBadges.userId, userId));

  return {
    ...user,
    stats: stats ?? {},
    // dailyPoints: dPoints ?? [],
    // weeklyActivity: wActivity ?? [],
    // subjectProgress: sProgress ?? [],
    // badges: userBadgesList.map((ub) => ({
    //   id: ub.badges?.id!,
    //   name: ub.badges?.name!,
    //   description: ub.badges?.description!,
    //   icon: ub.badges?.icon!,
    //   rarity: ub.badges?.rarity!,
    //   dateUnlocked: ub.user_badges.dateUnlocked!,
    // })),
  };
}
