export interface Article {
  id: string;
  title: string;
  summary: string;
  thumbnail: string;
  url: string;
  topic: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  points: number;
  streak: number;
  totalQuizzes: number;
  correctAnswers: number;
  createdAt: Date;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: QuizOption[];
  article: {
    title: string;
    topic: string;
  };
  points: number;
  timeLimit: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  streak: number;
}

export interface AppState {
  user: User | null;
  articles: Article[];
  viewedArticles: Article[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
}

export interface QuizResult {
  isCorrect: boolean;
  points: number;
  timeSpent: number;
  selectedOption: string;
}

export type ViewType = "interests" | "reel" | "leaderboard";
export type InterestCategory =
  | "science"
  | "technology"
  | "history"
  | "art"
  | "sports"
  | "music"
  | "nature"
  | "space"
  | "food"
  | "travel"
  | "literature"
  | "philosophy";

export interface Question {
  id: string;
  question: string;
  type: "open-ended" | "multiple-choice" | "true-false";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  context: string;
  options?: string[]; // Only for multiple-choice questions
  correctAnswer: string | boolean | number;
  createdAt: Date;
  explanation: string;
}
