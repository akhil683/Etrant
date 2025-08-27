"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { InterestCategory } from "@/types";
import { setInterests } from "@/actions/setInterest";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";

export const INTERESTS: {
  id: InterestCategory;
  label: string;
  emoji: string;
  brief: string;
}[] = [
  {
    id: "jee",
    label: "JEE (Main & Advanced)",
    emoji: "📐",
    brief:
      "JEE is for admission to top engineering colleges like IITs and NITs. It tests Physics, Chemistry, and Mathematics through objective and problem-solving questions. JEE Main is the first stage, while JEE Advanced is for IIT aspirants. It requires strong conceptual understanding and application skills.",
  },
  {
    id: "neet",
    label: "NEET",
    emoji: "🩺",
    brief:
      "NEET is the entrance exam for medical and dental courses in India. It assesses knowledge of Physics, Chemistry, and Biology at the 10+2 level. It is conducted by NTA and is mandatory for admission to MBBS, BDS, and related medical programs across India.",
  },
  {
    id: "upsc",
    label: "UPSC Civil Services",
    emoji: "📜",
    brief:
      "UPSC Civil Services Exam selects candidates for IAS, IPS, IFS, and other services. It has three stages: Prelims, Mains, and Interview. Subjects include History, Geography, Polity, Economy, Environment, Current Affairs, and optional papers. It’s one of the toughest competitive exams in India.",
  },
  {
    id: "gate",
    label: "GATE",
    emoji: "⚙️",
    brief:
      "GATE is conducted for admission to postgraduate programs and PSU recruitments. It tests Engineering subjects, Mathematics, and General Aptitude. It’s highly specialized, requiring deep subject knowledge in streams like Computer Science, Mechanical, Electrical, Civil, and other engineering disciplines along with problem-solving skills.",
  },
  {
    id: "cat",
    label: "CAT",
    emoji: "📊",
    brief:
      "CAT is for admission to IIMs and other top B-schools. It evaluates candidates in three main sections: Quantitative Ability, Verbal Ability & Reading Comprehension, and Data Interpretation & Logical Reasoning. It emphasizes speed, accuracy, and analytical thinking for management aspirants seeking MBA programs.",
  },
  {
    id: "ssc",
    label: "SSC Exams",
    emoji: "📝",
    brief:
      "SSC conducts multiple exams like CGL, CHSL, and CPO for various government posts. These exams test General Awareness, Quantitative Aptitude, English Language, and Reasoning Ability. They are popular for securing central government jobs with good career growth and stability across departments.",
  },
  {
    id: "railway",
    label: "Railway Exams",
    emoji: "🚆",
    brief:
      "Railway exams are conducted by RRB for various technical and non-technical posts. They test General Awareness, Mathematics, Reasoning, and Technical Knowledge (for technical posts). They are highly competitive due to the large number of vacancies and provide secure government employment in Indian Railways.",
  },
  {
    id: "banking",
    label: "Banking (IBPS/SBI)",
    emoji: "🏦",
    brief:
      "Banking exams like IBPS PO, IBPS Clerk, and SBI PO select candidates for positions in public sector banks. They assess Quantitative Aptitude, English Language, Reasoning Ability, General Awareness, and Computer Knowledge. These exams provide opportunities for stable careers in the banking sector.",
  },
  {
    id: "clat",
    label: "CLAT",
    emoji: "⚖️",
    brief:
      "CLAT is the Common Law Admission Test for entry into NLUs and top law schools in India. It covers English, Current Affairs, Legal Reasoning, Logical Reasoning, and Quantitative Techniques. It’s crucial for students pursuing integrated law programs like BA LLB or BBA LLB.",
  },
  {
    id: "nda",
    label: "NDA",
    emoji: "🎖️",
    brief:
      "NDA exam recruits candidates for the Army, Navy, and Air Force wings of the National Defence Academy. It tests Mathematics and General Ability, which includes English, General Knowledge, and Current Affairs. It also involves an SSB interview and medical tests for final selection.",
  },
  {
    id: "aiims",
    label: "AIIMS",
    emoji: "🏥",
    brief:
      "AIIMS entrance exam (now via NEET) is for admission to AIIMS medical colleges. It emphasizes Biology, Chemistry, and Physics, along with General Knowledge and Logical Reasoning. It’s one of the most competitive exams for medical aspirants aiming for premier medical institutions in India.",
  },
  {
    id: "net",
    label: "UGC-NET",
    emoji: "🎓",
    brief:
      "UGC-NET determines eligibility for Assistant Professorship and Junior Research Fellowship. It has two papers: General Teaching & Research Aptitude and Subject-specific paper chosen by the candidate. It covers Humanities, Sciences, Commerce, and other fields. It’s essential for those pursuing academic and research careers.",
  },
  {
    id: "afcat",
    label: "AFCAT",
    emoji: "✈️",
    brief:
      "AFCAT (Air Force Common Admission Test) is conducted by the Indian Air Force to recruit officers for Flying, Ground Duty (Technical), and Ground Duty (Non-Technical) branches. It tests General Awareness, Verbal Ability, Numerical Ability, Reasoning, and Military Aptitude. It’s crucial for aspirants seeking a career as an officer in the Indian Air Force.",
  },
];

export function InterestSelector() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] =
    useState<InterestCategory | null>(null);
  const router = useRouter();

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
        setUser({ ...user, interest: selectedInterests });
        router.push("/ai-questions");
      }
    } catch (error) {
      console.log("interest selection error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="md:text-4xl text-2xl font-bold text-white mb-4">
            What interests you?
          </h1>
          <p className="text-gray-300 md:text-lg">
            Select your interests to get personalized question discoveries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {INTERESTS.map((interest) => (
            <Card
              key={interest.id}
              className={`md:p-4 p-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedInterests === interest.id
                  ? "bg-white text-black border-2 border-white"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
              onClick={() => toggleInterest(interest.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="md:text-xl text-lg">{interest.emoji}</span>
                  <span className="font-medium text-sm">{interest.label}</span>
                </div>
                {selectedInterests === interest.id && (
                  <Check className="w-5 h-5" />
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={loading}
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
