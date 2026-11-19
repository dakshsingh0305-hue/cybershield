"use client";

import {
  Check,
  CheckCircle2,
  Copy,
  Info,
  LockKeyhole,
  OctagonAlert,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge, RiskBadge, riskTone, type BadgeTone } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { RadialScore } from "@/components/ui/radial-score";
import type { RiskLevel, ScanIndicator, ScanResult, Severity } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

const signalMeta: Record<Severity, { label: string; tone: BadgeTone; icon: typeof TriangleAlert }> = {
  high: { label: "High signal", tone: "danger", icon: OctagonAlert },
  medium: { label: "Medium signal", tone: "warning", icon: TriangleAlert },
  low: { label: "Low signal", tone: "info", icon: Info },
  info: { label: "Context", tone: "neutral", icon: Info },
};

const categoryLabels: Record<ScanIndicator["category"], string> = {
  transport: "Transport",
  domain: "Domain",
  structure: "Structure",
  content: "Content",
};

function verdictCopy(level: RiskLevel, count: number): string {
  if (count === 0) {
    return "No common heuristic red flags were detected. This is not a safety guarantee — continue with normal caution.";
  }
  if (level === "high") {
    return "Several high-weight patterns commonly used in phishing appear in this URL. Treat it as untrusted until you verify it through an independent channel.";
  }
  if (level === "medium") {
    return "Some patterns warrant caution. Verify the destination through an official source before entering credentials, payment details or personal information.";
  }
  return "Only weak heuristic signals were found. That does not prove the site is safe — treat the score as a prompt to look closer, not a verdict.";
}

