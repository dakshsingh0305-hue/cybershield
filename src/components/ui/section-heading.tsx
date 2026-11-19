import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <span className="eyebrow mb-4">{eyebrow}</span> : null}
      <h2 className="text-3xl font-semibold leading-[1.12] text-frost sm:text-4xl lg:text-[2.65rem]">{title}</h2>
      {description ? (
        <p className={cn("mt-4 text-[15px] leading-relaxed text-mist", align === "center" && "mx-auto max-w-xl")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
