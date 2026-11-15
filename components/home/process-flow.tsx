import { Download, ShuffleIcon as Swipe, Target, Trophy } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Create your profile",
    description:
      "Sign in with Google and pick your exam in under a minute. No forms to fill.",
  },
  {
    icon: Swipe,
    title: "Read the daily digest",
    description:
      "Work through a short, filtered set of current affairs and topic reels.",
  },
  {
    icon: Target,
    title: "Test what stuck",
    description:
      "Answer practice questions and read the explanation while it is still fresh.",
  },
  {
    icon: Trophy,
    title: "Keep the streak",
    description:
      "Track points and consistency, and compare progress with your study group.",
  },
];

export default function ProcessFlow() {
  return (
    <section className="border-b border-border bg-secondary/50 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="eyebrow">How it works</p>
          <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            From sign-up to mock-ready in four steps.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            A daily loop that is short enough to keep, and structured enough to
            build recall.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="surface relative p-6">
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {index + 1}
              </span>
              <step.icon className="mb-4 h-5 w-5 text-primary" />
              <h3 className="mb-2 text-lg font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
