import React, { useEffect, useState } from "react";
import { Baby } from "lucide-react";

interface BossBabyProps {
  message: string;
  onDismiss: () => void;
  autoAdvanceDelay?: number;
  altButton?: { label: string; onAlt: () => void };
  dismissLabel?: string;
}

export const BossBaby: React.FC<BossBabyProps> = ({
  message,
  onDismiss,
  autoAdvanceDelay,
  altButton,
  dismissLabel,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  // Typewriter Effect
  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + message[index]);
        setIndex(index + 1);
      }, 25); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [index, message]);

  // Auto-advance after typing completes
  useEffect(() => {
    if (
      autoAdvanceDelay !== undefined &&
      displayedText === message &&
      message.length > 0
    ) {
      const t = setTimeout(onDismiss, autoAdvanceDelay);
      return () => clearTimeout(t);
    }
  }, [displayedText, message, autoAdvanceDelay, onDismiss]);

  return (
    <div
      className="fixed z-50 flex items-center justify-center"
      style={{
        inset: 0,
        animation: "bossEnter 0.4s ease-out",
      }}
    >
      <div className="xp-window w-[520px]">
        {/* XP Title Bar */}
        <div className="xp-title-bar">
          <div className="flex items-center gap-1.5">
            <img
              src="/boss-baby.jpeg"
              alt="Boss Baby"
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-xs font-bold">
              LIAR... CHEATER... <span className="text-red-400">FIRED.</span>
            </span>
          </div>
        </div>
        {/* <div className="xp-window-body flex flex-col items-center gap-3 p-4">
          <div className="w-20 h-20 rounded-full bg-warning flex items-center justify-center border-4 border-foreground">

        {/* Dialogue Body */}
        <div className="xp-window-body p-4">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Dialogue Text */}
            <div className="flex-1 bg-[#ECE9D8] border-2 border-[#808080] p-3 text-sm font-bold leading-relaxed min-h-[120px]">
              <p className="whitespace-pre-wrap">
                {displayedText}
                <span className="animate-pulse">▌</span>
              </p>

              {/* Continue Button — hidden when auto-advancing */}
              {displayedText === message && autoAdvanceDelay === undefined && (
                <div className="mt-4 flex justify-end gap-2">
                  {altButton && (
                    <button className="xp-button" onClick={altButton.onAlt}>
                      {altButton.label}
                    </button>
                  )}
                  <button className="xp-button-primary" onClick={onDismiss}>
                    {dismissLabel ??
                      (message.toLowerCase().includes("email") ||
                      message.toLowerCase().includes("outlook")
                        ? "AGH, no..."
                        : "AGH, fine...")}
                  </button>
                </div>
              )}
            </div>

            {/* Right: Character */}
            <div className="flex flex-col items-center w-[130px]">
              <div className="w-24 h-24 border-2 border-primary overflow-hidden rounded-full">
                <img
                  src="/boss-baby.jpeg"
                  alt="Boss Baby"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name Tag */}
              <span className="text-sm font-bold text-card-foreground mt-2">
                Boss Baby
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
