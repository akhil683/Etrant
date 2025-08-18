import { auth } from "@/auth";
import Header from "@/components/header";
import { InterestSelector } from "@/components/interest-selector";
import { redirect } from "next/navigation";

export default async function InterestPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <section>
      <Header />
      <InterestSelector />
    </section>
  );
}
