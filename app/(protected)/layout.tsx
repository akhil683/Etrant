import Header from "@/components/header";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Header />
      {children}
    </main>
  );
}
