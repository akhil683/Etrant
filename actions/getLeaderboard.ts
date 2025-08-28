"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { IUser } from "@/types";
import { desc } from "drizzle-orm";

export const getLeaderboard = async () => {
  const leaderboard = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      interest: users.interest,
      points: users.points,
      streak: users.streak,
      subscriptionActive: users.subscriptionActive,
      plan: users.plan,
      lastActiveDate: users.lastActiveDate,
    })
    .from(users)
    .orderBy(desc(users.points))
    .limit(50);

  if (leaderboard) {
    return leaderboard as IUser[];
  }
  return null;
};
