import { ReactNode } from "react";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 text-white pt-28">
        {children}
      </main>
      <Footer />
    </>
  );
}
