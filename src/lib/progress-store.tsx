"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { analyzeUrl } from "./analyzer";
import { phishingScenarios } from "./data/phishing";
import { computeScore } from "./score";
import type {
  ActivityEvent,
  PhishingAttempt,
  ProgressState,
  ScanResult,
  ScoreBreakdown,
} from "./types";
import { getDayKey } from "./utils";

const STORAGE_KEY = "cybershield.progress.v1";
const STATE_VERSION = 1;
const MAX_SCANS = 40;
const MAX_ACTIVITY = 200;

export const emptyProgressState: ProgressState = {
  version: STATE_VERSION,
  completedLessons: [],
  lessonScores: {},
  phishingAttempts: {},
  scans: [],
  activity: [],
  seededDemo: false,
};

function uid(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isoDaysAgo(daysAgo: number, hour: number, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function buildDemoScans(): ScanResult[] {
  const samples = [
    { url: "https://www.wikipedia.org/wiki/Phishing", at: isoDaysAgo(1, 16, 12) },
    { url: "https://drive-google.com-share.xyz/account/verify?session=3fa9", at: isoDaysAgo(2, 11, 40) },
    { url: "http://192.168.1.20:8080/secure-login/verify?id=8842", at: isoDaysAgo(4, 9, 5) },
  ];

  return samples.flatMap(({ url, at }) => {
    const outcome = analyzeUrl(url, { demo: true, analyzedAt: at });
    return outcome.ok ? [outcome.result] : [];
  });
}

function buildDemoActivity(): ActivityEvent[] {
  const perDay = [3, 2, 4, 2, 3, 4, 1];
  const kinds: Array<{ kind: ActivityEvent["kind"]; label: string; xp: number }> = [
    { kind: "lesson", label: "Completed a short lesson", xp: 15 },
    { kind: "phishing", label: "Analysed a phishing simulation", xp: 10 },
    { kind: "scan", label: "Checked an unfamiliar URL", xp: 5 },
  ];
  const events: ActivityEvent[] = [];
  const today = new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const count = perDay[6 - offset] ?? 0;
    for (let index = 0; index < count; index += 1) {
      const template = kinds[(offset + index) % kinds.length];
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() - offset);
      eventDate.setHours(9 + index * 2, (offset * 7 + index * 11) % 60, 0, 0);
      events.push({
        id: `demo-${offset}-${index}`,
        kind: template.kind,
        label: template.label,
        xp: template.xp,
        at: eventDate.toISOString(),
        demo: true,
      });
    }
  }
  return events;
}

export function createInitialState(): ProgressState {
  return {
    ...emptyProgressState,
    version: STATE_VERSION,
    scans: buildDemoScans(),
    activity: buildDemoActivity(),
    seededDemo: true,
  };
}

function sanitizeState(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<ProgressState>;
  if (candidate.version !== STATE_VERSION) return null;
  if (!Array.isArray(candidate.scans) || !Array.isArray(candidate.activity)) return null;
  return {
    version: STATE_VERSION,
    completedLessons: Array.isArray(candidate.completedLessons)
      ? candidate.completedLessons.filter((item): item is string => typeof item === "string")
      : [],
    lessonScores:
      candidate.lessonScores && typeof candidate.lessonScores === "object"
        ? (candidate.lessonScores as Record<string, number>)
        : {},
    phishingAttempts:
      candidate.phishingAttempts && typeof candidate.phishingAttempts === "object"
        ? (candidate.phishingAttempts as Record<string, PhishingAttempt>)
        : {},
    scans: candidate.scans as ScanResult[],
    activity: (candidate.activity as ActivityEvent[]).slice(0, MAX_ACTIVITY),
    seededDemo: Boolean(candidate.seededDemo),
  };
}

