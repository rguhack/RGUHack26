import React, { useRef, useEffect, useState, useCallback } from "react";

const CELL = 24;
const COLS = 21;
const ROWS = 17;
const EMAIL_COUNT = 7;

const MAZE: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface Ghost {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  color: string;
  label: string;
  dir: { dx: number; dy: number };
}

interface Email {
  x: number;
  y: number;
  eaten: boolean;
}

interface GameState {
  running: boolean;
  px: number;
  py: number;
  targetX: number;
  targetY: number;
  progress: number;
  nextDir: { dx: number; dy: number };
  currentDir: { dx: number; dy: number };
  mouth: number;
  mouthDir: number;
  emails: Email[];
  ghosts: Ghost[];
  tick: number;
}

const GHOST_CONFIGS = [
  { color: "#e04040", label: "ED" },
  { color: "#e07020", label: "HR" },
  { color: "#40a0e0", label: "MD" },
  { color: "#e040a0", label: "SE" },
  { color: "#40c080", label: "CEO" },
  { color: "#f7d000", label: "VP" },
];

const GHOST_SPAWNS = [
  { x: 9, y: 9 },
  { x: 10, y: 9 },
  { x: 11, y: 9 },
  { x: 9, y: 8 },
  { x: 11, y: 8 },
];

const canMove = (x: number, y: number) =>
  x >= 0 && x < COLS && y >= 0 && y < ROWS && MAZE[y]?.[x] === 0;

interface PacmanGameProps {
  onWin: () => void;
  onLose: () => void;
}

