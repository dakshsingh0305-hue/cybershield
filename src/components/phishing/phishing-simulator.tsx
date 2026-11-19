"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock,
  FileText,
  FlaskConical,
  Info,
  Lightbulb,
  LockKeyhole,
  Mail,
  MessageCircle,
  MessageSquareText,
  Paperclip,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { RadialScore } from "@/components/ui/radial-score";
import { getLesson } from "@/lib/data/lessons";
import { getNextScenario, phishingChannelLabels, phishingScenarios } from "@/lib/data/phishing";
import { useProgress } from "@/lib/progress-store";
import type { MessageSegment, PhishingHotspot, PhishingScenario } from "@/lib/types";
import { cn } from "@/lib/utils";

type Verdict = "phishing" | "legit";

interface Breakdown {
  verdictPoints: number;
  recallPoints: number;
  precisionPoints: number;
  score: number;
  found: number;
  totalSuspicious: number;
  falsePositives: number;
  verdictCorrect: boolean;
}

const channelIcons = {
  email: Mail,
  sms: MessageSquareText,
  dm: MessageCircle,
};

const difficultyTone = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
} as const;

const reviewMeta = {
  "true-positive": { label: "Correctly flagged", tone: "success" as const, icon: CheckCircle2 },
  "false-negative": { label: "Missed signal", tone: "warning" as const, icon: TriangleAlert },
  "false-positive": { label: "False alarm", tone: "danger" as const, icon: XCircle },
  "true-negative": { label: "Correctly left alone", tone: "neutral" as const, icon: CheckCircle2 },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function buildBlocks(body: MessageSegment[]): MessageSegment[][] {
  const blocks: MessageSegment[][] = [];
  let current: MessageSegment[] = [];
  for (const segment of body) {
    if (segment.type === "break") {
      if (current.length > 0) blocks.push(current);
      current = [];
    } else {
      current.push(segment);
    }
  }
  if (current.length > 0) blocks.push(current);
  return blocks;
}

function HotspotButton({
  spot,
  selected,
  submitted,
  onToggle,
  className,
}: {
  spot: PhishingHotspot;
  selected: boolean;
  submitted: boolean;
  onToggle: (id: string) => void;
  className?: string;
}) {
  const stateClass = submitted
    ? spot.suspicious
      ? selected
        ? "bg-emerald-400/[0.16] text-emerald-200 decoration-emerald-300/50"
        : "bg-amber-400/[0.1] text-amber-200 decoration-amber-300/50"
      : selected
        ? "bg-rose-400/[0.16] text-rose-200 decoration-rose-300/50"
        : "text-[#a9bdd6] decoration-white/10"
    : selected
      ? "bg-aqua/15 text-[#a8f7ef] decoration-aqua/60"
      : "decoration-[#5b7699] hover:bg-white/[0.05] hover:text-frost";

  return (
    <button
      type="button"
      onClick={() => onToggle(spot.id)}
      disabled={submitted}
      aria-pressed={selected}
      aria-label={`${selected ? "Unflag" : "Flag"} “${spot.text}” as suspicious`}
      className={cn(
        "inline cursor-pointer rounded-[3px] px-0.5 text-left underline decoration-dashed underline-offset-[3px] transition-colors disabled:cursor-default",
        stateClass,
        className,
      )}
      style={{ font: "inherit" }}
    >
      {spot.text}
    </button>
  );
}

export function PhishingSimulator({ scenario }: { scenario: PhishingScenario }) {
  const { state, recordPhishing } = useProgress();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<Breakdown | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const hotspotMap = useMemo(() => new Map(scenario.hotspots.map((spot) => [spot.id, spot])), [scenario.hotspots]);
  const blocks = useMemo(() => buildBlocks(scenario.body), [scenario.body]);
  const attachmentSpot = hotspotMap.get("attachment");
  const channel = channelIcons[scenario.channel];
  const ChannelIcon = channel;
  const nextScenario = getNextScenario(scenario.id) ?? phishingScenarios[0];
  const relatedLesson = scenario.lessonSlug ? getLesson(scenario.lessonSlug) : undefined;
  const previousBest = state.phishingAttempts[scenario.id]?.score ?? null;

  function toggleSpot(id: string) {
    if (submitted) return;
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submitAnalysis() {
    if (!verdict || submitted) return;
    const suspiciousSpots = scenario.hotspots.filter((spot) => spot.suspicious);
    const totalSuspicious = suspiciousSpots.length;
    const found = suspiciousSpots.filter((spot) => selected.has(spot.id)).length;
    const falsePositives = [...selected].filter((id) => !hotspotMap.get(id)?.suspicious).length;
    const verdictCorrect = verdict === (scenario.isPhishing ? "phishing" : "legit");
    const verdictPoints = verdictCorrect ? 40 : 0;
    const recallPoints = totalSuspicious === 0 ? 40 : Math.round(40 * (found / totalSuspicious));
    const precisionPoints =
      totalSuspicious === 0
        ? Math.max(0, 20 - falsePositives * 8)
        : selected.size === 0
          ? 0
          : Math.round(20 * ((selected.size - falsePositives) / selected.size));
    let score = verdictPoints + recallPoints + precisionPoints;
    if (!verdictCorrect) score = Math.min(score, 55);

    const breakdown: Breakdown = {
      verdictPoints,
      recallPoints,
      precisionPoints,
      score,
      found,
      totalSuspicious,
      falsePositives,
      verdictCorrect,
    };

    setResult(breakdown);
    setSubmitted(true);
    recordPhishing(scenario.id, {
      verdictCorrect,
      score,
      found,
      total: totalSuspicious,
      completedAt: new Date().toISOString(),
    });
    window.setTimeout(() => resultHeadingRef.current?.focus({ preventScroll: true }), 120);
  }

  function reset() {
    setSelected(new Set());
    setVerdict(null);
    setSubmitted(false);
    setResult(null);
    topRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  const scoreTone = result ? (result.score >= 80 ? "low" : result.score >= 55 ? "medium" : "high") : "awareness";
  const best = state.phishingAttempts[scenario.id]?.score ?? previousBest;

  return (
    <div ref={topRef} className="mx-auto max-w-[1180px] scroll-mt-24">
      <Link
        href="/phishing"
        className="inline-flex items-center gap-1.5 rounded-lg text-[10.5px] font-medium text-dim transition-colors hover:text-frost"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to phishing lab
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">
            <span className="inline-flex items-center gap-1.5 text-[#b6a2f8]">
              <ChannelIcon className="h-3 w-3" /> {phishingChannelLabels[scenario.channel]}
            </span>
            <span className="text-[#3c4e6a]">/</span>
            <span>Simulation</span>
            <span className="text-[#3c4e6a]">/</span>
            <span>{scenario.difficulty}</span>
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug text-frost sm:text-2xl">{scenario.subject}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-dim">
            <span>
              From <span className="text-mist">{scenario.senderName}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" /> {scenario.receivedAt}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge tone="warning">
            <FlaskConical className="h-3 w-3" /> Fictional scenario
          </Badge>
          <Badge tone={difficultyTone[scenario.difficulty]}>{scenario.difficulty}</Badge>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-3.5 py-2.5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
        <p className="text-[10px] leading-relaxed text-amber-200/70">
          This is a made-up training message. Names and addresses are invented and no external link can be opened.
          Select every detail you find suspicious, then choose a verdict.
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px] lg:items-start">
        <div>
          <section className="panel overflow-hidden" aria-label="Fictional message">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-black/20 px-4 py-2.5">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-rose-400/50" />
                <span className="h-2 w-2 rounded-full bg-amber-400/50" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/50" />
              </div>
              <span className="flex items-center gap-1.5 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-dim">
                <LockKeyhole className="h-2.5 w-2.5" /> Training simulation · read only
              </span>
              <Badge tone="neutral" className="hidden px-1.5 py-0.5 text-[7.5px] sm:inline-flex">
                No links active
              </Badge>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-signal/70 via-aqua/60 to-iris/70 text-[11px] font-bold text-[#07111c]">
                    {initials(scenario.senderName)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-frost">{scenario.senderName}</p>
                    <p className="mt-0.5 flex items-center gap-1 break-all font-mono text-[9.5px] text-dim">
                      <AtSign className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                      {scenario.senderAddress}
                    </p>
                    {scenario.replyTo ? (
                      <p className="mt-1 text-[9px] text-dim">
                        Reply-to: <span className="font-mono text-[#c1a1ff]">{scenario.replyTo}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] text-dim">{scenario.receivedAt}</p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded border border-white/[0.07] bg-white/[0.02] px-1.5 py-0.5 text-[8px] text-dim">
                    <ChannelIcon className="h-2.5 w-2.5" />
                    {phishingChannelLabels[scenario.channel]}
                  </p>
                </div>
              </div>

              <h2 className="mt-5 border-t border-white/[0.06] pt-4 text-[15px] font-semibold leading-snug text-[#e8f0fb]">
                {scenario.subject}
              </h2>

              <div className="mt-3 space-y-3">
                {blocks.map((block, blockIndex) => (
                  <p key={blockIndex} className="text-[12.5px] leading-[1.9] text-[#c2d3e8]">
                    {block.map((segment, segmentIndex) => {
                      if (segment.type !== "hotspot") {
                        return segment.type === "text" ? <span key={segmentIndex}>{segment.text}</span> : null;
                      }
                      const spot = hotspotMap.get(segment.spotId);
                      if (!spot) return <span key={segmentIndex}>{segment.text}</span>;
                      return (
                        <HotspotButton
                          key={segmentIndex}
                          spot={spot}
                          selected={selected.has(spot.id)}
                          submitted={submitted}
                          onToggle={toggleSpot}
                        />
                      );
                    })}
                  </p>
                ))}
              </div>

              {scenario.attachment ? (
                <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/20 p-3">
                  <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-dim">
                    <Paperclip className="h-3 w-3" /> 1 attachment
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-mist">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    {attachmentSpot ? (
                      <HotspotButton
                        spot={attachmentSpot}
                        selected={selected.has(attachmentSpot.id)}
                        submitted={submitted}
                        onToggle={toggleSpot}
                        className="font-mono text-[10.5px]"
                      />
                    ) : (
                      <span className="font-mono text-[10.5px] text-mist">{scenario.attachment}</span>
                    )}
                    <span className="ml-auto text-[8.5px] text-dim">Not downloaded</span>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 rounded-xl border border-dashed border-white/[0.09] bg-white/[0.012] px-3.5 py-3">
                {!submitted ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-start gap-2 text-[9.5px] leading-relaxed text-dim">
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-aqua" aria-hidden="true" />
                      Click sender details, links, phrases or files that look suspicious. Some messages are legitimate.
                    </p>
                    <span className="shrink-0 rounded-md border border-aqua/20 bg-aqua/[0.05] px-2 py-1 text-[9px] font-medium text-[#8df4eb]">
                      {selected.size} flagged
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[9px] text-dim">
                    <span className="font-medium text-mist">Review colours:</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm bg-emerald-400/70" /> Correctly flagged
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm bg-amber-400/70" /> Missed signal
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm bg-rose-400/70" /> False alarm
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm bg-white/20" /> Benign detail
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {submitted && result ? (
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 space-y-4"
              aria-labelledby="simulation-report-heading"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <Badge tone={scenario.isPhishing ? "danger" : "success"} dot>
                    {scenario.isPhishing ? "This message was phishing" : "This message was legitimate"}
                  </Badge>
                  <h2 id="simulation-report-heading" className="mt-3 text-[13px] font-semibold text-frost">
                    Why
                  </h2>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-mist">{scenario.verdictExplanation}</p>
                </div>
                <div className="rounded-xl border border-aqua/15 bg-aqua/[0.035] p-4">
                  <Badge tone="aqua" dot>
                    If this were real
                  </Badge>
                  <h2 className="mt-3 text-[13px] font-semibold text-frost">Safest next action</h2>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-mist">{scenario.safeAction}</p>
                  {relatedLesson ? (
                    <Link
                      href={`/academy/${relatedLesson.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-aqua hover:text-[#8df4eb]"
                    >
                      Read: {relatedLesson.title}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="panel p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[13px] font-semibold text-frost">Signal-by-signal review</h2>
                    <p className="mt-0.5 text-[10px] text-dim">
                      Every highlight in this scenario, explained. Decoys are intentional.
                    </p>
                  </div>
                  <Badge tone="neutral">{scenario.hotspots.length} details</Badge>
                </div>
                <ul className="mt-4 space-y-2">
                  {scenario.hotspots.map((spot) => {
                    const picked = selected.has(spot.id);
                    const status = spot.suspicious
                      ? picked
                        ? "true-positive"
                        : "false-negative"
                      : picked
                        ? "false-positive"
                        : "true-negative";
                    const meta = reviewMeta[status];
                    const Icon = meta.icon;
                    return (
                      <li
                        key={spot.id}
                        className={cn(
                          "rounded-xl border p-3.5",
                          status === "true-positive"
                            ? "border-emerald-400/15 bg-emerald-400/[0.035]"
                            : status === "false-negative"
                              ? "border-amber-400/15 bg-amber-400/[0.03]"
                              : status === "false-positive"
                                ? "border-rose-400/15 bg-rose-400/[0.03]"
                                : "border-white/[0.06] bg-white/[0.015]",
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-2.5">
                            <span
                              className={cn(
                                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md",
                                status === "true-positive"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : status === "false-negative"
                                    ? "bg-amber-400/10 text-amber-300"
                                    : status === "false-positive"
                                      ? "bg-rose-400/10 text-rose-300"
                                      : "bg-white/[0.04] text-dim",
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="break-words font-mono text-[10px] text-[#c3d3e8]">{spot.text}</p>
                              <Badge tone={meta.tone} className="mt-1 px-1.5 py-0.5 text-[8px]">
                                {meta.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-[10.5px] leading-relaxed text-mist">{spot.explanation}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.section>
          ) : null}
        </div>

        <aside className={cn("space-y-4", !submitted && "lg:sticky lg:top-24")}>
          {!submitted ? (
            <>
              <section className="panel p-5" aria-labelledby="simulation-verdict-heading">
                <div className="flex items-center justify-between gap-2">
                  <h2 id="simulation-verdict-heading" className="text-[13px] font-semibold text-frost">
                    Your call
                  </h2>
                  <Badge tone="neutral">{selected.size} flagged</Badge>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-dim">
                  Choose what you believe this message is. Selecting clues and choosing a verdict are separate steps.
                </p>

                <div role="radiogroup" aria-label="Message verdict" className="mt-4 space-y-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={verdict === "phishing"}
                    onClick={() => setVerdict("phishing")}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                      verdict === "phishing"
                        ? "border-rose-400/30 bg-rose-400/[0.08] text-rose-200"
                        : "border-white/[0.07] bg-white/[0.02] text-mist hover:border-white/[0.14] hover:text-frost",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                        verdict === "phishing" ? "bg-rose-400/10 text-rose-300" : "bg-white/[0.03] text-dim",
                      )}
                    >
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="block text-[11.5px] font-medium">Looks like phishing</span>
                      <span className="block text-[9px] text-dim">Deceptive or malicious intent</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={verdict === "legit"}
                    onClick={() => setVerdict("legit")}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
                      verdict === "legit"
                        ? "border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200"
                        : "border-white/[0.07] bg-white/[0.02] text-mist hover:border-white/[0.14] hover:text-frost",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                        verdict === "legit" ? "bg-emerald-400/10 text-emerald-300" : "bg-white/[0.03] text-dim",
                      )}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="block text-[11.5px] font-medium">Looks legitimate</span>
                      <span className="block text-[9px] text-dim">Benign or expected message</span>
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={submitAnalysis}
                  disabled={!verdict}
                  className={buttonStyles({
                    size: "md",
                    className: cn("mt-4 w-full", !verdict && "cursor-not-allowed opacity-45"),
                  })}
                >
                  Submit analysis
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                {!verdict ? <p className="mt-2 text-center text-[9px] text-dim">Select a verdict to continue</p> : null}

                <div className="mt-4 border-t border-white/[0.06] pt-3">
                  <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-dim">
                    <CircleHelp className="h-3 w-3" /> How scoring works
                  </p>
                  <div className="mt-2 space-y-1.5 text-[9.5px] text-dim">
                    <div className="flex items-center justify-between">
                      <span>Correct verdict</span>
                      <span className="font-mono">40 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Spot risky details</span>
                      <span className="font-mono">40 pts</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Precision (avoid false alarms)</span>
                      <span className="font-mono">20 pts</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[8.5px] leading-relaxed text-dim">
                    Scores use your best attempt. Not every scenario is a scam — some realistic details are deliberately
                    harmless.
                  </p>
                </div>
              </section>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
                <p className="flex items-center gap-1.5 text-[9.5px] font-medium text-mist">
                  <LockKeyhole className="h-3 w-3 text-aqua/70" /> Inert by design
                </p>
                <p className="mt-1.5 text-[9px] leading-relaxed text-dim">
                  Links are not real anchors, attachments are not files and no request leaves this page. This is a
                  reading exercise, not a live inbox.
                </p>
              </div>
            </>
          ) : result ? (
            <section className="panel relative overflow-hidden p-5" aria-labelledby="simulation-result-heading">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-iris/[0.1] blur-[60px]" />
              <div className="relative flex items-center justify-between gap-2">
                <h2 id="simulation-result-heading" ref={resultHeadingRef} tabIndex={-1} className="text-[13px] font-semibold text-frost">
                  Analysis result
                </h2>
                {best !== null ? <span className="text-[9px] text-dim">Best: {best}%</span> : null}
              </div>

              <div className="relative mt-3 flex flex-col items-center">
                <RadialScore
                  value={result.score}
                  tone={scoreTone}
                  size={138}
                  strokeWidth={8}
                  ariaLabel={`Simulation score ${result.score} out of 100`}
                >
                  <span className="text-[2rem] font-semibold leading-none text-frost">{result.score}</span>
                  <span className="mt-1 text-[7.5px] font-semibold uppercase tracking-[0.16em] text-dim">out of 100</span>
                </RadialScore>
                <Badge
                  tone={result.score >= 80 ? "success" : result.score >= 55 ? "warning" : "danger"}
                  dot
                  className="mt-3"
                >
                  {result.score >= 80 ? "Strong read" : result.score >= 55 ? "Mixed read" : "Convincing trap"}
                </Badge>
                <p className="mt-2 text-center text-[10.5px] leading-relaxed text-mist">
                  {result.verdictCorrect
                    ? result.score >= 80
                      ? "You identified the key signals and made the right call."
                      : "The verdict was right, but some details deserve another look."
                    : "The verdict was wrong. Review the signals below — this is how the pattern becomes familiar."}
                </p>
              </div>

              <div className="relative mt-4 space-y-2 border-t border-white/[0.06] pt-3">
                {[
                  { label: "Correct verdict", value: `${result.verdictPoints}/40` },
                  {
                    label: result.totalSuspicious === 0 ? "No false alarm penalty" : `Signals found (${result.found}/${result.totalSuspicious})`,
                    value: `${result.recallPoints}/40`,
                  },
                  { label: "Precision", value: `${result.precisionPoints}/20` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-[9.5px]">
                    <span className="text-dim">{row.label}</span>
                    <span className="font-mono text-mist">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 text-[9.5px]">
                  <span className="text-dim">False alarms</span>
                  <span className={cn("font-mono", result.falsePositives > 0 ? "text-rose-300" : "text-emerald-300")}>
                    {result.falsePositives}
                  </span>
                </div>
              </div>

              <div className="relative mt-4 flex flex-col gap-2">
                <Link
                  href={`/phishing/${nextScenario.id}`}
                  className={buttonStyles({ size: "sm", className: "w-full" })}
                >
                  Next scenario <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className={buttonStyles({ variant: "secondary", size: "sm", className: "w-full" })}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Try again
                </button>
                <Link
                  href="/phishing"
                  className={buttonStyles({ variant: "ghost", size: "sm", className: "w-full text-dim" })}
                >
                  Back to lab
                </Link>
              </div>

              <p className="relative mt-3 flex items-center justify-center gap-1 text-[8.5px] text-dim">
                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-300/70" /> Best score saved locally
              </p>
            </section>
          ) : null}

          {!submitted ? (
            <div className="panel p-4">
              <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-dim">
                <Lightbulb className="h-3.5 w-3.5 text-amber-300/80" /> A useful lens
              </p>
              <ul className="mt-2.5 space-y-2 text-[9.5px] leading-relaxed text-mist">
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-aqua/60" /> Read sender addresses and domains
                  character by character, not just the display name.
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-aqua/60" /> Treat urgency, secrecy and
                  unusual payment requests as reasons to pause.
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-aqua/60" /> A legitimate-looking detail is not
                  proof of safety — and one odd detail is not always proof of a scam.
                </li>
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4">
              <p className="flex items-center gap-1.5 text-[9.5px] font-semibold text-mist">
                <Sparkles className="h-3 w-3 text-[#c3b2ff]" /> What happens next
              </p>
              <p className="mt-1.5 text-[9px] leading-relaxed text-dim">
                Your best score is stored in this browser. Replay this scenario to sharpen your precision, or move to a
                different channel.
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[8.5px] text-dim">
                <FlaskConical className="h-2.5 w-2.5" /> All content is fictional training material.
              </p>
            </div>
          )}
        </aside>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-[9px] text-dim">
        <ShieldAlert className="h-3 w-3" />
        Phishing awareness is a judgement skill, not a guarantee. When in doubt, verify through a channel you choose.
      </p>
    </div>
  );
}
