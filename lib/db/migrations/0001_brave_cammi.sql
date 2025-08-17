CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"icon" text,
	"rarity" text
);
--> statement-breakpoint
CREATE TABLE "daily_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"day" text,
	"date" date,
	"points" integer
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"userId" text NOT NULL,
	"badgeId" integer NOT NULL,
	"dateUnlocked" date,
	CONSTRAINT "user_badges_userId_badgeId_pk" PRIMARY KEY("userId","badgeId")
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"userId" text NOT NULL,
	"totalReels" integer DEFAULT 0,
	"totalQuizzes" integer DEFAULT 0,
	"averageScore" integer DEFAULT 0,
	"studyTime" real DEFAULT 0,
	"globalRank" integer,
	CONSTRAINT "user_stats_userId_pk" PRIMARY KEY("userId")
);
--> statement-breakpoint
CREATE TABLE "weekly_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"week" text,
	"reels" integer DEFAULT 0,
	"quizzes" integer DEFAULT 0,
	"hours" real DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "interest" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastActiveDate" date;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "rank" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "joinDate" date;--> statement-breakpoint
ALTER TABLE "daily_points" ADD CONSTRAINT "daily_points_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_badges_id_fk" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_activity" ADD CONSTRAINT "weekly_activity_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;