import { Loader2 } from "lucide-react";

export default function CircleLoader() {
  return (
    <div className="absolute z-50 top-0 bottom-0 inset-0 bg-black/40 min-h-screen w-full flex justify-center items-center">
      <Loader2 className="w-16 h-16 text-white animate-spin" />
    </div>
  );
}
