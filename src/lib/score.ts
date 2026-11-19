import type { ProgressState, Recommendation, ScoreBreakdown } from "./types";
import { lessons } from "./data/lessons";
import { phishingScenarios } from "./data/phishing";
import { clamp } from "./utils";

/**
 * The awareness score is an educational progress metric, not a security audit
 * of the user's device or accounts. It combines deliberate practice across the
 * platform and is fully explainable from data stored on this device.
 */
export function computeScore(state: ProgressState): ScoreBreakdown {
  const realScans = state.scans.filter((scan) => !scan.demo);
  const lessonsCompleted = state.completedLessons.length;
  const attempts = Object.values(state.phishingAttempts);
  const phishingCompleted = attempts.length;
  const averagePhishingScore = phishingCompleted
    ? attempts.reduce((total, attempt) => total + attempt.score, 0) / phishingCompleted
    : 0;

  const baseline = 10;
  const academy = (lessonsCompleted / lessons.length) * 40;
  const coverage = (phishingCompleted / phishingScenarios.length) * 20;
  const accuracy = (averagePhishingScore / 100) * 15;
  const phishing = clamp(coverage + accuracy, 0, 35);
  const practice = clamp(realScans.length * 5, 0, 15);
  const total = Math.round(clamp(baseline + academy + phishing + practice));

  const level =
    total >= 90
      ? "CyberShield pro"
      : total >= 75
        ? "Sharp-eyed defender"
        : total >= 55
          ? "Confident learner"
          : total >= 30
            ? "Building awareness"
            : "Just getting started";

  const levelBlurb =
    total >= 90
      ? "Habits look strong. Keep them fresh with occasional practice."
      : total >= 75
        ? "You can recognise most common traps. A little more practice will sharpen the edge."
        : total >= 55
          ? "Solid foundations. Finish the academy and complete a few more lab scenarios."
          : total >= 30
            ? "You've started building the right instincts. Keep going."
            : "Complete a lesson or a lab scenario to start building your score.";

  return {
    total,
    baseline,
    academy: Math.round(academy),
    phishing: Math.round(phishing),
    practice: Math.round(practice),
    lessonsCompleted,
    phishingCompleted,
    scansRun: realScans.length,
    averagePhishingScore: Math.round(averagePhishingScore),
    level,
    levelBlurb,
  };
}

export function phishingBestScore(state: ProgressState, scenarioId: string): number | null {
  return state.phishingAttempts[scenarioId]?.score ?? null;
}

export function getRecommendations(state: ProgressState, score: ScoreBreakdown): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const completed = new Set(state.completedLessons);
  const attempted = new Set(Object.keys(state.phishingAttempts));

  if (!completed.has("spot-the-hook")) {
    recommendations.push({
      id: "rec-phishing-basics",
      title: "Start with phishing fundamentals",
      body: "Eight focused minutes on sender checks, link anatomy and what to do after a bad click.",
      href: "/academy/spot-the-hook",
      cta: "Open lesson",
      priority: "high",
    });
  }

  if (score.scansRun === 0) {
    recommendations.push({
      id: "rec-first-scan",
      title: "Analyse a link before you trust it",
      body: "Paste a suspicious URL into the scanner. Nothing is visited or sent anywhere.",
      href: "/scanner",
      cta: "Try the scanner",
      priority: "high",
    });
  }

  if (attempted.size === 0) {
    recommendations.push({
      id: "rec-first-lab",
      title: "Test your instincts in the Wild Mail lab",
      body: "Spot the red flags in a fictional message and get a full explanation of every answer.",
      href: "/phishing",
      cta: "Enter the lab",
      priority: "high",
    });
  } else if (attempted.size < phishingScenarios.length) {
    recommendations.push({
      id: "rec-more-lab",
      title: "Your next phishing challenge is ready",
      body: `${attempted.size} of ${phishingScenarios.length} simulations analysed. Try a different channel to broaden your pattern recognition.`,
      href: "/phishing",
      cta: "Continue lab",
      priority: "medium",
    });
  }

  if (score.averagePhishingScore > 0 && score.averagePhishingScore < 70) {
    recommendations.push({
      id: "rec-precision",
      title: "Refine your signal-to-noise",
      body: "You're catching threats, but false positives are costly too. Review the explanations after your next scenario.",
      href: "/phishing",
      cta: "Retry a scenario",
      priority: "medium",
    });
  }

  if (!completed.has("passwords-that-hold")) {
    recommendations.push({
      id: "rec-passwords",
      title: "Make reuse a thing of the past",
      body: "A unique password for every account is the real upgrade. Learn the 15-minute reset.",
      href: "/academy/passwords-that-hold",
      cta: "Open lesson",
      priority: completed.has("spot-the-hook") ? "high" : "medium",
    });
  }

  if (!completed.has("trust-but-verify") && attempted.size >= 2) {
    recommendations.push({
      id: "rec-social",
      title: "Practise out-of-band verification",
      body: "The simplest defence against impersonation is a callback through a channel you choose.",
      href: "/academy/trust-but-verify",
      cta: "Open lesson",
      priority: "medium",
    });
  }

  if (!completed.has("privacy-footprint")) {
    recommendations.push({
      id: "rec-privacy",
      title: "Shrink your data footprint",
      body: "Audit app access, reduce public details and use practical privacy defaults.",
      href: "/academy/privacy-footprint",
      cta: "Open lesson",
      priority: "low",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-maintain",
      title: "Run a quarterly account check-up",
      body: "Review active sessions, connected apps and recovery details. Strong habits need occasional maintenance.",
      href: "/academy/privacy-footprint",
      cta: "Review privacy lesson",
      priority: "low",
    });
  }

  const priorityRank = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]).slice(0, 3);
}
