"use client";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/lib/store/useUserStore";
import { plans, discount_price } from "@/data/data";
import { studentEmailDomains } from "@/data/student-email-domains";
import { IPlan } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PricingCard({
  fromApp = false,
}: {
  fromApp?: boolean;
}) {
  const { data: session } = useSession();
  const student = studentEmailDomains.filter(
    (email) => session?.user?.email?.split("@")[1] === email,
  );
  const final_plan = student.length > 0 ? discount_price : plans;

  return (
    <>
      {student.length > 0 && (
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs font-semibold text-primary md:text-sm">
            You get a special student discount.
          </span>
        </div>
      )}
      <div className="grid max-w-5xl gap-6 md:mx-auto md:grid-cols-3">
        {final_plan.map((plan) => (
          <PayCard plan={plan} key={plan.name} fromApp={fromApp} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Payments are processed securely by Dodo Payments. Cancel anytime.
      </p>
    </>
  );
}

const PayCard = ({ plan, fromApp }: { plan: IPlan; fromApp: boolean }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const { data: session } = useSession();
  const hasActiveSubscription = user?.subscriptionActive === true;
  const isCurrentPlan =
    !!user &&
    (hasActiveSubscription
      ? user.plan === plan.name
      : plan.name === "Free");

  const openBillingPortal = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/subscription/portal", {
        method: "POST",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.portalUrl) {
        throw new Error(data?.error ?? "Could not open the billing portal.");
      }

      window.location.href = data.portalUrl;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not open the billing portal.",
      );
      setLoading(false);
    }
  };

  const subscribe = async (planName: string) => {
    if (hasActiveSubscription) {
      if (isCurrentPlan) return;
      await openBillingPortal();
      return;
    }

    if (plan.price === 0) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planName,
          from: fromApp ? "app" : undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (data?.portalUrl) {
        window.location.href = data.portalUrl;
        return;
      }

      if (!res.ok || !data?.checkoutUrl) {
        throw new Error(data?.error ?? "Could not start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout.",
      );
      setLoading(false);
    }
  };

  return (
    <Card
      key={plan.name}
      className={cn(
        "relative flex flex-col",
        plan.popular && "border-primary shadow-lift ring-1 ring-primary",
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
            Most popular
          </div>
        </div>
      )}

      <CardHeader className="pb-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <plan.icon className="h-5 w-5" />
        </div>
        <CardTitle className="mb-2 text-2xl">{plan.name}</CardTitle>
        <div className="mb-3 flex items-baseline gap-1">
          <span className="tabular text-4xl font-bold text-foreground">
            ₹{plan.price}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-6">
        <div className="flex-1 space-y-3">
          {plan.features.map((feature: string) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div>
          <Button
            onClick={() => subscribe(plan.name)}
            variant={plan.buttonVariant}
            disabled={
              loading || (!session?.user && plan.price > 0) || isCurrentPlan
            }
            className="w-full py-3 text-base"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : !session?.user && plan.price > 0 ? (
              "Sign in to subscribe"
            ) : isCurrentPlan ? (
              "Current plan"
            ) : hasActiveSubscription ? (
              "Manage plan"
            ) : (
              plan.buttonText
            )}
          </Button>
        </div>

        {plan.name === "Free" && (
          <p className="text-center text-xs text-muted-foreground">
            No credit card required
          </p>
        )}
      </CardContent>
    </Card>
  );
};
