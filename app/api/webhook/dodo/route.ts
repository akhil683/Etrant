import { NextRequest, NextResponse } from "next/server";
import type DodoPayments from "dodopayments";
import {
  getDodoClient,
  getPlanForProductId,
  isSubscriptionPlanName,
} from "@/lib/dodo";
import { recordSubscriptionUpdate } from "@/lib/subscription";
import sendSubscriptionEmail from "@/lib/email/subscription-email";

export const dynamic = "force-dynamic";

type DodoWebhookEvent = ReturnType<DodoPayments["webhooks"]["unwrap"]>;
type DodoSubscriptionEvent = Extract<
  DodoWebhookEvent,
  { type: `subscription.${string}` }
>;

function stringMetadata(
  metadata: Record<string, string | number | boolean> | null | undefined,
  key: string,
): string | undefined {
  const value = metadata?.[key];
  return typeof value === "string" ? value : undefined;
}

export async function POST(req: NextRequest) {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) {
    console.error("DODO_PAYMENTS_WEBHOOK_KEY is not configured.");
    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 },
    );
  }

  const webhookId = req.headers.get("webhook-id");
  const webhookSignature = req.headers.get("webhook-signature");
  const webhookTimestamp = req.headers.get("webhook-timestamp");

  if (!webhookId || !webhookSignature || !webhookTimestamp) {
    return NextResponse.json(
      { error: "Missing webhook signature headers." },
      { status: 400 },
    );
  }

  let event: DodoWebhookEvent;
  try {
    const rawBody = await req.text();
    event = getDodoClient().webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      },
      key: webhookKey,
    });
  } catch (error) {
    console.warn("Rejected Dodo webhook with an invalid signature:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (!event.type.startsWith("subscription.")) {
      // Payment, refund, and dispute events are intentionally not used to grant
      // access. The subscription lifecycle is the source of truth.
      return NextResponse.json({ received: true });
    }

    const subscriptionEvent = event as DodoSubscriptionEvent;
    const subscription = subscriptionEvent.data;
    const metadata = subscription.metadata;

    const result = await recordSubscriptionUpdate({
      userId: stringMetadata(metadata, "userId"),
      email: subscription.customer?.email,
      paymentId: stringMetadata(metadata, "paymentId"),
      subscriptionId: subscription.subscription_id,
      customerId: subscription.customer?.customer_id,
      plan:
        getPlanForProductId(subscription.product_id) ??
        (isSubscriptionPlanName(metadata?.plan) ? metadata.plan : undefined),
      status: subscription.status,
      currentPeriodEnd: subscription.next_billing_date,
      amount: subscription.recurring_pre_tax_amount,
      currency: subscription.currency,
    });

    if (!result) {
      console.error(
        `Dodo webhook ${event.type} could not be matched to a user.`,
        {
          subscriptionId: subscription.subscription_id,
          customerEmail: subscription.customer?.email,
          metadata,
        },
      );
      return NextResponse.json({ received: true });
    }

    if (result.shouldSendEmail) {
      await sendSubscriptionEmail(result.email, result.name, result.plan).catch(
        (error) => console.error("Subscription email failed:", error),
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Failed to process Dodo webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
