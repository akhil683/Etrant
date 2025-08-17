CREATE TABLE "subject_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"subject" text,
	"progress" integer DEFAULT 0,
	"color" text
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "lastActiveDate" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subject_progress" ADD CONSTRAINT "subject_progress_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;