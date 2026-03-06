import React from "react";

export const TeamsMockup: React.FC = () => (
  <div className="flex h-[380px] w-[700px] text-[11px] bg-[#ece9d8] border border-[#7f9db9]">
    {/* Sidebar */}
    <div className="w-36 border-r border-[#7f9db9] bg-[#f6f4ea] p-2">
      <div className="font-bold mb-1">Channels</div>
      <div># General</div>
      <div className="font-bold"># Engineering</div>
      <div># Incidents</div>
    </div>

    {/* Chat */}
    <div className="flex-1 flex flex-col">
      <div className="bg-[#d4d0c8] border-b border-[#7f9db9] px-2 py-[2px]">
        Engineering Chat
      </div>

      <div className="flex-1 p-2 space-y-2 bg-[#f6f4ea]">
        <p>
          <b>Sarah:</b> Prod DB connections high.
        </p>
        <p>
          <b>Michael:</b> API latency increasing.
        </p>
        <p>
          <b>You:</b> Scaling pool?
        </p>
        <p>
          <b>Sarah:</b> Rolling back deployment.
        </p>
      </div>

      <div className="border-t border-[#7f9db9] bg-white px-2 py-1 text-[10px] text-gray-400">
        Type a message...
      </div>
    </div>
  </div>
);
