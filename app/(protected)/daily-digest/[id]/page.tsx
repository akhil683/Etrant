import { articlesMeta } from "@/lib/config/site";

export default async function DailyDigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = {
    id: 1,
    title:
      "akl sdfnlas ndflkansf laksd ka slkdfnal sdfk asldfkn sldkafnd slkfn ",
    is_relevant: true,
    summary:
      "laknsfd laksn fdkasndf kasnd fkans fklans dfkna sldkfn akdsfn aksnf lkasdfn aknf lakdfn akf akdfn laksdfn alkd fnalkd fnakn faklf alksn fkland flka dflka nkdfn alkdf akld fnalksd fak fka dfka dnkaf kd naklfnlkaksd flkadn fkand  n",
    relevant_questions: [
      {
        question: "HellHOw are you?",
        answer: "I am fine thank you. How about you.",
      },
      {
        question: "Helo, HOw are you?",
        answer: "I am fine thank you. How about you.",
      },
      {
        question: "Hello, HOw a you?",
        answer: "I am fine thank you. How about you.",
      },
    ],
    source_url: "https://pingpong.com",
    topic: "Hello, Ping, Pong",
  };

  return (
    <section className="flex justify-center items-center flex-col gap-6">
      <div key={article?.title} className="max-w-4xl mt-12">
        <div className="p-4 rounded-xl">
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
      </div>
      {/* <div className="flex justify-start flex-col w-full max-w-4xl"> */}
      {/*   {article.relevant_questions.map((question) => ( */}
      {/*     <div>{question.question}</div> */}
      {/*   ))} */}
      {/* </div> */}
    </section>
  );
}
