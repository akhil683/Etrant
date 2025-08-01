"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Share2 } from "lucide-react";
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
  const [liked, setLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.url);
    }
  };

  const handleReadMore = () => {
    window.open(article.url, "_blank");
  };

  return (
    <div className="h-full mx-auto flex flex-col max-w-7xl bg-black text-white relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover opacity-60"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Topic Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {article.topic}
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-end">
          <h2 className="text-2xl font-bold mb-4 leading-tight">
            {article.title}
          </h2>

          <p className="text-gray-200 text-base leading-relaxed mb-6 line-clamp-6">
            {article.summary}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={`p-2 ${liked ? "text-red-500" : "text-white"} hover:bg-white/10`}
              >
                <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 text-white hover:bg-white/10"
              >
                <Share2 className="w-6 h-6" />
              </Button>
            </div>

            <Button
              onClick={handleReadMore}
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full font-medium"
            >
              Read More
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
