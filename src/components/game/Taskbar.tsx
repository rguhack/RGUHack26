import React, { useState, useEffect } from "react";
import {
  Monitor,
  Globe,
  MessageCircle,
  FolderOpen,
  Volume2,
} from "lucide-react";

interface TaskbarProps {
  volume: number;
  setVolume: (value: number) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ volume, setVolume }) => {
  const [time, setTime] = useState(new Date());
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = time.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="xp-taskbar fixed bottom-0 left-0 right-0 z-50 flex justify-between">
      <div className="flex items-center gap-1">
        <button className="xp-start-btn">
          <Monitor size={16} />
          <span className="hidden sm:inline">Start</span>
        </button>
        <div className="hidden sm:block h-6 w-px bg-border mx-1" />
        {/* Quick launch icons (Win7 style) */}
        <div className="hidden sm:flex items-center gap-0.5">
          {[
            { icon: <Globe size={14} />, label: "Chrome" },
            { icon: <MessageCircle size={14} />, label: "Teams" },
            { icon: <FolderOpen size={14} />, label: "Explorer" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded cursor-pointer"
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex items-center gap-2 px-2 bg-primary/10 border-l border-border">
        {showVolumeControl && (
          <div className="absolute bottom-9 right-2 xp-window px-2 py-1 min-w-[170px]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold">VOL</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={(event) => setVolume(Number(event.target.value) / 100)}
                className="w-24 accent-primary"
              />
              <span className="text-[10px] font-bold w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          title="Volume"
          onClick={() => setShowVolumeControl((prev) => !prev)}
          className="w-5 h-5 flex items-center justify-center hover:bg-primary/10 rounded"
        >
          <Volume2 size={12} className="text-muted-foreground" />
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="text-right">
          <span className="text-xs font-bold block leading-none">
            {timeStr}
          </span>
          <span className="text-[9px] text-muted-foreground block leading-none">
            {dateStr}
          </span>
        </div>
      </div>
    </div>
  );
};
