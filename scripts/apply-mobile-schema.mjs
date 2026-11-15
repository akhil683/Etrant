import fs from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing.");
}

const sql = postgres(url, { max: 1 });

try {
  const ddl = fs.readFileSync(
    new URL("../lib/db/migrations/0004_daily_questions.sql", import.meta.url),
    "utf8",
  );
  await sql.unsafe(ddl);
  console.log("Applied mobile schema: questions, mobile_refresh_tokens, quiz_attempts.");
} finally {
  await sql.end();
}
