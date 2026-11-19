"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { Activity, BookOpen, FlaskConical, ScanSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const stats = [
  { label: "Simulated URL checks", value: 1248, suffix: "", icon: ScanSearch, accent: "text-aqua" },
  { label: "Phishing simulations", value: 6, suffix: "", icon: FlaskConical, accent: "text-[#c3b2ff]" },
  { label: "Average lab score", value: 92, suffix: "%", icon: Activity, accent: "text-emerald-300" },
  { label: "Micro-lessons", value: 5, suffix: "", icon: BookOpen, accent: "text-amber-300" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const shown = reduceMotion ? value : display;

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat("en-US").format(shown)}
      {suffix}
    </span>
  );
}

export function DemoStats() {
  return (
    <section id="demo-data" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-shell">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Demo snapshot"
              align="left"
              title={
                <>
                  A preview of the
                  <br /> <span className="text-gradient-soft">dashboard experience.</span>
                </>
              }
              description="These figures illustrate what the platform looks like once you have activity. Your own dashboard is built only from actions you take and is stored on this device."
            />
            <div className="mt-6 inline-flex items-start gap-2.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3.5 py-2.5 text-[11px] leading-relaxed text-amber-200/80">
              <span className="mt-0.5 shrink-0 rounded border border-amber-400/25 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em]">
                Demo
              </span>
              Illustrative sample data. Not live platform metrics or real user results.
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel overflow-hidden p-2">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.055]">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-[#08111f]/95 p-5 sm:p-7">
                    <stat.icon className={`h-4 w-4 ${stat.accent}`} aria-hidden="true" />
                    <p className="mt-6 text-3xl font-semibold tracking-tight text-frost sm:text-4xl">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-dim">{stat.label}</p>
                    <span className="mt-3 inline-block rounded border border-white/[0.07] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-dim">
                      Demo
                    </span>
                  </div>
                ))}
              </div>
              <p className="px-4 py-3 text-center text-[10px] text-dim">
                Counts are seeded for presentation purposes · your real progress begins at zero
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
