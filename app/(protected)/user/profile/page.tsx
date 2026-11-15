"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Flame,
  Award,
  BookOpen,
  Target,
  Clock,
  LanguagesIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import UserImage from "@/public/placeholder-user.jpg";
import { useUserStore } from "@/lib/store/useUserStore";
import { LanguageSelector } from "@/components/language-selector";
import { InterestSelector } from "@/components/selector/interest-selector";

export default function ProfilePage() {
  const { user } = useUserStore();

  const stats = [
    {
      label: "Total points",
      value: (user?.points || 0).toLocaleString(),
      hint: "Earned this month",
      icon: Trophy,
    },
    {
      label: "Current streak",
      value: `${user?.streak || 0} days`,
      hint: "Keep showing up",
      icon: Flame,
    },
    {
      label: "Subscription",
      value: user?.plan || "Free",
      hint: "Current plan",
      icon: Sparkles,
    },
    {
      label: "Avg. score",
      value: `${user?.stats?.averageScore || 0}%`,
      hint: "Across practice sets",
      icon: Target,
    },
  ];

  return (
    <div className="page-shell max-w-5xl">
      <div className="mb-8 flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">Your account</p>
          <div className="flex items-center gap-5">
            <Image
              src={user?.image || UserImage}
              alt={user?.name || "User photo"}
              width={100}
              height={100}
              className="h-16 w-16 rounded-full border border-border object-cover md:h-20 md:w-20"
            />
            <div>
              <h1 className="mb-1 text-2xl font-bold tracking-tight md:text-3xl">
                {user?.name || "Your profile"}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
          <Sparkles className="h-4 w-4" />
          {user?.plan || "Free"} plan
        </span>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-bold text-foreground">Preferences</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <LanguageSelector />
          <InterestSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="tabular text-3xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-6 text-center">
          <BookOpen className="mx-auto mb-3 h-5 w-5 text-primary" />
          <div className="tabular text-2xl font-bold">
            {user?.stats?.totalReels || 0}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Reels watched
          </div>
        </Card>

        <Card className="p-6 text-center">
          <Award className="mx-auto mb-3 h-5 w-5 text-primary" />
          <div className="text-2xl font-bold capitalize">
            {user?.interest || "Not set"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Your interest
          </div>
        </Card>

        <Card className="p-6 text-center">
          <LanguagesIcon className="mx-auto mb-3 h-5 w-5 text-primary" />
          <div className="text-2xl font-bold">
            {user?.language || "English"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Preferred language
          </div>
        </Card>

        <Card className="p-6 text-center">
          <Clock className="mx-auto mb-3 h-5 w-5 text-primary" />
          <div className="tabular text-2xl font-bold">
            {user?.stats?.studyTime || 0}h
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Total study time
          </div>
        </Card>
      </div>
    </div>
  );
}
