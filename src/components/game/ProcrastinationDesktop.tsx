import React, { useState, useCallback, useEffect } from "react";
import { Globe } from "lucide-react";

const MATCH_OVERS = 20;
const MAX_BALLS_PER_INNINGS = MATCH_OVERS * 6;

type BattingTeam = "INDIA" | "AUSTRALIA" | "DONE";

interface InningsState {
  runs: number;
  wickets: number;
  balls: number;
}

interface MatchState {
  battingTeam: BattingTeam;
  india: InningsState;
  australia: InningsState;
  recentBalls: string[];
  lastBallCommentary: string;
}

function formatOvers(ballsFaced: number) {
  return `${Math.floor(ballsFaced / 6)}.${ballsFaced % 6}`;
}

function isInningsComplete(innings: InningsState) {
  return innings.wickets >= 10 || innings.balls >= MAX_BALLS_PER_INNINGS;
}

function createInitialMatchState(): MatchState {
  return {
    battingTeam: "INDIA",
    india: { runs: 0, wickets: 0, balls: 0 },
    australia: { runs: 0, wickets: 0, balls: 0 },
    recentBalls: [],
    lastBallCommentary: "Toss: India bat first.",
  };
}

function formatRunRate(runs: number, balls: number) {
  if (balls === 0) return "0.00";
  return ((runs * 6) / balls).toFixed(2);
}

interface ProcrastinationDesktopProps {
  hidden?: boolean;
  disabled?: boolean;
}

