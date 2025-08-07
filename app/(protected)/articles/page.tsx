import { auth } from "@/auth";
import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { redirect } from "next/navigation";

export default async function ArticlePage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black">
        <InfiniteReel />
      </main>
    </ErrorBoundary>
  );
}
