import { LockIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function LockedPage() {
  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-5 pt-24 md:pt-12">
      <div className="surface mx-auto flex max-w-md flex-col items-center gap-5 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <LockIcon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
          This feature is part of a paid plan
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Subscribe to unlock AI practice questions and the full daily digest.
        </p>

        <Link href="/subscription">
          <Button size="lg" className="h-11 px-7">
            View plans
          </Button>
        </Link>
      </div>
    </div>
  );
}
