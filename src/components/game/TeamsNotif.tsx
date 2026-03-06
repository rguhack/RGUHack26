interface TeamsNotifProps {
  onDismiss?: () => void;
  onJoin?: () => void;
}

export function TeamsNotif({ onDismiss, onJoin }: TeamsNotifProps) {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed bottom-14 right-4 z-50"
      style={{ fontFamily: "Tahoma, 'MS Sans Serif', sans-serif" }}
    >
      <div className="w-[325px] overflow-hidden border-2 border-[#0a246a] shadow-[6px_6px_0px_#808080]">
        {/* XP Title Bar */}
        <div className="flex items-center bg-[#0a246a] px-3 py-2 text-white">
          <span className="font-bold text-sm">💬 Microsoft Teams</span>
          <button
            onClick={onDismiss}
            className="ml-auto w-5 h-5 flex items-center justify-center bg-[#d4d0c8] text-black text-xs font-bold leading-none border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="bg-[#ece9d8] px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/boss-baby.jpeg"
              alt="Boss Baby"
              className="w-14 h-14 rounded-full border border-[#0a246a] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-black">Boss Baby</span>
              <span className="text-xs text-[#444]">
                JOIN MY TEAMS. We need to discuss cross-functional alignment
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onJoin}
              className="bg-[#d4d0c8] text-black px-4 py-0.5 text-sm border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
