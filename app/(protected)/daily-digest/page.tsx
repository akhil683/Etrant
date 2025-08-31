import DailyDigests from "@/components/daily-digest";
import CircleLoader from "@/components/loader/simple-loader-circle";
import { Suspense } from "react";

export default async function DailyDigestPage() {
  return (
    <div className="p-6 flex justify-center items-center flex-col gap-6">
      <Suspense fallback={<CircleLoader />}>
        <DailyDigests />
      </Suspense>
    </div>
  );
}
