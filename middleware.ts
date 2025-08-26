import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

const publicRoutes = ["/", "/auth", "/pricing", "/how-it-works", "/"];

const protectedRoutes = [
  "/articles",
  "/ai-questions",
  "/leaderboard",
  "/subscription",
  "/user",
  "/interest",
  "/daily-digest",
];

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  // ✅ Rule 1: Logged-in users should not see public pages
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/articles", req.url));
  }

  // ✅ Rule 2: Guests should not see protected pages
  if (!session && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export const config = {
  matcher: ["/:path*"],
};
