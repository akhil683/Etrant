"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import GoogleIcon from "../../public/google_icon.png";
import { toast } from "sonner";

export default function SignIn({
  callbackUrl = "/",
}: {
  callbackUrl?: string;
}) {
  const [loading, setLoading] = useState(false);
  const safeCallbackUrl =
    callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/";

  const handleProviderSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      await signIn(providerId, { callbackUrl: safeCallbackUrl });
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={() => handleProviderSignIn("google")}
      disabled={loading}
      variant="outline"
      className="h-11 w-full justify-center gap-3 bg-background py-3 text-sm font-semibold"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Image
            src={GoogleIcon}
            alt="Google logo"
            width={24}
            height={24}
            className="h-5 w-5"
          />
          Continue with Google
        </>
      )}
    </Button>
  );
}
