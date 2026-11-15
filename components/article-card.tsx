"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  url: string;
  topic: string;
}

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleReadMore = () => {
    window.open(article.url, "_blank");
  };

  return (
    <div className="relative mx-auto flex h-full max-w-[1600px] flex-col overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover opacity-40"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full bg-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-6 md:p-10">
        <div className="mb-4">
          <span className="inline-block rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
            {article.topic}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-end">
          <div className="max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              {article.title}
            </h2>

            <p className="mb-7 line-clamp-6 text-base leading-relaxed text-white/75 md:text-lg">
              {article.summary}
            </p>

            <div className="flex items-center">
              <Button
                onClick={handleReadMore}
                className="h-11 rounded-lg bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              >
                Read the original
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
