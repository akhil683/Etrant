export const APP_CONFIG = {
  QUIZ_TRIGGER_INTERVAL: 5,
  QUIZ_TIME_LIMIT: 15,
  POINTS_PER_CORRECT_ANSWER: 10,
  ARTICLES_PER_LOAD: 5,
  MAX_RETRIES: 3,
  LEADERBOARD_SIZE: 20,
} as const;

export const FALLBACK_ARTICLES = [
  {
    title: "Quantum Computing",
    extract:
      "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Quantum_computing",
    pageId: "25652",
  },
  {
    title: "Ancient Rome",
    extract:
      "Ancient Rome was a civilization that began as a city-state on the Italian Peninsula during the 8th century BC and expanded to become one of the largest empires in the ancient world.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Ancient_Rome",
    pageId: "25616",
  },
  {
    title: "Artificial Intelligence",
    extract:
      "Artificial intelligence is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals.",
    thumbnail: "/placeholder.svg?height=400&width=300",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
    pageId: "1386",
  },
] as const;
