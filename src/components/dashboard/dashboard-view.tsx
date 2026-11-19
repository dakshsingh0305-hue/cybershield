"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronDown,
  Eye,
  GraduationCap,
  Info,
  MailWarning,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { ScanMix } from "@/components/dashboard/scan-mix";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { RadialScore } from "@/components/ui/radial-score";
import { lessons } from "@/lib/data/lessons";
import { useProgress } from "@/lib/progress-store";
import { getRecommendations } from "@/lib/score";
import type { Recommendation } from "@/lib/types";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";

const priorityTone = {
  high: { label: "Do next", className: "border-aqua/25 bg-aqua/[0.07] text-[#8df4eb]" },
  medium: { label: "Suggested", className: "border-signal/20 bg-signal/[0.06] text-[#a9c7ff]" },
  low: { label: "Explore", className: "border-white/10 bg-white/[0.03] text-mist" },
};

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const tone = priorityTone[recommendation.priority];
  return (
    <Link
      href={recommendation.href}
      className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.12] hover:bg-white/[0.035]"
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#07101d] text-dim transition-colors group-hover:text-aqua">
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12px] font-semibold text-frost">{recommendation.title}</p>
          <span className={cn("rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em]", tone.className)}>
            {tone.label}
          </span>
        </div>
        <p className="mt-1 text-[10.5px] leading-relaxed text-dim">{recommendation.body}</p>
      </div>
    </Link>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  accent,
  footer,
}: {
  icon: typeof ScanSearch;
  label: string;
  value: string;
  note?: string;
  accent: string;
  footer?: ReactNode;
}) {
  return (
    <div className="panel relative overflow-hidden p-4">
      <div className={`pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full blur-[45px] ${accent}`} />
      <div className="relative flex items-center justify-between">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-mist">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        {note ? <span className="text-[8.5px] uppercase tracking-[0.12em] text-dim">{note}</span> : null}
      </div>
      <p className="relative mt-4 text-2xl font-semibold tracking-tight text-frost">{value}</p>
      <p className="relative mt-0.5 text-[10.5px] text-dim">{label}</p>
      {footer ? <div className="relative mt-3">{footer}</div> : null}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <div className="h-3 w-40 rounded bg-white/[0.05]" />
          <div className="h-8 w-72 rounded bg-white/[0.06]" />
          <div className="h-3 w-96 max-w-full rounded bg-white/[0.04]" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-xl bg-white/[0.05]" />
          <div className="h-10 w-36 rounded-xl bg-white/[0.04]" />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="panel h-[320px] xl:col-span-4" />
        <div className="panel h-[320px] xl:col-span-8" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="panel h-[124px]" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="panel h-[330px] xl:col-span-7" />
        <div className="panel h-[330px] xl:col-span-5" />
      </div>
    </div>
  );
}

