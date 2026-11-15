import type { DigestDetail, DigestResponse } from "./schemas";

export const MOCK_DIGEST: DigestResponse = {
  date: "13-11-2026",
  articles: [
    {
      id: 1,
      title: "Parliament clears the data protection amendment",
      summary:
        "The amendment changes how consent is recorded and gives the regulator a shorter window to act on complaints. Opposition members asked for a wider review before the rules take effect.",
      topic: "Polity",
      sourceUrl: "https://etrant.akkhil.dev/daily-digest",
      date: "13-11-2026",
    },
    {
      id: 2,
      title: "RBI holds the repo rate and flags food inflation",
      summary:
        "The central bank kept the policy rate unchanged and said it will watch the monsoon before the next review. It also raised the inflation forecast for the quarter.",
      topic: "Economy",
      sourceUrl: "https://etrant.akkhil.dev/daily-digest",
      date: "13-11-2026",
    },
    {
      id: 3,
      title: "New wetland rules tighten local clearance",
      summary:
        "District committees will need to publish a public notice before approving construction near protected wetlands. The rules take effect next month.",
      topic: "Environment",
      sourceUrl: "https://etrant.akkhil.dev/daily-digest",
      date: "13-11-2026",
    },
  ],
};

export const MOCK_DIGEST_DETAILS: Record<string, DigestDetail> = {
  "1": {
    id: 1,
    title: "Parliament clears the data protection amendment",
    summary:
      "The amendment changes how consent is recorded and gives the regulator a shorter window to act on complaints. Opposition members asked for a wider review before the rules take effect, while the government said the change closes a gap in the current framework.\n\nUnder the new rules, a complaint must be in writing. The regulator then has 30 days to publish its findings. The rules also require a verifiable record of consent before any data is processed, with a short transition window for existing systems.",
    relevantQuestions: [
      {
        question: "What change does the amendment make to consent records?",
        answer:
          "It requires consent to be recorded before processing begins and keeps a verifiable trail for audits.",
      },
      {
        question: "Who can act on a complaint under the new rules?",
        answer:
          "The data protection regulator can act after a written complaint and must publish its findings within 30 days.",
      },
      {
        question: "When do the rules take effect?",
        answer:
          "The rules take effect next month, with a short transition window for existing systems.",
      },
    ],
    sourceUrl: "https://etrant.akkhil.dev/daily-digest",
    topic: "Polity",
    date: "13-11-2026",
  },
  "2": {
    id: 2,
    title: "RBI holds the repo rate and flags food inflation",
    summary:
      "The central bank kept the policy rate unchanged and said it will watch the monsoon before the next review. It also raised the inflation forecast for the quarter.\n\nThe committee said food prices remain the main risk to the inflation path. It kept its stance focused on withdrawing accommodation while supporting growth.",
    relevantQuestions: [
      {
        question: "What did the RBI do with the repo rate?",
        answer: "It kept the repo rate unchanged.",
      },
      {
        question: "What is the main risk the committee named?",
        answer: "Food inflation, with the monsoon as the key variable.",
      },
    ],
    sourceUrl: "https://etrant.akkhil.dev/daily-digest",
    topic: "Economy",
    date: "13-11-2026",
  },
  "3": {
    id: 3,
    title: "New wetland rules tighten local clearance",
    summary:
      "District committees will need to publish a public notice before approving construction near protected wetlands. The rules take effect next month.\n\nThe notice must stay open for 30 days so residents can file objections. The state wetland authority will keep the final say on clearances.",
    relevantQuestions: [
      {
        question: "What must a district committee do before approving construction?",
        answer: "Publish a public notice and keep it open for objections.",
      },
      {
        question: "Who has the final say on clearances?",
        answer: "The state wetland authority.",
      },
    ],
    sourceUrl: "https://etrant.akkhil.dev/daily-digest",
    topic: "Environment",
    date: "13-11-2026",
  },
};
