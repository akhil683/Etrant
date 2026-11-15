import { getDailyDigest } from "@/lib/db/get-daily-digest";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DailyDigests() {
  const articles = await getDailyDigest();

  if (!Array.isArray(articles)) {
    console.error("Failed to fetch daily digest:", articles);
    return (
      <div className="flex h-full w-full items-center justify-center py-24">
        <p className="text-lg text-muted-foreground">Failed to load news.</p>
      </div>
    );
  }

  if (articles.length < 1) {
    return (
      <div className="flex h-full w-full items-center justify-center py-24">
        <p className="text-lg text-muted-foreground">No latest news.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {articles?.map((article) => (
        <Link
          href={`/daily-digest/${article.id}`}
          key={article?.title}
          prefetch
          className="group block"
        >
          <article className="surface surface-hover p-5 md:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {article?.topic?.split(",")?.map((topic: string) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
            <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl">
              {article?.title}
            </h2>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {article?.summary.slice(0, 240)}...
            </p>
            <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
              Read the digest
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
