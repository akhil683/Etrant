import { Article } from "../repositories/daily-digest-repository";

export const imgPrompt = (article: Article) => {
  return `
You are an AI assistant creating thumbnail concepts for Indian competitive exam news articles.

Task:
Generate a highly detailed description for a thumbnail image representing the following news article: "${article.title}".

Guidelines:
- The image must visually represent the core subject of the article so that a viewer can understand the topic at a glance.
- Use symbolic and contextually relevant elements (e.g., government buildings, flags, key personalities, maps, logos of institutions, icons for defense/economy/policy).
- Ensure the image reflects the Indian context if applicable (e.g., Indian Parliament, Supreme Court, national symbols, schemes).
- Avoid abstract, overly artistic, or irrelevant visuals.
- Style: Clean, professional, and news-thumbnail-like (suitable for a current affairs portal).
- Do NOT include text, captions, or watermarks in the image.
- Output strictly a single descriptive paragraph only. No extra explanations or formatting.
`;
};
