import type { Metadata } from "next";
import { getUserData } from "@/actions/getInterest";
import { QuestionReel } from "@/components/question-reel";
import { IUser } from "@/types";
import { redirect } from "next/navigation";
import { aiquestionsMeta } from "@/lib/config/site";

export const metadata: Metadata = aiquestionsMeta;

export default async function AiQuestionPage() {
  const userData: IUser | null = await getUserData();

  if (!userData) {
    redirect("/auth");
  }

  if (userData?.interest === "" || userData?.interest === null) {
    redirect("/interest");
  }

  return <QuestionReel interests={userData?.interest as string} />;
}
