import { getDailyDigest } from "@/lib/db/get-daily-digest";
import Link from "next/link";

interface IArticle {
  title: string;
  is_relevant: boolean;
  summary: string;
  relevant_questions: {
    question: string;
    answer: string;
  }[];
  source_url: string;
  topic: string;
}
export default async function DailyDigests() {
  const articles = (await getDailyDigest()) as IArticle[];
  return (
    <>
      {articles?.map((article) => (
        <Link href={"/daily-digest"} key={article?.title}>
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-600 hover:border-gray-500 duration-500">
            <div className="border-b border-gray-500">
              <h2 className="text-lg md:text-2xl">{article?.title}</h2>
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
                      className={`${randomColor} px-4 py-1 text-xs md:text-sm rounded-full`}
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
    </>
  );
}
