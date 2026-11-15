import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
export function getDifficultyColor(difficulty: string) {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-success/10 text-success border-success/25";
    case "medium":
      return "bg-primary/10 text-primary border-primary/25";
    case "hard":
      return "bg-destructive/10 text-destructive border-destructive/25";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}
