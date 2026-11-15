// Revalidate every 5 minutes for better performance while keeping content fresh
export const revalidate = 300;

import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import getSingleDigest from "@/actions/get-single-digest";
import LockedPage from "@/components/locked-page";
import { getUserData } from "@/actions/getInterest";

export default async function DailyDigestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [userData, digest] = await Promise.all([
    getUserData(),
    getSingleDigest(id),
  ]);

  if (userData?.subscriptionActive !== true) {
    return <LockedPage />;
  }

  if (!digest) {
    notFound();
  }

  return (
    <div className="w-full pt-24 md:pt-12">
      <article className="mx-auto max-w-3xl px-5 pb-20 md:px-8">
        <header className="mb-8 border-b border-border pb-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {digest?.topic?.split(",").map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            {digest?.title}
          </h1>
        </header>

        <div className="reading-prose measure">{digest?.summary}</div>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
            Relevant questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {digest?.relevantQuestions?.map((qa, index) => (
              <AccordionItem
                key={qa.question}
                value={qa.question}
                className="border-border"
              >
                <AccordionTrigger className="py-4 text-left hover:no-underline">
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-foreground">
                      {qa.question}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-9 pt-1">
                  <p className="reading-prose text-base text-muted-foreground">
                    {qa.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </article>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const digest = await getSingleDigest(id);
  if (!digest) {
    return {
      title: "Daily Digest Not Found",
      description: "The requested daily digest could not be found.",
    };
  }

  return {
    title: `${digest.title} | Daily Digest`,
    description: digest.summary.substring(0, 160) + "...",
    keywords: digest.topic,
    openGraph: {
      title: digest.title,
      description: digest.summary.substring(0, 160) + "...",
      type: "article",
      tags: digest.topic,
    },
  };
}
