import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-lift md:px-12 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_-20%,hsl(0_0%_100%/0.18),transparent_60%)]"
          />
          <div className="relative">
            <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Start with today&apos;s digest.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">
              Take the first step of a daily habit that compounds. Free to
              start, and useful from the first read.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="h-12 bg-white px-7 text-base text-primary shadow-sm hover:bg-white/90"
              >
                Create your free account
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
