"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Flame,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Clock,
  Users,
} from "lucide-react";
import Image from "next/image";
import BadgeGallery from "@/components/badge-gallery";
import Header from "@/components/header";
import { useUserStore } from "@/lib/store/useUserStore";

const dailyPoints = [
  { day: "Mon", points: 120, date: "Dec 16" },
  { day: "Tue", points: 180, date: "Dec 17" },
  { day: "Wed", points: 150, date: "Dec 18" },
  { day: "Thu", points: 220, date: "Dec 19" },
  { day: "Fri", points: 190, date: "Dec 20" },
  { day: "Sat", points: 250, date: "Dec 21" },
  { day: "Sun", points: 300, date: "Dec 22" },
];

export default function ProfilePage() {
  const { user } = useUserStore();
  const maxPoints = Math.max(...dailyPoints.map((d) => d.points));

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-950 text-white py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-12">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between bg-gray-900 border border-gray-800 rounded-2xl md:p-8 p-4 shadow-lg">
              <div className="flex items-center gap-6">
                <Image
                  src={user?.image || "/placeholder.svg"}
                  alt={user?.name as string}
                  width={100}
                  height={100}
                  className="md:w-20 md:h-20 w-12 h-12 rounded-full border-4 border-blue-500 shadow-xl"
                />
                <div>
                  <h1 className="md:text-4xl text-2xl font-bold text-white mb-1">
                    Akhil Palsra
                  </h1>
                  <p className="md:text-lg text-gray-300">{user?.rank}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 h-full hover:border-blue-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Total Points
                  </CardTitle>
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="md:text-3xl text-2xl font-bold text-white">
                    {user?.points}
                  </div>
                  <p className="text-xs text-green-400 mt-1">
                    +2,500 this month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 h-full hover:border-orange-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Current Streak
                  </CardTitle>
                  <Flame className="h-5 w-5 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="md:text-3xl text-2xl font-bold text-white">
                    {user?.streak} Days
                  </div>
                  <p className="text-xs text-orange-400 mt-1">Personal best!</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 h-full hover:border-purple-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Global Rank
                  </CardTitle>
                  <Users className="h-5 w-5 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    #{user?.rank || 1}
                  </div>
                  <p className="text-xs text-purple-400 mt-1">
                    Top 5% worldwide
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 h-full hover:border-green-700 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    Avg. Score
                  </CardTitle>
                  <Target className="h-5 w-5 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="md:text-3xl text-2xl font-bold text-white">
                    {user?.stats?.averageScore}%
                  </div>
                  <p className="text-xs text-green-400 mt-1">+3% this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Points Chart */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Daily Points (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around gap-2 py-4">
                  {user?.dailyPoints?.map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center h-full justify-end group"
                    >
                      <div className="relative">
                        <div
                          className="md:w-10 w-8 rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-500 transition-all duration-500 ease-out hover:from-blue-400 hover:to-purple-400 cursor-pointer"
                          style={{
                            height: `${(data?.points! / maxPoints) * 180}px`,
                          }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded md:opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.points}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-3 font-medium">
                        {data.day}
                      </span>
                      <span className="max-md:hidden text-xs text-gray-500">
                        {data.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 text-center p-6">
                <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {user?.stats.totalReels}
                </div>
                <div className="text-sm text-gray-400">Reels Watched</div>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 text-center p-6">
                <Award className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {user?.stats.totalQuizzes}
                </div>
                <div className="text-sm text-gray-400">Quizzes Completed</div>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 text-center p-6">
                <Clock className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white">
                  {user?.stats?.studyTime}h
                </div>
                <div className="text-sm text-gray-400">Total Study Time</div>
              </Card>
            </div>

            {/* Badges Section */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Achievements
              </h2>
              <BadgeGallery />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
