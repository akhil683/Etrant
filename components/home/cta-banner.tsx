"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTABanner() {
  const router = useRouter();
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-400/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-orange-400/30">
              <Star className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold">
                Limited Time: Free Premium Access
              </span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Learning Journey?
              </span>
            </h2>

            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of students who've already revolutionized their
              study habits. Start your free trial today and see the difference
              in just 7 days.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                onClick={() => router.push("/auth")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-10 py-5 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all"
              >
                <Smartphone className="mr-3 h-6 w-6" />
                Sign Up - It's Free!
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            <div className="mt-8 text-white/60">
              ✓ No credit card required ✓ 7-day free trial ✓ Cancel anytime
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
