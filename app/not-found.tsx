"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NotFound() {
  const { data: session } = useSession();

  return (
    <div className="bg-black">
      <Header />
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-9xl font-black text-gray-800 mb-8">404</div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Looks like this page took a study break! The page you're looking for
            doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>

            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg bg-transparent hover:text-white"
              >
                <Search className="mr-2 h-5 w-5" />
                How It Works
              </Button>
            </Link>
          </div>

          {/* Fun Message */}
          {!session?.user && (
            <div className="mt-12 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm">
                💡 <strong className="text-white">Pro Tip:</strong> While you're
                here, why not start learning something new?
                <Link
                  href="/auth"
                  className="text-blue-400 hover:text-blue-300 ml-1"
                >
                  Sign up for free!
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
