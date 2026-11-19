import { cn } from "@/lib/utils";

export type ProgressTone = "signal" | "aqua" | "violet" | "success" | "warning" | "danger";

const toneClasses: Record<ProgressTone, string> = {
  signal: "bg-gradient-to-r from-signal to-[#7cc4ff]",
  aqua: "bg-gradient-to-r from-aqua to-[#7eefff]",
  violet: "bg-gradient-to-r from-iris to-[#c3b2ff]",
  success: "bg-gradient-to-r from-emerald-400 to-[#8df4c8]",
  warning: "bg-gradient-to-r from-amber-400 to-[#ffe08a]",
  danger: "bg-gradient-to-r from-rose-400 to-[#ff9eb0]",
};

export function ProgressBar({
  value,
  tone = "aqua",
  className,
  label,
  size = "md",
}: {
  value: number;
  tone?: ProgressTone;
  className?: string;
  label?: string;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
      className={cn("w-full overflow-hidden rounded-full bg-white/[0.06]", size === "sm" ? "h-1.5" : "h-2", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", toneClasses[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
