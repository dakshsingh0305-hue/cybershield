"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Info,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { getNextLesson, lessons } from "@/lib/data/lessons";
import { useProgress } from "@/lib/progress-store";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryTone: Record<Lesson["category"], BadgeTone> = {
  Phishing: "info",
  Passwords: "warning",
  "Social Engineering": "violet",
  "Public Wi-Fi": "aqua",
  Privacy: "success",
};

const calloutMeta = {
  tip: {
    icon: Lightbulb,
    className: "border-aqua/20 bg-aqua/[0.045]",
    iconClass: "bg-aqua/10 text-aqua",
    titleClass: "text-[#8df4eb]",
    label: "Practical tip",
  },
  warning: {
    icon: ShieldAlert,
    className: "border-amber-400/20 bg-amber-400/[0.045]",
    iconClass: "bg-amber-400/10 text-amber-300",
    titleClass: "text-amber-200",
    label: "Watch out",
  },
  info: {
    icon: Info,
    className: "border-signal/20 bg-signal/[0.045]",
    iconClass: "bg-signal/10 text-[#a9c7ff]",
    titleClass: "text-[#b9d2ff]",
    label: "Good to know",
  },
} as const;

interface QuizResult {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  const { state, recordLesson } = useProgress();
  const reduceMotion = useReducedMotion();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const nextLesson = getNextLesson(lesson.slug);
  const completed = state.completedLessons.includes(lesson.slug);
  const bestScore = state.lessonScores[lesson.slug];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === lesson.quiz.length;
  const lessonIndex = lessons.findIndex((item) => item.slug === lesson.slug) + 1;

  const toc = useMemo(
    () => [
      { id: "objectives", label: "What you'll learn" },
      ...lesson.sections.map((section, index) => ({
        id: `section-${index + 1}`,
        label: section.heading,
      })),
      { id: "takeaways", label: "Key takeaways" },
      { id: "recall-check", label: "Recall check" },
    ],
    [lesson.sections],
  );

  function chooseAnswer(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((previous) => ({ ...previous, [questionIndex]: optionIndex }));
  }

  function submitQuiz() {
    if (!allAnswered || submitted) return;
    let correct = 0;
    lesson.quiz.forEach((question, index) => {
      if (answers[index] === question.answer) correct += 1;
    });
    const percent = Math.round((correct / lesson.quiz.length) * 100);
    const nextResult: QuizResult = {
      correct,
      total: lesson.quiz.length,
      percent,
      passed: percent >= 60,
    };
    setResult(nextResult);
    setSubmitted(true);
    recordLesson(lesson.slug, percent);
    window.setTimeout(() => resultHeadingRef.current?.focus({ preventScroll: true }), 120);
  }

