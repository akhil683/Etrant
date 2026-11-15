"use client";

import { useState } from "react";
import { submitFeedback } from "@/actions/user-feedback";
import { z } from "zod";
import { Loader2, MessageSquare, CheckCircle2 } from "lucide-react";

const feedbackSchema = z.object({
  feedback: z.string().min(5, "Feedback must be at least 5 characters"),
});

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = feedbackSchema.safeParse({ feedback });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const res = await submitFeedback({ feedback });
    setLoading(false);

    if ("error" in res) {
      setError(res.error as string);
    } else {
      setSuccess(true);
      setFeedback("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface w-full max-w-xl p-6 md:p-8"
    >
      <div className="mb-2 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">
          We value your feedback
        </h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Tell us what is working and what is not. It directly shapes what we
        build next.
      </p>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Write your feedback..."
        className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        rows={5}
      />

      {error && <p className="mt-2 text-sm font-medium text-destructive">{error}</p>}
      {success && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4" />
          Thank you for your feedback.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit feedback"}
      </button>
    </form>
  );
}
