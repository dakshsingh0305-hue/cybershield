"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GaugeTone = "awareness" | "low" | "medium" | "high";

const gradients: Record<GaugeTone, [string, string, string]> = {
  awareness: ["#4d8dff", "#2ee6d6", "#9a7dff"],
  low: ["#34d399", "#2ee6d6", "#8df4c8"],
  medium: ["#fbbf24", "#f59e0b", "#ffd27d"],
  high: ["#fb7185", "#f43f5e", "#ff9eb0"],
};

const glow: Record<GaugeTone, string> = {
  awareness: "rgba(46, 230, 214, 0.35)",
  low: "rgba(52, 211, 153, 0.35)",
  medium: "rgba(251, 191, 36, 0.35)",
  high: "rgba(251, 113, 133, 0.38)",
};

export function RadialScore({
  value,
  tone = "awareness",
  size = 176,
  strokeWidth = 8,
  children,
  className,
  ariaLabel,
}: {
  value: number;
  tone?: GaugeTone;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const [start, mid, end] = gradients[tone];

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90 overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="8" y1="8" x2="112" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={start} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth={strokeWidth} />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 5px ${glow[tone]})` }}
        />
        {Array.from({ length: 60 }).map((_, index) => {
          const angle = (index / 60) * 360;
          const active = index / 60 <= clamped / 100;
          return (
            <rect
              key={index}
              x="59.6"
              y="3.5"
              width="0.8"
              height="3.5"
              rx="0.4"
              fill={active ? mid : "rgba(255,255,255,0.09)"}
              opacity={active ? 0.7 : 0.5}
              transform={`rotate(${angle} 60 60)`}
            />
          );
        })}
      </svg>
      <div className="absolute inset-[17%] flex flex-col items-center justify-center rounded-full border border-white/[0.055] bg-[#07101d]/90 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        {children}
      </div>
    </div>
  );
}
