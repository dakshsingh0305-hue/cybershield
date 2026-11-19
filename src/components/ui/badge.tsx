import type { ReactNode } from "react";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "accent" | "aqua" | "violet" | "success" | "warning" | "danger" | "info";

const tones: Record<BadgeTone, string> = {
  neutral: "border-white/10 bg-white/[0.04] text-mist",
  accent: "border-signal/25 bg-signal/10 text-[#a9c7ff]",
  aqua: "border-aqua/25 bg-aqua/[0.08] text-[#8df4eb]",
  violet: "border-iris/25 bg-iris/[0.08] text-[#c3b2ff]",
  success: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300",
  warning: "border-amber-400/25 bg-amber-400/[0.08] text-amber-300",
  danger: "border-rose-400/25 bg-rose-400/[0.08] text-rose-300",
  info: "border-sky-400/25 bg-sky-400/[0.08] text-sky-300",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
  icon,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        tones[tone],
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
}

export const riskTone: Record<RiskLevel, BadgeTone> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export const riskText: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Suspicious",
  high: "High risk",
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <Badge tone={riskTone[level]} dot className={className}>
      {riskText[level]}
    </Badge>
  );
}
