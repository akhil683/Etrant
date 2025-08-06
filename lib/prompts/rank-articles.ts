import { Article } from "../repositories/daily-digest-repository";

export const rankingPrompt = (articles: Article[]): string => {
  return `
You are a ranking assistant for Indian competitive exam preparation (UPSC, NDA, SSC, AFCAT, State PSC, Banking, etc.).

Task:
Rank the following articles (title + summary) from MOST important to LEAST important for aspirants. 
Importance should consider:
1. Relevance to Indian current affairs (national and international issues affecting India)
2. Policy, governance, constitutional, economic, or socio-political implications
3. Likelihood of being asked in Indian competitive exams based on previous trends

Instructions:
- Return ONLY the TOP 10 articles.
- Output STRICTLY in valid JSON format (no explanations, no extra text).
- JSON structure: [{"title": "Article Title", "rank": 1}, {"title": "Article Title", "rank": 2}, ...]
- "rank" must be a number from 1 (most important) to 10 (least important).
- Do NOT include any content outside the JSON array.
- If fewer than 10 articles are available, rank all of them in the same format.

Articles:
${articles.map((a) => `Title: ${a.title}\nSummary: ${a.summary}`).join("\n\n")}
`;
};
