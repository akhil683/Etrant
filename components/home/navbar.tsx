"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/etrant.png";

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
          <div className="md:w-9 md:h-9 w-7 h-7 rounded-lg flex items-center justify-center">
            <Image
              className="w-full h-full"
              src={Logo}
              width={500}
              height={500}
              alt="Etrant Logo"
            />
          </div>
          <span className="md:text-2xl text-xl font-black text-white">
            Etrant
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
