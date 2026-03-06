import { useState, useCallback } from "react";

export type GameStage =
  | "intro"
  | "procrastination"
  | "teams"
  | "boss-teams"
  | "pong-howto"
  | "pingpong"
  | "pong-done"
  | "zoom"
  | "boss-zoom"
  | "wordle-howto"
  | "wordle"
  | "wordle-done"
  | "boss-email"
  | "pacman-howto"
  | "pacman"
  | "pacman-done"
  | "outlook"
  | "jira"
  | "tetris-howto"
  | "tetris"
  | "tetris-done"
  | "punishment"
  | "fired"
  | "promoted";

export interface GameState {
  stage: GameStage;
  meterValue: number; // -100 (FIRED/win) to +100 (PROMOTED/loss)
  bossMessage: string;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    stage: "intro",
    meterValue: 0,
    bossMessage: "",
  });

  const setStage = useCallback((stage: GameStage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const moveMeter = useCallback((delta: number) => {
    setState((prev) => {
      const newVal = Math.max(-100, Math.min(100, prev.meterValue + delta));
      if (newVal >= 100) {
        return { ...prev, meterValue: 100, stage: "promoted" as GameStage };
      }
      if (newVal <= -100) {
        return { ...prev, meterValue: -100, stage: "fired" as GameStage };
      }
      return { ...prev, meterValue: newVal };
    });
  }, []);

  const setBossMessage = useCallback((msg: string) => {
    setState((prev) => ({ ...prev, bossMessage: msg }));
  }, []);

  return { state, setStage, moveMeter, setBossMessage };
}
