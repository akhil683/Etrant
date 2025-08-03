import { getUserData } from "@/actions/getInterest";
import Header from "@/components/header";
import { InterestSelector } from "@/components/interest-selector";
import { IUser } from "@/types";
import { redirect } from "next/navigation";

export default async function InterestPage() {
  const userData: IUser | null = await getUserData();

  if (!userData) {
    redirect("/auth");
  }

  return (
    <section>
      <Header />
      <InterestSelector />
    </section>
  );
}
