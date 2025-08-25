import type { Metadata } from "next";
import { auth } from "@/auth";
import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { redirect } from "next/navigation";
import { articlesMeta } from "@/lib/config/site";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata: Metadata = articlesMeta;

export default async function ArticlePage() {
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <main className="min-h-screen bg-black">
          <InfiniteReel />
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
