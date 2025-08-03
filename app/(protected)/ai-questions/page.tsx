import { getUserData } from "@/actions/getInterest";
import { QuestionReel } from "@/components/question-reel";
import { IUser } from "@/types";
import { redirect } from "next/navigation";

export default async function AiQuestionPage() {
  const userData: IUser | null = await getUserData();

  if (!userData) {
    redirect("/auth");
  }

  if (userData?.interest === "") {
    redirect("/interest");
  }
  console.log(userData);
  return <QuestionReel interests={userData?.interest as string} />;
}
