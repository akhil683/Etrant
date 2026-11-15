import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getDodoClient,
  getDodoProductId,
  isStudentEmail,
  isSubscriptionPlanName,
} from "@/lib/dodo";
import {
  attachCheckoutSession,
  createPendingPayment,
  getActiveSubscription,
  markPaymentFailed,
} from "@/lib/subscription";
import { getBaseUrl } from "@/lib/base-url";

export async function POST(req: Request) {
  let paymentId: string | null = null;

  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Please sign in to subscribe." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => null);
    const plan = body?.plan;
    const fromApp = body?.from === "app";
    const subscriptionPath = fromApp
      ? "/subscription?from=app"
      : "/subscription";
    const successPath = fromApp
      ? "/subscription/success?from=app"
      : "/subscription/success";

    if (!isSubscriptionPlanName(plan)) {
      return NextResponse.json(
        { error: "Choose a valid plan." },
        { status: 400 },
      );
    }

    const student = isStudentEmail(session.user.email);
    const baseUrl = getBaseUrl(req);

    const activeSubscription = await getActiveSubscription(session.user.id);
    if (activeSubscription) {
      const portalSession = activeSubscription.customerId
        ? await getDodoClient().customers.customerPortal.create(
            activeSubscription.customerId,
            { return_url: `${baseUrl}${subscriptionPath}` },
          )
        : null;

      return NextResponse.json(
        {
          error:
            "You already have an active subscription. Manage or cancel it from the billing portal.",
          portalUrl: portalSession?.link,
        },
        { status: 409 },
      );
    }

    const productId = getDodoProductId(plan, student);
    paymentId = await createPendingPayment(session.user.id, plan);

    const checkout = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: session.user.email,
        name: session.user.name ?? undefined,
      },
      return_url: `${baseUrl}${successPath}`,
      cancel_url: `${baseUrl}${subscriptionPath}`,
      metadata: {
        paymentId,
        userId: session.user.id,
        plan,
      },
      customization: {
        theme: "light",
        show_order_details: true,
        theme_config: {
          pay_button_text: `Subscribe to ${plan}`,
          radius: "10px",
          light: {
            button_primary: "#2563EB",
            button_primary_hover: "#1D4ED8",
            input_focus_border: "#2563EB",
          },
        },
      },
      feature_flags: {
        allow_discount_code: false,
      },
    });

    if (!checkout.checkout_url) {
      throw new Error("Dodo did not return a checkout URL.");
    }

    await attachCheckoutSession(paymentId, checkout.session_id).catch(
      (error) => {
        console.error("Failed to attach Dodo checkout session:", error);
      },
    );

    return NextResponse.json({
      checkoutUrl: checkout.checkout_url,
      sessionId: checkout.session_id,
    });
  } catch (error) {
    console.error("Failed to create Dodo checkout session:", error);

    if (paymentId) {
      await markPaymentFailed(paymentId).catch(() => undefined);
    }

    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
