import { InterestCategory } from "@/types";
import { GoogleGenAI } from "@google/genai";

export const INTERESTS: {
  id: InterestCategory;
  label: string;
  emoji: string;
  brief: string;
}[] = [
  {
    id: "jee",
    label: "JEE (Main & Advanced)",
    emoji: "📐",
    brief:
      "JEE is for admission to top engineering colleges like IITs and NITs. It tests Physics, Chemistry, and Mathematics through objective and problem-solving questions. JEE Main is the first stage, while JEE Advanced is for IIT aspirants. It requires strong conceptual understanding and application skills.",
  },
  {
    id: "neet",
    label: "NEET",
    emoji: "🩺",
    brief:
      "NEET is the entrance exam for medical and dental courses in India. It assesses knowledge of Physics, Chemistry, and Biology at the 10+2 level. It is conducted by NTA and is mandatory for admission to MBBS, BDS, and related medical programs across India.",
  },
  {
    id: "upsc",
    label: "UPSC Civil Services",
    emoji: "📜",
    brief:
      "UPSC Civil Services Exam selects candidates for IAS, IPS, IFS, and other services. It has three stages: Prelims, Mains, and Interview. Subjects include History, Geography, Polity, Economy, Environment, Current Affairs, and optional papers. It’s one of the toughest competitive exams in India.",
  },
  {
    id: "gate",
    label: "GATE",
    emoji: "⚙️",
    brief:
      "GATE is conducted for admission to postgraduate programs and PSU recruitments. It tests Engineering subjects, Mathematics, and General Aptitude. It’s highly specialized, requiring deep subject knowledge in streams like Computer Science, Mechanical, Electrical, Civil, and other engineering disciplines along with problem-solving skills.",
  },
  {
    id: "cat",
    label: "CAT",
    emoji: "📊",
    brief:
      "CAT is for admission to IIMs and other top B-schools. It evaluates candidates in three main sections: Quantitative Ability, Verbal Ability & Reading Comprehension, and Data Interpretation & Logical Reasoning. It emphasizes speed, accuracy, and analytical thinking for management aspirants seeking MBA programs.",
  },
  {
    id: "ssc",
    label: "SSC Exams",
    emoji: "📝",
    brief:
      "SSC conducts multiple exams like CGL, CHSL, and CPO for various government posts. These exams test General Awareness, Quantitative Aptitude, English Language, and Reasoning Ability. They are popular for securing central government jobs with good career growth and stability across departments.",
  },
  {
    id: "railway",
    label: "Railway Exams",
    emoji: "🚆",
    brief:
      "Railway exams are conducted by RRB for various technical and non-technical posts. They test General Awareness, Mathematics, Reasoning, and Technical Knowledge (for technical posts). They are highly competitive due to the large number of vacancies and provide secure government employment in Indian Railways.",
  },
  {
    id: "banking",
    label: "Banking (IBPS/SBI)",
    emoji: "🏦",
    brief:
      "Banking exams like IBPS PO, IBPS Clerk, and SBI PO select candidates for positions in public sector banks. They assess Quantitative Aptitude, English Language, Reasoning Ability, General Awareness, and Computer Knowledge. These exams provide opportunities for stable careers in the banking sector.",
  },
  {
    id: "clat",
    label: "CLAT",
    emoji: "⚖️",
    brief:
      "CLAT is the Common Law Admission Test for entry into NLUs and top law schools in India. It covers English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques. It’s crucial for students pursuing integrated law programs like BA LLB or BBA LLB.",
  },
  {
    id: "nda",
    label: "NDA",
    emoji: "🎖️",
    brief:
      "NDA exam recruits candidates for the Army, Navy, and Air Force wings of the National Defence Academy. It tests Mathematics and General Ability, which includes English, General Knowledge, and Current Affairs. It also involves an SSB interview and medical tests for final selection.",
  },
  {
    id: "aiims",
    label: "AIIMS",
    emoji: "🏥",
    brief:
      "AIIMS entrance exam (now via NEET) is for admission to AIIMS medical colleges. It emphasizes Biology, Chemistry, and Physics, along with General Knowledge and Logical Reasoning. It’s one of the most competitive exams for medical aspirants aiming for premier medical institutions in India.",
  },
  {
    id: "net",
    label: "UGC-NET",
    emoji: "🎓",
    brief:
      "UGC-NET determines eligibility for Assistant Professorship and Junior Research Fellowship. It has two papers: General Teaching & Research Aptitude and Subject-specific paper chosen by the candidate. It covers Humanities, Sciences, Commerce, and other fields. It’s essential for those pursuing academic and research careers.",
  },
];
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

function GetPrompt(interest: InterestCategory) {
  const interestObj = INTERESTS.find((int) => int.id === interest);
  if (!interestObj) {
    throw new Error(`Invalid interest category: ${interest}`);
  }
  return `
Generate 20 medium or hard questions to practice for the exam - ${interestObj.label}. Below is the description of exam: \n ${interestObj.brief} \n\n


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
"previousYearQuestion": "exam_name-year, if not then empty string",
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
}

export class QuestionRepository implements IWikipediaRepository {
  private static instance: QuestionRepository;

  public static getInstance(): QuestionRepository {
    if (!QuestionRepository.instance) {
      QuestionRepository.instance = new QuestionRepository();
    }
    return QuestionRepository.instance;
  }

  async getAIQuestions(category: InterestCategory): Promise<QuestionData[]> {
    try {
      console.log("category poing poing", category);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          {
            parts: [
              {
                text: GetPrompt(category),
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
