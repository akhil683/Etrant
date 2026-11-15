"use client";
import { Loader2, LogOut, Menu, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { sidebarLinks } from "@/data/data";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import ThemeToggle from "./bar/theme-toggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const { user } = useUserStore();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="fixed top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Image src={Logo} className="h-full w-full object-cover" alt="Etrant logo" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Etrant
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="tabular text-xs font-semibold text-primary">
                {(user?.points || 0).toLocaleString()}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[998] bg-slate-950/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed bottom-0 right-0 top-0 z-[999] h-full w-72 transform border-l border-border bg-card transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Image src={Logo} alt="Etrant logo" className="h-full w-full" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Etrant
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto p-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.link;
            return (
              <Link key={link.link} href={link.link} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
          <div className="flex flex-col gap-3">
            <ThemeToggle />
            <Link
              href="/user/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                <Avatar className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || ""}
                    width={100}
                    height={100}
                    className="h-8 w-8"
                  />
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <p className="flex flex-col text-sm leading-tight text-foreground">
                  Account
                  <span className="text-xs text-muted-foreground">
                    {user?.name}
                  </span>
                </p>
              </div>
            </Link>
            <Button
              onClick={handleSignOut}
              disabled={loading}
              variant="outline"
              className="w-full justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <LogOut />
                  <span>Sign out</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
