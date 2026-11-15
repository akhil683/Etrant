import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 md:pb-28 md:pt-36">
      {/* A single, restrained blue glow anchors the page without extra hues */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,hsl(221_83%_53%/0.10),transparent_70%)]"
      />
      <div className="container relative mx-auto">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Daily current affairs for UPSC &amp; defence aspirants
            </div>

            <h1 className="mb-5 text-[2.7rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]">
              Learn the news that decides the exam.
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              A daily digest of what matters, AI practice questions built around
              your syllabus, and study groups that keep you accountable.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/auth">
                <Button size="lg" className="h-12 w-full px-7 text-base sm:w-auto">
                  Start learning free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full px-7 text-base sm:w-auto"
                >
                  See how it works
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                No card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Built for aspirants
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-primary/5 blur-2xl" />
            <div className="rounded-[2rem] border border-border bg-card p-2.5 shadow-lift">
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
                    <span className="font-display text-base font-bold">
                      Etrant
                    </span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Today
                  </span>
                </div>

                <div className="space-y-4 px-4 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                      Polity
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                      GS II
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-snug">
                    What the new parliamentary committee means for federalism
                  </h2>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    A short, exam-ready summary of the day&apos;s most relevant
                    development, with the context you need to write an answer.
                  </p>

                  <div className="rounded-xl border border-border bg-card p-3.5">
                    <p className="mb-3 text-sm font-semibold leading-snug">
                      Which article deals with the formation of new states?
                    </p>
                    <div className="space-y-2">
                      <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                        Article 1
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 px-3 py-2 text-sm font-semibold text-primary">
                        Article 3
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                        Article 13
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
