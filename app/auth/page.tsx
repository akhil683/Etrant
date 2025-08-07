"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function SignUpPage() {
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-blue-700 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <p className="text-gray-300">Join the Wiki Reel learning community</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Sign Up */}
          <div className="space-y-8">
            <Button
              onClick={() => handleProviderSignIn("google")}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <Mail className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>

            {/* <div className="relative"> */}
            {/*   <Separator className="bg-gray-400" /> */}
            {/*   <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-900 px-2 text-sm text-gray-300"> */}
            {/*     or */}
            {/*   </span> */}
            {/* </div> */}
            {/**/}
            {/* <Button */}
            {/*   onClick={() => handleProviderSignIn("github")} */}
            {/*   disabled={loading} */}
            {/*   className="w-full bg-gray-800 hover:bg-gray-700" */}
            {/* > */}
            {/*   <Github className="w-4 h-4 mr-2" /> */}
            {/*   Continue with GitHub */}
            {/* </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
