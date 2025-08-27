import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function ShowExplanation({
  explanation,
}: {
  explanation: string | undefined;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <div>
      <Button
        className="bg-white rounded-full text-black"
        onClick={() => setShowExplanation(true)}
      >
        Explanation
      </Button>
      {showExplanation && (
        <div className="absolute inset-0 bg-black/50">
          <div className=" min-h-screen flex justify-center items-center">
            <div className="bg-[#222] max-w-lg p-6 m-2 rounded-xl">
              <div className="flex justify-between mb-4">
                <p className="text-xl">Explanation</p>
                <X
                  onClick={() => setShowExplanation(false)}
                  className="text-white text-2xl p-1 rounded-full hover:bg-white hover:text-black duration-200 cursor-pointer"
                />
              </div>
              <p className="text-gray-300 md:text-lg">{explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
