CREATE TABLE IF NOT EXISTS "questions" (
  "id" text PRIMARY KEY NOT NULL,
  "digest_date" date NOT NULL,
  "position" integer NOT NULL,
  "question_key" text NOT NULL,
  "question" text NOT NULL,
  "difficulty" text NOT NULL,
  "category" text NOT NULL,
  "tags" text[],
  "context" text,
  "estimated_time" integer,
  "options" jsonb NOT NULL,
  "correct_answer" integer NOT NULL,
  "explanation" text NOT NULL,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "questions_question_key_unique" UNIQUE("question_key")
);

CREATE INDEX IF NOT EXISTS "questions_digest_date_idx"
  ON "questions" ("digest_date");

CREATE TABLE IF NOT EXISTS "mobile_refresh_tokens" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL UNIQUE,
  "device_id" text NOT NULL,
  "platform" varchar(16) NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone,
  "last_used_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "mobile_refresh_tokens_user_idx"
  ON "mobile_refresh_tokens" ("user_id");

CREATE TABLE IF NOT EXISTS "quiz_attempts" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "question_id" text NOT NULL REFERENCES "questions"("id") ON DELETE CASCADE,
  "selected_index" integer NOT NULL,
  "correct_index" integer NOT NULL,
  "is_correct" boolean NOT NULL,
  "points_awarded" integer NOT NULL,
  "idempotency_key" text NOT NULL UNIQUE,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "quiz_attempts_user_idx"
  ON "quiz_attempts" ("user_id", "created_at");

