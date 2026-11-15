export type DigestQuestionSource = {
  title: string;
  summary: string;
  topic: string | null;
  sourceUrl: string | null;
};

/**
 * Builds the nightly prompt that turns one day's digest into a fixed set of
 * reel-style MCQs. The app reads the stored result and never calls the model.
 */
export function digestToQuestionsPrompt(articles: DigestQuestionSource[]) {
  const material = articles
    .map(
      (article, index) => `### Article ${index + 1}
Title: ${article.title}
Topic: ${article.topic ?? "General"}
Summary: ${article.summary}
Source: ${article.sourceUrl ?? "Daily digest"}`,
    )
    .join("\n\n");

  return `
You are an expert question setter for Indian competitive exams.
Your task is to generate exactly 10 multiple-choice questions based strictly on the daily digest below.

RULES (follow exactly):
1. Output must be valid JSON only. No prose, no markdown, no code fences.
2. Each object must follow this schema:

{
  "question": "string",
  "difficulty": "string",
  "category": "string",
  "tags": ["string"],
  "context": "string",
  "estimatedTime": number,
  "options": [
    { "name": "string", "isCorrect": boolean }
  ],
  "previousYearQuestion": "string",
  "correctAnswer": number,
  "explanation": "string",
  "metadata": {
    "source": "ai-generated",
    "complexity": number,
    "bloomsLevel": "string",
    "learningObjective": "string"
  }
}

3. "question" must be 10 to 400 characters.
4. "difficulty" must be "medium" or "hard".
5. "category" must be "Daily Digest".
6. "tags" must contain 3 to 8 lowercase, hyphen-separated tags.
7. "context" must be 10 to 300 characters.
8. "estimatedTime" must be an integer from 1 to 60.
9. "options" must contain exactly 4 objects. Exactly one must have "isCorrect": true.
10. "correctAnswer" must be the 0-based index of the correct option and must match the option with "isCorrect": true.
11. "explanation" must be 20 to 50 words and explain why the correct answer is right and the others are wrong.
12. "previousYearQuestion" must be "" when not applicable.
13. "metadata.source" must be "ai-generated".
14. "metadata.complexity" must be an integer from 5 to 10.
15. "metadata.bloomsLevel" must be one of "apply", "analyze", "evaluate", "create".
16. Do not repeat the same fact in more than one question.
17. Do not ask about the source outlet or the publication date. Ask about the substance of the story.
18. Vary the position of the correct option across the 10 questions.
19. Most questions should be hard.

DAILY DIGEST:

${material}

OUTPUT:
Return a JSON array of exactly 10 question objects. Nothing else.
`;
}
