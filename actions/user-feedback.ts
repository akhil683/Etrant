"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { feedbacks } from "@/lib/db/schema";
import { z } from "zod";

const feedbackSchema = z.object({
  feedback: z.string().min(5, "Feedback must be at least 5 characters"),
});

export async function submitFeedback(input: { feedback: string }) {
  const session = await auth();
  const parsed = feedbackSchema.safeParse({ feedback: input.feedback });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    await db.insert(feedbacks).values({
      userName: session?.user?.name as string,
      email: session?.user?.email as string,
      feedback: parsed.data.feedback,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please Try Again." };
  }
}