interface ProgressContextValue {
  state: ProgressState;
  hydrated: boolean;
  score: ScoreBreakdown;
  addScan: (scan: ScanResult) => void;
  removeScan: (id: string) => void;
  clearScans: () => void;
  removeDemoData: () => void;
  recordLesson: (slug: string, percentScore: number) => void;
  recordPhishing: (scenarioId: string, attempt: PhishingAttempt) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function activityId(): string {
  return uid("act");
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyProgressState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydration is intentionally deferred one tick so the first client render
    // matches the server markup before localStorage data is applied.
    const timer = window.setTimeout(() => {
      let next: ProgressState;
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          next = sanitizeState(JSON.parse(stored)) ?? createInitialState();
        } else {
          next = createInitialState();
        }
      } catch {
        next = createInitialState();
      }
      setState(next);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be disabled or full. The session still works in memory.
    }
  }, [state, hydrated]);

  const addScan = useCallback((scan: ScanResult) => {
    setState((previous) => {
      const scans = [scan, ...previous.scans].slice(0, MAX_SCANS);
      const activity = scan.demo
        ? previous.activity
        : [
            {
              id: activityId(),
              kind: "scan" as const,
              label: `Analysed ${scan.hostname || "a URL"}`,
              xp: 5,
              at: scan.analyzedAt,
            },
            ...previous.activity,
          ].slice(0, MAX_ACTIVITY);
      return { ...previous, scans, activity };
    });
  }, []);

  const removeScan = useCallback((id: string) => {
    setState((previous) => ({
      ...previous,
      scans: previous.scans.filter((scan) => scan.id !== id),
    }));
  }, []);

  const clearScans = useCallback(() => {
    setState((previous) => ({
      ...previous,
      scans: [],
      seededDemo: previous.scans.some((scan) => scan.demo) ? false : previous.seededDemo,
    }));
  }, []);

  const removeDemoData = useCallback(() => {
    setState((previous) => ({
      ...previous,
      scans: previous.scans.filter((scan) => !scan.demo),
      activity: previous.activity.filter((event) => !event.demo),
      seededDemo: false,
    }));
  }, []);

  const recordLesson = useCallback((slug: string, percentScore: number) => {
    setState((previous) => {
      const best = Math.max(previous.lessonScores[slug] ?? 0, percentScore);
      const passed = percentScore >= 60;
      const alreadyCompleted = previous.completedLessons.includes(slug);
      const completedLessons =
        passed && !alreadyCompleted ? [...previous.completedLessons, slug] : previous.completedLessons;
      const activity =
        passed && !alreadyCompleted
          ? [
              {
                id: activityId(),
                kind: "lesson" as const,
                label: `Completed “${slug.replace(/-/g, " ")}”`,
                xp: 15,
                at: new Date().toISOString(),
              },
              ...previous.activity,
            ].slice(0, MAX_ACTIVITY)
          : previous.activity;
      return {
        ...previous,
        completedLessons,
        lessonScores: { ...previous.lessonScores, [slug]: best },
        activity,
      };
    });
  }, []);

  const recordPhishing = useCallback((scenarioId: string, attempt: PhishingAttempt) => {
    setState((previous) => {
      const existing = previous.phishingAttempts[scenarioId];
      const best = existing && existing.score >= attempt.score ? existing : attempt;
      const isFirst = !existing;
      const scenario = phishingScenarios.find((item) => item.id === scenarioId);
      const activity = isFirst
        ? [
            {
              id: activityId(),
              kind: "phishing" as const,
              label: `Phishing lab: ${scenario?.channel === "sms" ? "SMS" : scenario?.channel === "dm" ? "DM" : "email"} scenario scored ${attempt.score}%`,
              xp: 10,
              at: new Date().toISOString(),
            },
            ...previous.activity,
          ].slice(0, MAX_ACTIVITY)
        : previous.activity;
      return {
        ...previous,
        phishingAttempts: { ...previous.phishingAttempts, [scenarioId]: best },
        activity,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh: ProgressState = {
      ...emptyProgressState,
      version: STATE_VERSION,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore storage errors
    }
    setState(fresh);
  }, []);

  const score = useMemo(() => computeScore(state), [state]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      hydrated,
      score,
      addScan,
      removeScan,
      clearScans,
      removeDemoData,
      recordLesson,
      recordPhishing,
      resetProgress,
    }),
    [
      state,
      hydrated,
      score,
      addScan,
      removeScan,
      clearScans,
      removeDemoData,
      recordLesson,
      recordPhishing,
      resetProgress,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside a ProgressProvider");
  }
  return context;
}

export function getWeeklyActivity(activity: ActivityEvent[], includeDemo: boolean, days = 7) {
  const today = new Date();
  const output: Array<{ key: string; label: string; events: number; xp: number; demo: number }> = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = getDayKey(date);
    const label = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
    const matching = activity.filter((event) => getDayKey(new Date(event.at)) === key && (includeDemo || !event.demo));
    output.push({
      key,
      label,
      events: matching.length,
      xp: matching.reduce((total, event) => total + event.xp, 0),
      demo: matching.filter((event) => event.demo).length,
    });
  }
  return output;
}
