"use client";

import { LogOut, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { sidebarLinks } from "@/data/data";
import Logo from "@/public/etrant.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./theme-toggle";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user } = useUserStore();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="sticky top-0 z-50 h-screen shrink-0 border-r border-border bg-card max-md:hidden">
      <div className="flex h-full w-[15rem] flex-col justify-between px-3 py-5 lg:w-[16rem] lg:px-4">
        <div className="flex flex-col">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2.5 px-2"
            aria-label="Etrant home"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Image
                src={Logo}
                className="h-full w-full object-cover"
                alt="Etrant logo"
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Etrant
            </span>
          </Link>

          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.link ||
                (link.link !== "/" && pathname.startsWith(`${link.link}/`));
              return (
                <Link
                  key={link.link}
                  href={link.link}
                  aria-label={link.name}
                  title={link.name}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <link.icon
                    className={cn(
                      "h-[18px] w-[18px]",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-accent-foreground",
                    )}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/leaderboard"
            className="mb-1 flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Trophy className="h-4 w-4 text-primary" />
              Points
            </span>
            <span className="tabular text-sm font-bold text-foreground">
              {(user?.points || 0).toLocaleString()}
            </span>
          </Link>

          <Link href="/user/profile" aria-label="Profile" className="block">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent">
              <Avatar className="h-9 w-9 rounded-full border border-border">
                <AvatarImage
                  src={user?.image || ""}
                  alt={user?.name || ""}
                  width={100}
                  height={100}
                />
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-sm font-semibold text-foreground">
                  {user?.name || "Account"}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {user?.plan || "Free"} plan
                </span>
              </div>
            </div>
          </Link>

          <ThemeToggle />

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full justify-start gap-2 text-muted-foreground"
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
            <span>{loading ? "Signing out..." : "Sign out"}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
