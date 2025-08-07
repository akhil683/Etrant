"use client";

import { motion } from "framer-motion";
import { Download, ShuffleIcon as Swipe, Target, Trophy } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Sign Up to WikiReel",
    description:
      "Get the app and create your personalized learning profile in under 30 seconds.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Swipe,
    title: "Swipe Through Reels",
    description:
      "Browse AI-curated knowledge reels tailored to your exam and interests.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Target,
    title: "Take Quick Quizzes",
    description:
      "Test your knowledge with instant quizzes and get immediate feedback.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Trophy,
    title: "Track Your Progress",
    description:
      "Watch your knowledge grow with streaks, points, and achievement badges.",
    color: "from-purple-500 to-violet-500",
  },
];

export default function ProcessFlow() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-white mb-6">
            Get Started in
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              4 Simple Steps
            </span>
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gray-700"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
