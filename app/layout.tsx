import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/components/providers/UserProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { siteConfig } from "@/lib/config/site";

const inter = Inter({ subsets: ["latin"] });

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
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 600,
        alt: siteConfig.name,
      },
    ],
    creator: "@akkhil_dev",
  },
  icons: siteConfig.icons,
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {/* <Head> */}
      {/*   <script */}
      {/*     crossOrigin="anonymous" */}
      {/*     src="//unpkg.com/react-scan/dist/auto.global.js" */}
      {/*   /> */}
      {/* </Head> */}
      <PostHogProvider>
        <SessionProvider>
          <UserProvider>
            <body className={inter.className}>{children}</body>
          </UserProvider>
        </SessionProvider>
      </PostHogProvider>
    </html>
  );
}
