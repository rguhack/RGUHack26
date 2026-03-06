import { Settings } from "lucide-react";
import React, { useState } from "react";

interface IntroScreenProps {
  onStart: () => void;
  skipTutorials: boolean;
  setSkipTutorials: (skip: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  skipTutorials,
  setSkipTutorials,
  volume,
  setVolume,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden font-sans bg-background">
      <div className="absolute inset-0 bg-foreground/10" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 text-center w-full">
        <div className="xp-window w-[680px] max-w-[95vw]">
          <div className="xp-title-bar">
            <div className="flex items-center gap-1.5">
              <img
                src="/boss-baby.jpeg"
                alt="Boss Baby"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="text-xs">Manager - Workstation Alert</span>
            </div>
            <button className="xp-close-btn" type="button" aria-label="Close">
              ×
            </button>
          </div>

          <div className="xp-window-body flex flex-col items-center gap-8 p-9">
            <div className="select-none flex flex-col gap-1">
              <h1 className="pixel-text text-4xl md:text-5xl font-bold tracking-wide text-foreground">
                LIAR...
              </h1>
              <h1 className="pixel-text text-4xl md:text-5xl font-bold tracking-wide text-foreground">
                CHEATER...
              </h1>
              <h1 className="pixel-text text-5xl md:text-6xl font-extrabold tracking-wider text-destructive">
                FIRED.
              </h1>
            </div>

            <div className="xp-window w-full max-w-[535px]">
              <div className="xp-title-bar">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold">BOSS MESSAGE</span>
                </div>
              </div>
              <div className="xp-window-body flex flex-col gap-6 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-14 flex-1 justify-center">
                    <p className="text-base font-bold leading-relaxed text-left whitespace-pre-wrap">
                      "I hate liars and cheaters. Why are you hired if you don't
                      do your job?{" "}
                      <span className="text-destructive">Focus on work!</span>"
                    </p>
                    <div className="flex justify-start">
                      <button
                        className="xp-button-primary text-xs px-4 py-0.5"
                        onClick={onStart}
                      >
                        I'm ready to get fired!
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative w-32 h-32">
                      <img
                        src="/boss-baby.jpeg"
                        alt="Boss Baby"
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full border-2 border-primary"
                      />
                    </div>
                    <span className="text-sm font-bold text-card-foreground mt-2">
                      Boss Baby
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center px-4">
        <div
          className="w-full max-w-[900px] flex items-center justify-between gap-3 px-3 py-2"
          style={{
            background:
              "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(0,0%,85%) 100%)",
            border: "2px solid",
            borderColor:
              "hsl(0,0%,100%) hsl(220,10%,55%) hsl(220,10%,55%) hsl(0,0%,100%)",
          }}
        >
          <div className="text-xs text-foreground/80">
            (Disclaimer: This is not representative of us developers; we are
            very, very, very good employees.)
          </div>

          <div className="flex items-center">
            <div
              style={{
                overflow: "hidden",
                width: settingsOpen ? 320 : 0,
                transition: "width 0.25s ease",
              }}
            >
              <div
                style={{
                  width: 320,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  background:
                    "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(0,0%,85%) 100%)",
                  border: "2px solid",
                  borderColor:
                    "hsl(0,0%,100%) transparent hsl(220,10%,55%) hsl(0,0%,100%)",
                  padding: "6px 10px",
                  minHeight: 40,
                  boxSizing: "border-box",
                }}
              >
                <div className="flex items-center justify-between h-8">
                  <span className="text-xs font-bold">Tutorials</span>
                  <button
                    type="button"
                    className="xp-button text-[11px] px-2 py-0.5"
                    onClick={() => setSkipTutorials(!skipTutorials)}
                  >
                    {skipTutorials ? "OFF" : "ON"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 h-8">
                  <span className="text-xs font-bold">Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(volume * 100)}
                    onChange={(event) =>
                      setVolume(Number(event.target.value) / 100)
                    }
                    className="w-32 accent-primary"
                  />
                  <span className="text-[11px] font-bold w-9 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              title="Settings"
              style={{
                width: 40,
                height: 40,
                background:
                  "linear-gradient(180deg, hsl(0,0%,100%) 0%, hsl(0,0%,85%) 100%)",
                border: "2px solid",
                borderColor:
                  "hsl(0,0%,100%) hsl(220,10%,55%) hsl(220,10%,55%) hsl(0,0%,100%)",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <Settings size={20} color="hsl(220,10%,30%)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
