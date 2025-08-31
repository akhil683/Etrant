import { Loader2 } from "lucide-react";

export default function CircleLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 w-screen h-screen flex justify-center items-center">
      <Loader2 className="w-16 h-16 text-white animate-spin" />
    </div>
  );
}