export function ScanResultPanel({
  scan,
  onAnalyzeAnother,
  onRemove,
}: {
  scan: ScanResult;
  onAnalyzeAnother: () => void;
  onRemove?: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copySummary() {
    const summary = `CyberShield local heuristic result: ${scan.score}/100 (${scan.level} risk) for ${scan.normalized}. ${scan.indicators.length} signal(s) found. This is not a safety verdict.`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setCopyError(false);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="panel relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-aqua/60 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal/[0.06] blur-[80px]" />

      <div className="relative flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-aqua">Heuristic analysis</p>
            <RiskBadge level={scan.level} />
            {scan.demo ? <Badge tone="warning">Sample record</Badge> : null}
          </div>
          <h2 id="scan-result-heading" tabIndex={-1} className="mt-2 break-all font-mono text-[15px] font-medium leading-relaxed text-frost sm:text-[17px]">
            {scan.hostname}
          </h2>
          <p className="mt-1 break-all font-mono text-[10px] leading-relaxed text-dim">{scan.normalized}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[9.5px] text-dim">
            <LockKeyhole className="h-2.5 w-2.5 text-aqua/70" />
            Analyzed locally on {formatDateTime(scan.analyzedAt)} · URL never opened
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copySummary}
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy summary"}
          </button>
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            New analysis
          </button>
          {onRemove ? (
            <button
              type="button"
              onClick={() => onRemove(scan.id)}
              className={buttonStyles({ variant: "ghost", size: "sm", className: "text-dim" })}
              aria-label="Remove this result from history"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {copyError ? (
        <p role="alert" className="border-b border-rose-400/15 bg-rose-400/[0.05] px-5 py-2 text-[10px] text-rose-300">
          Clipboard access was blocked by your browser. You can still read the summary on this page.
        </p>
      ) : null}

      <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <div>
          <div className="flex items-center gap-4 lg:flex-col lg:items-start">
            <RadialScore
              value={scan.score}
              tone={scan.level}
              size={150}
              strokeWidth={9}
              ariaLabel={`Heuristic risk score ${scan.score} out of 100, ${scan.level} risk`}
            >
              <span className="text-[2.1rem] font-semibold leading-none text-frost">{scan.score}</span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-dim">risk score</span>
            </RadialScore>
            <div className="min-w-0">
              <Badge tone={riskTone[scan.level]} dot>
                {scan.level === "high" ? "High risk signals" : scan.level === "medium" ? "Suspicious patterns" : "Low signal count"}
              </Badge>
              <p className="mt-3 text-[11.5px] leading-relaxed text-mist">{verdictCopy(scan.level, scan.indicators.length)}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4 text-center lg:grid-cols-2">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-2">
              <p className="text-lg font-semibold text-frost">{scan.indicators.length}</p>
              <p className="text-[8.5px] uppercase tracking-[0.1em] text-dim">signals</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-2">
              <p className="text-lg font-semibold text-frost">{scan.passed.length}</p>
              <p className="text-[8.5px] uppercase tracking-[0.1em] text-dim">checks passed</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-amber-400/15 bg-amber-400/[0.04] p-3">
            <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-amber-300">
              <ShieldAlert className="h-3 w-3" /> Heuristic, not verdict
            </p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-amber-200/65">
              Scores are rule-based pattern matches. They cannot confirm malware, fraud or legitimacy.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[13px] font-semibold text-frost">
              {scan.indicators.length > 0 ? `Signals detected (${scan.indicators.length})` : "No heuristic signals detected"}
            </h3>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-dim">
              weight / 100
            </span>
          </div>

          {scan.indicators.length === 0 ? (
            <div className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <p className="text-[12px] font-semibold">This URL did not trigger any rules.</p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-emerald-100/65">
                That is not a green light. The scanner has no reputation data, cannot see the page and does not know
                whether the domain is newly registered, compromised or serving a targeted scam. Continue with normal
                caution.
              </p>
              <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {scan.passed.map((check) => (
                  <div key={check.label} className="flex items-start gap-2 text-[10px] text-emerald-100/70">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>
                      <span className="font-medium text-emerald-200/90">{check.label}</span>
                      <span className="block text-[9px] leading-relaxed text-dim">{check.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {scan.indicators.map((indicator) => {
                const meta = signalMeta[indicator.severity];
                const Icon = meta.icon;
                return (
                  <li
                    key={indicator.id}
                    className={cn(
                      "rounded-xl border p-3.5",
                      indicator.severity === "high"
                        ? "border-rose-400/15 bg-rose-400/[0.035]"
                        : indicator.severity === "medium"
                          ? "border-amber-400/15 bg-amber-400/[0.03]"
                          : "border-white/[0.07] bg-white/[0.02]",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2">
                        <span
                          className={cn(
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md",
                            indicator.severity === "high"
                              ? "bg-rose-400/10 text-rose-300"
                              : indicator.severity === "medium"
                                ? "bg-amber-400/10 text-amber-300"
                                : "bg-sky-400/10 text-sky-300",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-[11.5px] font-semibold text-[#e3edfb]">{indicator.label}</p>
                          <p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-dim">
                            {categoryLabels[indicator.category]} · {meta.label}
                          </p>
                        </div>
                      </div>
                      <span className="rounded border border-white/[0.08] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] text-dim">
                        +{indicator.weight}
                      </span>
                    </div>
                    <p className="mt-2 break-words font-mono text-[9.5px] leading-relaxed text-[#9fb4d1]">{indicator.detail}</p>
                    <p className="mt-1.5 text-[10.5px] leading-relaxed text-mist">{indicator.explanation}</p>
                  </li>
                );
              })}
            </ul>
          )}

          {scan.indicators.length > 0 && scan.passed.length > 0 ? (
            <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-dim">Checks that passed</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {scan.passed.map((check) => (
                  <span
                    key={check.label}
                    className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[9px] text-mist"
                    title={check.detail}
                  >
                    <Check className="h-2.5 w-2.5 text-emerald-300/80" />
                    {check.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative border-t border-white/[0.07] bg-white/[0.012] p-5 sm:p-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-frost">What this analysis cannot tell you</h3>
        <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[
            "Whether the page contains malware, phishing forms or malicious scripts",
            "Whether the domain has a good or bad reputation, or was recently registered",
            "Whether the TLS certificate is valid, stolen or issued to the real organization",
            "Whether a legitimate site has been compromised or is running a scam",
          ].map((item) => (
            <p key={item} className="flex items-start gap-2 text-[9.5px] leading-relaxed text-dim">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-300/70" />
              {item}
            </p>
          ))}
        </div>
        <p className="mt-3 text-[9.5px] leading-relaxed text-dim">
          If you are unsure, navigate to the organization&apos;s known website yourself or contact them through a
          published phone number. Do not rely on this score alone.
        </p>
      </div>
    </div>
  );
}

