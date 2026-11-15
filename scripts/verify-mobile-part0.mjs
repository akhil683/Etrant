import crypto from "node:crypto";
import postgres from "postgres";
import { SignJWT } from "jose";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const AUTH_SECRET = process.env.AUTH_SECRET;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing.");
if (!AUTH_SECRET) throw new Error("AUTH_SECRET is missing.");

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const userId = crypto.randomUUID();
const email = `mobile-part0-${Date.now()}@example.com`;
const today = new Date().toISOString().slice(0, 10);
const questionIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function call(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: response.status, body };
}

try {
  console.log("1. Creating test user and questions...");
  await sql`
    insert into "user" (id, name, email, plan, "subscriptionActive", points, streak, "joinDate")
    values (${userId}, ${"Mobile Part 0 Test"}, ${email}, ${"Pro"}, true, 0, 0, ${today})
  `;

  for (let index = 0; index < questionIds.length; index += 1) {
    await sql`
      insert into questions (
        id, digest_date, position, question_key, question, difficulty, category,
        tags, context, estimated_time, options, correct_answer, explanation, metadata
      ) values (
        ${questionIds[index]}, ${today}, ${index}, ${`part0-test-${today}-${index}`},
        ${`Part 0 test question ${index + 1}?`}, ${"medium"}, ${"Daily Digest"},
        ${sql.array(["test", "part0"])}, ${"Test context"}, 2,
        ${sql.json([
          { name: "Correct", isCorrect: true },
          { name: "Wrong 1", isCorrect: false },
          { name: "Wrong 2", isCorrect: false },
          { name: "Wrong 3", isCorrect: false },
        ])},
        0, ${"The first option is correct because this is a test."},
        ${sql.json({ source: "test" })}
      )
    `;
  }

  const secret = new TextEncoder().encode(AUTH_SECRET);
  const token = await new SignJWT({
    email,
    name: "Mobile Part 0 Test",
    image: null,
    typ: "mobile-access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);

  const auth = { Authorization: `Bearer ${token}` };

  console.log("2. GET /api/user");
  const user = await call("/api/user", { headers: auth });
  assert(user.status === 200, `user status ${user.status}`);
  assert(user.body?.user?.email === email, "user email mismatch");
  console.log("   ok:", user.body.user.email, user.body.user.plan);

  console.log("3. GET /api/digest");
  const digest = await call("/api/digest", { headers: auth });
  assert(digest.status === 200, `digest status ${digest.status}`);
  assert(Array.isArray(digest.body?.articles), "digest articles missing");
  console.log("   ok:", digest.body.date, `${digest.body.articles.length} articles`);

  console.log("4. GET /api/digest/[id]");
  const firstDigest = digest.body.articles[0];
  if (firstDigest) {
    const detail = await call(`/api/digest/${firstDigest.id}`, { headers: auth });
    assert(detail.status === 200, `digest detail status ${detail.status}`);
    console.log("   ok:", detail.body.title.slice(0, 50));
  } else {
    console.log("   skipped: no digest rows");
  }

  console.log("5. GET /api/questions");
  const questions = await call(
    `/api/questions?from=${today}&to=${today}&limit=10`,
    { headers: auth },
  );
  assert(questions.status === 200, `questions status ${questions.status}`);
  assert(questions.body?.count === 3, `expected 3 questions, got ${questions.body?.count}`);
  console.log("   ok:", questions.body.count, "questions");

  console.log("6. POST /api/questions/attempt (correct)");
  const idempotencyKey = crypto.randomUUID();
  const attempt = await call("/api/questions/attempt", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      questionId: questionIds[0],
      selectedIndex: 0,
      idempotencyKey,
    }),
  });
  assert(attempt.status === 200, `attempt status ${attempt.status}`);
  assert(attempt.body?.isCorrect === true, "expected correct");
  assert(attempt.body?.pointsAwarded === 10, "expected 10 points");
  assert(attempt.body?.totalPoints === 10, `expected total 10, got ${attempt.body?.totalPoints}`);
  console.log("   ok: +10 points, total", attempt.body.totalPoints);

  console.log("7. POST /api/questions/attempt (duplicate)");
  const duplicate = await call("/api/questions/attempt", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({
      questionId: questionIds[0],
      selectedIndex: 0,
      idempotencyKey,
    }),
  });
  assert(duplicate.status === 200, `duplicate status ${duplicate.status}`);
  assert(duplicate.body?.duplicate === true, "expected duplicate");
  assert(duplicate.body?.totalPoints === 10, "duplicate must not add points");
  console.log("   ok: duplicate ignored, total", duplicate.body.totalPoints);

  console.log("8. GET /api/leaderboard");
  const leaderboard = await call("/api/leaderboard", { headers: auth });
  assert(leaderboard.status === 200, `leaderboard status ${leaderboard.status}`);
  assert(leaderboard.body?.me?.rank >= 1, "expected a rank");
  console.log("   ok: rank", leaderboard.body.me.rank, "points", leaderboard.body.me.points);

  console.log("9. GET /api/subscription/verify");
  const subscription = await call("/api/subscription/verify", { headers: auth });
  assert(subscription.status === 200, `subscription status ${subscription.status}`);
  assert(subscription.body?.active === true, "expected active subscription");
  console.log("   ok: plan", subscription.body.plan);

  console.log("10. GET /api/questions without auth");
  const unauthenticated = await call(`/api/questions?from=${today}&to=${today}`);
  assert(unauthenticated.status === 401, `expected 401, got ${unauthenticated.status}`);
  console.log("   ok: 401 without a token");

  console.log("\nPart 0 verification passed.");
} finally {
  console.log("Cleaning up test rows...");
  await sql`delete from quiz_attempts where user_id = ${userId}`;
  await sql`delete from mobile_refresh_tokens where user_id = ${userId}`;
  await sql`delete from "user" where id = ${userId}`;
  await sql`delete from questions where question_key like ${`part0-test-${today}-%`}`;
  await sql.end();
}
