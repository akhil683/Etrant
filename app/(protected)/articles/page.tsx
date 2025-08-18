import type { Metadata } from "next";
import { auth } from "@/auth";
import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { redirect } from "next/navigation";
import { articlesMeta } from "@/lib/config/site";

export const metadata: Metadata = articlesMeta;

export default async function ArticlePage() {
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black">
        <InfiniteReel />
      </main>
    </ErrorBoundary>
  );
}
