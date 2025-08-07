import { InfiniteReel } from "@/components/infinite-reel";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function ArticlePage() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black">
        <InfiniteReel />
      </main>
    </ErrorBoundary>
  );
}
