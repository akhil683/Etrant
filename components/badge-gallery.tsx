"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, CheckCircle, Zap, BookOpen } from "lucide-react";

const badges = [
  {
    id: "points-1k",
    icon: Trophy,
    title: "Novice Learner",
    description: "Earned 1,000 total points.",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
    unlocked: true, // Placeholder: true for unlocked, false for locked
  },
  {
    id: "points-5k",
    icon: Trophy,
    title: "Skilled Scholar",
    description: "Earned 5,000 total points.",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
    unlocked: true,
  },
  {
    id: "points-10k",
    icon: Trophy,
    title: "Master Mind",
    description: "Earned 10,000 total points.",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-orange-500",
    unlocked: true,
  },
  {
    id: "streak-7",
    icon: Flame,
    title: "7-Day Streak",
    description: "Maintained a learning streak for 7 consecutive days.",
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
    unlocked: true,
  },
  {
    id: "streak-30",
    icon: Flame,
    title: "Month-Long Learner",
    description: "Maintained a learning streak for 30 consecutive days.",
    color: "text-orange-400",
    gradient: "from-orange-500 to-red-500",
    unlocked: false,
  },
  {
    id: "quiz-master",
    icon: CheckCircle,
    title: "Quiz Whiz",
    description: "Answered 100 questions correctly in quizzes.",
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-green-500",
    unlocked: true,
  },
  {
    id: "topic-expert",
    icon: BookOpen,
    title: "Topic Expert",
    description: "Completed all reels in a specific subject category.",
    color: "text-blue-400",
    gradient: "from-blue-500 to-cyan-500",
    unlocked: false,
  },
  {
    id: "early-bird",
    icon: Zap,
    title: "Early Bird",
    description: "Completed your first learning session before 8 AM.",
    color: "text-purple-400",
    gradient: "from-purple-500 to-indigo-500",
    unlocked: true,
  },
];

export default function BadgeGallery() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {badges.map((badge) => (
            <motion.div key={badge.id} variants={itemVariants}>
              <Card
                className={`h-full ${badge.unlocked ? "bg-gray-900/50 border-gray-800 hover:border-blue-700" : "bg-gray-900/30 border-gray-800 opacity-60 grayscale"} transition-all duration-300`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${badge.unlocked ? badge.gradient : "bg-gray-700"}`}
                  >
                    <badge.icon
                      className={`h-8 w-8 ${badge.unlocked ? "text-white" : "text-gray-400"}`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-2 ${badge.unlocked ? "text-white" : "text-gray-500"}`}
                  >
                    {badge.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${badge.unlocked ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {badge.description}
                  </p>
                  {!badge.unlocked && (
                    <div className="mt-3 text-xs text-gray-500 font-medium">
                      Locked
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
