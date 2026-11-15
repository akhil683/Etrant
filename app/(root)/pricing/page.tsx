import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { plans, faqs } from "@/data/data";
import { cn } from "@/lib/utils";

export default async function PricingPage() {
  return (
    <div className="container mx-auto max-w-6xl pb-20">
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow">Plans</p>
        <h1 className="page-title md:text-5xl">Simple pricing</h1>
        <p className="page-description">
          Start free and upgrade when you need more. Every paid plan is built
          around daily practice and exam-relevant content.
        </p>
      </div>

      <div className="grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((plan) => (
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
                <span className="tabular text-4xl font-bold">₹{plan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col space-y-6">
              <div className="flex-1 space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <Link href="/auth" className="block">
                  <Button
                    variant={plan.buttonVariant}
                    className="w-full py-3 text-base"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>

              {plan.name === "Free" && (
                <p className="text-center text-xs text-muted-foreground">
                  No credit card required
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Payments are processed securely by Dodo Payments. Cancel anytime.
      </p>

      <div className="mx-auto my-20 max-w-3xl">
        <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-3xl">
          Frequently asked questions
        </h2>
        <div className="surface divide-y divide-border overflow-hidden">
          {faqs.map((faq, idx) => (
            <div key={idx} className="px-6 py-6">
              <h3 className="mb-2 text-lg font-bold">{faq.question}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
