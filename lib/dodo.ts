import DodoPayments from "dodopayments";
import { studentEmailDomains } from "@/data/student-email-domains";

export type SubscriptionPlanName = "Pro" | "Max";

export const SUBSCRIPTION_PLAN_NAMES: SubscriptionPlanName[] = ["Pro", "Max"];

type DodoEnvironment = "test_mode" | "live_mode";

let client: DodoPayments | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function getDodoEnvironment(): DodoEnvironment {
  const configured = process.env.DODO_PAYMENTS_ENVIRONMENT;
  if (configured === "live_mode" || configured === "test_mode") {
    return configured;
  }
  return process.env.NEXT_ENVIRONMENT === "Production"
    ? "live_mode"
    : "test_mode";
}

/**
 * Lazily create the Dodo client so a production build never requires payment
 * credentials, and missing credentials fail at request time with a clear error.
 */
export function getDodoClient(): DodoPayments {
  const bearerToken = requiredEnv("DODO_PAYMENTS_API_KEY");

  if (!client) {
    client = new DodoPayments({
      bearerToken,
      environment: getDodoEnvironment(),
      webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? null,
    });
  }

  return client;
}

export function isStudentEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return studentEmailDomains.some((item) => item.toLowerCase() === domain);
}

export function isSubscriptionPlanName(
  value: unknown,
): value is SubscriptionPlanName {
  return value === "Pro" || value === "Max";
}

export function getDodoProductId(
  plan: SubscriptionPlanName,
  student: boolean,
): string {
  const suffix = student ? "_STUDENT" : "";
  return requiredEnv(`DODO_PRODUCT_ID_${plan.toUpperCase()}${suffix}`);
}

export function getPlanForProductId(
  productId: string | null | undefined,
): SubscriptionPlanName | null {
  if (!productId) return null;

  for (const plan of SUBSCRIPTION_PLAN_NAMES) {
    const regular = process.env[`DODO_PRODUCT_ID_${plan.toUpperCase()}`];
    const student =
      process.env[`DODO_PRODUCT_ID_${plan.toUpperCase()}_STUDENT`];

    if (productId === regular || productId === student) {
      return plan;
    }
  }

  return null;
}
