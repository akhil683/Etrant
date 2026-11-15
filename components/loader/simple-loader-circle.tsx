import { Loader2 } from "lucide-react";

export default function CircleLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/70 backdrop-blur-[1px]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
