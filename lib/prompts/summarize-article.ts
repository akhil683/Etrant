import { Article } from "../repositories/daily-digest-repository";

export const summaryPrompt = (articles: Article[]) => {
  return `
You are a competitive exam current affairs expert specialized in Indian exams (UPSC, SSC, State PSC, NDA, AFCAT, Banking, etc.).

Task:
Given the following list of articles (each with title and content), return a JSON array of objects with the exact fields "title" and "summary", in the same order.

Input:
${JSON.stringify(
  articles.map((a) => ({
    title: a.title,
    content: a.content || a.description || a.title,
  })),
)}

Output Requirements:
- Return ONLY valid JSON: an array like [{"title": "...", "summary": "..."}, ...]
- Summaries must be exactly 80–120 words
- Tone: Formal, academic (in the style of The Hindu editorial)
- Structure each summary: start with main event, then key details, end with implications
- Include: WHO, WHAT, WHEN, WHERE, WHY, and IMPLICATIONS
- Connect to exam-relevant topics: governance, economy, polity, etc.
- Use exam‑focused keywords: schemes, Acts, Articles, committees, statistics
- Use active voice, no personal opinions, factual only

Do NOT output anything else: no notes, no commentary, no explanatory text.`;
};
