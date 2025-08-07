"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Trophy, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Learners",
    color: "text-blue-400",
  },
  {
    icon: BookOpen,
    value: "10K+",
    label: "Knowledge Reels",
    color: "text-emerald-400",
  },
  {
    icon: Trophy,
    value: "95%",
    label: "Success Rate",
    color: "text-orange-400",
  },
  {
    icon: Clock,
    value: "2M+",
    label: "Hours Learned",
    color: "text-purple-400",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gray-900 relative">
      {" "}
      {/* Changed background */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`inline-flex items-center justify-center md:w-16 md:h-16 w-12 h-12 rounded-2xl bg-gray-800 mb-4 ${stat.color}`}
              >
                {" "}
                {/* Changed icon background */}
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 " />
              </div>
              <div className="md:text-3xl text-xl font-black text-white mb-2">
                {stat.value}
              </div>{" "}
              {/* Changed text color */}
              <div className="text-gray-400 font-medium">{stat.label}</div>{" "}
              {/* Changed text color */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
