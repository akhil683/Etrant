import { GoogleGenAI, Modality } from "@google/genai";
import { relevancePrompt } from "../prompts/relevancePrompt";
import { summaryPrompt } from "../prompts/summarize-article";
import { rankingPrompt } from "../prompts/rank-articles";
import { rewritePrompt } from "../prompts/rewritePrompt";
import { imgPrompt } from "../prompts/generate-image";

export interface Article {
  title: string;
  content?: string;
  description?: string;
  url: string;
  summary?: string;
  finalSummary?: string;
  image?: string;
  pubDate?: string;
}

/**
 * Daily Digest Service - Singleton service for generating exam-focused news digests
 *
 * This service fetches news articles, filters them for exam relevance, summarizes them
 * using Gemini AI, and returns a curated list of the top 5 most relevant articles
 * for competitive exam preparation.
 *
 * Flow: Fetch News → Filter Relevance → Summarize → Rank & Select Top 5 → Rewrite → Add Images
 */
export class DailyDigestService {
  private static instance: DailyDigestService;
  private genAI: GoogleGenAI;

  private constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  /**
   * Returns the singleton instance of the service
   * Ensures only one instance exists throughout the application lifecycle
   */
  public static getInstance(): DailyDigestService {
    if (!DailyDigestService.instance) {
      DailyDigestService.instance = new DailyDigestService();
    }
    return DailyDigestService.instance;
  }

  /**
   * Main orchestrator method that generates a complete daily digest
   *
   * @param examType - Type of exam (e.g., "UPSC", "SSC", "Banking Exam")
   * @returns Array of processed articles with summaries and images, empty array if no relevant articles found
   */
  async generateDailyDigest(
    examType: string = "competitive exam",
  ): Promise<Article[]> {
    try {
      const articles = await this.fetchTopNews();
      if (!articles.length) {
        console.log("No articles found.");
        return [];
      }

      const relevantArticles = await this.filterForExamRelevance(
        articles,
        examType,
      );
      console.log("relevant articles", relevantArticles);
      if (!relevantArticles.length) {
        console.log(`No ${examType}-relevant articles found.`);
        return [];
      }

      const summarizedArticles = await this.summarizeArticles(
        relevantArticles,
        examType,
      );
      console.log("summary", summarizedArticles);
      const top5Articles = await this.rankAndSelectTop5(
        summarizedArticles,
        examType,
      );
      const rewrittenArticles = await this.rewriteForExam(
        top5Articles,
        examType,
      );
      console.log("rewriteen", rewrittenArticles);
      const articlesWithImages = await this.generateImages(rewrittenArticles);

      console.log("Daily digest generated successfully.");
      return articlesWithImages;
    } catch (error) {
      console.error("Error generating daily digest:", error);
      throw error;
    }
  }

  /**
   * Fetches latest Indian news articles from NewsAPI
   * Uses Indian headlines to ensure content relevance for Indian competitive exams
   */
  private async fetchTopNews(): Promise<Article[]> {
    try {
      // Google News RSS feed for India with current affairs focus
      const rssUrl = "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en";

      const response = await fetch(rssUrl);
      if (!response.ok) {
        throw new Error(
          `Google News RSS request failed: ${response.statusText}`,
        );
      }

      const xmlText = await response.text();
      const articles = this.parseRSSFeed(xmlText);

      // Limit to top 20 articles for processing efficiency
      return articles.slice(0, 20);
    } catch (error) {
      console.error("Failed to fetch from Google News RSS:", error);
      throw error;
    }
  }

  /**
   * Parses RSS XML feed and extracts article information
   * Handles Google News RSS format which includes title, link, description, and publication date
   */
  private parseRSSFeed(xmlText: string): Article[] {
    const articles: Article[] = [];

    try {
      // Simple XML parsing for RSS items
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const items = [...xmlText.matchAll(itemRegex)];

      for (const item of items) {
        const itemContent = item[1];

        // Extract title (remove CDATA wrapper if present)
        const titleMatch = itemContent.match(
          /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/,
        );
        const title = titleMatch ? titleMatch[1] || titleMatch[2] : "";

        // Extract link
        const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
        const url = linkMatch ? linkMatch[1].trim() : "";

        // Extract description (remove CDATA and HTML tags)
        const descMatch = itemContent.match(
          /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/,
        );
        const rawDescription = descMatch ? descMatch[1] || descMatch[2] : "";
        const description = this.cleanDescription(rawDescription);

        // Extract publication date
        const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
        const pubDate = pubDateMatch ? pubDateMatch[1] : "";

        // Only add articles with valid title and URL
        if (title && url) {
          articles.push({
            title: this.cleanTitle(title),
            description: description,
            url: url,
            content: description, // Use description as content for processing
            pubDate: pubDate,
          });
        }
      }
    } catch (error) {
      console.error("Error parsing RSS feed:", error);
      throw new Error("Failed to parse RSS feed");
    }

    return articles;
  }

  /**
   * Cleans up article titles by removing source attribution and extra formatting
   */
  private cleanTitle(title: string): string {
    // Remove source attribution like " - BBC News", " - The Hindu" etc.
    return title.replace(/\s*-\s*[^-]+$/, "").trim();
  }

