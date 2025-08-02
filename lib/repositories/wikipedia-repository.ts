import type { Article, InterestCategory } from "@/types";
import { BaseRepository } from "./base-repository";
import { WikipediaAPIError } from "@/lib/errors/custom-errors";
import { INTEREST_CATEGORIES, FALLBACK_ARTICLES } from "@/lib/config/constants";

export interface IWikipediaRepository {
  getRandomArticle(category: string): Promise<Article>;
  getArticlesByInterests(
    interests: InterestCategory[],
    count: number,
  ): Promise<Article[]>;
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

  async getRandomArticle(category: string): Promise<Article> {
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
        return this.mapToArticle(data, category);
      } catch (error) {
        this.logger.warn("Wikipedia API failed, using fallback", {
          category,
          error,
        });
        return this.getFallbackArticle(category);
      }
    }, "Failed to fetch Wikipedia article");
  }

  async getArticlesByInterests(
    interests: InterestCategory[],
    count: number,
  ): Promise<Article[]> {
    const articles: Article[] = [];

    for (let i = 0; i < count; i++) {
      const randomInterest =
        interests[Math.floor(Math.random() * interests.length)];
      const categories = INTEREST_CATEGORIES[randomInterest] || ["general"];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      try {
        const article = await this.getRandomArticle(randomCategory);
        articles.push({
          ...article,
          topic:
            randomInterest.charAt(0).toUpperCase() + randomInterest.slice(1),
        });
      } catch (error) {
        this.logger.error("Error fetching article", {
          interest: randomInterest,
          error,
        });
        continue;
      }
    }

    return articles.length > 0 ? articles : this.getFallbackArticles(count);
  }

  private mapToArticle(data: any, category: string): Article {
    return {
      id: `${data.pageid || Date.now()}-${Math.random()}`,
      title: data.title || "Unknown Article",
      summary: data.extract || data.description || "No description available.",
      thumbnail:
        data.originalimage?.source ||
        `/placeholder.svg?height=1200&width=900&query=${encodeURIComponent(data.title || category)}`,
      url:
        data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title || category)}`,
      topic: category,
      createdAt: new Date(),
    };
  }

  private getFallbackArticle(category: string): Article {
    const fallback =
      FALLBACK_ARTICLES[Math.floor(Math.random() * FALLBACK_ARTICLES.length)];
    return {
      id: `fallback-${Date.now()}-${Math.random()}`,
      title: fallback.title,
      summary: fallback.extract,
      thumbnail: `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(category + " " + fallback.title)}`,
      url: fallback.url,
      topic: category,
      createdAt: new Date(),
    };
  }

  private getFallbackArticles(count: number): Article[] {
    return FALLBACK_ARTICLES.slice(0, count).map((article, i) => ({
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
