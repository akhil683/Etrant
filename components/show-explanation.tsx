import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function ShowExplanation({
  explanation,
}: {
  explanation: string | undefined;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <div>
      <Button onClick={() => setShowExplanation(true)}>Explanation</Button>

      {showExplanation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onClick={() => setShowExplanation(false)}
        >
          <div
            className="mx-4 w-full max-w-lg animate-in fade-in zoom-in rounded-xl border border-border bg-card p-6 shadow-lift duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Explanation</h2>
              <button
                onClick={() => setShowExplanation(false)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Close explanation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="reading-prose text-base">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
