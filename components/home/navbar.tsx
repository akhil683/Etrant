"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Image
              className="h-full w-full object-cover"
              src={Logo}
              width={50}
              height={50}
              alt="Etrant logo"
            />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Etrant
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={session?.user ? "/daily-digest" : "/auth"}>
            <Button className="h-9 px-5">
              {session?.user ? "Open app" : "Get started"}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
