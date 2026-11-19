"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  Clock,
  GraduationCap,
  Layers,
  Search,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { RadialScore } from "@/components/ui/radial-score";
import { lessonCategories, lessons } from "@/lib/data/lessons";
import { useProgress } from "@/lib/progress-store";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryMeta: Record<Lesson["category"], { tint: string; tone: BadgeTone; blurb: string }> = {
  Phishing: { tint: "from-signal/60 to-[#7cc4ff]", tone: "info", blurb: "Recognise manipulation" },
  Passwords: { tint: "from-amber-400/70 to-[#ffd27d]", tone: "warning", blurb: "Contain the damage" },
  "Social Engineering": { tint: "from-iris/70 to-[#c3b2ff]", tone: "violet", blurb: "Verify identity" },
  "Public Wi-Fi": { tint: "from-aqua/70 to-[#8df4eb]", tone: "aqua", blurb: "Travel with defaults" },
  Privacy: { tint: "from-emerald-400/70 to-[#8df4c8]", tone: "success", blurb: "Shrink your footprint" },
};

function AcademySkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-3">
        <div className="h-3 w-44 rounded bg-white/[0.05]" />
        <div className="h-9 w-80 max-w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-[520px] max-w-full rounded bg-white/[0.04]" />
      </div>
      <div className="panel h-[230px]" />
      <div className="panel h-[92px]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="panel h-[280px]" />
        ))}
      </div>
    </div>
  );
}

