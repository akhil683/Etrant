// Idempotent migration from the Razorpay payments schema to Dodo Payments.
const { neon } = require("@neondatabase/serverless");
const { config } = require("dotenv");

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  console.log("Migrating payments table for Dodo Payments...");

  await sql`
    DO $$
    BEGIN
      IF to_regclass('public.payments') IS NULL THEN
        CREATE TABLE payments (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          provider VARCHAR(32) NOT NULL DEFAULT 'dodo',
          checkout_session_id VARCHAR(255) UNIQUE,
          provider_customer_id VARCHAR(255),
          provider_subscription_id VARCHAR(255) UNIQUE,
          plan VARCHAR(50),
          status VARCHAR(50),
          amount INTEGER,
          currency VARCHAR(10),
          method VARCHAR(50),
          webhook_confirmed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      ELSE
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'payments'
            AND column_name = 'razorpay_payment_id'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'payments'
            AND column_name = 'provider_subscription_id'
        ) THEN
          ALTER TABLE payments RENAME COLUMN razorpay_payment_id TO provider_subscription_id;
        END IF;

        ALTER TABLE payments
          ADD COLUMN IF NOT EXISTS provider VARCHAR(32) NOT NULL DEFAULT 'dodo',
          ADD COLUMN IF NOT EXISTS checkout_session_id VARCHAR(255),
          ADD COLUMN IF NOT EXISTS provider_customer_id VARCHAR(255),
          ADD COLUMN IF NOT EXISTS provider_subscription_id VARCHAR(255),
          ADD COLUMN IF NOT EXISTS plan VARCHAR(50),
          ADD COLUMN IF NOT EXISTS status VARCHAR(50),
          ADD COLUMN IF NOT EXISTS amount INTEGER,
          ADD COLUMN IF NOT EXISTS currency VARCHAR(10),
          ADD COLUMN IF NOT EXISTS method VARCHAR(50),
          ADD COLUMN IF NOT EXISTS webhook_confirmed BOOLEAN DEFAULT FALSE,
          ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
          ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

        ALTER TABLE payments ALTER COLUMN provider_subscription_id DROP NOT NULL;

        UPDATE payments SET provider = 'dodo' WHERE provider IS NULL;
        UPDATE payments SET status = 'legacy' WHERE status IS NULL;

        CREATE UNIQUE INDEX IF NOT EXISTS payments_checkout_session_id_key
          ON payments (checkout_session_id);
        CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_subscription_id_key
          ON payments (provider_subscription_id);
      END IF;
    END $$;
  `;

  console.log("Payments table is ready for Dodo Payments.");
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
