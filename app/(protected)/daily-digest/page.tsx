import DailyDigests from "@/components/daily-digest";
import CircleLoader from "@/components/loader/simple-loader-circle";
import { Suspense } from "react";

// Force dynamic rendering to support database queries at runtime
export const dynamic = "force-dynamic";

export default async function DailyDigestPage() {
  return (
    <div className="page-shell-narrow">
      <div className="page-header">
        <p className="eyebrow">Every morning</p>
        <h1 className="page-title">Daily Digest</h1>
        <p className="page-description">
          The day&apos;s current affairs, filtered for what is relevant to your
          exam.
        </p>
      </div>
      <Suspense fallback={<CircleLoader />}>
        <DailyDigests />
      </Suspense>
    </div>
  );
}
