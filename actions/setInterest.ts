"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { InterestCategory } from "@/types";
import { eq } from "drizzle-orm";

export const storeInterests = async (
  interests: InterestCategory[],
  userEmail: string,
) => {
  if (!interests || interests.length < 1) {
    return { success: false, error: "Interest is required" };
  }

  try {
    await db
      .update(users)
      .set({ interest: interests[0] })
      .where(eq(users.email, userEmail));

    return { success: true, message: "Interest stored successfully" };
  } catch (error) {
    return { success: false, error: "Failed to store interest" };
  }
};
