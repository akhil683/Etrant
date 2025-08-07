import HeroSection from "@/components/home/hero-section";
import Navbar from "@/components/home/navbar"; // Import the new Navbar component
import StatsSection from "@/components/home/stats-section";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function LandingPage() {
  return (
    <ErrorBoundary>
      <main className="bg-gray-950 overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <StatsSection />
        {/* <FeaturesGrid /> */}
        {/* <ProcessFlow /> */}
        {/* <TestimonialsSection /> */}
        {/* <CTABanner /> */}
        {/* <CustomFooter /> */}
      </main>
    </ErrorBoundary>
  );
}
