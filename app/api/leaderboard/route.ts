import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/request-user";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireUser(request);
    if ("response" in authResult) return authResult.response;
    const { user } = authResult;

    const leaderboard = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        interest: users.interest,
        points: users.points,
        streak: users.streak,
        lastActiveDate: users.lastActiveDate,
      })
      .from(users)
      .orderBy(desc(users.points))
      .limit(50);

    const [me] = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        points: users.points,
        streak: users.streak,
      })
      .from(users)
      .where(eq(users.id, user.id));

    let rank: number | null = null;
    if (me) {
      const [ahead] = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(sql`coalesce(${users.points}, 0) > coalesce(${me.points}, 0)`);
      rank = Number(ahead?.count ?? 0) + 1;
    }

    return NextResponse.json({
      leaderboard,
      me: me ? { ...me, rank } : null,
    });
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
