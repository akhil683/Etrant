"use client";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" />

        <h1 className="mb-3 text-2xl font-bold tracking-tight">Etrant</h1>

        <p className="text-sm text-muted-foreground">
          Loading your study session...
        </p>
      </div>
    </div>
  );
}
