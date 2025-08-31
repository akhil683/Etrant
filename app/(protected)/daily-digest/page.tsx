import DailyDigests from "@/components/daily-digest";
import CircleLoader from "@/components/loader/simple-loader-circle";
import { Info } from "lucide-react";
import { Suspense } from "react";

export default async function DailyDigestPage() {
  return (
    <div className="p-6 flex justify-center items-center flex-col">
      <div className="max-w-5xl flex flex-col justify-center gap-6">
        <div className="md:mb-4 flex items-center justify-between gap-2">
          <h2 className="text-2xl md:text-4xl">Daily Digest</h2>
          {/* <button> */}
          {/*   <Info /> */}
          {/* </button> */}
        </div>
        <Suspense fallback={<CircleLoader />}>
          <DailyDigests />
        </Suspense>
      </div>
    </div>
  );
}
