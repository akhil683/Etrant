"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { InterestCategory } from "@/types";
import { eq } from "drizzle-orm";

export const setInterests = async (
  interests: InterestCategory,
  userEmail: string,
) => {
  console.log("interest", interests);
  if (!interests) {
    return { success: false, error: "Interest is required" };
  }

  try {
    const newUser = await db
      .update(users)
      .set({ interest: interests })
      .where(eq(users.email, userEmail));

    console.log("new user", newUser);

    return { success: true, message: "Interest stored successfully" };
  } catch (error) {
    return { success: false, error: "Failed to store interest" };
  }
};
