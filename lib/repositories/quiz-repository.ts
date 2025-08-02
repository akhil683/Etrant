import type { Article, Quiz } from "@/types";
import { BaseRepository } from "./base-repository";
import { QuizGenerationError } from "@/lib/errors/custom-errors";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export interface IQuizRepository {
  generateQuiz(articles: Article[]): Promise<Quiz>;
}

export class QuizRepository extends BaseRepository implements IQuizRepository {
  private static instance: QuizRepository;

  public static getInstance(): QuizRepository {
    if (!QuizRepository.instance) {
      QuizRepository.instance = new QuizRepository();
    }
    return QuizRepository.instance;
  }

  async generateQuiz(articles: Article[]): Promise<Quiz> {
    return this.handleRequest(async () => {
      if (!articles || articles.length === 0) {
        throw new QuizGenerationError(
          "No articles provided for quiz generation",
        );
      }

      const randomArticle =
        articles[Math.floor(Math.random() * articles.length)];

      try {
        const { text } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: this.buildQuizPrompt(randomArticle),
          // maxTokens: 400,
        });

        const quizData = JSON.parse(text);
        return this.validateAndMapQuiz(quizData, randomArticle);
      } catch (error) {
        this.logger.warn("AI quiz generation failed, using fallback", {
          article: randomArticle.title,
          error,
        });
        return this.generateFallbackQuiz(randomArticle);
      }
    }, "Failed to generate quiz");
  }

  private buildQuizPrompt(article: Article): string {
    return `Create a multiple choice question based on this Wikipedia article summary. The question should test comprehension and memory of key facts.

Article Title: ${article.title}
Topic: ${article.topic}
Summary: ${article.summary}

Generate a JSON response with this exact structure:
{
  "question": "A clear, specific question about the article",
  "options": [
    {"id": "a", "text": "Option A text", "isCorrect": false},
    {"id": "b", "text": "Option B text", "isCorrect": true},
    {"id": "c", "text": "Option C text", "isCorrect": false},
    {"id": "d", "text": "Option D text", "isCorrect": false}
  ],
  "article": {
    "title": "${article.title}",
    "topic": "${article.topic}"
  },
  "points": 10
}

Make sure:
- The question is specific and answerable from the summary
- Only one option is correct
- Wrong options are plausible but clearly incorrect
- The question tests understanding, not just memorization`;
  }

  private validateAndMapQuiz(quizData: any, article: Article): Quiz {
    if (
      !quizData.question ||
      !quizData.options ||
      !Array.isArray(quizData.options)
    ) {
      throw new QuizGenerationError("Invalid quiz structure from AI");
    }

    return {
      id: `quiz-${Date.now()}-${Math.random()}`,
      question: quizData.question,
      options: quizData.options,
      article: {
        title: article.title,
        topic: article.topic,
      },
      points: quizData.points || 10,
      timeLimit: 15,
      difficulty: "medium",
    };
  }

  private generateFallbackQuiz(article: Article): Quiz {
    const topics = ["History", "Science", "Art", "Technology", "Nature"];
    const wrongOptions = topics
      .filter((topic) => topic !== article.topic)
      .slice(0, 3);

    return {
      id: `fallback-quiz-${Date.now()}`,
      question: `What topic does the article "${article.title}" belong to?`,
      options: [
        { id: "a", text: article.topic, isCorrect: true },
        ...wrongOptions.map((topic, index) => ({
          id: String.fromCharCode(98 + index), // 'b', 'c', 'd'
          text: topic,
          isCorrect: false,
        })),
      ].sort(() => Math.random() - 0.5),
      article: {
        title: article.title,
        topic: article.topic,
      },
      points: 10,
      timeLimit: 15,
      difficulty: "easy" as const,
    };
  }
}
