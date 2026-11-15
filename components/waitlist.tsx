"use client";

import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";

const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be atleast 5 characters"),
});

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error as string);
    } else {
      setSuccess(true);
      setEmail("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md"
    >
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Join our waitlist"
      />

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {success && (
        <p className="mt-2 text-sm text-success">
          Thank you for joining our waitlist!
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Join Waitlist"}
      </button>
    </form>
  );
}
