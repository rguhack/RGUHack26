import React from "react";
import {
  Monitor,
  Trash2,
  FolderOpen,
  FileSpreadsheet,
  MessageSquare,
  Calendar,
} from "lucide-react";

const icons = [
  { icon: <Monitor size={26} />, label: "My Computer", bg: "#1a6db5" },
  { icon: <Trash2 size={26} />, label: "Recycle Bin", bg: "#6b7280" },
  { icon: <FolderOpen size={26} />, label: "My Documents", bg: "#d97706" },
  {
    icon: <FileSpreadsheet size={26} />,
    label: "Sprint_FINAL_v3.xls",
    bg: "#16a34a",
  },
  { icon: <MessageSquare size={26} />, label: "Slack", bg: "#7c3aed" },
  { icon: <Calendar size={26} />, label: "Standup.exe", bg: "#dc2626" },
];

export const DesktopIcons: React.FC = () => (
  <div className="absolute top-4 left-4 flex flex-col gap-4">
    {icons.map((item) => (
      <div
        key={item.label}
        className="flex flex-col items-center gap-1 w-16 cursor-pointer group"
      >
        <div
          className="w-10 h-10 flex items-center justify-center rounded shadow-md group-hover:brightness-110 transition-[filter]"
          style={{ background: item.bg, color: "white" }}
        >
          {item.icon}
        </div>
        <span
          className="text-[10px] text-white text-center leading-tight px-0.5"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
        >
          {item.label}
        </span>
      </div>
    ))}
  </div>
);
