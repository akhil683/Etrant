import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db/db";
import { accounts, sessions, users, verificationTokens } from "./lib/db/schema";
import sendWelcomeEmail from "./lib/email/welcome-mail";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.email) {
        sendWelcomeEmail(user?.email, user.name || "").catch(console.error);
      }
    },
  },
});
