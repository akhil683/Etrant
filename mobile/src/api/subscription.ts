import { apiFetch } from "./client";
import { subscriptionStatusSchema } from "./schemas";

export function fetchSubscriptionStatus() {
  return apiFetch("/api/subscription/verify", undefined, {
    schema: subscriptionStatusSchema,
  });
}
