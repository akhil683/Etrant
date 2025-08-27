import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Clock } from "lucide-react";
import Logo from "@/public/etrant.png";
import Link from "next/link";
import { Metadata } from "next";
import { howItWorkMetadata } from "@/lib/config/site";
import { stepsHowItWorks } from "@/data/data";
import Image from "next/image";

export const metadata: Metadata = howItWorkMetadata;

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-black mb-6">
          How{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Etrant
          </span>{" "}
          Works
        </h1>
        <p className="md:text-xl text-sm text-gray-300 max-w-3xl mx-auto mb-8">
          Discover how we're revolutionizing education by making learning as
          engaging as social media. From Instagram-style reels to gamified
          quizzes, here's your complete guide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 md:text-lg"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="max-md:hidden md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Your Learning Journey in 5 Simple Steps
        </h2>

        <div className="space-y-24">
          {stepsHowItWorks.map((step, index) => (
            <div
              key={step.step}
              className={`flex flex-col items-center gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`md:w-16 md:h-16 w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl`}
                  >
                    {step.step}
                  </div>
                  <h3 className="md:text-3xl text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="md:text-lg text-gray-300 leading-relaxed">
                  {step.description}
                </p>

                <div className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 flex justify-center">
                <Card className="bg-gray-900/50 border-gray-800 p-8 max-w-sm w-full">
                  <CardContent className="text-center">
                    <div
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6`}
                    >
                      <step.icon className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {step.description.split(".")[0]}.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Interface */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          See It In Action
        </h2>

        <div className="flex justify-center">
          <div className="relative mx-auto w-80 h-[650px] bg-gradient-to-b from-gray-800 to-black rounded-[3.5rem] p-2 shadow-2xl">
            {/* iPhone frame */}
            <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative">
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-20"></div>

              {/* Screen content */}
              <div className="absolute inset-0 bg-gray-900 rounded-[3rem] overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 px-4 pt-12 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <Image
                          src={Logo}
                          className="w-full h-full"
                          alt="Etrant Logo"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-white">Etrant</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-white text-sm">1,247</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-4 space-y-4">
                  {/* Knowledge Reel */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <h4 className="text-white font-semibold mb-2">
                      Photosynthesis Basics
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Plants convert sunlight into energy through
                      chloroplasts...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>45 seconds</span>
                    </div>
                  </div>

                  {/* Quiz */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <h4 className="text-white font-semibold mb-3">
                      Quick Quiz
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Which organelle is responsible for photosynthesis?
                    </p>
                    <div className="space-y-2">
                      <button className="w-full bg-blue-900/30 border border-blue-500 rounded-lg p-2 text-left">
                        <span className="text-white text-sm">
                          Chloroplast ✓
                        </span>
                      </button>
                      <button className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-left">
                        <span className="text-gray-300 text-sm">
                          Mitochondria
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
