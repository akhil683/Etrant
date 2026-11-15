"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div className="bg-background">
      <Header />
      <div className="flex min-h-screen items-center justify-center px-5 pt-24 md:pt-12">
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-6 text-7xl font-bold tracking-tight text-primary/20 md:text-8xl">
            404
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            Page not found
          </h1>

          <p className="mb-8 text-sm leading-relaxed text-muted-foreground md:text-base">
            This page does not exist or has moved. Head back home, or see how
            Etrant works.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/">
              <Button size="lg" className="h-11 w-full px-6 sm:w-auto">
                <Home className="mr-2 h-4 w-4" />
                Back to home
              </Button>
            </Link>

            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-11 w-full px-6 sm:w-auto"
              >
                <Search className="mr-2 h-4 w-4" />
                How it works
              </Button>
            </Link>
          </div>

          {!session?.user && (
            <div className="mt-10 rounded-xl border border-border bg-card p-4 shadow-soft">
              <p className="text-sm text-muted-foreground">
                While you are here, why not start with today&apos;s digest?{" "}
                <Link
                  href="/auth"
                  className="font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
