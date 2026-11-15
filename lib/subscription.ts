import { and, desc, eq, inArray } from "drizzle-orm";
import { format } from "date-fns";
import { db } from "@/lib/db/db";
import { payments, users } from "@/lib/db/schema";
import type { SubscriptionPlanName } from "@/lib/dodo";

export interface SubscriptionStatus {
  active: boolean;
  plan: string;
  subscriptionEnd: string | null;
}

export interface SubscriptionUpdateInput {
  userId?: string;
  email?: string | null;
  paymentId?: string;
  subscriptionId: string;
  customerId?: string | null;
  plan?: SubscriptionPlanName;
  status: string;
  currentPeriodEnd?: string | null;
  amount?: number | null;
  currency?: string | null;
}

export interface ActiveSubscription {
  subscriptionId: string | null;
  customerId: string | null;
  plan: string | null;
  status: string | null;
}

export interface SubscriptionUpdateResult {
  userId: string;
  plan: string;
  active: boolean;
  shouldSendEmail: boolean;
  email: string | null;
  name: string | null;
}

function formatPeriodEnd(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "dd-MM-yyyy");
}

function isActiveStatus(status: string): boolean {
  return status === "active" || status === "past_due";
}

export async function getSubscriptionStatus(
  userId: string,
): Promise<SubscriptionStatus> {
  const [user] = await db
    .select({
      plan: users.plan,
      active: users.subscriptionActive,
      subscriptionEnd: users.subscriptionEnd,
    })
    .from(users)
    .where(eq(users.id, userId));

  return {
    active: user?.active === true,
    plan: user?.plan ?? "Free",
    subscriptionEnd: user?.subscriptionEnd ?? null,
  };
}

export async function getActiveSubscription(
  userId: string,
): Promise<ActiveSubscription | null> {
  const [payment] = await db
    .select({
      subscriptionId: payments.providerSubscriptionId,
      customerId: payments.providerCustomerId,
      plan: payments.plan,
      status: payments.status,
    })
    .from(payments)
    .where(
      and(
        eq(payments.userId, userId),
        eq(payments.provider, "dodo"),
        inArray(payments.status, ["active", "past_due"]),
      ),
    )
    .orderBy(desc(payments.updatedAt))
    .limit(1);

  return payment ?? null;
}

export async function createPendingPayment(
  userId: string,
  plan: SubscriptionPlanName,
): Promise<string> {
  const id = crypto.randomUUID();

  await db.insert(payments).values({
    id,
    userId,
    provider: "dodo",
    plan,
    status: "pending",
    webhookConfirmed: false,
  });

  return id;
}

export async function attachCheckoutSession(
  paymentId: string,
  checkoutSessionId: string,
): Promise<void> {
  await db
    .update(payments)
    .set({ checkoutSessionId, updatedAt: new Date() })
    .where(eq(payments.id, paymentId));
}

export async function markPaymentFailed(paymentId: string): Promise<void> {
  await db
    .update(payments)
    .set({ status: "failed", updatedAt: new Date() })
    .where(eq(payments.id, paymentId));
}

async function resolveUserId(
  input: SubscriptionUpdateInput,
): Promise<string | null> {
  if (input.userId) return input.userId;

  if (input.email) {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email));
    return user?.id ?? null;
  }

  return null;
}

/**
 * Apply a verified Dodo subscription webhook to our database.
 *
 * This is intentionally the only place that grants or revokes access. It is
 * idempotent, so retried webhooks are safe.
 */
export async function recordSubscriptionUpdate(
  input: SubscriptionUpdateInput,
): Promise<SubscriptionUpdateResult | null> {
  const userId = await resolveUserId(input);
  if (!userId) return null;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!existingUser) return null;

  const active = isActiveStatus(input.status);
  const wasActive = existingUser.subscriptionActive === true;
  const resolvedPlan =
    input.plan ??
    (existingUser.plan === "Pro" || existingUser.plan === "Max"
      ? existingUser.plan
      : null);
  const subscriptionEnd =
    formatPeriodEnd(input.currentPeriodEnd) ?? existingUser.subscriptionEnd;

  await db
    .update(users)
    .set({
      subscriptionActive: active,
      subscriptionEnd,
      ...(resolvedPlan ? { plan: resolvedPlan } : {}),
    })
    .where(eq(users.id, userId));

  const paymentValues = {
    userId,
    provider: "dodo",
    providerCustomerId: input.customerId ?? undefined,
    providerSubscriptionId: input.subscriptionId,
    plan: resolvedPlan,
    status: input.status,
    amount: input.amount ?? null,
    currency: input.currency ?? null,
    webhookConfirmed: true,
    updatedAt: new Date(),
  };

  if (input.paymentId) {
    const updated = await db
      .update(payments)
      .set(paymentValues)
      .where(eq(payments.id, input.paymentId))
      .returning({ id: payments.id });

    if (updated.length === 0) {
      await db.insert(payments).values({
        ...paymentValues,
        webhookConfirmed: true,
      });
    }
  } else {
    await db
      .insert(payments)
      .values({
        ...paymentValues,
        webhookConfirmed: true,
      })
      .onConflictDoUpdate({
        target: payments.providerSubscriptionId,
        set: paymentValues,
      });
  }

  return {
    userId,
    plan: resolvedPlan ?? "Free",
    active,
    shouldSendEmail: active && !wasActive,
    email: existingUser.email,
    name: existingUser.name,
  };
}
