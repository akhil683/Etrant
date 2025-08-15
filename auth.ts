import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db/db";
import { accounts, sessions, users, verificationTokens } from "./lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  events: {
    async signIn({ user, isNewUser }: any) {
      console.log("auth user", user);
      // if (isNewUser && user.email) {
      await fetch(`${process.env.NEXT_BASE_URL}/api/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
        }),
      });
      // }
    },
  },
});
