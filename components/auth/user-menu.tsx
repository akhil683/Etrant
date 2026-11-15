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
import {
  Trophy,
  LogOut,
  BookDown,
  AlarmClockCheck,
  DollarSign,
  Book,
  FormInput,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";

export function UserMenu() {
  const { data: session, status } = useSession();
  const { user } = useUserStore();
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

  if (status === "loading") {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />;
  }
  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth">
          <Button size="sm">
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
            {user?.subscriptionActive === true && (
              <span className="absolute -right-2 -top-1 z-30 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold uppercase text-primary-foreground">
                {user?.plan}
              </span>
            )}
            <Avatar
              className={`h-8 w-8 border-2 ${user?.subscriptionActive === true ? "border-primary" : "border-transparent"}`}
            >
              <AvatarImage
                src={session?.user?.image || ""}
                alt={user?.name || ""}
                className={``}
              />
              <AvatarFallback>
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 border-border bg-popover text-popover-foreground"
          align="end"
          forceMount
        >
          <div className="flex items-center justify-start gap-2 p-2">
            <Link
              href={"/"}
              className="flex flex-col space-y-1 leading-none cursor-pointer"
            >
              {session?.user?.name && (
                <p className="font-medium">{session?.user?.name}</p>
              )}
              {session?.user?.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {session?.user?.email}
                </p>
              )}
            </Link>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <div className="p-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Streak:</span>
              <span className="font-semibold text-primary">
                {user?.streak || 0}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Interest:
              </span>
              <span className="font-semibold text-primary">
                {!user
                  ? "none"
                  : user?.interest === null
                    ? "none"
                    : user?.interest?.toUpperCase()}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={aiQuestionHandler}
            className="hover:bg-secondary cursor-pointer"
          >
            <BookDown className=" h-4 w-4" />
            <span>AI Questions</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem asChild className="hover:bg-secondary">
            <Link href="/articles" className="flex items-center cursor-pointer">
              <AlarmClockCheck className="mr-2 h-4 w-4" />
              <span>Article Reel</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem asChild className="hover:bg-secondary">
            <Link
              href="/daily-digest"
              className="flex items-center cursor-pointer"
            >
              <Book className="mr-2 h-4 w-4" />
              <span>Daily Digest</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem asChild className="hover:bg-secondary">
            <Link
              href="/leaderboard"
              className="flex items-center cursor-pointer"
            >
              <Trophy className="mr-2 h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem asChild className="hover:bg-secondary">
            <Link
              href="/subscription"
              className="cursor-pointer flex items-center"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Subscription</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem asChild className="hover:bg-secondary">
            <Link
              href="/user-feedback"
              className="cursor-pointer flex items-center"
            >
              <FormInput className="mr-2 h-4 w-4" />
              <span>Feedback</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={loading}
            className="hover:bg-secondary cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{loading ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
