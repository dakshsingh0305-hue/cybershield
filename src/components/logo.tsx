import { cn } from "@/lib/utils";

interface ShieldMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const markSizes = {
  sm: "h-8 w-8 rounded-[9px]",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-[14px]",
};

const innerSizes = {
  sm: "h-[29px] w-[29px] rounded-[8px]",
  md: "h-[37px] w-[37px] rounded-[11px]",
  lg: "h-[45px] w-[45px] rounded-[13px]",
};

export function ShieldMark({ className, size = "md" }: ShieldMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 bg-gradient-to-br from-signal via-aqua to-iris p-[1.5px] shadow-[0_0_28px_-8px_rgba(46,230,214,0.55)]",
        markSizes[size],
        className,
      )}
      aria-hidden="true"
    >
      <span className={cn("flex items-center justify-center bg-[#071120]", innerSizes[size])}>
        <svg viewBox="0 0 24 24" fill="none" className="h-[62%] w-[62%]">
          <path
            d="M12 2.8 20 6v5.6c0 4.9-3.3 8.4-8 9.9-4.7-1.5-8-5-8-9.9V6l8-3.2Z"
            fill="rgba(46,230,214,0.09)"
            stroke="#2ee6d6"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="m8.6 12.2 2.3 2.3 4.6-4.8"
            stroke="#f2fdff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showTagline?: boolean;
}

export function Logo({ className, size = "md", href = "/", showTagline = false }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ShieldMark size={size} />
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display font-semibold uppercase leading-none tracking-[0.14em] text-frost",
            size === "sm" ? "text-[13px]" : size === "lg" ? "text-lg" : "text-[15px]",
          )}
        >
          Cyber<span className="text-aqua">Shield</span>
        </span>
        {showTagline ? (
          <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-dim">
            Digital safety, simplified
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <a href={href} aria-label="CyberShield home" className="inline-flex rounded-lg">
      {content}
    </a>
  );
}
