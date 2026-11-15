"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, Home, Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useUser } from "@/components/providers/UserProvider";

type ActivationState = "checking" | "active" | "pending";

const MAX_POLLS = 12;
const POLL_INTERVAL_MS = 2000;

export default function SuccessPage() {
  const [state, setState] = useState<ActivationState>("checking");
  const [plan, setPlan] = useState<string | null>(null);
  const { refreshUser } = useUser();
  const refreshUserRef = useRef(refreshUser);

  useEffect(() => {
    refreshUserRef.current = refreshUser;
  }, [refreshUser]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    let celebrated = false;

    const celebrate = () => {
      if (celebrated) return;
      celebrated = true;
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#2563EB", "#60A5FA", "#FFFFFF"],
      });
    };

    const poll = async () => {
      try {
        const res = await fetch("/api/subscription/verify", {
          cache: "no-store",
        });
        const data = await res.json();

        if (cancelled) return;

        if (data?.active) {
          setPlan(typeof data.plan === "string" ? data.plan : null);
          setState("active");
          celebrate();
          await refreshUserRef.current();
          return;
        }
      } catch {
        // Keep polling; the webhook may still be in flight.
      }

      attempts += 1;
      if (attempts >= MAX_POLLS) {
        if (!cancelled) setState("pending");
        return;
      }

      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const isChecking = state === "checking";
  const isActive = state === "active";

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-5 pt-24 md:pt-12">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {isChecking ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          ) : isActive ? (
            <Check className="h-7 w-7 text-primary" />
          ) : (
            <Clock className="h-7 w-7 text-primary" />
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {isChecking
            ? "Activating your subscription"
            : isActive
              ? "Payment successful"
              : "Payment received"}
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {isChecking
            ? "Your payment went through. We are updating your access now — this usually takes a few seconds."
            : isActive
              ? `Your ${plan ?? ""} subscription is active. You can start using the full digest and AI practice questions right away.`
              : "We are still confirming your subscription with the payment provider. Refresh in a moment to see your access."}
        </p>

        {isActive && (
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/articles">
              <Button size="lg" className="h-11 w-full px-6 sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Read articles
              </Button>
            </Link>

            <Link href="/ai-questions">
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full px-6 sm:w-auto"
              >
                <Search className="mr-2 h-4 w-4" />
                AI questions
              </Button>
            </Link>
          </div>
        )}

        {state === "pending" && (
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-11 px-6"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh status
            </Button>

            <Link href="/subscription">
              <Button size="lg" variant="outline" className="h-11 px-6">
                Back to plans
              </Button>
            </Link>
          </div>
        )}

        {isChecking && (
          <p className="text-xs text-muted-foreground">
            You can safely keep this page open.
          </p>
        )}

        <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">
          Using the Etrant app? Return to the app and sign in with the same
          Google account. Your plan will appear automatically.
        </p>
      </div>
    </div>
  );
}