export function AcademyList() {
  const { state, hydrated } = useProgress();
  const [category, setCategory] = useState<Lesson["category"] | "All">("All");
  const [query, setQuery] = useState("");

  const completed = state.completedLessons.length;
  const scores = Object.values(state.lessonScores);
  const averageScore = scores.length
    ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
    : null;
  const nextLesson = lessons.find((lesson) => !state.completedLessons.includes(lesson.slug)) ?? lessons[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      if (category !== "All" && lesson.category !== category) return false;
      if (!q) return true;
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.category.toLowerCase().includes(q) ||
        lesson.objectives.some((objective) => objective.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  if (!hydrated) return <AcademySkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <GraduationCap className="h-3 w-3 text-aqua" />
            Cyber academy
          </p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight text-frost sm:text-[1.9rem]">
            Security knowledge, <span className="text-gradient-soft">built to stick.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-dim">
            Five compact lessons, each ending in a three-question check. No jargon walls — just the reasoning behind
            the habits that keep your accounts and data safer.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge tone="aqua" dot>
            {completed}/5 completed
          </Badge>
          <Badge tone="neutral">
            <Clock className="h-3 w-3" /> {lessons.reduce((total, lesson) => total + lesson.duration, 0)} min total
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <section className="panel relative overflow-hidden p-5 sm:p-6" aria-labelledby="academy-progress-heading">
          <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-aqua/[0.07] blur-[70px]" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <h2 id="academy-progress-heading" className="text-[14px] font-semibold text-frost">
                Your learning progress
              </h2>
              <p className="mt-0.5 text-[10px] text-dim">Completion requires at least 60% on each quiz</p>
            </div>
            <Badge tone={completed === lessons.length ? "success" : "aqua"} dot={completed > 0}>
              {completed === lessons.length ? "Academy complete" : "In progress"}
            </Badge>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-5 sm:flex-nowrap">
            <RadialScore
              value={(completed / lessons.length) * 100}
              tone="awareness"
              size={116}
              strokeWidth={7}
              ariaLabel={`Academy completion ${completed} of 5 lessons`}
            >
              <span className="text-xl font-semibold text-frost">{completed}/5</span>
              <span className="mt-0.5 text-[7.5px] uppercase tracking-[0.15em] text-dim">lessons</span>
            </RadialScore>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-mist">Path completion</span>
                  <span className="font-mono text-dim">{Math.round((completed / lessons.length) * 100)}%</span>
                </div>
                <ProgressBar
                  value={(completed / lessons.length) * 100}
                  size="sm"
                  className="mt-1.5"
                  label="Academy completion"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-dim">Average quiz</p>
                  <p className="mt-0.5 text-sm font-semibold text-frost">
                    {averageScore === null ? "—" : `${averageScore}%`}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-dim">Remaining</p>
                  <p className="mt-0.5 text-sm font-semibold text-frost">{lessons.length - completed}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="panel relative flex flex-col justify-between overflow-hidden p-5 sm:p-6"
          aria-labelledby="academy-next-heading"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-iris/[0.1] blur-[60px]" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-iris/20 bg-iris/[0.08] text-[#c3b2ff]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b6a2f8]">
                {completed === lessons.length ? "Keep it fresh" : "Up next"}
              </p>
            </div>
            <h2 id="academy-next-heading" className="mt-3 text-[16px] font-semibold leading-snug text-frost">
              {completed === lessons.length ? "Revisit a lesson" : nextLesson.title}
            </h2>
            <p className="mt-1 text-[10.5px] text-dim">
              {completed === lessons.length
                ? "Replay a quiz to check that the reasoning still feels natural."
                : `${nextLesson.category} · ${nextLesson.duration} min · ${nextLesson.level}`}
            </p>
          </div>
          <Link
            href={`/academy/${nextLesson.slug}`}
            className="relative mt-4 inline-flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[11px] font-medium text-frost transition-colors hover:border-aqua/25 hover:bg-aqua/[0.04]"
          >
            {completed === lessons.length ? "Revisit this lesson" : "Continue learning"}
            <ArrowRight className="h-3.5 w-3.5 text-aqua" />
          </Link>
        </section>
      </div>

      <section className="panel p-5 sm:p-6" aria-labelledby="academy-catalogue-heading">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="academy-catalogue-heading" className="text-[14px] font-semibold text-frost">
                Lesson library
              </h2>
              <Badge tone="neutral">{filtered.length}</Badge>
            </div>
            <p className="mt-0.5 text-[10px] text-dim">Choose a path by topic or jump into the next unfinished lesson</p>
          </div>

          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-1">
              {lessonCategories.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  aria-pressed={category === value}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[9.5px] font-medium transition-colors",
                    category === value
                      ? "border-aqua/25 bg-aqua/[0.07] text-[#8df4eb]"
                      : "border-transparent text-dim hover:bg-white/[0.03] hover:text-mist",
                  )}
                >
                  {value === "All" ? "All topics" : value}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-52">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-dim"
                aria-hidden="true"
              />
              <label htmlFor="academy-search" className="sr-only">
                Search lessons
              </label>
              <input
                id="academy-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search lessons…"
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
            <p className="mt-3 text-[12px] font-medium text-frost">No lessons match</p>
            <p className="mt-1 max-w-sm text-[10.5px] text-dim">Try another topic or a shorter search term.</p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setQuery("");
              }}
              className="mt-3 text-[10.5px] font-semibold text-aqua hover:text-[#8df4eb]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((lesson) => {
              const meta = categoryMeta[lesson.category];
              const isComplete = state.completedLessons.includes(lesson.slug);
              const best = state.lessonScores[lesson.slug];
              return (
                <Link
                  key={lesson.slug}
                  href={`/academy/${lesson.slug}`}
                  className="panel panel-hover group relative flex flex-col overflow-hidden p-4"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-2">
                    <Badge tone={meta.tone} className="px-1.5 py-0.5 text-[8px]">
                      {lesson.category}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded border border-white/[0.07] px-1.5 py-0.5 text-[8px] font-medium text-dim">
                        {lesson.level}
                      </span>
                      {isComplete ? (
                        <Badge tone="success" className="px-1.5 py-0.5 text-[8px]">
                          <Check className="h-2.5 w-2.5" /> Done
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3">
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-[#06101a]",
                        meta.tint,
                      )}
                    >
                      <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[12.5px] font-semibold leading-snug text-[#e4eefc]">{lesson.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[9px] text-dim">
                        <Clock className="h-2.5 w-2.5" /> {lesson.duration} min ·
                        <span>{meta.blurb}</span>
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 text-[10.5px] leading-relaxed text-dim">{lesson.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-dim">
                    <span className="flex items-center gap-1">
                      <Layers className="h-2.5 w-2.5" /> {lesson.sections.length} sections
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-2.5 w-2.5" /> {lesson.quiz.length}-question quiz
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3">
                    {best === undefined ? (
                      <span className="text-[9.5px] text-dim">Not started</span>
                    ) : (
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-[9.5px] font-medium",
                          isComplete ? "text-emerald-300" : "text-amber-300",
                        )}
                      >
                        <Trophy className="h-3 w-3" /> {isComplete ? `Completed · ${best}%` : `Best ${best}% · retake`}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[9.5px] font-semibold text-[#8db4e7] transition-colors group-hover:text-aqua">
                      {isComplete ? "Revisit" : best !== undefined ? "Retake" : "Start lesson"}
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
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
          Lessons count toward your awareness score. A 60% quiz pass marks a lesson complete; your best score is kept.
        </p>
        <Link
          href="/dashboard"
          className={buttonStyles({ variant: "secondary", size: "sm", className: "shrink-0" })}
        >
          View dashboard <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
