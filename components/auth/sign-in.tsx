"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import GoogleIcon from "../../public/google_icon.png";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProviderSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      await signIn(providerId, { callbackUrl: "/" });
    } catch (error) {
      setError("An error occurred during sign up");
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={() => handleProviderSignIn("google")}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-4 font-semibold bg-white hover:bg-gray-200 text-gray-900 rounded-xl shadow-lg transition-all duration-300 transform"
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
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