  /**
   * Cleans up article descriptions by removing HTML tags and unwanted formatting
   */
  private cleanDescription(description: string): string {
    if (!description) return "";

    return description
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
      .replace(/&amp;/g, "&") // Replace &amp; with &
      .replace(/&lt;/g, "<") // Replace &lt; with <
      .replace(/&gt;/g, ">") // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }

  /**
   * Uses Gemini AI to classify which articles are relevant for the specified exam
   * Considers typical exam topics: current affairs, governance, economics, etc.
   */
  private async filterForExamRelevance(
    articles: Article[],
    examType: string,
  ): Promise<Article[]> {
    const result = await this.genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      // model: "gemini-2.0-flash-exp",
      contents: [
        {
          parts: [
            {
              text: relevancePrompt(articles),
            },
          ],
        },
      ],
    });
    let content = [];
    const responseText = result.text;
    console.log("exam relevance", responseText);
    try {
      // Clean the response text to extract JSON
      const cleanedResponse = responseText!
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      content = JSON.parse(cleanedResponse);

      // Validate that it's an array
      if (!Array.isArray(content)) {
        throw new Error("Response is not an array");
      }

      return content;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Invalid JSON response from AI");
    }
  }

  /**
   * Creates concise, exam-focused summaries for each article
   * Maintains formal tone similar to The Hindu editorial style
   */
  private async summarizeArticles(
    articles: Article[],
    examType: string,
  ): Promise<Article[]> {
    const result = await this.genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      // model: "gemini-2.0-flash-exp",
      contents: [
        {
          parts: [
            {
              text: summaryPrompt(articles),
            },
          ],
        },
      ],
    });
    const responseText = result.text;
    let content;
    try {
      // Clean the response text to extract JSON
      const cleanedResponse = responseText!
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      content = JSON.parse(cleanedResponse);

      // Validate that it's an array
      if (!Array.isArray(content)) {
        throw new Error("Response is not an array");
      }

      return content;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Invalid JSON response from AI");
    }
  }

  /**
   * Ranks articles by exam importance and selects the top 5
   * Prioritizes articles with high current affairs value and policy implications
   */
  private async rankAndSelectTop5(
    articles: Article[],
    examType: string,
  ): Promise<Article[]> {
    const result = await this.genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      // model: "gemini-2.0-flash-exp",
      contents: [
        {
          parts: [
            {
              text: rankingPrompt(articles),
            },
          ],
        },
      ],
    });
    const responseText = result.text;
    let content;
    try {
      // Clean the response text to extract JSON
      const cleanedResponse = responseText!
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      content = JSON.parse(cleanedResponse);

      // Validate that it's an array
      if (!Array.isArray(content)) {
        throw new Error("Response is not an array");
      }

      return content;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Invalid JSON response from AI");
    }
  }

  /**
   * Enhances summaries with exam-specific terminology and focus areas
   * Emphasizes governance, policy aspects, and key concepts for competitive exams
   */
  private async rewriteForExam(
    articles: Article[],
    examType: string,
  ): Promise<Article[]> {
    //TODO: Write it to return array in a single request.
    const rewrittenArticles = await Promise.all(
      articles.map(async (article: Article) => {
        const result = await this.genAI.models.generateContent({
          model: "gemini-1.5-flash-latest",
          // model: "gemini-2.0-flash-exp",
          contents: [
            {
              parts: [
                {
                  text: rewritePrompt(article),
                },
              ],
            },
          ],
        });
        const finalSummary = result.text;
        console.log("final summary", finalSummary);

        return {
          ...article,
          finalSummary: finalSummary,
        };
      }),
    );

    return rewrittenArticles;
  }

  /**
   * Generates descriptive text for visual representations of articles
   * Note: Since Gemini doesn't create actual images, we generate detailed descriptions
   * that can be used to create infographics or visual aids later
   */
  private async generateImages(articles: Article[]): Promise<Article[]> {
    const withImages = await Promise.all(
      articles.map(async (article: Article) => {
        try {
          const result = await this.genAI.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: imgPrompt(article),
            config: {
              responseModalities: [Modality.IMAGE],
            },
          });
          const imageDescription = result.text;
          console.log(imageDescription);

          //TODO: Write s3 logic using gemini
          return {
            ...article,
            image: imageDescription,
          };
        } catch (error) {
          console.error(
            `Failed to generate image description for article: ${article.title}`,
            error,
          );
          return {
            ...article,
            image: undefined,
          };
        }
        //TODO: S3 logic
      }),
    );

    return withImages;
  }

  /**
   * Utility method to check if service is properly configured
   */
  isConfigured(): boolean {
    return !!(process.env.GEMINI_API_KEY && process.env.NEWS_API_KEY);
  }

  /**
   * Validates that all required environment variables are present
   * Useful for health checks and debugging configuration issues
   */
  validateEnvironment(): { isValid: boolean; missingKeys: string[] } {
    const requiredKeys = ["GEMINI_API_KEY", "NEWS_API_KEY"];
    const missingKeys = requiredKeys.filter((key) => !process.env[key]);

    return {
      isValid: missingKeys.length === 0,
      missingKeys,
    };
  }
}

// Usage examples:
export const digestService = DailyDigestService.getInstance();
