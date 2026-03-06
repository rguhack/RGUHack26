import React, { useEffect, useState } from "react";
import { PartyPopper, Frown } from "lucide-react";

interface EndScreenProps {
  type: "fired" | "promoted";
  onRestart: () => void;
}

const CONFETTI_COLORS = [
  "#f72585",
  "#7209b7",
  "#3a0ca3",
  "#4361ee",
  "#4cc9f0",
  "#f77f00",
  "#fcbf49",
];

export const EndScreen: React.FC<EndScreenProps> = ({ type, onRestart }) => {
  const [confetti, setConfetti] = useState<
    { id: number; x: number; color: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    if (type === "fired") {
      setConfetti(
        Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color:
            CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          delay: Math.random() * 2,
          size: Math.random() * 8 + 4,
        })),
      );
    }
  }, [type]);

  if (type === "fired") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti-piece z-10"
            style={{
              left: `${c.x}%`,
              top: "-20px",
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
            }}
          />
        ))}
        <div className="xp-window w-[min(95vw,680px)] z-20">
          <div className="xp-title-bar">
            <span>Office Simulator.exe</span>
            <div className="xp-close-btn">×</div>
          </div>
          <div className="xp-window-body flex flex-col items-center gap-5 py-8 px-6 text-center">
            <PartyPopper size={60} className="text-warning" />
            <h1
              className="pixel-text text-3xl md:text-5xl font-bold text-destructive"
              style={{ animation: "shake 0.5s ease-in-out infinite" }}
            >
              YOU'RE FIRED!
            </h1>
            <p className="text-lg text-card-foreground font-bold max-w-lg leading-relaxed">
              Congratulations! You successfully avoided all productivity and
              earned your freedom.
            </p>
            <button
              className="xp-button-primary pixel-text text-sm px-8 py-2 mt-2"
              onClick={onRestart}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="xp-window w-[min(95vw,680px)] z-10">
        <div className="xp-title-bar-inactive">
          <span>Human Resources</span>
          <div className="xp-close-btn">×</div>
        </div>
        <div className="xp-window-body flex flex-col items-center gap-5 py-8 px-6 text-center">
          <Frown size={56} className="text-muted-foreground" />
          <h1 className="pixel-text text-2xl md:text-4xl font-bold text-card-foreground">
            WOW. CONGRATULATIONS.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            You were <strong>way too competent</strong> at your job. As a
            reward, you've been promoted to
            <br />
            <span className="text-destructive font-bold text-xl">
              Senior Vice President of Meetings
            </span>
          </p>
          <p className="text-sm text-muted-foreground italic">
            Dream big. Now spend forever in back-to-back status calls.
          </p>
          <button
            className="xp-button-primary pixel-text text-sm px-8 py-2 mt-2"
            onClick={onRestart}
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};
