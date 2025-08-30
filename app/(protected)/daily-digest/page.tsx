import { digestService } from "@/lib/repositories/daily-digest-repository";
import Link from "next/link";

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
  // const articles = await getDailyDigest();
  // console.log("articles", articles.data);
  const articles = [
    {
      title:
        "What happens to Donald Trump’s tariffs now that federal appeals court has knocked them down",
      is_relevant: true,
      summary:
        "A US federal appeals court struck down Donald Trump's tariffs, impacting trade relations. The decision affects various sectors and countries, including India, which faced significant levies. This highlights the complexities of international trade law and the potential for legal challenges to influence economic policy.",
      relevant_questions: [
        {
          question:
            "Explain the implications of the US federal appeals court decision on Donald Trump's tariffs for international trade relations.",
          answer:
            "The decision could lead to renegotiations of trade agreements, potentially impacting the global economy and shifting the balance of power in international trade. It also sets a precedent for future legal challenges against protectionist trade policies.",
        },
        {
          question: "Who are the likely winners and losers from the ruling?",
          answer:
            "Export-oriented industries and importers may benefit from lower costs, while protected domestic sectors could face greater competition. Trading partners that were targeted by tariffs may see improved market access.",
        },
      ],
      source_url: "https://example.com/article",
      topic: "trade, tariffs,US,appeals court",
    },
  ];
  return (
    <div className="p-6 flex justify-center items-center flex-col gap-6">
      {articles.map((article: any) => (
        <Link href={"/daily-digest"} key={article?.title}>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 hover:border-gray-500 duration-500">
            <div>
              <h2 className="text-2xl text-gray-100">{article?.title}</h2>
              <div className="flex items-center gap-2 my-4">
                {article?.topic?.split(",")?.map((topic: any) => {
                  const colors = [
                    "bg-green-600",
                    "bg-orange-600",
                    "bg-indigo-600",
                    "bg-yellow-600",
                    "bg-blue-600",
                  ];
                  const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <span
                      key={topic}
                      className={`${randomColor} px-4 py-1 text-sm rounded-full`}
                    >
                      {topic}
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="mt-4 text-gray-300">{article?.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
