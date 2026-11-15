"use client";

import { Twitter, Instagram, Youtube, Mail, MapPin } from "lucide-react";
import Logo from "@/public/etrant.png";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-14 md:py-16">
      <div className="container mx-auto">
        <div className="mb-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-5 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Image
                  className="h-full w-full object-cover"
                  src={Logo}
                  width={500}
                  height={500}
                  alt="Etrant logo"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                Etrant
              </span>
            </Link>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Daily current affairs, practice questions and study groups for
              UPSC and defence aspirants. Built as a short, repeatable study
              loop.
            </p>
            <div className="flex gap-2.5">
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold text-foreground">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Features" },
                { href: "/how-it-works", label: "How it works" },
                { href: "/pricing", label: "Pricing" },
                { href: "/auth", label: "Sign in" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold text-foreground">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>hello@akkhil.dev</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>Mandi, Himachal, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-7 md:flex-row">
          <p className="text-center text-xs text-muted-foreground md:text-left">
            &copy; 2024 Etrant. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="transition-colors hover:text-primary"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
