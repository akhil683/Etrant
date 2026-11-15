import {
  Smartphone,
  Brain,
  Map,
  Newspaper,
  Youtube,
  Gamepad2,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Knowledge reels",
    description:
      "Swipe through bite-sized summaries that make dense topics easier to hold on to.",
  },
  {
    icon: Brain,
    title: "Practice questions",
    description:
      "AI questions built around your exam, with explanations you can learn from.",
  },
  {
    icon: Newspaper,
    title: "Daily current affairs",
    description:
      "A filtered digest every morning, focused on what is exam-relevant rather than everything published.",
  },
  {
    icon: Map,
    title: "Visual knowledge maps",
    description:
      "See how topics connect, so revision becomes a map instead of a pile of notes.",
  },
  {
    icon: Youtube,
    title: "Multi-source content",
    description:
      "Articles, papers and transcripts turned into short, readable learning units.",
  },
  {
    icon: Gamepad2,
    title: "Progress that sticks",
    description:
      "Streaks, points and leaderboards that encourage consistency without turning study into a game.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="border-y border-border bg-background py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="eyebrow">Everything in one place</p>
          <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Built for the way you actually revise.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Not another feed to scroll through. Every feature is aimed at
            retaining what you read and turning it into marks.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="surface surface-hover group p-6">
              <div className="icon-tile mb-5 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
