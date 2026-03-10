import React from "react";
import { STAGE_METER_POINT_CUTOF } from "@/pages/index";

interface FailMeterProps {
  value: number; // -100 (FIRED) to +100 (PROMOTED)
}

export const FailMeter: React.FC<FailMeterProps> = ({ value }) => {
  const angle = 90 - (value / 100) * 90;
  const radians = (angle * Math.PI) / 180;

  const cx = 130;
  const cy = 115;
  const r = 95;
  const needleX = cx + r * 0.82 * Math.cos(radians);
  const needleY = cy - r * 0.82 * Math.sin(radians);

  const status =
    value <= -STAGE_METER_POINT_CUTOF
      ? "CRITICAL"
      : value <= STAGE_METER_POINT_CUTOF
        ? "NEUTRAL"
        : "EXCELLENT";

  const statusColor =
    value <= -STAGE_METER_POINT_CUTOF
      ? "hsl(0, 70%, 50%)"
      : value <= STAGE_METER_POINT_CUTOF
        ? "hsl(45, 90%, 50%)"
        : "hsl(120, 60%, 40%)";

  return (
    <div
      className="xp-window"
      style={{ width: 276, background: "hsl(213,71%,53%)" }}
    >
      <div className="xp-titlebar">
        <div className="flex items-center gap-2">
          <span>🔥 Fire-O-Meter™</span>
        </div>
      </div>
      <div
        style={{
          background: "hsl(210,20%,96%)",
          padding: 6,
        }}
      >
        {/* Sunken panel */}
        <div
          style={{
            border: "2px solid",
            borderColor:
              "hsl(220,10%,60%) hsl(0,0%,95%) hsl(0,0%,95%) hsl(220,10%,60%)",
            background: "hsl(210,20%,96%)",
            padding: 8,
          }}
        >
          {/* Label bar */}
          <div
            style={{
              background:
                "linear-gradient(90deg, hsl(213,72%,44%), hsl(213,50%,62%))",
              borderRadius: 2,
              padding: "2px 8px",
              marginBottom: 6,
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "white",
              textShadow: "1px 1px 1px rgba(0,0,0,0.4)",
              letterSpacing: 1,
              textAlign: "center",
            }}
          >
            AM I GETTING FIRED?
          </div>

          {/* viewBox starts at y=-15 to give clearance above the arc top */}
          <svg
            width="260"
            height="150"
            viewBox="0 0 260 150"
            style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="needleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0,0%,15%)" />
                <stop offset="100%" stopColor="hsl(0,0%,35%)" />
              </linearGradient>
              <filter id="innerShadow">
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="2"
                  floodOpacity="0.25"
                />
              </filter>
              <linearGradient
                id="arcGrad"
                x1={cx - r}
                y1="0"
                x2={cx + r}
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="hsl(0,65%,48%)" />
                <stop offset="50%" stopColor="hsl(50,85%,50%)" />
                <stop offset="100%" stopColor="hsl(120,60%,38%)" />
              </linearGradient>
            </defs>

            {/* Black border arc */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="hsl(220,10%,55%)"
              strokeWidth="22"
              strokeLinecap="butt"
            />

            {/* Gradient arc */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="20"
              strokeLinecap="butt"
            />

            {/* Tick marks */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
              const a = Math.PI - (i / 10) * Math.PI;
              const x1 = cx + (r + 12) * Math.cos(a);
              const y1 = cy - (r + 12) * Math.sin(a);
              const x2 = cx + (r + 4) * Math.cos(a);
              const y2 = cy - (r + 4) * Math.sin(a);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(220,10%,50%)"
                  strokeWidth={i % 5 === 0 ? 2 : 1}
                />
              );
            })}

            {/* Needle shadow */}
            <line
              x1={cx + 1}
              y1={cy + 1}
              x2={needleX + 1}
              y2={needleY + 1}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle */}
            <line
              x1={cx}
              y1={cy}
              x2={needleX}
              y2={needleY}
              stroke="url(#needleGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle hub */}
            <circle
              cx={cx}
              cy={cy}
              r="8"
              fill="hsl(220,10%,30%)"
              stroke="hsl(220,10%,50%)"
              strokeWidth="1.5"
            />
            <circle cx={cx} cy={cy} r="4" fill="hsl(220,10%,45%)" />

            {/* Labels */}
            <text
              x="12"
              y="130"
              fontSize="9"
              fontWeight="bold"
              fill="hsl(0,65%,48%)"
              fontFamily="Tahoma, sans-serif"
            >
              🔥 FIRED
            </text>
            <text
              x="248"
              y="130"
              textAnchor="end"
              fontSize="9"
              fontWeight="bold"
              fill="hsl(120,60%,38%)"
              fontFamily="Tahoma, sans-serif"
            >
              PROMOTED 🏆
            </text>
          </svg>

          {/* Status readout */}
          <div
            style={{
              border: "2px solid",
              borderColor:
                "hsl(220,10%,60%) hsl(0,0%,100%) hsl(0,0%,100%) hsl(220,10%,60%)",
              background: "white",
              padding: "3px 8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "Tahoma, sans-serif",
              fontSize: 12,
            }}
          >
            <span style={{ color: "hsl(220,10%,30%)" }}>Status:</span>
            <span style={{ fontWeight: "bold", color: statusColor }}>
              {status}
            </span>
            <span style={{ color: "hsl(220,10%,50%)", fontSize: 10 }}>
              [{value > 0 ? "+" : ""}
              {value}]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
