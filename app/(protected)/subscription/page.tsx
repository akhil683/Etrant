import { faqs } from "@/data/data";
import PricingCard from "@/components/pricing-card";
import { auth } from "@/auth";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const fromApp = from === "app";
  const session = fromApp ? await auth() : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-24 md:px-8 md:pt-12">
      <div className="page-header">
        <p className="eyebrow">Plans</p>
        <h1 className="page-title md:text-5xl">Simple pricing</h1>
        <p className="page-description">
          Start free and upgrade when you need more. Every paid plan is built
          around daily practice and exam-relevant content.
        </p>
      </div>

      {fromApp && (
        <div className="mx-auto mb-8 max-w-5xl rounded-xl border border-primary/25 bg-primary/5 p-5">
          <p className="text-sm font-semibold text-foreground">
            Subscribing from the Etrant app?
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Use the same Google account you use in the app. After payment,
            return to the app. Your plan will appear automatically when you
            refresh or reopen the app.
          </p>
          {session?.user?.email && (
            <p className="mt-2 text-xs font-medium text-foreground">
              Signed in as {session.user.email}
            </p>
          )}
        </div>
      )}

      <PricingCard fromApp={fromApp} />

      <div className="mx-auto my-20 max-w-3xl">
        <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-3xl">
          Frequently asked questions
        </h2>
        <div className="surface divide-y divide-border overflow-hidden">
          {faqs.map((faq, idx) => (
            <div key={idx} className="px-6 py-6">
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {faq.question}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
