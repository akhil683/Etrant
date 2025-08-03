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
  {
    id: "afcat",
    label: "AFCAT",
    emoji: "✈️",
    brief:
      "AFCAT (Air Force Common Admission Test) is conducted by the Indian Air Force to recruit officers for Flying, Ground Duty (Technical), and Ground Duty (Non-Technical) branches. It tests General Awareness, Verbal Ability, Numerical Ability, Reasoning, and Military Aptitude. It’s crucial for aspirants seeking a career as an officer in the Indian Air Force.",
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
## SYSTEM INSTRUCTIONS
You are a specialized JSON generation API. Your sole purpose is to create educational exam questions and return them in a valid, raw JSON format. You MUST adhere strictly to the output specifications. Do not provide any conversational text, introductions, or summaries. Your entire response must be a single, valid JSON array.

---
## CORE TASK
Generate 20 practice questions for the exam specified in the INPUT DATA section. The questions should be of 'medium' or 'hard' difficulty.

---
## INPUT DATA
- **Exam Category Label**: ${interestObj.label}
- **Exam Description**: ${interestObj.brief}

---
## OUTPUT SPECIFICATION

### 1. Top-Level Structure
- The entire output MUST be a single JSON array "[...]".
- The array MUST contain exactly 20 JSON objects.
- The response MUST start with "[" and end with "]". There must be NO other text or formatting outside of this JSON array.
- **CRITICAL:** DO NOT wrap the output in markdown code blocks.

### 2. JSON Object Schema (Per Question)
Each object in the array must have the following exact structure and adhere to these constraints:

{
    "question": "string", // The question text. Length: 10 to 500 characters.
    "difficulty": "string", // Must be one of: 'medium', or 'hard'.
    "category": "string", // Must be the exact Exam Category Label provided in the INPUT DATA.
    "tags": ["string"], // An array of 3 to 8 relevant, lowercase, hyphen-separated string tags.
    "context": "string", // Background information for the question. Length: 10 to 300 characters.
    "estimatedTime": "number", // An integer from 1 to 60, representing estimated minutes to solve.
    "options": [ // An array of exactly 4 option objects.
      {
        "name": "string", // The text for this option.
        "isCorrect": "boolean" // true or false.
      }
    ],
    "previousYearQuestion": "string", // Identifier like "exam_name-year". Leave as an empty string "" if not applicable.
    "correctAnswer": "number", // The 0-based index of the correct option in the "options" array. This MUST match the option with "isCorrect": true.
    "explanation": "string", // A detailed explanation for why the correct answer is correct and others are not. Optional, but highly recommended.
    "metadata": { // A nested object for metadata.
      "source": "string", // Must be "ai-generated".
      "complexity": "number", // An integer from 5 to 10, representing difficulty on a 1-10 scale ('medium' maps to 5-7, 'hard' to 8-10).
      "bloomsLevel": "string", // Must be one of: 'apply', 'analyze', 'evaluate', 'create'. Avoid 'remember' and 'understand'.
      "learningObjective": "string" // A brief learning objective. Optional, can be an empty string "".
    }
}

### 3. Key Constraints & Validation Rules
- **Options Array:** The "options" array must contain exactly 4 objects.
- **Single Correct Answer:** Within the "options" array, exactly ONE object must have '"isCorrect": true'. The other three must have '"isCorrect": false'.
- **Index Match:** The 'correctAnswer' index must correspond to the option where 'isCorrect' is 'true'.
- **String Escaping:** Ensure all strings within the JSON are properly escaped (e.g., use '\"' for double quotes inside a string).

---
## FINAL CHECKLIST (Internal monologue before responding)
1.  Is my entire response starting with '[' and ending with ']' and nothing else?
2.  Does the array contain exactly 20 objects?
3.  Have I avoided all markdown and conversational text?
4.  Does every object precisely match the specified schema and data types?
5.  In every object, is there exactly one correct option and does the 'correctAnswer' index match it?
6.  Is the generated JSON syntax 100% valid?
7. The correct options should be differennt for each question. Don't always put the correct answer in one option (e.g. option1 or option2 should not be always correct)
8. Most of the questions level should be hard.
9. Some of the question should be previous year questions of the ${interestObj.label} exam.

Proceed with generation.
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
        model: "gemini-1.5-flash-latest",
        // model: "gemini-2.0-flash-exp",
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
