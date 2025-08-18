"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { IUser } from "@/types";
import { eq } from "drizzle-orm";

export const updateUser = async (user: IUser) => {
  if (!user) {
    return { success: false, error: "User is required" };
  }

  try {
    await db
      .update(users)
      .set({
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        interest: user.interest,
        streak: user.streak,
        image: user.image,
        points: user.points,
      })
      .where(eq(users.id, user.id));

    return { success: true, message: "Interest stored successfully" };
  } catch (error) {
    return { success: false, error: "Failed to store interest" };
  }
};
