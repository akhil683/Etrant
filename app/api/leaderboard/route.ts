import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema"; // your users table schema
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const leaderboard = await db
      .select({
        id: users.id,
        email: users.email,
        image: users.image,
        interest: users.interest,
        points: users.points,
        streak: users.streak,
        lastActiveDate: users.lastActiveDate,
      })
      .from(users)
      .orderBy(desc(users.points))
      .limit(50);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
