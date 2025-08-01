"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const INTERESTS = [
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "history", label: "History", emoji: "📚" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "space", label: "Space", emoji: "🚀" },
  { id: "food", label: "Food", emoji: "🍕" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "literature", label: "Literature", emoji: "📖" },
  { id: "philosophy", label: "Philosophy", emoji: "🤔" },
];

interface InterestSelectorProps {
  onInterestsSelected: (interests: string[]) => void;
}

export function InterestSelector({
  onInterestsSelected,
}: InterestSelectorProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId],
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      onInterestsSelected(selectedInterests);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            What interests you?
          </h1>
          <p className="text-gray-300 text-lg">
            Select your interests to get personalized Wikipedia discoveries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {INTERESTS.map((interest) => (
            <Card
              key={interest.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedInterests.includes(interest.id)
                  ? "bg-white text-black border-2 border-white"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{interest.emoji}</span>
                  <span className="font-medium">{interest.label}</span>
                </div>
                {selectedInterests.includes(interest.id) && (
                  <Check className="w-5 h-5" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={selectedInterests.length === 0}
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue ({selectedInterests.length} selected)
          </Button>
        </div>
      </div>
    </div>
  );
}
