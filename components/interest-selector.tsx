"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { InterestCategory } from "@/types";
import { setInterests } from "@/actions/setInterest";
import { User, useUserStore } from "@/lib/store/useUserStore";
import { INTERESTS } from "@/data/interest";
import { toast } from "sonner";

export function InterestSelector() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] =
    useState<InterestCategory | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const userData = await res.json();
      if (userData) {
        setSelectedInterests(userData.interest);
      }
    };
    fetchUser();
  }, []);

  const toggleInterest = (interestId: InterestCategory) => {
    setSelectedInterests(interestId);
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      if (selectedInterests) {
        const res = await setInterests(
          selectedInterests,
          user?.email as string,
        );
        console.log("res", res);
        setUser({
          ...(user as User),
          interest: selectedInterests as InterestCategory,
        });
        if (res.success) {
          // router.push("/ai-questions");
          toast.success("Successfully updated the interest.");
        }
      }
    } catch (error) {
      console.log("interest selection error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 pb-16 pt-24 md:pt-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 border-b border-border pb-6">
          <p className="eyebrow">Personalise</p>
          <h1 className="page-title">
            What are you preparing for?
          </h1>
          <p className="page-description">
            Pick one exam so your digest and questions stay relevant.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests === interest.id;
            return (
              <Card
                key={interest.id}
                className={`cursor-pointer p-3 transition-colors duration-150 md:px-4 md:py-3.5 ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
                onClick={() => toggleInterest(interest.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg md:text-xl">{interest.emoji}</span>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {interest.label}
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
              </Card>
            );
          })}
        </div>

        <div>
          <Button
            onClick={handleContinue}
            disabled={loading}
            className="h-11 px-7 text-base font-semibold"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
