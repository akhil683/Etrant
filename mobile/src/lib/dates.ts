import { format, parse } from "date-fns";

export function formatDigestDate(value: string | null | undefined) {
  if (!value) return "";
  const parsed = parse(value, "dd-MM-yyyy", new Date());
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, "d MMMM yyyy");
}

export function splitTopics(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);
}
