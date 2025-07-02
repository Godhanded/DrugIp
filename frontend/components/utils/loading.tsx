"use client";
import { useEffect, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [start, setStart] = useState(false);

  useEffect(() => {
    setStart(true);
    const timeout = setTimeout(() => {
      onComplete(); // Move to next step after animation
    }, 3000); // Match loader duration
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white relative">
      <div className="text-sm mb-8">analyzing drug toxicity.</div>
      <div className="w-7/12 h-[6px] bg-white/10 rounded-full overflow-hidden relative shadow-md">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 shadow-[0_0_20px_#22c55e] transition-all duration-[3000ms] ${
            start ? "w-full" : "w-0"
          }`}
        ></div>
      </div>
    </div>
  );
}
