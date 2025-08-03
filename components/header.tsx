"use client";
import { Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { UserMenu } from "./auth/user-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [userPoints, setUserPoints] = useState(0);
  // useEffect(() => {
  //   localStorage.setItem("userPoints", userPoints.toString());
  // }, [userPoints]);
  //
  // // Load user points from localStorage
  // useEffect(() => {
  //   const savedPoints = localStorage.getItem("userPoints");
  //   if (savedPoints) {
  //     setUserPoints(Number.parseInt(savedPoints));
  //   }
  // }, []);
  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-gray-900">
      <div className="flex items-center justify-between p-4">
        <h1 className="md:text-lg font-semibold">
          <Link href={"/"}>Wiki Reel</Link>
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-yellow-600/20 px-3 py-1 rounded-full">
            <Trophy className="md:w-4 md:h-4 w-3 h-3 text-yellow-400" />
            <span className="md:text-sm text-xs font-medium text-yellow-400">
              {userPoints}
            </span>
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
