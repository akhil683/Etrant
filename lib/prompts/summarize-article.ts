import { Article } from "../repositories/daily-digest-repository";

export const summaryPrompt = (article: Article) => {
  return `You are a competitive exam current affairs expert. Create a precise summary for competitive exam preparation.

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
• Include technical terms and keywords commonly used in competitive exams
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
};
