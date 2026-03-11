import React from "react";

const PARTICIPANTS = [
  { initials: "JD", name: "John D.", color: "#4a7c9b" },
  { initials: "SK", name: "Sarah K.", color: "#7c4a9b" },
  { initials: "MR", name: "Mike R.", color: "#9b6b4a" },
  { initials: "AL", name: "Amy L.", color: "#4a9b6b" },
];

export const ZoomMockup: React.FC = () => {
  return (
    <div className="flex flex-col max-w-[600px] max-h-[80vh] text-[11px] bg-[#ece9d8] border border-[#7f9db9]">
      {/* Menu */}
      <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-2 py-[2px] flex gap-4">
        <span>Call</span>
        <span>View</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      {/* Main video */}
      <div className="p-1 bg-[#f6f4ea]">
        <div className="relative bg-black border border-black">
          <img
            src="zoomscreenshare.png"
            className="w-full max-h-[35vh] object-contain opacity-90"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-2 py-[2px]">
            PM – Screen Sharing (Poor Connection)
          </div>
        </div>
      </div>

      {/* Participant strip */}
      <div className="grid grid-cols-4 gap-1 p-1 border-t border-[#7f9db9] bg-[#ece9d8]">
        {PARTICIPANTS.map((p) => (
          <div
            key={p.initials}
            className="h-16 border border-black flex flex-col items-center justify-center"
            style={{ backgroundColor: p.color }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              {p.initials}
            </div>
            <span className="text-white text-[9px] mt-0.5">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="bg-[#d4d0c8] border-t border-[#7f9db9] px-2 py-[2px]">
        Connected • 12 participants
      </div>
    </div>
  );
};
