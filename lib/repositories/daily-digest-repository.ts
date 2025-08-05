import { GoogleGenAI, Modality } from "@google/genai";

interface Article {
  title: string;
  content?: string;
  description?: string;
  url: string;
  summary?: string;
  finalSummary?: string;
  image?: string;
}

interface RankingResult {
  title: string;
  rank: number;
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
  private newsApiKey: string;

  private constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    if (!process.env.NEWS_API_KEY) {
      throw new Error("NEWS_API_KEY environment variable is required");
    }

    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    this.newsApiKey = process.env.NEWS_API_KEY;
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
      console.log(`Starting ${examType} Daily Digest generation...`);

      const articles = await this.fetchTopNews();
      if (!articles.length) {
        console.log("No articles found.");
        return [];
      }

      const relevantArticles = await this.filterForExamRelevance(
        articles,
        examType,
      );
      if (!relevantArticles.length) {
        console.log(`No ${examType}-relevant articles found.`);
        return [];
      }

      const summarizedArticles = await this.summarizeArticles(
        relevantArticles,
        examType,
      );
      const top5Articles = await this.rankAndSelectTop5(
        summarizedArticles,
        examType,
      );
      const rewrittenArticles = await this.rewriteForExam(
        top5Articles,
        examType,
      );
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
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&pageSize=20&apiKey=${this.newsApiKey}`,
    );

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.articles || [];
  }

  /**
   * Uses Gemini AI to classify which articles are relevant for the specified exam
   * Considers typical exam topics: current affairs, governance, economics, etc.
   */
  private async filterForExamRelevance(
    articles: Article[],
    examType: string,
  ): Promise<Article[]> {
    const relevancePrompt = `
Classify the following news headlines as ${examType}-relevant or not. 
Consider topics like current affairs, government policies, economics, science & technology, environment, international relations, and other subjects typically covered in competitive exams.
Return JSON: [{"title": "...", "is_relevant": true/false}].
Headlines:
${articles.map((a) => a.title).join("\n")}
    `;

    const result = await this.genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      // model: "gemini-2.0-flash-exp",
      contents: [
        {
          parts: [
            {
              text: relevancePrompt,
            },
          ],
        },
      ],
    });
    let content = [];
    const responseText = result.text;

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

      // Validate each question has required fields
      content.forEach((q, index) => {
        if (
          !q.question ||
          !q.difficulty ||
          !q.category ||
          !q.options ||
          q.correctAnswer === undefined
        ) {
          throw new Error(`Question ${index} is missing required fields`);
        }
      });

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
    const summarizedArticles = await Promise.all(
      articles.map(async (article: Article) => {
        const summaryPrompt = `
Summarize this news article in 80–120 words for a ${examType} aspirant.
- Use formal tone (like The Hindu editorial)
- Highlight key facts, dates, and implications
- Focus on aspects relevant for competitive examinations
Article:
${article.content || article.description || article.title}
        `;

        const result = await this.genAI.models.generateContent({
          model: "gemini-1.5-flash-latest",
          // model: "gemini-2.0-flash-exp",
          contents: [
            {
              parts: [
                {
                  text: summaryPrompt,
                },
              ],
            },
          ],
        });
        const summary = result.text;

        return {
          ...article,
          summary: summary,
        };
      }),
    );

    return summarizedArticles;
  }

  /**
   * Ranks articles by exam importance and selects the top 5
   * Prioritizes articles with high current affairs value and policy implications
   */
  private async rankAndSelectTop5(
    articles: Article[],
    examType: string,
  ): Promise<Article[]> {
    const rankingPrompt = `
Rank the following summaries (title + summary) from most important to least for ${examType} aspirants.
Consider current affairs importance, policy implications, and examination relevance.
Return top 5 as JSON: [{"title": "...", "rank": 1}].
${articles.map((a) => `Title: ${a.title}\nSummary: ${a.summary}`).join("\n\n")}
    `;

    const result = await this.genAI.models.generateContent({
      model: "gemini-1.5-flash-latest",
      // model: "gemini-2.0-flash-exp",
      contents: [
        {
          parts: [
            {
              text: rankingPrompt,
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
    const rewrittenArticles = await Promise.all(
      articles.map(async (article: Article) => {
        const rewritePrompt = `
Rewrite this summary for a ${examType} aspirant:
- Use formal editorial tone
- Emphasize governance, policy, and exam-relevant aspects
- Include key terms and concepts important for competitive exams
Keep it 80–120 words.
Summary:
${article.summary}
        `;

        const result = await this.genAI.models.generateContent({
          model: "gemini-1.5-flash-latest",
          // model: "gemini-2.0-flash-exp",
          contents: [
            {
              parts: [
                {
                  text: rewritePrompt,
                },
              ],
            },
          ],
        });
        const finalSummary = result.text;

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
          const imgPrompt = `Create a detailed description for an infographic or illustration that would represent this news article: "${article.title}". 
          The description should be suitable for creating a visual representation that helps exam aspirants understand the topic better.
          Keep it concise but descriptive.`;

          const result = await this.genAI.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: imgPrompt,
            config: {
              responseModalities: [Modality.IMAGE],
            },
          });
          const imageDescription = result.text;

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
// const digestService = DailyDigestService.getInstance();
// const articles = await digestService.generateDailyDigest("UPSC");
// const articles = await digestService.generateDailyDigest("SSC");
// const articles = await digestService.generateDailyDigest("Banking Exam");
