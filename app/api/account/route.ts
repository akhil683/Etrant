import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/request-user";

/**
 * Deletes the signed-in user and everything that cascades from it. Required by
 * the App Store for apps that create accounts.
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireUser(request);
    if ("response" in authResult) return authResult.response;

    await db.delete(users).where(eq(users.id, authResult.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { error: "Could not delete the account." },
      { status: 500 },
    );
  }
}
