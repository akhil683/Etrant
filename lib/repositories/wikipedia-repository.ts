import type { Article } from "@/types";
import { BaseRepository } from "./base-repository";
import { WikipediaAPIError } from "@/lib/errors/custom-errors";
import { FALLBACK_ARTICLES } from "@/lib/config/constants";

export interface IWikipediaRepository {
  getRandomArticle(): Promise<Article>;
  getArticlesByInterests(): Promise<Article[]>;
}

export class WikipediaRepository
  extends BaseRepository
  implements IWikipediaRepository
{
  private static instance: WikipediaRepository;

  public static getInstance(): WikipediaRepository {
    if (!WikipediaRepository.instance) {
      WikipediaRepository.instance = new WikipediaRepository();
    }
    return WikipediaRepository.instance;
  }

  async getRandomArticle(): Promise<Article> {
    return this.handleRequest(async () => {
      try {
        const response = await fetch(
          "https://en.wikipedia.org/api/rest_v1/page/random/summary",
          {
            headers: {
              "User-Agent": "WikipediaReel/1.0 (https://example.com/contact)",
            },
          },
        );

        if (!response.ok) {
          throw new WikipediaAPIError(
            `Wikipedia API returned ${response.status}`,
          );
        }

        const data = await response.json();
        return this.mapToArticle(data);
      } catch (error) {
        this.logger.warn("Wikipedia API failed, using fallback", {
          error,
        });
        return this.getFallbackArticle();
      }
    }, "Failed to fetch Wikipedia article");
  }

  async getArticlesByInterests(): Promise<Article[]> {
    const articles: Article[] = [];

    for (let i = 0; i < 20; i++) {
      try {
        const article = await this.getRandomArticle();
        articles.push({
          ...article,
          topic: "General",
        });
      } catch (error) {
        this.logger.error("Error fetching article", {
          error,
        });
        continue;
      }
    }

    return articles.length > 0 ? articles : this.getFallbackArticles();
  }

  private mapToArticle(data: any): Article {
    return {
      id: `${data.pageid || Date.now()}-${Math.random()}`,
      title: data.title || "Unknown Article",
      summary: data.extract || data.description || "No description available.",
      thumbnail:
        data.originalimage?.source ||
        `/placeholder.svg?height=1200&width=900&query=${encodeURIComponent(data.title)}`,
      url:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
      topic: "General",
      createdAt: new Date(),
    };
  }

  private getFallbackArticle(): Article {
    const fallback =
      FALLBACK_ARTICLES[Math.floor(Math.random() * FALLBACK_ARTICLES.length)];
    return {
      id: `fallback-${Date.now()}-${Math.random()}`,
      title: fallback.title,
      summary: fallback.extract,
      thumbnail: `/placeholder.svg?height=400&width=300&query=${encodeURIComponent("wikireel" + " " + fallback.title)}`,
      url: fallback.url,
      topic: "General",
      createdAt: new Date(),
    };
  }

  private getFallbackArticles(): Article[] {
    return FALLBACK_ARTICLES.slice(0, 10).map((article, i) => ({
      id: `error-fallback-${Date.now()}-${i}`,
      title: article.title,
      summary: article.extract,
      thumbnail: article.thumbnail,
      url: article.url,
      topic: "General",
      createdAt: new Date(),
    }));
  }
}
