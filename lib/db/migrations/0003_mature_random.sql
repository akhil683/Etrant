ALTER TABLE "user" ADD COLUMN "plan" text DEFAULT 'Free';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscriptionActive" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "subscriptionEnd" text;