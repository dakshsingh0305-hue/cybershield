"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  EyeOff,
  Fingerprint,
  GraduationCap,
  LockKeyhole,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { RadialScore } from "@/components/ui/radial-score";
import { buttonStyles } from "@/components/ui/button";
import { RiskBadge } from "@/components/ui/badge";

const demoUrl = "http://cloudvault-verify.secure-login.xyz/account/update";

const indicators = [
  { label: "Unencrypted connection (HTTP)", severity: "medium" as const },
  { label: "Deep subdomain chain", severity: "medium" as const },
  { label: ".xyz domain extension", severity: "medium" as const },
  { label: "Account-related keywords", severity: "low" as const },
];

const trustPoints = [
  { icon: EyeOff, text: "Links are never visited" },
  { icon: Fingerprint, text: "Heuristics, explained" },
  { icon: LockKeyhole, text: "Progress stays local" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: x * 5, y: y * -4 });
  }

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.75,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        };

  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28 lg:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[62rem] -translate-x-1/2 rounded-full bg-signal/[0.11] blur-[130px]" />
        <div className="absolute left-[62%] top-24 h-[26rem] w-[26rem] rounded-full bg-aqua/[0.07] blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />
      </div>

      <div className="container-shell grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div className="min-w-0">
          <motion.div {...fadeUp(0)}>
            <span className="eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-aqua" />
              </span>
              Cybersecurity awareness, built for real life
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.035em] text-frost sm:text-6xl lg:text-[4.35rem]"
          >
            Your digital world.
            <br />
            <span className="text-gradient">Protected.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist sm:text-base"
          >
            A hands-on security studio for everyday people. Inspect suspicious links without opening them,
            practise phishing detection in a safe simulation, and build the habits that keep threats out.
          </motion.p>

          <motion.div {...fadeUp(0.24)}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/dashboard" className={buttonStyles({ size: "lg", className: "group" })}>
              Launch security dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/scanner"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              <ScanSearch className="h-4 w-4 text-aqua" aria-hidden="true" />
              Try the URL scanner
            </Link>
          </motion.div>

          <motion.ul {...fadeUp(0.32)}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-3"
          >
            {trustPoints.map((point) => (
              <li key={point.text} className="flex items-center gap-2 text-[12px] font-medium text-dim">
                <point.icon className="h-3.5 w-3.5 text-aqua/80" aria-hidden="true" />
                {point.text}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full min-w-0 max-w-[500px] lg:max-w-none"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="relative h-[420px] w-[420px] max-w-full rounded-full border border-aqua/[0.08]">
              <div className="absolute inset-[16%] rounded-full border border-signal/[0.09]" />
              <div className="absolute inset-[32%] rounded-full border border-iris/[0.1]" />
              <div className="absolute inset-0 rounded-full border border-white/[0.035]" />
              <div className="animate-radar absolute inset-0 rounded-full [background:conic-gradient(from_0deg,rgba(46,230,214,0.18),transparent_22%)] [mask-image:radial-gradient(circle,transparent_28%,black_29%)]" />
              <div className="absolute left-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-aqua/60 shadow-[0_0_12px_2px_rgba(46,230,214,0.35)]" />
              <div className="absolute right-[22%] top-[62%] h-1 w-1 rounded-full bg-signal/80" />
              <div className="absolute bottom-[18%] left-[38%] h-1.5 w-1.5 rounded-full bg-iris/70" />
            </div>
          </div>

          <div className="mb-3 hidden items-center justify-between gap-2 sm:flex">
            <div className="animate-float flex items-center gap-2 rounded-xl border border-white/10 bg-[#091322]/90 px-3 py-2 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-400/10 text-emerald-300">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-semibold text-[#dbe7f8]">Stored on this device</span>
            </div>
            <div
              className="animate-float flex items-center gap-2 rounded-xl border border-white/10 bg-[#091322]/90 px-3 py-2 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              style={{ animationDelay: "-3.5s" }}
            >
              <span className="grid h-6 w-6 place-items-center rounded-md bg-iris/10 text-[#c3b2ff]">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-semibold text-[#dbe7f8]">5 guided lessons</span>
            </div>
          </div>

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            className="relative transition-transform duration-300 ease-out"
            style={{ transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
          >
            <div className="panel relative overflow-hidden rounded-3xl border-white/[0.1] p-4 shadow-[0_50px_120px_-45px_rgba(0,0,0,0.95)] sm:p-5">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-aqua/70 to-transparent" />
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg border border-aqua/20 bg-aqua/[0.07]">
                    <ScanSearch className="h-3.5 w-3.5 text-aqua" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-frost">URL analysis</p>
                    <p className="text-[10px] text-dim">Local heuristic preview</p>
                  </div>
                </div>
                <span className="rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-300">
                  Demo
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/25 px-3 py-2.5">
                <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-dim" aria-hidden="true" />
                <span className="min-w-0 truncate font-mono text-[11px] text-[#c5d9f5]">{demoUrl}</span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <RadialScore
                  value={68}
                  tone="high"
                  size={118}
                  strokeWidth={7}
                  ariaLabel="Illustrative demo risk score: 68 out of 100, high risk"
                >
                  <span className="text-[1.6rem] font-semibold leading-none text-frost">68</span>
                  <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-dim">Risk score</span>
                </RadialScore>
                <div className="min-w-0 flex-1">
                  <RiskBadge level="high" />
                  <p className="mt-2 text-[12px] font-medium text-frost">4 heuristic signals found</p>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-dim">
                    Heuristics can be wrong in both directions. Always verify through an independent channel.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {indicators.map((indicator, index) => (
                  <motion.div
                    key={indicator.label}
                    initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 + index * 0.08, duration: 0.4 }}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.055] bg-white/[0.025] px-2.5 py-2"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={
                          indicator.severity === "medium"
                            ? "h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
                            : "h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"
                        }
                      />
                      <span className="truncate text-[10.5px] font-medium text-[#b8c9e4]">{indicator.label}</span>
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-dim">signal</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3.5">
                <span className="flex items-center gap-1.5 text-[9.5px] text-dim">
                  <EyeOff className="h-3 w-3 text-aqua/70" aria-hidden="true" />
                  URL never visited · no network request
                </span>
                <Link
                  href={`/scanner?url=${encodeURIComponent(demoUrl)}`}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-aqua hover:text-[#8df4eb]"
                >
                  Open in scanner
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>

          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-dim">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Illustrative preview with sample data — not a live scan of a real website.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

