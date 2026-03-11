import React, { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface DraggableWindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  width?: number;
  height?: number;
  initialX?: number;
  initialY?: number;
  active?: boolean;
  closable?: boolean;
  bodyStyle?: React.CSSProperties;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
  title,
  icon,
  children,
  onClose,
  width = 400,
  height,
  initialX,
  initialY,
  active = true,
  closable = true,
  bodyStyle,
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveWidth = isMobile
    ? Math.min(width, window.innerWidth - 16)
    : width;

  const [pos, setPos] = useState({
    x: isMobile
      ? Math.max(8, (window.innerWidth - effectiveWidth) / 2)
      : (initialX ??
        Math.max(
          50,
          (window.innerWidth - width) / 2 + Math.random() * 60 - 30,
        )),
    y: isMobile
      ? 155
      : (initialY ??
        Math.max(30, window.innerHeight / 2 - 200 + Math.random() * 60 - 30)),
  });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      dragging.current = true;
      offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

      const onMove = (ev: MouseEvent) => {
        if (dragging.current) {
          setPos({
            x: ev.clientX - offset.current.x,
            y: ev.clientY - offset.current.y,
          });
        }
      };
      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pos, isMobile],
  );

  return (
    <div
      className="xp-window fixed z-40"
      style={{ left: pos.x, top: pos.y, width: effectiveWidth }}
    >
      <div
        className={active ? "xp-title-bar" : "xp-title-bar-inactive"}
        onMouseDown={onMouseDown}
        style={{ cursor: isMobile ? "default" : "grab" }}
      >
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs drop-shadow-sm">{title}</span>
        </div>
        <div className="flex gap-0.5">
          {closable && (
            <button className="xp-close-btn" onClick={onClose}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      <div
        className="xp-window-body"
        style={{ ...(height ? { height } : {}), ...bodyStyle }}
      >
        {children}
      </div>
    </div>
  );
};
