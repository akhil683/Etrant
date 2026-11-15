import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Logo from "@/public/etrant.png";
import Link from "next/link";
import { Metadata } from "next";
import { howItWorkMetadata } from "@/lib/config/site";
import { stepsHowItWorks } from "@/data/data";
import Image from "next/image";

export const metadata: Metadata = howItWorkMetadata;

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-5xl pb-20">
      <div className="mb-16 border-b border-border pb-8">
        <p className="eyebrow">How it works</p>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          A short daily loop, built to compound.
        </h1>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Read the day&apos;s relevant news, test yourself while it is fresh,
          and keep a record of what you have covered. That is the whole system.
        </p>
        <Link href="/auth">
          <Button size="lg" className="h-11 px-6">
            Get started free
          </Button>
        </Link>
      </div>

      <div className="mb-20 space-y-4">
        {stepsHowItWorks.map((step) => (
          <div
            key={step.step}
            className="surface grid items-center gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:p-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <step.icon className="h-6 w-6 text-primary" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-3">
                <span className="text-xs font-bold text-primary">
                  Step {step.step}
                </span>
                <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                  {step.title}
                </h3>
              </div>
              <p className="mb-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {step.description}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {step.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <span className="tabular text-4xl font-bold text-border">
                {step.step}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-3xl">
          A look at the daily view
        </h2>

        <div className="flex justify-center">
          <div className="relative w-full max-w-sm rounded-[2rem] border border-border bg-card p-2.5 shadow-lift">
            <div className="overflow-hidden rounded-[1.6rem] border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md bg-primary/10 ring-1 ring-primary/20">
                    <Image
                      src={Logo}
                      className="h-full w-full object-cover"
                      alt="Etrant logo"
                    />
                  </div>
                  <h3 className="font-display text-base font-bold">Etrant</h3>
                </div>
                <span className="tabular rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  1,247 points
                </span>
              </div>

              <div className="space-y-4 px-4 py-5">
                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="mb-2 text-base font-bold">
                    Today&apos;s digest
                  </h4>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    A short summary of the most exam-relevant development, with
                    the context you need to write an answer.
                  </p>
                  <div className="border-t border-border pt-3 text-xs font-semibold text-primary">
                    Read the digest
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="mb-3 text-base font-bold">Quick check</h4>
                  <p className="mb-3 text-sm leading-relaxed text-foreground">
                    Which article deals with the formation of new states?
                  </p>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-primary bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                      Article 3
                    </div>
                    <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                      Article 1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
