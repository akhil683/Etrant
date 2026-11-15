"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, CheckCircle, Zap, BookOpen } from "lucide-react";

const badges = [
  {
    id: "points-1k",
    icon: Trophy,
    title: "Novice learner",
    description: "Earned 1,000 total points.",
    unlocked: true,
  },
  {
    id: "points-5k",
    icon: Trophy,
    title: "Skilled scholar",
    description: "Earned 5,000 total points.",
    unlocked: true,
  },
  {
    id: "points-10k",
    icon: Trophy,
    title: "Master mind",
    description: "Earned 10,000 total points.",
    unlocked: true,
  },
  {
    id: "streak-7",
    icon: Flame,
    title: "7-day streak",
    description: "Maintained a learning streak for 7 consecutive days.",
    unlocked: true,
  },
  {
    id: "streak-30",
    icon: Flame,
    title: "Month-long learner",
    description: "Maintained a learning streak for 30 consecutive days.",
    unlocked: false,
  },
  {
    id: "quiz-master",
    icon: CheckCircle,
    title: "Quiz whiz",
    description: "Answered 100 questions correctly in quizzes.",
    unlocked: true,
  },
  {
    id: "topic-expert",
    icon: BookOpen,
    title: "Topic expert",
    description: "Completed all reels in a specific subject category.",
    unlocked: false,
  },
  {
    id: "early-bird",
    icon: Zap,
    title: "Early bird",
    description: "Completed your first learning session before 8 AM.",
    unlocked: true,
  },
];

export default function BadgeGallery() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {badges.map((badge) => (
            <motion.div key={badge.id} variants={itemVariants}>
              <Card
                className={`h-full ${
                  badge.unlocked
                    ? "border-border bg-card"
                    : "border-border bg-card opacity-55"
                }`}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${
                      badge.unlocked
                        ? "border-primary/25 bg-primary/10"
                        : "border-border bg-secondary"
                    }`}
                  >
                    <badge.icon
                      className={`h-6 w-6 ${
                        badge.unlocked ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <h3
                    className={`mb-2 font-display text-lg font-semibold ${
                      badge.unlocked ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {badge.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {badge.description}
                  </p>
                  {!badge.unlocked && (
                    <div className="mt-3 text-xs font-medium text-muted-foreground">
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
