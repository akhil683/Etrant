import type React from "react";

import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import { auth } from "@/auth";

export default async function SignUpPage() {
  const session = await auth();

  if (session) {
    redirect("/articles");
  }

  return <AuthLayout />;
}
