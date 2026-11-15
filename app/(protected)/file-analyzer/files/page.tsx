import { auth } from "@/auth";
import FileMCQ from "@/components/file-analyzer/file-mcq";
import Link from "next/link";
import { db } from "@/lib/db/db";
import { files, mcqs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { QuestionData } from "@/types";

export default async function AnalyzerFilePage({
  searchParams,
}: {
  searchParams: Promise<{ fileId: string }>;
}) {
  const session = await auth();
  const { fileId } = await searchParams;

  if (!session?.user?.id) {
    return (
      <section className="w-full max-w-5xl space-y-6 px-5 pb-16 pt-24 md:px-8 md:pt-12">
        <h2 className="text-2xl font-bold text-foreground">
          Please sign in to view your files
        </h2>
      </section>
    );
  }

  const userFiles = await db
    .select()
    .from(files)
    .where(eq(files.userId, session.user.id));

  if (fileId && userFiles.length > 0) {
    const selectedFile = userFiles.find((fl) => fl.id === fileId);

    if (!selectedFile) {
      return (
        <section className="w-full max-w-5xl space-y-6 px-5 pb-16 pt-24 md:px-8 md:pt-12">
          <h2 className="text-2xl font-bold text-foreground">
            File not found
          </h2>
        </section>
      );
    }

    const file_name = selectedFile.fileName.split(".")[0];

    // Fetch MCQs directly from database
    const questions = (await db
      .select()
      .from(mcqs)
      .where(eq(mcqs.fileId, fileId))) as QuestionData[];

    return (
      <>
        {questions.length > 0 && (
          <FileMCQ questions={questions} file={file_name} />
        )}
      </>
    );
  }

  return (
    <section className="page-shell max-w-5xl space-y-6">
      <div className="page-header">
        <p className="eyebrow">Saved analyses</p>
        <h2 className="page-title">Your file history</h2>
      </div>
      <div className="flex w-full flex-col items-center gap-6">
        {userFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No files yet
            </h3>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              You haven't uploaded any files for analysis yet. Upload a PDF to generate MCQs and start practicing!
            </p>
            <Link
              href="/file-analyzer"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Upload your first file
            </Link>
          </div>
        ) : (
          userFiles.map((file) => (
            <Link
              href={`?fileId=${file.id}`}
              key={file.id}
              className="w-full rounded-xl border border-border bg-card p-4 text-foreground shadow-soft transition-all duration-200 hover:border-primary/40 hover:shadow-lift"
            >
              {file.fileName.split(".")[0]}
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
