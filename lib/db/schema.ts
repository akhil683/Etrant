import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  date,
  real,
} from "drizzle-orm/pg-core";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { AdapterAccountType } from "@auth/core/adapters";

const connectionString = process.env.DATABASE_URL!;
const pool = neon(
  "postgresql://neondb_owner:npg_y5EWmYHDCI1l@ep-hidden-tree-a1041pdx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
);
export const db = drizzle(pool);

// -------------------- USERS --------------------
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  streak: integer("streak").default(0),
  interest: text("interest"),
  points: integer("points").default(0),
  lastActiveDate: text("lastActiveDate"),
  rank: text("rank"),
  joinDate: date("joinDate"),
});

// -------------------- USER STATS --------------------
export const userStats = pgTable(
  "user_stats",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    totalReels: integer("totalReels").default(0),
    totalQuizzes: integer("totalQuizzes").default(0),
    averageScore: integer("averageScore").default(0), // %
    studyTime: real("studyTime").default(0), // hours
    globalRank: integer("globalRank"),
  },
  (t) => [primaryKey({ columns: [t.userId] })],
);

// -------------------- DAILY POINTS --------------------
export const dailyPoints = pgTable("daily_points", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  day: text("day"), // e.g. Mon
  date: date("date"),
  points: integer("points"),
});

// -------------------- WEEKLY ACTIVITY --------------------
export const weeklyActivity = pgTable("weekly_activity", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  week: text("week"), // e.g. Week 1
  reels: integer("reels").default(0),
  quizzes: integer("quizzes").default(0),
  hours: real("hours").default(0),
});

// -------------------- SUBJECT PROGRESS --------------------
export const subjectProgress = pgTable("subject_progress", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject"),
  progress: integer("progress").default(0), // %
  color: text("color"), // Tailwind class or HEX
});

// -------------------- BADGES --------------------
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  icon: text("icon"), // path to icon image
  rarity: text("rarity"), // common, rare, epic
});

// -------------------- USER BADGES --------------------
export const userBadges = pgTable(
  "user_badges",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: integer("badgeId")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    dateUnlocked: date("dateUnlocked"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

// -------------------- AUTH TABLES --------------------
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({ columns: [authenticator.userId, authenticator.credentialID] }),
  ],
);
