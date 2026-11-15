"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Medal, Award, User } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
}

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userName, setUserName] = useState("");
  const [userRank, setUserRank] = useState(0);

  useEffect(() => {
    loadLeaderboard();
    loadUserData();
  }, []);

  const loadUserData = () => {
    const points = Number.parseInt(localStorage.getItem("userPoints") || "0");
    const name = localStorage.getItem("userName") || "Anonymous";
    setUserPoints(points);
    setUserName(name);
  };

  const loadLeaderboard = () => {
    // Get existing leaderboard from localStorage
    const existingLeaderboard = JSON.parse(
      localStorage.getItem("leaderboard") || "[]",
    );
    const currentUserPoints = Number.parseInt(
      localStorage.getItem("userPoints") || "0",
    );
    const currentUserName = localStorage.getItem("userName") || "Anonymous";

    // Add current user if not exists or update their score
    const userIndex = existingLeaderboard.findIndex(
      (entry: LeaderboardEntry) => entry.name === currentUserName,
    );

    if (userIndex >= 0) {
      existingLeaderboard[userIndex].points = Math.max(
        existingLeaderboard[userIndex].points,
        currentUserPoints,
      );
    } else if (currentUserPoints > 0) {
      existingLeaderboard.push({
        id: Date.now().toString(),
        name: currentUserName,
        points: currentUserPoints,
      });
    }

    // Add some sample users if leaderboard is empty
    if (existingLeaderboard.length === 0) {
      const sampleUsers = [
        { id: "1", name: "WikiMaster", points: 850 },
        { id: "2", name: "KnowledgeSeeker", points: 720 },
        { id: "3", name: "FactFinder", points: 680 },
        { id: "4", name: "StudyBuddy", points: 590 },
        { id: "5", name: "QuizChamp", points: 520 },
        { id: "6", name: "BrainBox", points: 480 },
        { id: "7", name: "SmartCookie", points: 420 },
        { id: "8", name: "WisdomWolf", points: 380 },
      ];
      existingLeaderboard.push(...sampleUsers);
    }

    // Sort by points and add ranks
    const sortedLeaderboard = existingLeaderboard
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.points - a.points)
      .map((entry: LeaderboardEntry, index: number) => ({
        ...entry,
        rank: index + 1,
      }));

    // Find user rank
    const currentUserRank =
      sortedLeaderboard.findIndex(
        (entry: any) => entry.name === currentUserName,
      ) + 1;
    setUserRank(currentUserRank);

    setLeaderboard(sortedLeaderboard.slice(0, 20)); // Top 20

    // Save updated leaderboard
    localStorage.setItem("leaderboard", JSON.stringify(sortedLeaderboard));
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-primary" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-primary" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const handleNameChange = (newName: string) => {
    if (newName.trim()) {
      localStorage.setItem("userName", newName.trim());
      setUserName(newName.trim());
      loadLeaderboard(); // Refresh leaderboard with new name
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <Link href={"/"}>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Leaderboard</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* User Stats Card */}
        <Card className="mb-6 bg-card border-border text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Your Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="border-b border-border bg-transparent text-lg font-semibold focus:border-primary focus:outline-none"
                  placeholder="Enter your name"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Rank: #{userRank > 0 ? userRank : "Unranked"}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {userPoints}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-card border-border text-foreground">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Top Players</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    entry.name === userName
                      ? "border border-primary/40 bg-primary/10"
                      : "bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getRankIcon(entry.rank)}
                    <div>
                      <p className="font-semibold">{entry.name}</p>
                      {entry.name === userName && (
                        <p className="text-xs text-primary">You</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{entry.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-6 rounded-lg bg-secondary/40 p-4">
          <h3 className="font-semibold mb-2">How to earn points:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Answer quiz questions correctly after every 5 articles</li>
            <li>• Each correct answer gives you 10 points</li>
            <li>• Quick answers earn bonus points</li>
            <li>• Keep reading to unlock more quizzes!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
