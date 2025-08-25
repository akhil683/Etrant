import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle, Home, Search } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="bg-black">
      <Header />
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
        <div className="text-center flex flex-col justify-center items-center gap-4 max-w-2xl mx-auto">
          {/* Error Message */}
          <Check className="w-36 h-36 bg-indigo-500 text-white rounded-full" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Yay, Payment Successfully
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Your subscription is created successfully. Enjoy you learning with
            Etrant.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/articles">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg"
              >
                <Home className="mr-2 h-5 w-5" />
                See Articles
              </Button>
            </Link>

            <Link href="/ai-questions">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg bg-transparent hover:text-white"
              >
                <Search className="mr-2 h-5 w-5" />
                AI Questions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
