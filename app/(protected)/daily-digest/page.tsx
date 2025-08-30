import { digestService } from "@/lib/repositories/daily-digest-repository";

export async function getDailyDigest() {
  try {
    const articles = await digestService.generateDailyDigest();
    return {
      success: true,
      data: articles,
    };
  } catch (error) {
    console.error("DailyDigest Error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
export default async function DailyDigestPage() {
  const articles = await getDailyDigest();
  console.log("articles", articles.data);

  return <div>{JSON.stringify(articles)}</div>;
}
