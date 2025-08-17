export const siteConfig = {
  name: "Wiki Reel",
  url: "https://wiki.akkhil.dev",
  ogImage: "../../app/favicon.ico",
  description:
    "WikiReel is an AI-powered learning platform that turns Wikipedia summaries, news, research papers, and exam-focused questions into short, scrollable reels. Learn faster, stay updated, and prepare smarter for UPSC, JEE, NEET, and more.",
  keywords: [
    "WikiReel",
    "Wikipedia Reels",
    "Exam Preparation",
    "UPSC Current Affairs",
    "JEE Preparation",
    "Interactive Learning",
    "AI Summarization",
    "Daily Quiz",
    "Microlearning",
    "Visual Learning",
    "Personalized Study",
    "General Knowledge",
    "EdTech",
    "Daily Digest",
    "AI-powered Learning",
    "Short Notes Generator",
    "Competitive Exams",
    "Study Reels",
    "Smart Learning",
  ],
  authors: [
    {
      name: "Akhil Palsra",
      url: "https://akkhil.dev",
    },
  ],
  creator: "WikiReel Team",
  themeColor: "#6366f1",
};

export type SiteConfig = typeof siteConfig;

export const articlesMeta = {
  title: "AI-Summarized Wikipedia Articles | WikiReel",
  description:
    "Discover AI-summarized Wikipedia articles in interactive reel format. Learn faster with bite-sized explanations, visual stories, and smart knowledge reels tailored for curious learners.",
  keywords: [
    "Wikipedia Reels",
    "AI Summarized Articles",
    "Knowledge Reels",
    "Interactive Learning",
    "Microlearning",
    "AI-powered Summaries",
    "Visual Learning",
    "Daily Learning",
    "Educational Reels",
    "Smart Study",
    "Learn with AI",
    "Quick Knowledge",
  ],
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/articles`,
    title: "AI-Summarized Wikipedia Articles | WikiReel",
    description:
      "Bite-sized Wikipedia knowledge in AI-powered reel format. Learn quickly, stay curious.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "WikiReel Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Summarized Wikipedia Articles | WikiReel",
    description:
      "Get Wikipedia knowledge in bite-sized AI-summarized reels. Learn faster with WikiReel.",
    images: [siteConfig.ogImage],
    creator: "@akkhil_dev",
  },
};

export const aiquestionsMeta = {
  title: "AI-Powered Questions | WikiReel",
  description:
    "Practice AI-generated questions tailored to your interests. Improve learning with interactive question reels and personalized quizzes on WikiReel.",
  keywords: [
    "AI questions",
    "personalized learning",
    "quiz reels",
    "exam preparation",
    "interactive learning",
    "WikiReel AI",
  ],
  alternates: {
    canonical: `${siteConfig.url}/ai-questions`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/ai-questions`,
    title: "AI Questions | WikiReel",
    description:
      "Discover personalized, AI-generated questions in reel format. Learn smarter, faster with WikiReel’s AI-driven practice.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "WikiReel AI Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Questions | WikiReel",
    description:
      "Boost your learning with personalized AI-generated questions in interactive reels.",
    images: [siteConfig.ogImage],
    creator: "@akkhil_dev",
  },
};

export const leaderboardMeta = {
  title: "Leaderboard | WikiReel",
  description:
    "Check out the WikiReel leaderboard to see top performers, point rankings, and monthly champions. Join the challenge, earn points, and climb the ranks in our knowledge community.",
  keywords: [
    "Leaderboard",
    "WikiReel Rankings",
    "Top Performers",
    "Monthly Champions",
    "Points Leaderboard",
    "Knowledge Competition",
    "Ranking System",
    "Community Achievements",
    "Gamified Learning",
    "Top Users",
    "Best Performers",
    "WikiReel Points",
  ],
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/leaderboard`,
    title: "Leaderboard | WikiReel",
    description:
      "Discover the top learners and monthly champions on WikiReel. Earn points, compete, and rise in the knowledge leaderboard.",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "WikiReel Leaderboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leaderboard | WikiReel",
    description:
      "See the top performers and knowledge champions on the WikiReel leaderboard. Join the challenge!",
    images: [siteConfig.ogImage],
    creator: "@akkhil_dev",
  },
};
