import React, { useRef, useEffect, useState } from "react";

const COLS = 20;
const ROWS = 15;
const CELL = 22;
const TIMER_SECONDS = 60;

// Row index from the top (0 = very top, ROWS-1 = bottom).
// Overlay fires when any block reaches this row — i.e. stack is (ROWS - DANGER_ROW) tall.
const DANGER_ROW = 5; // triggers when 10 of 15 rows are stacked

const SHAPES = [
  [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ], // I: 2×4 slab
  [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ], // O: 3×3 square
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ], // T: 3×3 cross
  [
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 1],
  ], // L: 3×3 chunky L
  [
    [0, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
  ], // J: 3×3 chunky J
  [[1, 1, 1, 1]], // I: 1×4 bar
];

const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

const PRIORITIES = ["CRIT", "HIGH", "MED", "LOW"];
const COLORS = ["#ff3333", "#fb5607", "#ffbe0b", "#22c55e"];
const HIGHLIGHT_COLORS = ["#ff9999", "#fdb080", "#ffe580", "#86efac"];
const SHADOW_COLORS = ["#7a0000", "#7d2b03", "#806000", "#14532d"];

interface TetrisGameProps {
  onTopReached: () => void;
  onCleared: () => void;
}

export const TetrisGame: React.FC<TetrisGameProps> = ({
  onTopReached,
  onCleared,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const canvasScale = isMobile
    ? Math.min(1, (window.innerWidth - 48) / CANVAS_W)
    : 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [flashMsg, setFlashMsg] = useState<string | null>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ctrlRef = useRef<{
    move: (dir: number) => void;
    rotate: () => void;
    drop: () => void;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid: (number | null)[][] = Array.from({ length: ROWS }, () =>
      Array(COLS).fill(null),
    );
    let currentPiece: {
      shape: number[][];
      colorIdx: number;
      label: string;
      x: number;
      y: number;
    } | null = null;
    let running = true;
    let dropCounter = 0;
    let lastTime = 0;
    let startTime = performance.now();
    let piecesPlaced = 0;

    function flash(msg: string) {
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
      setFlashMsg(msg);
      flashTimeout.current = setTimeout(() => setFlashMsg(null), 1300);
    }

    function newPiece() {
      const shapeIdx = Math.floor(Math.random() * SHAPES.length);
      const priorityIdx = Math.floor(Math.random() * PRIORITIES.length);
      currentPiece = {
        shape: SHAPES[shapeIdx],
        colorIdx: priorityIdx,
        label: PRIORITIES[priorityIdx],
        x: Math.floor(COLS / 2) - 1,
        y: 0,
      };
      if (collides(currentPiece)) {
        running = false;
        onTopReached();
      }
    }

    function collides(piece: typeof currentPiece) {
      if (!piece) return false;
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            const nx = piece.x + c;
            const ny = piece.y + r;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (ny >= 0 && grid[ny][nx] !== null) return true;
          }
        }
      }
      return false;
    }

    function merge() {
      if (!currentPiece) return;
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c]) {
            const ny = currentPiece.y + r;
            const nx = currentPiece.x + c;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
              grid[ny][nx] = currentPiece.colorIdx;
            }
          }
        }
      }
      piecesPlaced++;
      let linesCleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every((c) => c !== null)) {
          grid.splice(r, 1);
          grid.unshift(Array(COLS).fill(null));
          linesCleared++;
          r++;
        }
      }
      if (linesCleared > 1) {
        flash("Reassigned to the whole team!");
      } else if (linesCleared === 1) {
        flash("Pawned off!");
      }
    }

    function drop() {
      if (!currentPiece) return;
      currentPiece.y++;
      if (collides(currentPiece)) {
        currentPiece.y--;
        merge();
        newPiece();
      }
    }

    function move(dir: number) {
      if (!currentPiece) return;
      currentPiece.x += dir;
      if (collides(currentPiece)) currentPiece.x -= dir;
    }

    function rotate() {
      if (!currentPiece) return;
      const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece!.shape.map((row) => row[i]).reverse(),
      );
      const old = currentPiece.shape;
      currentPiece.shape = rotated;
      if (collides(currentPiece)) currentPiece.shape = old;
    }

    function drawBlock(px: number, py: number, colorIdx: number) {
      const s = CELL - 1;
      ctx.fillStyle = COLORS[colorIdx];
      ctx.fillRect(px, py, s, s);
      ctx.fillStyle = HIGHLIGHT_COLORS[colorIdx];
      ctx.fillRect(px, py, s, 3);
      ctx.fillRect(px, py, 3, s);
      ctx.fillStyle = SHADOW_COLORS[colorIdx];
      ctx.fillRect(px, py + s - 3, s, 3);
      ctx.fillRect(px + s - 3, py, 3, s);
    }

    function draw() {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c] !== null) {
            drawBlock(c * CELL, r * CELL, grid[r][c]!);
          }
        }
      }

      if (currentPiece) {
        for (let r = 0; r < currentPiece.shape.length; r++) {
          for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
              drawBlock(
                (currentPiece.x + c) * CELL,
                (currentPiece.y + r) * CELL,
                currentPiece.colorIdx,
              );
            }
          }
        }
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px monospace";
        ctx.fillText(
          currentPiece.label,
          (currentPiece.x + 0.15) * CELL,
          (currentPiece.y + 1) * CELL - 3,
        );
      }

      // Danger overlay: blocks are stacking into the top zone
      let isDanger = false;
      for (let c = 0; c < COLS; c++) {
        if (grid[DANGER_ROW][c] !== null) {
          isDanger = true;
          break;
        }
      }
      if (isDanger) {
        ctx.fillStyle = "rgba(255, 51, 51, 0.12)";
        ctx.fillRect(0, 0, COLS * CELL, DANGER_ROW * CELL);
        ctx.fillStyle = "rgba(255, 51, 51, 0.85)";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
          "all yours now...",
          (COLS * CELL) / 2,
          DANGER_ROW * CELL - 6,
        );
        ctx.textAlign = "left";
      }

      ctx.strokeStyle = "#1a1a3e";
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL);
        ctx.lineTo(COLS * CELL, r * CELL);
        ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL, 0);
        ctx.lineTo(c * CELL, ROWS * CELL);
        ctx.stroke();
      }
    }

    function gameLoop(time: number) {
      if (!running) return;
      const delta = time - lastTime;
      lastTime = time;
      dropCounter += delta;

      const elapsed = (time - startTime) / 1000;
      const remaining = Math.max(0, TIMER_SECONDS - elapsed);
      setTimeLeft(Math.ceil(remaining));
      if (remaining <= 0) {
        running = false;
        onCleared();
        return;
      }

      const dropInterval = Math.max(160, 420 - piecesPlaced * 12);
      if (dropCounter > dropInterval) {
        drop();
        dropCounter = 0;
      }
      draw();
      requestAnimationFrame(gameLoop);
    }

    const keyHandler = (e: KeyboardEvent) => {
      if (!running) return;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") move(-1);
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") move(1);
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") drop();
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") rotate();
    };

    window.addEventListener("keydown", keyHandler);
    ctrlRef.current = { move, rotate, drop };
    newPiece();
    startTime = performance.now();
    requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      ctrlRef.current = null;
      window.removeEventListener("keydown", keyHandler);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, [onTopReached, onCleared]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[12px] font-semibold text-center text-card-foreground leading-snug w-full">
        Clear rows to reassign Jiras &mdash; let them stack and{" "}
        <span className="text-destructive font-bold">
          they&apos;re all yours
        </span>
      </p>
      <div className="flex justify-between w-full px-1">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <span style={{ color: "#ff3333" }}>■</span> Crit &nbsp;
          <span style={{ color: "#fb5607" }}>■</span> High &nbsp;
          <span style={{ color: "#ffbe0b" }}>■</span> Med &nbsp;
          <span style={{ color: "#22c55e" }}>■</span> Low
        </span>
        <span
          className={`text-xs font-bold ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-card-foreground"}`}
        >
          {timeLeft}s
        </span>
      </div>
      <div
        className="relative"
        style={{
          width: CANVAS_W * canvasScale,
          height: CANVAS_H * canvasScale,
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="border-2 border-border"
          style={{
            transform: `scale(${canvasScale})`,
            transformOrigin: "top left",
            display: "block",
          }}
        />
        {flashMsg && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
            <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">
              {flashMsg}
            </span>
          </div>
        )}
      </div>
      {isMobile ? (
        <div className="flex gap-2 justify-center mt-1">
          <button
            onPointerDown={() => ctrlRef.current?.move(-1)}
            className="w-12 h-12 flex items-center justify-center text-lg font-bold bg-card/80 border-2 border-border rounded select-none"
          >
            ←
          </button>
          <button
            onPointerDown={() => ctrlRef.current?.rotate()}
            className="w-12 h-12 flex items-center justify-center text-sm font-bold bg-card/80 border-2 border-border rounded select-none"
          >
            ↺ rot
          </button>
          <button
            onPointerDown={() => ctrlRef.current?.drop()}
            className="w-12 h-12 flex items-center justify-center text-lg font-bold bg-card/80 border-2 border-border rounded select-none"
          >
            ↓
          </button>
          <button
            onPointerDown={() => ctrlRef.current?.move(1)}
            className="w-12 h-12 flex items-center justify-center text-lg font-bold bg-card/80 border-2 border-border rounded select-none"
          >
            →
          </button>
        </div>
      ) : (
        <p className="text-[10px] text-center text-card-foreground/70">
          ↑ rotate &nbsp;·&nbsp; ← → move &nbsp;·&nbsp; ↓ drop
        </p>
      )}
    </div>
  );
};
