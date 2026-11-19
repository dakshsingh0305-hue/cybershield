export type RiskLevel = "low" | "medium" | "high";

export type Severity = "info" | "low" | "medium" | "high";

export type ScanCategory = "transport" | "domain" | "structure" | "content";

export interface ScanIndicator {
  id: string;
  label: string;
  severity: Severity;
  weight: number;
  category: ScanCategory;
  detail: string;
  explanation: string;
}

export interface PassedCheck {
  label: string;
  detail: string;
}

export interface ScanResult {
  id: string;
  input: string;
  normalized: string;
  hostname: string;
  path: string;
  score: number;
  level: RiskLevel;
  indicators: ScanIndicator[];
  passed: PassedCheck[];
  analyzedAt: string;
  demo?: boolean;
}

export type AnalyzeOutcome =
  | { ok: true; result: ScanResult }
  | { ok: false; error: string };

export type ActivityKind = "scan" | "phishing" | "lesson";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  label: string;
  xp: number;
  at: string;
  demo?: boolean;
}

export interface PhishingAttempt {
  verdictCorrect: boolean;
  score: number;
  found: number;
  total: number;
  completedAt: string;
}

export interface ProgressState {
  version: number;
  completedLessons: string[];
  lessonScores: Record<string, number>;
  phishingAttempts: Record<string, PhishingAttempt>;
  scans: ScanResult[];
  activity: ActivityEvent[];
  seededDemo: boolean;
}

export type LessonCategory =
  | "Phishing"
  | "Passwords"
  | "Social Engineering"
  | "Public Wi-Fi"
  | "Privacy";

export interface LessonCallout {
  type: "tip" | "warning" | "info";
  title: string;
  body: string;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: LessonCallout;
}

export interface LessonQuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  category: LessonCategory;
  duration: number;
  level: "Beginner" | "Intermediate";
  objectives: string[];
  sections: LessonSection[];
  takeaways: string[];
  quiz: LessonQuizQuestion[];
}

export type PhishingChannel = "email" | "sms" | "dm";

export type MessageSegment =
  | { type: "text"; text: string }
  | { type: "hotspot"; spotId: string; text: string }
  | { type: "break" };

export interface PhishingHotspot {
  id: string;
  text: string;
  suspicious: boolean;
  explanation: string;
}

export interface PhishingScenario {
  id: string;
  channel: PhishingChannel;
  senderName: string;
  senderAddress: string;
  replyTo?: string;
  subject: string;
  preview: string;
  receivedAt: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isPhishing: boolean;
  attachment?: string;
  body: MessageSegment[];
  hotspots: PhishingHotspot[];
  verdictExplanation: string;
  safeAction: string;
  lessonSlug?: string;
}

export interface ScoreBreakdown {
  total: number;
  baseline: number;
  academy: number;
  phishing: number;
  practice: number;
  lessonsCompleted: number;
  phishingCompleted: number;
  scansRun: number;
  averagePhishingScore: number;
  level: string;
  levelBlurb: string;
}

export interface Recommendation {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  priority: "high" | "medium" | "low";
}
