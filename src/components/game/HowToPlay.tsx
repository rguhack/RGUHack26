import React from "react";

interface HowToPlayProps {
  title: string;
  instructions: string[];
  onStart: () => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({
  title,
  instructions,
  onStart,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 p-3">
      <h3 className="text-sm font-bold text-card-foreground">
        📖 How to Play: {title}
      </h3>
      <ul className="text-xs text-card-foreground space-y-1">
        {instructions.map((inst, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary font-bold">{i + 1}.</span>
            <span>{inst}</span>
          </li>
        ))}
      </ul>
      <button className="xp-button-primary text-sm" onClick={onStart}>
        ▶ Start!
      </button>
    </div>
  );
};
