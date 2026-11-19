"use client";

import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Check,
  FlaskConical,
  Mail,
  MessageCircle,
  MessageSquareText,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { RadialScore } from "@/components/ui/radial-score";
import { phishingChannelLabels, phishingScenarios } from "@/lib/data/phishing";
import { useProgress } from "@/lib/progress-store";
import type { PhishingChannel } from "@/lib/types";
import { cn, truncate } from "@/lib/utils";

const channelMeta: Record<
  PhishingChannel,
  { icon: typeof Mail; label: string; avatar: string; tint: string }
> = {
  email: {
    icon: Mail,
    label: "Email",
    avatar: "from-signal/70 to-[#6bb8ff]",
    tint: "border-sky-400/15 bg-sky-400/[0.06] text-sky-300",
  },
  sms: {
    icon: MessageSquareText,
    label: "SMS",
    avatar: "from-emerald-400/60 to-aqua/60",
    tint: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
  },
  dm: {
    icon: MessageCircle,
    label: "Direct message",
    avatar: "from-iris/70 to-[#d6b4ff]",
    tint: "border-iris/20 bg-iris/[0.07] text-[#c3b2ff]",
  },
};

const difficultyTone = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
} as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PhishingSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-3">
        <div className="h-3 w-44 rounded bg-white/[0.05]" />
        <div className="h-9 w-80 max-w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-[520px] max-w-full rounded bg-white/[0.04]" />
      </div>
      <div className="panel h-[180px]" />
      <div className="panel h-[120px]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="panel h-[280px]" />
        ))}
      </div>
    </div>
  );
}

