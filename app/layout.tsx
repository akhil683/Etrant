import type React from "react";
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { siteConfig } from "@/lib/config/site";
import { UserProvider } from "@/components/providers/UserProvider";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    site: "@akhil_web",
    description: siteConfig.description,
    images: [
      "https://raw.githubusercontent.com/akhil683/Etrant/refs/heads/main/public/og-image.png",
    ],
    creator: "@akkhil_dev",
  },
  icons: siteConfig.icons,
  manifest: "/site.webmanifest",
  verification: {
    google: "EwF6VPOPDKObEf3SzaXf1GkyPmCdDiofW9MqDonM03w",
  },
};

const themeInitScript = `
(function() {
  try {
    var saved = localStorage.getItem("theme");
    var theme = saved === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.remove("dark");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable}`}
    >
      <body className={`${inter.className} overflow-x-hidden`}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <PostHogProvider>
          <SessionProvider>
            <UserProvider>
              <QueryProvider>
                <ThemeProvider>
                  {children}
                  <Toaster />
                </ThemeProvider>
              </QueryProvider>
            </UserProvider>
          </SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