export const ProcrastinationDesktop: React.FC<ProcrastinationDesktopProps> = ({
  hidden = false,
  disabled = false,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [pos, setPos] = useState({
    x: isMobile ? 8 : 96,
    y: isMobile ? 155 : 40
  });
  const [activeTab, setActiveTab] = useState<"cricket" | "cat" | "youtube">(
    "cricket",
  );
  const [match, setMatch] = useState<MatchState>(createInitialMatchState);

  const resetMatch = useCallback(() => {
    setMatch(createInitialMatchState());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setMatch((prev) => {
        if (prev.battingTeam === "DONE") return prev;

        const teamKey = prev.battingTeam === "INDIA" ? "india" : "australia";
        const currentInnings = prev[teamKey];

        const australiaChasedTarget =
          prev.battingTeam === "AUSTRALIA" && prev.australia.runs > prev.india.runs;

        if (australiaChasedTarget) {
          return { ...prev, battingTeam: "DONE" };
        }

        if (isInningsComplete(currentInnings)) {
          if (prev.battingTeam === "INDIA") {
            return {
              ...prev,
              battingTeam: "AUSTRALIA",
              recentBalls: [],
              lastBallCommentary: `Target: ${prev.india.runs + 1} from ${MATCH_OVERS} overs.`,
            };
          }
          return {
            ...prev,
            battingTeam: "DONE",
            lastBallCommentary: "Australia innings complete.",
          };
        }

        const outcomeRoll = Math.random();
        let runDelta = 0;
        let wicketDelta = 0;
        let ballSymbol = ".";
        let ballCommentary = "Dot ball.";

        if (outcomeRoll < 0.04) {
          wicketDelta = 1;
          ballSymbol = "W";
          ballCommentary = "WICKET! Batter dismissed.";
        } else if (outcomeRoll < 0.44) {
          runDelta = 0;
        } else if (outcomeRoll < 0.79) {
          runDelta = 1;
          ballSymbol = "1";
          ballCommentary = "Single taken.";
        } else if (outcomeRoll < 0.91) {
          runDelta = 2;
          ballSymbol = "2";
          ballCommentary = "Driven for two.";
        } else if (outcomeRoll < 0.94) {
          runDelta = 3;
          ballSymbol = "3";
          ballCommentary = "Excellent running, three runs.";
        } else if (outcomeRoll < 0.995) {
          runDelta = 4;
          ballSymbol = "4";
          ballCommentary = "FOUR! Finds the gap.";
        } else {
          runDelta = 6;
          ballSymbol = "6";
          ballCommentary = "SIX! Huge hit into the stands.";
        }

        const nextInnings: InningsState = {
          runs: currentInnings.runs + runDelta,
          wickets: Math.min(10, currentInnings.wickets + wicketDelta),
          balls: currentInnings.balls + 1,
        };

        const nextState: MatchState =
          teamKey === "india"
            ? {
              ...prev,
              india: nextInnings,
            }
            : {
              ...prev,
              australia: nextInnings,
            };

        const ballPrefix =
          prev.battingTeam === "INDIA" ? `IND ${formatOvers(nextInnings.balls)}` : `AUS ${formatOvers(nextInnings.balls)}`;

        nextState.recentBalls = [...prev.recentBalls.slice(-11), ballSymbol];
        nextState.lastBallCommentary = `${ballPrefix}: ${ballCommentary}`;

        const chaseCompleted =
          prev.battingTeam === "AUSTRALIA" && nextState.australia.runs > nextState.india.runs;

        if (chaseCompleted) {
          return {
            ...nextState,
            battingTeam: "DONE",
            lastBallCommentary: `${ballPrefix}: ${ballCommentary} Australia complete the chase.`,
          };
        }

        if (isInningsComplete(nextInnings)) {
          if (prev.battingTeam === "INDIA") {
            return {
              ...nextState,
              battingTeam: "AUSTRALIA",
              recentBalls: [],
              lastBallCommentary: `India finish on ${nextState.india.runs}/${nextState.india.wickets}. Target: ${nextState.india.runs + 1}`,
            };
          }
          return {
            ...nextState,
            battingTeam: "DONE",
            lastBallCommentary: `${ballPrefix}: Innings over.`,
          };
        }

        return nextState;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const indiaRuns = match.india.runs;
  const australiaRuns = match.australia.runs;
  const target = indiaRuns + 1;
  const runsNeeded = Math.max(0, target - australiaRuns);
  const ballsRemaining = Math.max(0, MAX_BALLS_PER_INNINGS - match.australia.balls);
  const requiredRate =
    match.battingTeam === "AUSTRALIA" && ballsRemaining > 0 && runsNeeded > 0
      ? ((runsNeeded * 6) / ballsRemaining).toFixed(2)
      : "0.00";
  const currentRate =
    match.battingTeam === "INDIA"
      ? formatRunRate(match.india.runs, match.india.balls)
      : formatRunRate(match.australia.runs, match.australia.balls);

  const liveLine =
    match.battingTeam === "INDIA"
      ? `● LIVE - India batting first (${MATCH_OVERS}-over match)`
      : match.battingTeam === "AUSTRALIA"
        ? australiaRuns >= target
          ? `● LIVE - Australia have chased ${target}`
          : `● LIVE - Australia need ${runsNeeded} from ${ballsRemaining} balls`
        : australiaRuns >= target
          ? `● RESULT - Australia won by ${10 - match.australia.wickets} wickets`
          : indiaRuns === australiaRuns
            ? "● RESULT - Match tied"
            : `● RESULT - India won by ${indiaRuns - australiaRuns} runs`;

  const statusColorClass =
    match.battingTeam !== "DONE"
      ? "text-green-700"
      : australiaRuns >= target
        ? "text-red-700"
        : indiaRuns > australiaRuns
          ? "text-blue-700"
          : "text-gray-700";

  const browserTitle =
    activeTab === "cricket"
      ? "CricketLiveScore.tv"
      : activeTab === "cat"
        ? "CatVideosNow.tv"
        : "YouTube";

  const browserFavicon =
    activeTab === "cricket" ? "🏏" : activeTab === "cat" ? "🐱" : "▶️";

  const browserUrl =
    activeTab === "cricket"
      ? "https://www.cricketlive.tv/match/ind-vs-aus-2026"
      : activeTab === "cat"
        ? "https://www.catvideosnow.tv/watch/funniest-cats"
        : "https://www.youtube.com/watch?v=minecraft-live";

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX - pos.x;
      const startY = e.clientY - pos.y;

      const onMove = (ev: MouseEvent) => {
        setPos({ x: ev.clientX - startX, y: ev.clientY - startY });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pos],
  );

  return (
    <div
      className="fixed z-20"
      style={{
        left: pos.x,
        top: pos.y,
        display: hidden ? "none" : undefined,
        pointerEvents: disabled ? "none" : undefined,
      }}
    >
      <div
        className="bg-[#ECE9D8] border-2 border-[#003c74] shadow-2xl flex flex-col"
        style={{
          width: isMobile ? "calc(100vw - 16px)" : "700px",
          maxWidth: "700px",
          fontFamily: "Tahoma, sans-serif",
          maxHeight: isMobile ? "70vh" : "500px",
        }}
      >
        {/* Title Bar — drag handle */}
        <div
          className="bg-gradient-to-r from-[#0a246a] to-[#3a6ea5] text-white px-3 py-1 flex justify-between items-center"
          style={{ cursor: "grab" }}
          onMouseDown={onMouseDown}
        >
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span className="text-xs font-bold">
              Google Chrome - {browserFavicon} {browserTitle}
            </span>
          </div>
          <div className="flex gap-1">
            <div className="w-5 h-5 bg-[#d4d0c8] text-black text-[10px] flex items-center justify-center border border-black">
              _
            </div>
            <div className="w-5 h-5 bg-[#d4d0c8] text-black text-[10px] flex items-center justify-center border border-black">
              □
            </div>
            <div className="w-5 h-5 bg-[#d4d0c8] text-black text-[10px] flex items-center justify-center border border-black">
              ✕
            </div>
          </div>
        </div>

        {/* Browser Toolbar */}
        <div className="bg-[#d4d0c8] px-2 py-1 flex items-center gap-2 border-t border-white border-b border-[#808080]">
          <span className="text-xs">←</span>
          <span className="text-xs">→</span>
          <span className="text-xs">⟳</span>
          <div className="flex-1 bg-white border border-[#808080] px-2 py-0.5 text-[11px]">
            {browserUrl}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#d4d0c8] px-1 pt-1 flex gap-1 border-b border-[#808080]">
          <button
            type="button"
            onClick={() => setActiveTab("cricket")}
            className={`${activeTab === "cricket"
              ? "bg-[#ECE9D8] border-t border-l border-r border-white border-b-0 font-bold"
              : "bg-[#c0c0c0] border border-[#808080]"
              } px-3 py-1 text-[11px] flex items-center gap-1`}
          >
            🏏 Cricket Live
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cat")}
            className={`${activeTab === "cat"
              ? "bg-[#ECE9D8] border-t border-l border-r border-white border-b-0 font-bold"
              : "bg-[#c0c0c0] border border-[#808080]"
              } px-3 py-1 text-[11px] flex items-center gap-1`}
          >
            🐱 Cat Videos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`${activeTab === "youtube"
              ? "bg-[#ECE9D8] border-t border-l border-r border-white border-b-0 font-bold"
              : "bg-[#c0c0c0] border border-[#808080]"
              } px-3 py-1 text-[11px] flex items-center gap-1`}
          >
            ▶️ YouTube
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6 overflow-y-auto flex-1">
          {activeTab === "cricket" && (
            <>
              <h2 className="text-lg font-bold text-center mb-6">
                🏏 IND vs AUS - LIVE
              </h2>
              <div className="mx-auto max-w-md bg-[#ECE9D8] p-4 border-2 border-[#808080] shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">INDIA</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {match.india.runs}/{match.india.wickets}
                    </p>
                    <p className="text-xs text-gray-600">
                      ({formatOvers(match.india.balls)} ov)
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-600">vs</div>
                  <div className="text-center">
                    <p className="text-sm font-bold">AUSTRALIA</p>
                    <p className="text-2xl font-bold text-red-600">
                      {match.australia.runs}/{match.australia.wickets}
                    </p>
                    <p className="text-xs text-gray-600">
                      ({formatOvers(match.australia.balls)} ov)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="bg-white border border-[#808080] px-2 py-1">
                    <p className="font-bold text-gray-700">Current RR</p>
                    <p>{currentRate}</p>
                  </div>
                  <div className="bg-white border border-[#808080] px-2 py-1">
                    <p className="font-bold text-gray-700">Target</p>
                    <p>{target}</p>
                  </div>
                  <div className="bg-white border border-[#808080] px-2 py-1">
                    <p className="font-bold text-gray-700">Req RR</p>
                    <p>{requiredRate}</p>
                  </div>
                  <div className="bg-white border border-[#808080] px-2 py-1">
                    <p className="font-bold text-gray-700">Balls Left</p>
                    <p>{ballsRemaining}</p>
                  </div>
                </div>
                <div className="bg-white border border-[#808080] px-2 py-1 text-xs mb-3">
                  <p className="font-bold text-gray-700 mb-1">Last Over Feed</p>
                  <p className="font-mono tracking-wide">
                    {match.recentBalls.length > 0 ? match.recentBalls.join(" ") : "No balls yet"}
                  </p>
                </div>
                <div className="text-center mt-3">
                  <p className={`text-sm font-bold ${statusColorClass}`}>
                    {liveLine}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{match.lastBallCommentary}</p>
                </div>
              </div>
              <div className="flex justify-center gap-6 text-xs mt-6 items-center">
                <span className="underline cursor-pointer">
                  Live Chat (2.4k)
                </span>
                <span className="underline cursor-pointer">Scorecard</span>
                <span className="underline cursor-pointer">Commentary</span>
                <button
                  type="button"
                  onClick={resetMatch}
                  className="px-2 py-1 border border-[#808080] bg-[#d4d0c8] hover:bg-[#c8c4bb]"
                >
                  Restart Match
                </button>
              </div>
            </>
          )}

          {activeTab === "cat" && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <h2 className="text-lg font-bold text-center">
                🐱 Cat Videos - LIVE
              </h2>
              <img
                src="/cats.gif"
                alt="Funny cat video"
                className="max-h-[320px] w-auto border-2 border-[#808080]"
              />
            </div>
          )}

          {activeTab === "youtube" && (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <h2 className="text-lg font-bold text-center">▶ YouTube</h2>
              <div className="relative w-full max-w-[560px] border-2 border-[#808080] bg-black">
                <img
                  src="/minecraft.jpg"
                  alt="Minecraft gameplay"
                  className="w-full h-auto max-h-[315px] object-cover opacity-85"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/25">
                  <div className="w-10 h-10 border-4 border-white/40 border-t-white rounded-full animate-spin" />
                  <p className="text-xs font-bold text-white drop-shadow">
                    Buffering...
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 font-bold">
                probably your office Wi-Fi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