export const PacmanGame: React.FC<PacmanGameProps> = ({ onWin, onLose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emailsLeft, setEmailsLeft] = useState(EMAIL_COUNT);
  const stateRef = useRef<GameState | null>(null);

  const initState = useCallback(() => {
    const paths: { x: number; y: number }[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (MAZE[r][c] === 0 && !(r === 1 && c === 1))
          paths.push({ x: c, y: r });
    for (let i = paths.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paths[i], paths[j]] = [paths[j], paths[i]];
    }
    const emails = paths
      .slice(0, EMAIL_COUNT)
      .map((p) => ({ ...p, eaten: false }));

    const ghosts: Ghost[] = GHOST_CONFIGS.map((cfg, i) => {
      const spawn = GHOST_SPAWNS[i % GHOST_SPAWNS.length];
      return {
        x: spawn.x,
        y: spawn.y,
        targetX: spawn.x,
        targetY: spawn.y,
        progress: 1,
        speed: 0.018 + Math.random() * 0.004,
        color: cfg.color,
        label: cfg.label,
        dir: { dx: 0, dy: 0 },
      };
    });

    return {
      running: true,
      px: 1,
      py: 1,
      targetX: 1,
      targetY: 1,
      progress: 1,
      nextDir: { dx: 0, dy: 0 },
      currentDir: { dx: 0, dy: 0 },
      mouth: 0,
      mouthDir: 0.04,
      emails,
      ghosts,
      tick: 0,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = initState();
    stateRef.current = state;
    setEmailsLeft(EMAIL_COUNT);

    const keyHandler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s || !s.running) return;
      const dirs: Record<string, { dx: number; dy: number }> = {
        ArrowUp: { dx: 0, dy: -1 },
        w: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        s: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        a: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
        d: { dx: 1, dy: 0 },
      };
      if (dirs[e.key]) {
        e.preventDefault();
        s.nextDir = dirs[e.key];
      }
    };
    window.addEventListener("keydown", keyHandler);

    const PACMAN_SPEED = 0.06;

    const chooseGhostDir = (g: Ghost) => {
      const dirs = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
      ].filter((d) => canMove(g.targetX + d.dx, g.targetY + d.dy));

      const nonReverse = dirs.filter(
        (d) => !(d.dx === -g.dir.dx && d.dy === -g.dir.dy),
      );
      const options = nonReverse.length > 0 ? nonReverse : dirs;

      if (options.length === 0) return { dx: 0, dy: 0 };

      const s = stateRef.current!;
      if (Math.random() < 0.4) {
        let best = options[0];
        let bestDist = Infinity;
        for (const d of options) {
          const nx = g.targetX + d.dx;
          const ny = g.targetY + d.dy;
          const dist = Math.abs(nx - s.px) + Math.abs(ny - s.py);
          if (dist < bestDist) {
            bestDist = dist;
            best = d;
          }
        }
        return best;
      }

      return options[Math.floor(Math.random() * options.length)];
    };

    const loop = () => {
      const s = stateRef.current;
      if (!s || !s.running) return;
      s.tick++;

      // --- PACMAN LOGIC ---
      if (s.progress >= 1) {
        s.px = s.targetX;
        s.py = s.targetY;
        if (canMove(s.px + s.nextDir.dx, s.py + s.nextDir.dy))
          s.currentDir = { ...s.nextDir };
        if (canMove(s.px + s.currentDir.dx, s.py + s.currentDir.dy)) {
          s.targetX = s.px + s.currentDir.dx;
          s.targetY = s.py + s.currentDir.dy;
          s.progress = 0;
        }
      } else s.progress = Math.min(1, s.progress + PACMAN_SPEED);

      const pacScreenX =
        (s.px + (s.targetX - s.px) * s.progress) * CELL + CELL / 2;
      const pacScreenY =
        (s.py + (s.targetY - s.py) * s.progress) * CELL + CELL / 2;

      s.mouth += s.mouthDir;
      if (s.mouth > 0.3 || s.mouth < 0) s.mouthDir *= -1;

      const cpx = Math.round(s.px + (s.targetX - s.px) * s.progress);
      const cpy = Math.round(s.py + (s.targetY - s.py) * s.progress);
      for (const em of s.emails) {
        if (!em.eaten && cpx === em.x && cpy === em.y) {
          em.eaten = true;
          const left = s.emails.filter((e) => !e.eaten).length;
          setEmailsLeft(left);
          if (left === 0) {
            s.running = false;
            onWin();
            return;
          }
        }
      }

      // --- GHOSTS ---
      for (const g of s.ghosts) {
        if (g.progress >= 1) {
          g.x = g.targetX;
          g.y = g.targetY;
          const newDir = chooseGhostDir(g);
          g.dir = newDir;
          if (canMove(g.x + newDir.dx, g.y + newDir.dy)) {
            g.targetX = g.x + newDir.dx;
            g.targetY = g.y + newDir.dy;
            g.progress = 0;
          }
        } else g.progress = Math.min(1, g.progress + g.speed);

        const gsx = (g.x + (g.targetX - g.x) * g.progress) * CELL + CELL / 2;
        const gsy = (g.y + (g.targetY - g.y) * g.progress) * CELL + CELL / 2;

        if (
          Math.abs(pacScreenX - gsx) < CELL * 0.6 &&
          Math.abs(pacScreenY - gsy) < CELL * 0.6
        ) {
          s.running = false;
          onLose();
          return;
        }
      }

      // --- DRAW ---
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (MAZE[r][c] === 1) {
            ctx.fillStyle = "#1a3a6e";
            ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
            ctx.strokeStyle = "#2a5aae";
            ctx.lineWidth = 1;
            ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
          }

      for (const em of s.emails) {
        if (!em.eaten) {
          const ex = em.x * CELL + CELL / 2;
          const ey = em.y * CELL + CELL / 2;
          ctx.fillStyle = "#fffbe6";
          ctx.fillRect(ex - 7, ey - 4, 14, 10);
          ctx.strokeStyle = "#c9a84c";
          ctx.strokeRect(ex - 7, ey - 4, 14, 10);
          ctx.beginPath();
          ctx.moveTo(ex - 7, ey - 4);
          ctx.lineTo(ex, ey + 2);
          ctx.lineTo(ex + 7, ey - 4);
          ctx.stroke();
        }
      }

      for (const g of s.ghosts) {
        const gx = (g.x + (g.targetX - g.x) * g.progress) * CELL + CELL / 2;
        const gy = (g.y + (g.targetY - g.y) * g.progress) * CELL + CELL / 2;
        const r = CELL / 2 - 2;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(gx, gy - 2, r, Math.PI, 0);
        ctx.lineTo(gx + r, gy + r);
        const wave = Math.sin(s.tick * 0.15) * 2;
        for (let i = 0; i < 4; i++) {
          const wx = gx + r - ((r * 2) / 4) * (i + 0.5);
          ctx.quadraticCurveTo(
            wx + 2,
            gy + r + wave * (i % 2 === 0 ? 1 : -1),
            wx - 2,
            gy + r,
          );
        }
        ctx.lineTo(gx - r, gy + r);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.ellipse(gx - 3, gy - 3, 3, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(gx + 3, gy - 3, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        const angle = Math.atan2(pacScreenY - gy, pacScreenX - gx);
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(
          gx - 3 + Math.cos(angle) * 1.5,
          gy - 3 + Math.sin(angle) * 1.5,
          1.5,
          0,
          Math.PI * 2,
        );
        ctx.arc(
          gx + 3 + Math.cos(angle) * 1.5,
          gy - 3 + Math.sin(angle) * 1.5,
          1.5,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(g.label, gx, gy + r + 10);
      }

      const pacAngle = Math.atan2(s.currentDir.dy, s.currentDir.dx);
      ctx.fillStyle = "#f7d000";
      ctx.beginPath();
      ctx.arc(
        pacScreenX,
        pacScreenY,
        CELL / 2 - 2,
        pacAngle + s.mouth * Math.PI,
        pacAngle + (2 - s.mouth) * Math.PI,
      );
      ctx.lineTo(pacScreenX, pacScreenY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(
        pacScreenX + Math.cos(pacAngle - Math.PI / 4) * 4,
        pacScreenY + Math.sin(pacAngle - Math.PI / 4) * 4,
        2,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => {
      if (stateRef.current) stateRef.current.running = false;
      window.removeEventListener("keydown", keyHandler);
    };
  }, [initState, onWin, onLose]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", userSelect: "none" }}>
      {/* Info / Emails */}
      <div
        className="flex justify-between w-full px-2 py-1"
        style={{ background: "#0a0a1e" }}
      >
        <span
          style={{
            color: "#f7d000",
            fontFamily: "var(--font-body)",
            fontSize: 16,
          }}
        >
          Emails: {emailsLeft}
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        style={{ display: "block", imageRendering: "pixelated" }}
      />

      {/* Status Bar */}
      <div
        style={{
          background: "#000080",
          color: "#fff",
          padding: "2px 6px",
          fontSize: 12,
        }}
      >
        Avoid the 6 coworkers!
      </div>
    </div>
  );
};
