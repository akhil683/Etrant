"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Trophy, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50+",
    label: "Active learners",
  },
  {
    icon: BookOpen,
    value: "10K+",
    label: "Knowledge reels",
  },
  {
    icon: Trophy,
    value: "95%",
    label: "Success rate",
  },
  {
    icon: Clock,
    value: "20+",
    label: "Hours learned",
  },
];

export default function StatsSection() {
  return (
    <section className="border-y border-border bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="tabular mb-1 font-display text-2xl font-semibold md:text-3xl">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
