import { ReactNode } from "react";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
