"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import GoogleIcon from "../../public/google_icon.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AuthLayout() {
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
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left Side - App Logo and Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full mix-blend-screen blur-3xl animate-blob-1" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-500/10 rounded-full mix-blend-screen blur-3xl animate-blob-2" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          {/* App Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <BookOpen className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white mb-4">
              Wiki{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Reel
              </span>
            </h1>
            <p className="text-xl text-orange-300 font-bold mb-4">
              Scroll. Learn. Test. Repeat.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 text-left max-w-md">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Instagram-style learning reels</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>AI-powered quiz engine</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Daily current affairs digest</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Gamified learning experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile background for smaller screens */}
        <div className="absolute inset-0 bg-gray-950 lg:hidden"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo - Only visible on smaller screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">
              Wiki{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Reel
              </span>
            </h1>
          </div>

          <Card className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="md:text-3xl text-2xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome Learner
              </CardTitle>
              <CardDescription className="text-gray-300 mt-3 md:text-lg">
                Sign in to continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google Sign In Button */}
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">
                    Trusted by 50,000+ learners
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="text-center space-y-2 text-sm text-gray-400">
                <p>✓ No credit card required</p>
                <p>✓ Start learning in seconds</p>
                <p>✓ Sync across all devices</p>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-blue-400 hover:text-blue-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-400 hover:text-blue-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
