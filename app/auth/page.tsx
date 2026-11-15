import type React from "react";
import AuthLayout from "@/components/auth/auth-layout";
import { Metadata } from "next";
import { authMetadata } from "@/lib/config/site";

export const metadata: Metadata = authMetadata;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return <AuthLayout callbackUrl={callbackUrl} />;
}
