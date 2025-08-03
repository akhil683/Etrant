import { getUserData } from "@/actions/getInterest";
import { InterestSelector } from "@/components/interest-selector";
import { QuestionReel } from "@/components/question-reel";
import { IUser } from "@/types";
import { redirect } from "next/navigation";

export default async function AiQuestionPage() {
  const userData: IUser | null = await getUserData();

  if (!userData) {
    redirect("/auth");
  }

  if (userData?.interest === "") {
    return <InterestSelector />;
  }
  console.log(userData);
  return <QuestionReel interests={userData?.interest as string} />;
}