export function DashboardView() {
  const { state, hydrated, score, removeDemoData } = useProgress();
  const recommendations = useMemo(() => getRecommendations(state, score), [state, score]);
  const recentScans = state.scans.slice(0, 4);
  const bestLabScore = useMemo(() => {
    const scores = Object.values(state.phishingAttempts).map((attempt) => attempt.score);
    return scores.length > 0 ? Math.max(...scores) : null;
  }, [state.phishingAttempts]);
  const hasRealActivity = state.activity.some((event) => !event.demo);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            Your local security workspace
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-frost sm:text-[1.9rem]">
            Welcome back. <span className="text-mist">Let&apos;s keep you sharp.</span>
          </h1>
          <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-dim">
            This score reflects deliberate practice on this device — it is not a scan of your accounts or a security
            audit.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link href="/scanner" className={buttonStyles({ size: "md" })}>
            <ScanSearch className="h-4 w-4" aria-hidden="true" />
            Scan a URL
          </Link>
          <Link href="/academy" className={buttonStyles({ variant: "secondary", size: "md" })}>
            <GraduationCap className="h-4 w-4 text-aqua" aria-hidden="true" />
            Continue learning
          </Link>
        </div>
      </div>

      {state.seededDemo ? (
        <div className="flex flex-col gap-2.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-[10.5px] leading-relaxed text-amber-200/80 sm:items-center">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:mt-0" aria-hidden="true" />
            <span>
              <span className="font-semibold text-amber-200">Demo preview:</span> sample scan history and sample practice
              activity are included so you can explore the dashboard.
            </span>
          </p>
          <button
            type="button"
            onClick={removeDemoData}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-amber-400/20 px-2 py-1 text-[9.5px] font-medium text-amber-200/90 transition-colors hover:bg-amber-400/10 sm:self-auto"
          >
            <RotateCcw className="h-2.5 w-2.5" /> Remove sample data
          </button>
        </div>
      ) : null}

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-12">
        <section className="panel relative overflow-hidden p-5 sm:p-6 xl:col-span-4" aria-labelledby="score-heading">
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-aqua/[0.07] blur-[70px]" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 id="score-heading" className="text-[14px] font-semibold text-frost">
                Awareness score
              </h2>
              <p className="mt-0.5 text-[10px] text-dim">A practice metric, not a security audit</p>
            </div>
            <Badge tone="aqua" dot>
              Local
            </Badge>
          </div>

          <div className="relative mt-5 flex items-center gap-4 sm:gap-5">
            <RadialScore
              value={score.total}
              size={154}
              strokeWidth={9}
              ariaLabel={`Overall security awareness score ${score.total} out of 100`}
            >
              <span className="text-[2.35rem] font-semibold leading-none text-frost">{score.total}</span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-dim">out of 100</span>
            </RadialScore>
            <div className="min-w-0">
              <Badge tone={score.total >= 55 ? "aqua" : score.total >= 30 ? "info" : "warning"}>
                {score.level}
              </Badge>
              <p className="mt-2.5 text-[11px] leading-relaxed text-mist">{score.levelBlurb}</p>
            </div>
          </div>

          <div className="relative mt-5 space-y-3 border-t border-white/[0.06] pt-4">
            {[
              { label: "Academy", value: score.academy, max: 40, tone: "aqua" as const },
              { label: "Phishing lab", value: score.phishing, max: 35, tone: "violet" as const },
              { label: "URL practice", value: score.practice, max: 15, tone: "signal" as const },
            ].map((part) => (
              <div key={part.label}>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-mist">{part.label}</span>
                  <span className="font-mono text-dim">
                    {part.value}/{part.max}
                  </span>
                </div>
                <ProgressBar value={(part.value / part.max) * 100} tone={part.tone} size="sm" className="mt-1.5" />
              </div>
            ))}
          </div>

          <details className="group relative mt-4 rounded-lg border border-white/[0.055] bg-white/[0.015]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-[10px] font-medium text-mist marker:hidden">
              How this score is calculated
              <ChevronDown className="h-3 w-3 text-dim transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-3 pb-2.5 text-[9.5px] leading-relaxed text-dim">
              A 10-point baseline plus 40 for lessons completed, 35 for lab coverage and accuracy, and 15 for real URL
              analyses (maximum 3). Sample data is never counted.
            </p>
          </details>
        </section>

        <div className="xl:col-span-8">
          <ActivityChart activity={state.activity} hasRealActivity={hasRealActivity} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 [&>*]:min-w-0 lg:grid-cols-4">
        <StatCard
          icon={GraduationCap}
          label="Lessons completed"
          value={`${score.lessonsCompleted} / 5`}
          accent="bg-aqua/10"
          footer={<ProgressBar value={(score.lessonsCompleted / 5) * 100} size="sm" tone="aqua" label="Lessons completed" />}
        />
        <StatCard
          icon={MailWarning}
          label="Lab scenarios analysed"
          value={`${score.phishingCompleted} / 6`}
          accent="bg-iris/10"
          footer={<ProgressBar value={(score.phishingCompleted / 6) * 100} size="sm" tone="violet" label="Lab scenarios analysed" />}
        />
        <StatCard
          icon={ScanSearch}
          label="Real URLs analysed"
          value={String(score.scansRun)}
          note="Samples excluded"
          accent="bg-signal/10"
          footer={
            <p className="flex items-center gap-1.5 text-[9px] text-dim">
              <Eye className="h-2.5 w-2.5 text-aqua/70" /> Nothing is visited
            </p>
          }
        />
        <StatCard
          icon={Target}
          label="Best lab score"
          value={bestLabScore === null ? "—" : `${bestLabScore}%`}
          note={bestLabScore === null ? "Not attempted" : "Best of all attempts"}
          accent="bg-emerald-400/10"
          footer={<ProgressBar value={bestLabScore ?? 0} size="sm" tone="success" label="Best lab score" />}
        />
      </div>

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-12">
        <section className="panel p-5 xl:col-span-7" aria-labelledby="recent-heading">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="recent-heading" className="text-[14px] font-semibold text-frost">
                Recent URL analyses
              </h2>
              <p className="mt-0.5 text-[10px] text-dim">Saved locally · computed with transparent heuristics</p>
            </div>
            <div className="flex items-center gap-2">
              {recentScans.some((scan) => scan.demo) ? <Badge tone="warning">Sample</Badge> : null}
              <Link href="/scanner" className="text-[10.5px] font-semibold text-[#8db4e7] hover:text-aqua">
                Open scanner
              </Link>
            </div>
          </div>

          {recentScans.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.03] text-dim">
                <ScanSearch className="h-4 w-4" />
              </span>
              <p className="mt-3 text-[12px] font-medium text-frost">No analyses yet</p>
              <p className="mt-1 max-w-[260px] text-[10.5px] leading-relaxed text-dim">
                Paste a suspicious link to inspect its structure. Sample history was removed.
              </p>
              <Link href="/scanner" className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4" })}>
                Try the scanner
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.055]">
              {recentScans.map((scan) => (
                <li key={scan.id}>
                  <Link
                    href={`/scanner?view=${scan.id}`}
                    className="group flex items-center gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-white/[0.025]"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
                        scan.level === "high"
                          ? "border-rose-400/15 bg-rose-400/[0.06] text-rose-300"
                          : scan.level === "medium"
                            ? "border-amber-400/15 bg-amber-400/[0.06] text-amber-300"
                            : "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
                      )}
                    >
                      <ScanSearch className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate font-mono text-[11px] font-medium text-[#d5e3f6]">{scan.hostname}</p>
                        {scan.demo ? (
                          <span className="rounded border border-amber-400/20 px-1 py-0.5 text-[7px] font-bold uppercase tracking-[0.1em] text-amber-300/80">
                            Sample
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate text-[9.5px] text-dim">{truncate(scan.path, 52)}</p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <RiskBadge level={scan.level} />
                      <p className="mt-1 text-[8.5px] text-dim">{formatRelativeTime(scan.analyzedAt)}</p>
                    </div>
                    <span className="ml-1 font-mono text-[11px] text-dim">{scan.score}</span>
                    <ArrowUpRight className="hidden h-3 w-3 shrink-0 text-dim transition-colors group-hover:text-aqua sm:block" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex items-center gap-1.5 border-t border-white/[0.05] pt-3 text-[9px] text-dim">
            <Info className="h-2.5 w-2.5" />
            Scores are heuristic signals — never proof that a site is safe or malicious.
          </div>
        </section>

        <section className="panel p-5 xl:col-span-5" aria-labelledby="recommendations-heading">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="recommendations-heading" className="text-[14px] font-semibold text-frost">
                Recommended next
              </h2>
              <p className="mt-0.5 text-[10px] text-dim">Adapted to your local progress</p>
            </div>
            <Sparkles className="h-4 w-4 text-aqua/70" aria-hidden="true" />
          </div>
          <div className="mt-4 space-y-2">
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2 text-[9px] text-dim">
            <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-300/80" />
            Recommendations are generated from progress, not personal profiling.
          </div>
        </section>
      </div>

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-12">
        <section className="panel p-5 xl:col-span-7" aria-labelledby="learning-heading">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="learning-heading" className="text-[14px] font-semibold text-frost">
                Learning progress
              </h2>
              <p className="mt-0.5 text-[10px] text-dim">Five short paths · quiz-based completion</p>
            </div>
            <Link href="/academy" className="text-[10.5px] font-semibold text-[#8db4e7] hover:text-aqua">
              Open academy
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <ProgressBar
              value={(score.lessonsCompleted / lessons.length) * 100}
              tone="aqua"
              size="sm"
              label="Overall academy completion"
            />
            <span className="shrink-0 font-mono text-[10px] text-dim">
              {score.lessonsCompleted}/{lessons.length}
            </span>
          </div>

          <ul className="mt-4 divide-y divide-white/[0.05]">
            {lessons.map((lesson) => {
              const completed = state.completedLessons.includes(lesson.slug);
              const best = state.lessonScores[lesson.slug];
              return (
                <li key={lesson.slug}>
                  <Link
                    href={`/academy/${lesson.slug}`}
                    className="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-white/[0.025]"
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[9px]",
                        completed
                          ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300"
                          : "border-white/[0.08] bg-white/[0.02] text-dim",
                      )}
                    >
                      {completed ? <Check className="h-3 w-3" /> : <BookOpenCheck className="h-3 w-3" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11.5px] font-medium text-[#d5e3f6]">{lesson.title}</p>
                      <p className="text-[9px] text-dim">
                        {lesson.category} · {lesson.duration} min
                      </p>
                    </div>
                    <div className="hidden w-24 shrink-0 sm:block">
                      <ProgressBar
                        value={completed ? 100 : best ?? 0}
                        tone={completed ? "success" : "warning"}
                        size="sm"
                        label={`${lesson.title} progress`}
                      />
                    </div>
                    <span
                      className={cn(
                        "w-20 shrink-0 text-right text-[9.5px] font-medium",
                        completed ? "text-emerald-300" : best ? "text-amber-300" : "text-dim",
                      )}
                    >
                      {completed ? "Completed" : best ? `Retake · ${best}%` : "Not started"}
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-aqua" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="xl:col-span-5">
          <ScanMix scans={state.scans} />
        </div>
      </div>

      <div className="panel relative overflow-hidden p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-iris/[0.09] blur-[60px]" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-aqua">
              <Trophy className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-frost">Awareness is a habit, not a badge.</p>
              <p className="mt-0.5 text-[10px] text-dim">
                One lesson or lab scenario this week keeps your instincts current. Your next best action is waiting above.
              </p>
            </div>
          </div>
          <Link href="/phishing" className={buttonStyles({ variant: "secondary", size: "sm", className: "shrink-0" })}>
            Practise now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
