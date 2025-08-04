"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, LogOut, BookDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../providers/UserProvider";

export function UserMenu() {
  const { data: session } = useSession();
  const { user, userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  const aiQuestionHandler = () => {
    if (user?.interest) {
      router.push("/ai-questions");
    } else {
      router.push("/interest");
    }
  };

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || ""}
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-gray-800 border-gray-700 text-white"
          align="end"
          forceMount
        >
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {session.user?.name && (
                <p className="font-medium">{session.user?.name}</p>
              )}
              {session.user?.email && (
                <p className="w-[200px] truncate text-sm text-gray-400">
                  {session.user?.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator className="bg-gray-700" />
          <div className="p-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Streak:</span>
              <span className="font-semibold text-orange-400">
                {userLoading ? 0 : user?.streak}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Interest:</span>
              <span className="font-semibold text-orange-400">
                {userLoading ? "none" : user?.interest.toUpperCase()}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem className="hover:bg-gray-700">
            <Link href="/leaderboard" className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={aiQuestionHandler}
            className="hover:bg-gray-700 cursor-pointer"
          >
            <BookDown className="mr-2 h-4 w-4" />
            <span>AI Questions</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="hover:bg-gray-700"> */}
          {/*   <Settings className="mr-2 h-4 w-4" /> */}
          {/*   <span>Settings</span> */}
          {/* </DropdownMenuItem> */}
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={loading}
            className="hover:bg-gray-700 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{loading ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
