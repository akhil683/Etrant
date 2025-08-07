"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full backdrop-blur-lg border-b border-gray-800 py-4"
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="md:w-9 md:h-9 w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <BookOpen className="md:h-5 md:w-5 h-4 w-4 text-white" />
          </div>
          <span className="md:text-2xl text-xl font-black text-white">
            Wiki Reel
          </span>
        </Link>

        {/* Sign In Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/auth")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white md:px-5 md:py-2 px-3 py-1 rounded-lg md:font-medium shadow-md"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
