import React, { useEffect, useState } from "react";
import { Video, MessageCircle, LayoutList } from "lucide-react";
import { TeamsMockup } from "./TeamsMockup";
import { OutlookMockup } from "./OutlookMockup";
import { ZoomMockup } from "./ZoomMockup";

interface PunishmentScreenProps {
  onComplete: () => void;
  gameStage: string;
  isPunishment: boolean;
}

const PUNISHMENT_TIME_SECONDS = 5;

const PUNISHMENTS = {
  zoom: {
    title: "Zoom - All Hands Meeting",
    icon: <Video size={14} />,
    content: <ZoomMockup />,
  },
  teams: {
    title: "Microsoft Teams - Sprint Chat",
    icon: <MessageCircle size={14} />,
    content: <TeamsMockup />,
  },
  jira: {
    title: "Jira - Sprint Board",
    icon: <LayoutList size={14} />,
    content: (
      <div className="flex flex-col h-[420px] text-[11px] bg-[#ece9d8] border border-[#7f9db9]">
        {/* Toolbar */}
        <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-2 py-[2px]">
          Project Dashboard
        </div>

        {/* Board */}
        <div className="flex flex-1 gap-2 p-2 bg-[#f6f4ea]">
          {[
            { title: "TO DO", items: ["Fix mobile", "Docs", "Dark mode"] },
            { title: "IN PROGRESS", items: ["Auth flow", "Refactor API"] },
            { title: "DONE", items: ["Update README"] },
          ].map((col) => (
            <div
              key={col.title}
              className="flex-1 border border-[#7f9db9] bg-white"
            >
              <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-1 font-bold">
                {col.title}
              </div>

              <div className="p-1 space-y-1">
                {col.items.map((i) => (
                  <div
                    key={i}
                    className="border border-[#c0c0c0] bg-[#ffffe1] px-1 py-[2px]"
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="bg-[#d4d0c8] border-t border-[#7f9db9] px-2 py-[2px]">
          47 issues remaining
        </div>
      </div>
    ),
  },
  email: {
    title: "Outlook",
    icon: <MessageCircle size={14} />,
    content: null,
  },
};

const GAME_STAGE_PUNISHMENT_MAP: Record<string, keyof typeof PUNISHMENTS> = {
  pingpong: "teams",
  wordle: "zoom",
  tetris: "jira",
  pacman: "email",
};

export const PunishmentScreen: React.FC<PunishmentScreenProps> = ({
  onComplete,
  gameStage,
  isPunishment,
}) => {
  const [timer, setTimer] = useState(PUNISHMENT_TIME_SECONDS);
  const punishmentType =
    GAME_STAGE_PUNISHMENT_MAP[gameStage.toLowerCase()] ?? "zoom";
  const punishment = PUNISHMENTS[punishmentType];

  // Unique heights for each punishment type
  const windowHeightMap: Record<string, string> = {
    zoom: "h-[600px]",
    teams: "h-[400px]",
    jira: "h-[500px]",
    email: "h-[520px]",
  };
  const windowWidthMap: Record<string, string> = {
    zoom: "w-[800px]",
    teams: "w-[700px]",
    jira: "w-[720px]",
    email: "w-[720px]",
  };
  const windowHeight = windowHeightMap[punishmentType] || "h-[520px]";
  const windowWidth = windowWidthMap[punishmentType] || "w-[700px]";

  useEffect(() => {
    setTimer(PUNISHMENT_TIME_SECONDS);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onComplete, gameStage, punishmentType]);

  return (
    <div className="fixed inset-0 z-[60] bg-foreground/60 flex items-center justify-center">
      <div className="xp-window max-w-fit max-h-fit flex flex-col justify-center items-center">
        <div className="xp-title-bar w-full">
          <div className="flex items-center gap-1.5">
            {punishment.icon}
            <span className="text-xs">{punishment.title}</span>
          </div>
        </div>
        <div
          className="xp-window-body w-full"
          style={punishmentType === "email" ? { padding: 0 } : undefined}
        >
          {punishmentType === "email" ? (
            <OutlookMockup onPlayAgain={onComplete} />
          ) : (
            <>{punishment.content}</>
          )}
        </div>
      </div>
    </div>
  );
};
