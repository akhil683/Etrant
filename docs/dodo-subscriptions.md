# Dodo Payments Subscription Architecture

## Usage sketch

```text
POST /api/subscription          { plan: "Pro" | "Max" } -> { checkoutUrl }
POST /api/subscription/portal                            -> { portalUrl }
GET  /api/subscription/verify                            -> { active, plan, subscriptionEnd }
POST /api/webhook/dodo          signed Standard Webhooks -> { received: true }
```

```ts
// lib/dodo.ts
getDodoClient(): DodoPayments
getDodoEnvironment(): "test_mode" | "live_mode"
getDodoProductId(plan, student): string
getPlanForProductId(productId): SubscriptionPlanName | null
isStudentEmail(email): boolean

// lib/subscription.ts
getSubscriptionStatus(userId): { active, plan, subscriptionEnd }
getActiveSubscription(userId): { subscriptionId, customerId, plan, status } | null
createPendingPayment(userId, plan): paymentId
attachCheckoutSession(paymentId, checkoutSessionId): void
markPaymentFailed(paymentId): void
recordSubscriptionUpdate(input): { userId, plan, active, shouldSendEmail, email, name } | null
```

## Module boundaries

| Module | Responsibility |
| --- | --- |
| `lib/dodo.ts` | Dodo SDK client, environment selection, product/plan catalog, student detection. No database access. |
| `lib/subscription.ts` | All subscription state transitions: pending payments, activation, renewal, cancellation, portal lookup. This is the only module that grants or revokes access. |
| `app/api/subscription/route.ts` | Authenticated checkout creation. Refuses a second concurrent subscription. |
| `app/api/subscription/portal/route.ts` | Creates a Dodo customer portal session for an active subscriber. |
| `app/api/subscription/verify/route.ts` | Read-only status endpoint used by the success page while the webhook lands. |
| `app/api/webhook/dodo/route.ts` | Verifies the Dodo signature, normalizes the event, and delegates to `recordSubscriptionUpdate`. |

## Flow

1. The signed-in user picks Pro or Max on `/subscription`.
2. `POST /api/subscription` verifies the session, picks the regular or student product ID, and writes a `pending` payment row.
3. The route creates a Dodo checkout session with `metadata: { paymentId, userId, plan }` and returns `checkoutUrl`.
4. The browser redirects to Dodo's hosted checkout.
5. Dodo calls `POST /api/webhook/dodo`. The raw body is verified with `client.webhooks.unwrap`.
6. `recordSubscriptionUpdate` updates the user's `plan`, `subscriptionActive`, and `subscriptionEnd`, then records the provider subscription and customer IDs.
7. The success page polls `GET /api/subscription/verify` until `active` is true, then refreshes the user store.
8. Active subscribers are sent to the Dodo customer portal instead of creating a second subscription.

## Why hosted checkout + webhook

Two candidates were considered:

- **A. Hosted checkout session + webhook source of truth (chosen).** No client payment SDK, no extra CSP surface, credentials stay server-side, and access cannot be granted by a browser redirect alone.
- **B. Client-side overlay checkout.** Requires a browser SDK, publishable key handling, additional CSP rules, and still needs the same webhook for renewals. More surface, no benefit for this monthly plan model.

## Key decisions

- **Webhook is the source of truth.** `/api/subscription/verify` only reads our database. The success page cannot grant access.
- **Idempotent transitions.** Repeated or retried webhooks simply rewrite the same status. The welcome email only sends on an inactive-to-active transition.
- **Product ID is authoritative for plan changes.** Portal upgrades change the subscription's `product_id`; metadata can still carry the original checkout plan.
- **Metadata first, email fallback.** `userId` from signed checkout metadata is trusted. If Dodo does not propagate metadata, the webhook falls back to the customer email.
- **No accidental double billing.** Any active subscription blocks a new checkout and routes the user to the Dodo customer portal.
- **Student pricing fails closed.** If a student product ID is missing, checkout errors instead of silently charging the full price.
- **Status mapping.** `active` and `past_due` grant access; `cancelled`, `expired`, `failed`, `on_hold`, and `paused` revoke it.

## Environment contract

```env
DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_WEBHOOK_KEY=
DODO_PAYMENTS_ENVIRONMENT=test_mode

DODO_PRODUCT_ID_PRO=
DODO_PRODUCT_ID_MAX=
DODO_PRODUCT_ID_PRO_STUDENT=
DODO_PRODUCT_ID_MAX_STUDENT=
```

Set `DODO_PAYMENTS_ENVIRONMENT=live_mode` in production. Products must have a subscription period longer than their payment frequency, otherwise Dodo expires them after the first charge.

## Database migration

```bash
pnpm db:migrate-dodo
```

The migration is idempotent. It creates the `payments` table when missing, renames the legacy provider column, drops its `NOT NULL` constraint, and adds the Dodo columns.
