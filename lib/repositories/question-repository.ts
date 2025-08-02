import { GoogleGenAI } from "@google/genai";

interface OptionType {
  name: string;
  isCorrect: boolean;
}

export interface QuestionData {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  context: string;
  estimatedTime: number;
  options: OptionType[];
  correctAnswer: number;
  explanation?: string;
  previousYearQuestion: string;
  metadata: {
    source: string;
    complexity: number;
    bloomsLevel:
      | "remember"
      | "understand"
      | "apply"
      | "analyze"
      | "evaluate"
      | "create";
    learningObjective?: string;
  };
}

export interface IWikipediaRepository {
  getAIQuestions(category: string): Promise<QuestionData[]>;
}

// Initialize AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY, // Make sure to set this in your .env.local
});

export const AI_PROMPT_TEMPLATE = `
Generate 10 questions based on the given category and requirements.
IMPORTANT: You must respond with an Array of EXACTLY this JSON structure, no additional text or formatting:
[
  {
    "question": "Your question here (10-500 characters)",
    "difficulty": "easy|medium|hard",
    "category": "The provided category",
    "tags": ["3-8 relevant tags"],
    "context": "Background information (10-300 characters)",
    "estimatedTime": 1-60,
    "options": [
{
name: "option1", 
isCorrect: true/false,
},
{
name: "option2", 
isCorrect: true/false,
},
{
name: "option3", 
isCorrect: true/false,
},
{
name: "option3", 
isCorrect: true/false,
},
],
"previousYearQuestion": "{exam_name}-{year}, if not then empty string",
    "correctAnswer": 0,
    "explanation": "Optional explanation",
    "metadata": {
      "source": "ai-generated",
      "complexity": 1-10,
      "bloomsLevel": "remember|understand|apply|analyze|evaluate|create",
      "learningObjective": "Optional learning objective"
    }
  }
]

Rules:
- Always include ALL required fields
- For multiple-choice: include "options" and "correctAnswer" (index number)
- Tags should be lowercase, hyphen-separated
- EstimatedTime is in minutes
- Complexity is 1-10 scale (1=very simple, 10=expert level)
- No markdown formatting, just pure JSON array
- Return exactly 10 questions
- There should only be one correct option
`;

export class QuestionRepository implements IWikipediaRepository {
  private static instance: QuestionRepository;

  public static getInstance(): QuestionRepository {
    if (!QuestionRepository.instance) {
      QuestionRepository.instance = new QuestionRepository();
    }
    return QuestionRepository.instance;
  }

  async getAIQuestions(category: string): Promise<QuestionData[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          {
            parts: [
              {
                text: `${AI_PROMPT_TEMPLATE}\nCategory: ${category}`,
              },
            ],
          },
        ],
        // generationConfig: {
        //   temperature: 0.7,
        //   maxOutputTokens: 4000,
        // },
      });

      const responseText = response.text;
      console.log("Gemini response:", responseText);

      // Parse the JSON response
      let questions: QuestionData[];

      try {
        // Clean the response text to extract JSON
        const cleanedResponse = responseText!
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        questions = JSON.parse(cleanedResponse);

        // Validate that it's an array
        if (!Array.isArray(questions)) {
          throw new Error("Response is not an array");
        }

        // Validate each question has required fields
        questions.forEach((q, index) => {
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

        return questions;
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      console.error("AI question generation failed:", {
        category,
        error: error instanceof Error ? error.message : error,
      });
      throw new Error("Failed to generate questions");
    }
  }
}

// Singleton instance
export const AIQuestions = QuestionRepository.getInstance();
