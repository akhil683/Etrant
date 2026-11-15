import Header from "@/components/header";
import Sidebar from "@/components/bar/side-bar";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="flex min-h-screen w-full">
        <Sidebar />
        <section className="flex min-w-0 w-full justify-center">{children}</section>
      </section>
    </main>
  );
}
