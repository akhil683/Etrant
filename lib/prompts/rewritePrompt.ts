import { Article } from "../repositories/daily-digest-repository";

export const rewritePrompt = (article: Article) => {
  return `
You are an expert content editor for Indian competitive exam preparation (UPSC, SSC, State PSC, Banking, etc.).

Task:
Rewrite the following summary for a competitive exam aspirant.

Guidelines:
- Use a formal, editorial tone similar to high-quality current affairs analysis.
- Explicitly connect the content to Indian governance, public policy, constitutional provisions, economic implications, and exam trends.
- Highlight names of schemes, Acts, Articles, committees, government programs, and international organizations wherever relevant.
- Integrate key terms and keywords frequently used in Indian competitive exams.
- Prioritize information that aids exam-focused retention and analysis.
- Maintain clarity, precision, and analytical depth.
- Keep the length strictly between 80–120 words.
Output must be plain text (no markdown, no headings).

Summary to rewrite:
${article.summary}
`;
};