export function PhishingList() {
  const { state, hydrated } = useProgress();
  const [channel, setChannel] = useState<PhishingChannel | "all">("all");
  const [status, setStatus] = useState<"all" | "new" | "done">("all");
  const [query, setQuery] = useState("");

  const attempts = state.phishingAttempts;
  const completed = Object.keys(attempts).length;
  const scores = Object.values(attempts).map((attempt) => attempt.score);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
  const best = scores.length ? Math.max(...scores) : null;
  const nextScenario = phishingScenarios.find((scenario) => !attempts[scenario.id]) ?? phishingScenarios[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return phishingScenarios.filter((scenario) => {
      if (channel !== "all" && scenario.channel !== channel) return false;
      if (status === "new" && attempts[scenario.id]) return false;
      if (status === "done" && !attempts[scenario.id]) return false;
      if (!q) return true;
      return (
        scenario.subject.toLowerCase().includes(q) ||
        scenario.senderName.toLowerCase().includes(q) ||
        scenario.senderAddress.toLowerCase().includes(q) ||
        scenario.preview.toLowerCase().includes(q)
      );
    });
  }, [attempts, channel, query, status]);

  if (!hydrated) return <PhishingSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <FlaskConical className="h-3 w-3 text-[#c3b2ff]" />
            Phishing awareness lab
          </p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight text-frost sm:text-[1.9rem]">
            Would you <span className="text-gradient-soft">take the bait?</span>
          </h1>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-dim">
            Six fictional messages, three channels, no real links. Flag what feels wrong, make a call, then read a
            signal-by-signal explanation — including the ones you missed.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge tone="violet" dot>
            100% fictional
          </Badge>
          <Badge tone="neutral">
            <ShieldCheck className="h-3 w-3" /> Nothing opens
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="panel flex flex-col justify-between gap-4 p-5 sm:p-6" aria-labelledby="lab-progress-heading">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="lab-progress-heading" className="text-[14px] font-semibold text-frost">
                Your lab progress
              </h2>
              <p className="mt-0.5 text-[10px] text-dim">Best attempts saved in this browser</p>
            </div>
            <Badge tone={completed === phishingScenarios.length ? "success" : "aqua"} dot={completed > 0}>
              {completed === phishingScenarios.length ? "Lab complete" : `${completed}/6 analysed`}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:flex-nowrap">
            <RadialScore
              value={(completed / phishingScenarios.length) * 100}
              tone="awareness"
              size={110}
              strokeWidth={7}
              ariaLabel={`Lab completion ${completed} of 6`}
            >
              <span className="text-xl font-semibold text-frost">{completed}/6</span>
              <span className="mt-0.5 text-[7.5px] uppercase tracking-[0.15em] text-dim">complete</span>
            </RadialScore>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-mist">Coverage</span>
                  <span className="font-mono text-dim">{Math.round((completed / 6) * 100)}%</span>
                </div>
                <ProgressBar value={(completed / 6) * 100} size="sm" className="mt-1.5" label="Phishing lab coverage" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-dim">Avg. best</p>
                  <p className="mt-0.5 text-sm font-semibold text-frost">{average === null ? "—" : `${average}%`}</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-dim">Highest</p>
                  <p className="mt-0.5 text-sm font-semibold text-frost">{best === null ? "—" : `${best}%`}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel relative flex flex-col justify-between overflow-hidden p-5 sm:p-6" aria-labelledby="next-lab-heading">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-iris/[0.1] blur-[60px]" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-iris/20 bg-iris/[0.08] text-[#c3b2ff]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b6a2f8]">Up next</p>
            </div>
            <h2 id="next-lab-heading" className="mt-3 text-[16px] font-semibold text-frost">
              {completed === 6 ? "Replay a tough one" : "Your next simulation"}
            </h2>
            <p className="mt-1 text-[10.5px] text-dim">
              {truncate(nextScenario.subject, 56)} · {nextScenario.difficulty}
            </p>
          </div>
          <Link
            href={`/phishing/${nextScenario.id}`}
            className="relative mt-4 inline-flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[11px] font-medium text-frost transition-colors hover:border-aqua/25 hover:bg-aqua/[0.04]"
          >
            {completed === 6 ? "Replay a scenario" : "Start simulation"}
            <ArrowRight className="h-3.5 w-3.5 text-aqua" />
          </Link>
        </section>
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3 sm:flex-row sm:items-center">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300">
          <ShieldAlert className="h-3.5 w-3.5" /> Fictional training content
        </span>
        <span className="hidden h-3 w-px bg-amber-400/20 sm:block" />
        <p className="text-[10px] leading-relaxed text-amber-200/70">
          Every sender, link and attachment is invented. No links are clickable and nothing is downloaded. Real messages
          can contain legitimate links — judge the whole context, not one detail.
        </p>
      </div>

      <section className="panel p-5 sm:p-6" aria-labelledby="lab-scenarios-heading">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="lab-scenarios-heading" className="text-[14px] font-semibold text-frost">
                Simulation inbox
              </h2>
              <Badge tone="neutral">{filtered.length}</Badge>
            </div>
            <p className="mt-0.5 text-[10px] text-dim">Use search and filters to find a scenario</p>
          </div>

          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-1">
              {(["all", "email", "sms", "dm"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setChannel(value)}
                  aria-pressed={channel === value}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[9.5px] font-medium transition-colors",
                    channel === value
                      ? "border-aqua/25 bg-aqua/[0.07] text-[#8df4eb]"
                      : "border-transparent text-dim hover:bg-white/[0.03] hover:text-mist",
                  )}
                >
                  {value === "all" ? "All channels" : phishingChannelLabels[value]}
                </button>
              ))}
            </div>
            <div className="hidden h-4 w-px bg-white/10 lg:block" />
            <div className="flex items-center gap-1">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "new", label: "Not started" },
                  { value: "done", label: "Completed" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  aria-pressed={status === option.value}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[9.5px] font-medium transition-colors",
                    status === option.value
                      ? "border-iris/25 bg-iris/[0.08] text-[#c3b2ff]"
                      : "border-transparent text-dim hover:bg-white/[0.03] hover:text-mist",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-52">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-dim" aria-hidden="true" />
              <label htmlFor="lab-search" className="sr-only">
                Search simulations
              </label>
              <input
                id="lab-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sender or subject…"
                className="input-cyber h-8 py-1 pl-8 pr-2.5 text-[10px]"
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-12 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.03] text-dim">
              <Search className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[12px] font-medium text-frost">No simulations match</p>
            <p className="mt-1 max-w-sm text-[10.5px] text-dim">
              Try a different channel, status or search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setChannel("all");
                setStatus("all");
                setQuery("");
              }}
              className="mt-3 text-[10.5px] font-semibold text-aqua hover:text-[#8df4eb]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((scenario) => {
              const meta = channelMeta[scenario.channel];
              const ChannelIcon = meta.icon;
              const attempt = attempts[scenario.id];
              const mastery = attempt ? (attempt.score >= 80 ? "mastered" : "review") : null;
              return (
                <Link
                  key={scenario.id}
                  href={`/phishing/${scenario.id}`}
                  className="panel panel-hover group relative flex flex-col overflow-hidden p-4"
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r",
                      scenario.channel === "email"
                        ? "from-transparent via-signal/60 to-transparent"
                        : scenario.channel === "sms"
                          ? "from-transparent via-aqua/60 to-transparent"
                          : "from-transparent via-iris/70 to-transparent",
                    )}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn("grid h-7 w-7 place-items-center rounded-lg border", meta.tint)}>
                        <ChannelIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-dim">
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge tone={difficultyTone[scenario.difficulty]} className="px-1.5 py-0.5 text-[8px]">
                        {scenario.difficulty}
                      </Badge>
                      {attempt ? (
                        <Badge tone={mastery === "mastered" ? "success" : "warning"} className="px-1.5 py-0.5 text-[8px]">
                          {mastery === "mastered" ? (
                            <>
                              <Check className="h-2.5 w-2.5" /> Mastered
                            </>
                          ) : (
                            <>Review</>
                          )}
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2.5">
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[10px] font-bold text-[#06101a]",
                        meta.avatar,
                      )}
                    >
                      {initials(scenario.senderName)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-semibold text-frost">{scenario.senderName}</p>
                      <p className="flex items-center gap-1 truncate font-mono text-[9px] text-dim">
                        <AtSign className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                        {scenario.senderAddress}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-[12.5px] font-semibold leading-snug text-[#e4eefc]">
                    {scenario.subject}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[10.5px] leading-relaxed text-dim">{scenario.preview}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                    {attempt ? (
                      <span className="flex items-center gap-1.5 text-[9.5px] font-medium text-mist">
                        <Target className="h-3 w-3 text-aqua/70" /> Best {attempt.score}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[9.5px] text-dim">
                        <span className="h-1.5 w-1.5 rounded-full bg-dim" /> Not attempted
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[9.5px] font-semibold text-[#8db4e7] transition-colors group-hover:text-aqua">
                      {attempt ? "Replay" : "Analyse"} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="panel flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-[10px] text-dim">
          <Trophy className="h-3.5 w-3.5 text-amber-300/80" />
          Scores save automatically. You can retake any scenario to improve your best.
        </p>
        <Link href="/academy/spot-the-hook" className="text-[10px] font-semibold text-[#8db4e7] hover:text-aqua">
          Brush up on phishing basics →
        </Link>
      </div>
    </div>
  );
}
