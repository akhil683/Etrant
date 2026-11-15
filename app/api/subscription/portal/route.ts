import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDodoClient } from "@/lib/dodo";
import { getActiveSubscription } from "@/lib/subscription";
import { getBaseUrl } from "@/lib/base-url";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to manage your subscription." },
        { status: 401 },
      );
    }

    const activeSubscription = await getActiveSubscription(session.user.id);
    if (!activeSubscription?.customerId) {
      return NextResponse.json(
        { error: "No active subscription was found." },
        { status: 404 },
      );
    }

    const portal = await getDodoClient().customers.customerPortal.create(
      activeSubscription.customerId,
      { return_url: `${getBaseUrl(req)}/subscription` },
    );

    return NextResponse.json({ portalUrl: portal.link });
  } catch (error) {
    console.error("Failed to create Dodo customer portal session:", error);
    return NextResponse.json(
      { error: "Could not open the billing portal. Please try again." },
      { status: 500 },
    );
  }
}
