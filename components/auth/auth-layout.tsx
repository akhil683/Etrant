import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignIn from "./sign-in";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import { Check } from "lucide-react";

export default function AuthLayout({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_0%,hsl(0_0%_100%/0.16),transparent_60%)]"
        />
        <Link href="/" className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/15 ring-1 ring-white/25">
            <Image src={Logo} className="h-full w-full" alt="Etrant logo" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight">
            Etrant
          </span>
        </Link>

        <div className="relative max-w-md">
          <h1 className="mb-4 text-5xl font-bold leading-[1.05] tracking-tight">
            Think clearer.
            <br />
            Prepare better.
          </h1>
          <p className="mb-8 text-lg text-white/75">
            A short daily loop: read, test, repeat.
          </p>
          <div className="space-y-3 border-t border-white/20 pt-8">
            {[
              "A daily digest filtered for your exam",
              "Practice questions with real explanations",
              "Study groups and steady accountability",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-white/85"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/60">
          Built for UPSC and defence aspirants.
        </p>
      </div>

      {/* Form */}
      <div className="flex w-full items-center justify-center px-5 py-14 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Image src={Logo} className="h-full w-full" alt="Etrant logo" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              Etrant
            </span>
          </div>

          <Card className="border-border">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl md:text-3xl">
                Welcome back
              </CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base">
                Sign in to continue your preparation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignIn callbackUrl={callbackUrl} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">
                    Trusted by 50+ learners
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-center text-sm text-muted-foreground">
                <p>No credit card required</p>
                <p>Start learning in seconds</p>
                <p>Sync across all devices</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
