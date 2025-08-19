import type React from "react";
import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import { auth } from "@/auth";
import { Metadata } from "next";
import { authMetadata } from "@/lib/config/site";

export const metadata: Metadata = authMetadata;

export default async function SignUpPage() {
  const session = await auth();

  if (session) {
    redirect("/articles");
  }

  return <AuthLayout />;
}
