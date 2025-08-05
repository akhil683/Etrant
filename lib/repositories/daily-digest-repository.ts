import { GoogleGenAI, Modality } from "@google/genai";

interface Article {
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
  // private newsApiKey: string;

  private constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    // if (!process.env.NEWS_API_KEY) {
    //   throw new Error("NEWS_API_KEY environment variable is required");
    // }

    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // this.newsApiKey = process.env.NEWS_API_KEY;
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
      // console.log("service articles", articles);

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
    const relevancePrompt = `You are an expert ${examType} current affairs analyst. Evaluate each news description for examination relevance across ALL domains.

RELEVANCE CRITERIA - Include if the news relates to:
• Governance & Administration: Policy decisions, government schemes, administrative reforms, bureaucracy
• Economics & Finance: Budget, fiscal policy, banking, markets, trade, business developments
• Social Issues: Education, health, welfare, demographics, social justice, community affairs  
• Science & Technology: Research breakthroughs, space, defense tech, digital initiatives, innovation
• Environment & Geography: Climate change, conservation, natural disasters, geographical developments
• International Relations: Diplomacy, treaties, global events, bilateral relations, international organizations
• Legal & Constitutional: Supreme Court judgments, new laws, constitutional amendments, legal reforms
• Culture & Heritage: Art, literature, historical events, cultural preservation, archaeology
• Current Events: Sports achievements, awards, appointments, obituaries of notable personalities
• Infrastructure & Development: Transportation, urban planning, rural development, connectivity projects

EXCLUSION CRITERIA - Exclude if the news is:
• Pure entertainment/celebrity gossip without broader significance
• Highly localized incidents with no policy/national implications
• Commercial advertisements or product launches without policy impact
• Routine crime reports without systemic importance

INSTRUCTIONS:
1. Analyze each description thoroughly across ALL domains mentioned above
2. Consider potential examination questions that could arise from this news
3. Include diverse topics - avoid bias toward any single domain
4. Return ONLY valid JSON format as specified
5. Match titles exactly as provided

Headlines and Descriptions:
${articles.map((a, index) => `${index + 1}. Title: "${a.title}"\nDescription: "${a.description || a.title}"`).join("\n\n")}

Return ONLY this JSON format:
[{"title": "exact_title_from_above", "is_relevant": true/false}]`;

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
    const summarizedArticles = await Promise.all(
      articles.map(async (article: Article) => {
        const summaryPrompt = `You are a ${examType} current affairs expert. Create a precise summary for competitive exam preparation.

CONTENT TO SUMMARIZE:
Title: ${article.title}
Content: ${article.content || article.description || article.title}

SUMMARY REQUIREMENTS:
• Word Count: Exactly 80-120 words
• Tone: Formal, academic (similar to The Hindu editorial style)
• Structure: Start with the main event, follow with key details, end with implications

ESSENTIAL ELEMENTS TO INCLUDE:
• WHO: Key personalities, organizations, institutions involved
• WHAT: The main event, decision, or development
• WHEN: Specific dates, timelines, deadlines (if mentioned)
• WHERE: Geographical context, locations affected
• WHY: Background context, reasons behind the development
• IMPLICATIONS: Policy impact, future consequences, broader significance

EXAMINATION FOCUS:
• Connect to relevant exam topics (governance, economy, polity, etc.)
• Include technical terms and keywords commonly used in ${examType}
• Highlight constitutional, legal, or policy angles
• Mention statistics, percentages, or numerical data if present
• Note any committee names, schemes, or institutional references

FORMATTING GUIDELINES:
• Use active voice and clear, concise sentences
• Avoid colloquial language or informal expressions  
• Include specific names of people, places, organizations exactly as mentioned
• Use standard abbreviations (GoI, RBI, SC, etc.) where appropriate
• Maintain factual accuracy without personal opinions

Write ONLY the summary, no additional text or explanations.`;

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
        console.log("summar", summary);

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
Return top 10 as JSON: [{"title": "...", "rank": 1}].
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
export const digestService = DailyDigestService.getInstance();