  function retakeQuiz() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    quizRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <Link
        href="/academy"
        className="inline-flex items-center gap-1.5 rounded-lg text-[10.5px] font-medium text-dim transition-colors hover:text-frost"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to academy
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">
            <span className="inline-flex items-center gap-1.5 text-[#8df4eb]">
              <GraduationCap className="h-3 w-3" /> Lesson {lessonIndex} of {lessons.length}
            </span>
            <span className="text-[#3c4e6a]">/</span>
            <span>{lesson.category}</span>
            <span className="text-[#3c4e6a]">/</span>
            <span>{lesson.level}</span>
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug text-frost sm:text-[1.7rem]">{lesson.title}</h1>
          <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-dim">{lesson.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge tone="neutral">
            <Clock className="h-3 w-3" /> {lesson.duration} min read
          </Badge>
          <Badge tone={categoryTone[lesson.category]}>{lesson.category}</Badge>
          {completed ? (
            <Badge tone="success" dot>
              Completed{bestScore !== undefined ? ` · ${bestScore}%` : ""}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_272px] lg:items-start">
        <div className="min-w-0">
          <section id="objectives" className="panel scroll-mt-24 p-5 sm:p-6" aria-labelledby="objectives-heading">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-aqua/15 bg-aqua/[0.06] text-aqua">
                <Target className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 id="objectives-heading" className="text-[13px] font-semibold text-frost">
                  What you&apos;ll learn
                </h2>
                <p className="text-[9.5px] text-dim">Three outcomes for this lesson</p>
              </div>
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-3">
              {lesson.objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[10.5px] leading-relaxed text-mist"
                >
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-aqua/80" aria-hidden="true" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <article className="panel mt-4 overflow-hidden">
            <div className="divide-y divide-white/[0.055]">
              {lesson.sections.map((section, index) => {
                const callout = section.callout ? calloutMeta[section.callout.type] : null;
                const CalloutIcon = callout?.icon;
                return (
                  <section
                    key={section.heading}
                    id={`section-${index + 1}`}
                    className="scroll-mt-24 p-5 sm:p-6"
                    aria-labelledby={`section-heading-${index + 1}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.03] font-mono text-[10px] text-dim">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2
                        id={`section-heading-${index + 1}`}
                        className="text-[16px] font-semibold leading-snug text-frost sm:text-[17px]"
                      >
                        {section.heading}
                      </h2>
                    </div>

                    <div className="prose-cyber mt-3 space-y-3 pl-0 sm:pl-10">
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} className="text-[12.5px] leading-[1.9]">
                          {paragraph}
                        </p>
                      ))}

                      {section.bullets ? (
                        <ul className="space-y-2 pt-1">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-2.5 text-[11.5px] leading-relaxed">
                              <ChevronRight
                                className="mt-[3px] h-3 w-3 shrink-0 text-aqua/70"
                                aria-hidden="true"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {section.callout && callout && CalloutIcon ? (
                        <div className={cn("mt-4 rounded-xl border p-4", callout.className)}>
                          <div className="flex items-start gap-2.5">
                            <span
                              className={cn(
                                "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                                callout.iconClass,
                              )}
                            >
                              <CalloutIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <div>
                              <p className={cn("text-[10px] font-bold uppercase tracking-[0.12em]", callout.titleClass)}>
                                {callout.label}
                              </p>
                              <p className="mt-1 text-[11.5px] font-semibold text-[#e4eefc]">
                                {section.callout.title}
                              </p>
                              <p className="mt-1 text-[10.5px] leading-relaxed text-mist">
                                {section.callout.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          </article>

          <section
            id="takeaways"
            className="panel mt-4 scroll-mt-24 p-5 sm:p-6"
            aria-labelledby="takeaways-heading"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-iris/20 bg-iris/[0.07] text-[#c3b2ff]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 id="takeaways-heading" className="text-[13px] font-semibold text-frost">
                  Key takeaways
                </h2>
                <p className="text-[9.5px] text-dim">The four ideas worth remembering</p>
              </div>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {lesson.takeaways.map((takeaway) => (
                <li
                  key={takeaway}
                  className="flex items-start gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2.5 text-[10.5px] leading-relaxed text-mist"
                >
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-300/80" aria-hidden="true" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </section>

          <section
            id="recall-check"
            ref={quizRef}
            className="panel mt-4 scroll-mt-24 p-5 sm:p-6"
            aria-labelledby="recall-heading"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300">
                  <ListChecks className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="recall-heading" className="text-[13px] font-semibold text-frost">
                    Recall check
                  </h2>
                  <p className="text-[9.5px] text-dim">
                    {lesson.quiz.length} questions · 60% needed to complete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {bestScore !== undefined ? (
                  <Badge tone={completed ? "success" : "warning"}>Best {bestScore}%</Badge>
                ) : null}
                <Badge tone="neutral">
                  {submitted ? `${result?.correct ?? 0}/${lesson.quiz.length} correct` : `${answeredCount}/${lesson.quiz.length} answered`}
                </Badge>
              </div>
            </div>

            <div className="mt-4" aria-live="polite">
              {submitted && result ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-xl border p-4",
                    result.passed ? "border-emerald-400/20 bg-emerald-400/[0.045]" : "border-amber-400/20 bg-amber-400/[0.045]",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid h-10 w-10 place-items-center rounded-full",
                          result.passed ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300",
                        )}
                      >
                        {result.passed ? <Trophy className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                      </span>
                      <div>
                        <h3
                          ref={resultHeadingRef}
                          tabIndex={-1}
                          className="text-[13px] font-semibold text-frost"
                        >
                          {result.passed
                            ? completed
                              ? "Lesson complete — best score saved"
                              : "Lesson complete"
                            : "Not passed yet — review and retake"}
                        </h3>
                        <p className="mt-0.5 text-[10px] text-dim">
                          {result.correct} of {result.total} correct · {result.percent}%
                          {result.passed ? " · counts toward your awareness score" : " · 60% required to complete"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={retakeQuiz} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                        <RotateCcw className="h-3.5 w-3.5" /> Retake
                      </button>
                      {nextLesson && result.passed ? (
                        <Link
                          href={`/academy/${nextLesson.slug}`}
                          className={buttonStyles({ size: "sm" })}
                        >
                          Next lesson <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={result.percent}
                      tone={result.passed ? "success" : "warning"}
                      size="sm"
                      label="Quiz score"
                    />
                  </div>
                </motion.div>
              ) : null}
            </div>

            <div className="mt-4 space-y-3">
              {lesson.quiz.map((question, questionIndex) => {
                const chosen = answers[questionIndex];
                const isCorrect = submitted && chosen === question.answer;
                const isWrong = submitted && chosen !== undefined && chosen !== question.answer;
                return (
                  <div
                    key={question.question}
                    className={cn(
                      "rounded-xl border p-4",
                      isCorrect
                        ? "border-emerald-400/15 bg-emerald-400/[0.025]"
                        : isWrong
                          ? "border-rose-400/15 bg-rose-400/[0.025]"
                          : "border-white/[0.065] bg-white/[0.015]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[11.5px] font-medium leading-relaxed text-[#e4eefc]">
                        <span className="mr-2 font-mono text-[9px] text-dim">
                          {String(questionIndex + 1).padStart(2, "0")}
                        </span>
                        {question.question}
                      </p>
                      {submitted ? (
                        isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" aria-label="Correct" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-rose-300" aria-label="Incorrect" />
                        )
                      ) : null}
                    </div>

                    <div
                      role="radiogroup"
                      aria-label={`Question ${questionIndex + 1}`}
                      className="mt-3 grid gap-1.5 sm:grid-cols-2"
                    >
                      {question.options.map((option, optionIndex) => {
                        const selectedOption = chosen === optionIndex;
                        const correctOption = submitted && optionIndex === question.answer;
                        return (
                          <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={selectedOption}
                            onClick={() => chooseAnswer(questionIndex, optionIndex)}
                            disabled={submitted}
                            className={cn(
                              "flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-[10.5px] leading-relaxed transition-colors",
                              correctOption
                                ? "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-200"
                                : selectedOption
                                  ? submitted
                                    ? "border-rose-400/25 bg-rose-400/[0.06] text-rose-200"
                                    : "border-aqua/30 bg-aqua/[0.07] text-[#dffdf9]"
                                  : "border-white/[0.06] bg-white/[0.015] text-mist hover:border-white/[0.12] hover:text-frost",
                              submitted && "cursor-default",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[8px]",
                                correctOption
                                  ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200"
                                  : selectedOption
                                    ? "border-aqua/40 bg-aqua/15 text-aqua"
                                    : "border-white/[0.14] text-transparent",
                              )}
                            >
                              {selectedOption || correctOption ? "●" : "○"}
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {submitted ? (
                      <div className="mt-3 rounded-lg border border-white/[0.055] bg-black/20 px-3 py-2.5">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-dim">
                          Why this is the answer
                        </p>
                        <p className="mt-1 text-[10.5px] leading-relaxed text-mist">{question.explanation}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {!submitted ? (
              <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center">
                <p className="text-[9.5px] text-dim">
                  {allAnswered
                    ? "All questions answered. Submit when you're ready."
                    : `Answer ${lesson.quiz.length - answeredCount} more question${lesson.quiz.length - answeredCount === 1 ? "" : "s"} to submit.`}
                </p>
                <button
                  type="button"
                  onClick={submitQuiz}
                  disabled={!allAnswered}
                  className={buttonStyles({
                    size: "md",
                    className: cn("w-full sm:w-auto", !allAnswered && "cursor-not-allowed opacity-45"),
                  })}
                >
                  Submit answers <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center">
                <p className="flex items-center gap-1.5 text-[9.5px] text-dim">
                  <LockKeyhole className="h-3 w-3 text-aqua/60" />
                  Best score is stored in this browser only.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={retakeQuiz} className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    <RotateCcw className="h-3.5 w-3.5" /> Try again
                  </button>
                  {nextLesson ? (
                    <Link href={`/academy/${nextLesson.slug}`} className={buttonStyles({ size: "sm" })}>
                      Next: {nextLesson.category} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link href="/academy" className={buttonStyles({ size: "sm" })}>
                      Back to academy <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>

          <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 text-[9.5px] leading-relaxed text-dim">
              <BookOpenCheck className="h-3.5 w-3.5 shrink-0 text-aqua/70" />
              Reading is not the same as practising. Try the phishing lab to apply this lesson to a realistic message.
            </p>
            <Link
              href="/phishing"
              className="shrink-0 text-[10px] font-semibold text-[#8db4e7] transition-colors hover:text-aqua"
            >
              Open the lab →
            </Link>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            <nav className="panel p-4" aria-label="On this page">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-dim">On this page</p>
              <ol className="mt-2.5 space-y-0.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded-md px-2 py-1.5 text-[10px] leading-snug text-mist transition-colors hover:bg-white/[0.03] hover:text-frost"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="panel p-4">
              <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-dim">
                <Trophy className="h-3 w-3 text-amber-300/80" /> Your progress
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="text-mist">Lesson status</span>
                <span className={completed ? "font-medium text-emerald-300" : "text-dim"}>
                  {completed ? "Completed" : bestScore !== undefined ? "In progress" : "Not started"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-mist">Best quiz</span>
                <span className="font-mono text-dim">{bestScore === undefined ? "—" : `${bestScore}%`}</span>
              </div>
              <ProgressBar
                value={bestScore ?? 0}
                tone={completed ? "success" : "warning"}
                size="sm"
                className="mt-2.5"
                label="Best quiz score"
              />
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="text-mist">Academy path</span>
                <span className="font-mono text-dim">{lessonIndex}/{lessons.length}</span>
              </div>
              <ProgressBar
                value={(lessonIndex / lessons.length) * 100}
                tone="aqua"
                size="sm"
                className="mt-2.5"
                label="Academy path position"
              />
              <p className="mt-3 border-t border-white/[0.06] pt-2.5 text-[8.5px] leading-relaxed text-dim">
                Progress is calculated locally. No account or server stores your answers.
              </p>
            </div>

            <div className="rounded-xl border border-aqua/15 bg-aqua/[0.035] p-4">
              <p className="flex items-center gap-1.5 text-[9.5px] font-semibold text-[#8df4eb]">
                <Lightbulb className="h-3 w-3" /> Apply it
              </p>
              <p className="mt-1.5 text-[9px] leading-relaxed text-mist">
                Open the URL scanner and inspect a link that has been sitting in your messages. Reading structure is a
                skill that improves with repetition.
              </p>
              <Link
                href="/scanner"
                className="mt-2.5 inline-flex items-center gap-1 text-[9.5px] font-semibold text-aqua hover:text-[#8df4eb]"
              >
                Open scanner <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
