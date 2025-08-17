import type React from "react";

import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import { getUserData } from "@/actions/getInterest";
import { IUser } from "@/types";

export default async function SignUpPage() {
  const userData: IUser | null = await getUserData();

  if (userData) {
    redirect("/articles");
  }

  return <AuthLayout />;
}
