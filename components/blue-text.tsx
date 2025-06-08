"use client";

import { useEffect, useState } from "react";
import { getAnimationClasses } from "@/components/text-animations";

// Blue wipe text component - properly positioned and animated with auto-fade
export const BlueText = ({ children }: { children: React.ReactNode }) => {
  const [isAppearing, setIsAppearing] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Trigger the wipe animation
    const wipeTimer = setTimeout(() => setIsAppearing(false), 50);

    // Auto-fade after 5 seconds
    const fadeTimeout = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Allow time for fade transition
    }, 5000);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(fadeTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-20 left-0 right-0 z-[100] px-4 transition-opacity duration-300 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div
          className={`px-4 py-2 ${getAnimationClasses("wipe", isAppearing)}`}
        >
          <p className="text-2xl font-medium text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};
