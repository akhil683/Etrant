"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { IUser } from "@/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const getUserData = async () => {
  const session = await auth();
  const email = session?.user?.email;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email as string));

  if (!user) {
    return null;
  }
  if (user) {
    return user[0] as IUser;
  }
  return null;
};
