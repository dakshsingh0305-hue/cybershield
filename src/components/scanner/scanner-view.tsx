"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronRight,
  CircleDot,
  EyeOff,
  FileWarning,
  Globe,
  Info,
  Link2,
  Loader2,
  LockKeyhole,
  Radar,
  ScanSearch,
  Search,
  ShieldQuestion,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ScanResultPanel } from "@/components/scanner/scan-result-panel";
import { Badge, RiskBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { analyzeUrl } from "@/lib/analyzer";
import { useProgress } from "@/lib/progress-store";
import type { RiskLevel, ScanResult } from "@/lib/types";
import { cn, formatRelativeTime, truncate } from "@/lib/utils";

const sampleUrls = [
  {
    label: "Low-signal example",
    url: "https://www.wikipedia.org/wiki/Phishing",
  },
  {
    label: "Lookalike example",
    url: "https://cloudvault-login.verify-account.xyz/secure/signin",
  },
  {
    label: "IP-host example",
    url: "http://203.0.113.42:8080/billing/update",
  },
];

const loadingStages = [
  "Parsing URL structure",
  "Checking domain and lookalike patterns",
  "Scoring heuristic signals",
];

const filterOptions: Array<{ label: string; value: RiskLevel | "all" }> = [
  { label: "All", value: "all" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

function UrlAnatomy() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#040a13]/80 p-4">
      <div className="flex flex-wrap items-end gap-x-0.5 gap-y-3 font-mono text-[13px] sm:text-[15px]">
        <span className="border-b-2 border-emerald-400/50 px-0.5 pb-1 text-emerald-300">https://</span>
        <span className="border-b-2 border-iris/50 px-0.5 pb-1 text-[#c3b2ff]">cloudvault.com.</span>
        <span className="border-b-2 border-rose-400/60 px-0.5 pb-1 text-rose-300">account-verify.xyz</span>
        <span className="border-b-2 border-aqua/50 px-0.5 pb-1 text-[#8df4eb]">/signin</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] sm:grid-cols-4">
        {[
          { color: "bg-emerald-400", label: "Protocol" },
          { color: "bg-iris", label: "Subdomain" },
          { color: "bg-rose-400", label: "Real domain" },
          { color: "bg-aqua", label: "Path" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-dim">
            <span className={cn("h-1.5 w-1.5 rounded-full", item.color)} />
            {item.label}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-start gap-2 border-t border-white/[0.06] pt-3 text-[10px] leading-relaxed text-mist">
        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-aqua" />
        Read right to left until the first single slash. Here the real destination is{" "}
        <span className="font-mono text-[#e3edfb]">account-verify.xyz</span> — the trusted-looking name before it is just
        a subdomain.
      </p>
    </div>
  );
}

export function ScannerSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-3">
        <div className="h-3 w-44 rounded bg-white/[0.05]" />
        <div className="h-9 w-80 max-w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-[520px] max-w-full rounded bg-white/[0.04]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="panel h-[330px]" />
        <div className="panel h-[330px]" />
      </div>
      <div className="panel h-[170px]" />
    </div>
  );
}

export function ScannerView() {
  const { state, hydrated, addScan, removeScan, clearScans, removeDemoData } = useProgress();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ScanResult | null>(null);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const processedView = useRef<string | null>(null);
  const prefilled = useRef(false);

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (!urlParam || prefilled.current) return;
    prefilled.current = true;
    const timer = window.setTimeout(() => setInput(urlParam), 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (!hydrated) return;
    const viewId = searchParams.get("view");
    if (!viewId || processedView.current === viewId) return;
    const scan = state.scans.find((item) => item.id === viewId);
    if (!scan) return;
    processedView.current = viewId;
    const timer = window.setTimeout(() => setSelected(scan), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, searchParams, state.scans]);

  useEffect(() => {
    const timersList = timers.current;
    return () => {
      timersList.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const filteredScans = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return state.scans.filter((scan) => {
      if (riskFilter !== "all" && scan.level !== riskFilter) return false;
      if (!normalizedQuery) return true;
      return (
        scan.hostname.toLowerCase().includes(normalizedQuery) ||
        scan.normalized.toLowerCase().includes(normalizedQuery) ||
        scan.input.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [state.scans, riskFilter, query]);

  const hasDemo = state.scans.some((scan) => scan.demo);
  const realCount = state.scans.filter((scan) => !scan.demo).length;

  function scrollToResult() {
    const behavior: ScrollBehavior =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior, block: "start" });
      document.getElementById("scan-result-heading")?.focus({ preventScroll: true });
    }, 60);
  }

  function openHistoryScan(scan: ScanResult) {
    setSelected(scan);
    setError(null);
    scrollToResult();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAnalyzing) return;
    const trimmed = input.trim();
    setConfirmClear(false);
    setError(null);

    if (!trimmed) {
      setError("Paste a URL to analyze. Nothing is fetched or opened.");
      inputRef.current?.focus();
      return;
    }

    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
    setIsAnalyzing(true);
    setStage(0);

    timers.current.push(setTimeout(() => setStage(1), 380));
    timers.current.push(setTimeout(() => setStage(2), 760));
    timers.current.push(
      setTimeout(() => {
        const outcome = analyzeUrl(trimmed);
        setIsAnalyzing(false);
        setStage(3);
        if (!outcome.ok) {
          setError(outcome.error);
          return;
        }
        setSelected(outcome.result);
        addScan(outcome.result);
        scrollToResult();
      }, 1180),
    );
  }

  function startNewAnalysis() {
    setSelected(null);
    setInput("");
    setError(null);
    setConfirmClear(false);
    formRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
    window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
  }

  function handleRemove(id: string) {
    removeScan(id);
    if (selected?.id === id) setSelected(null);
  }

  function handleRemoveDemo() {
    removeDemoData();
    if (selected?.demo) setSelected(null);
  }

  function handleClearAll() {
    clearScans();
    setSelected(null);
    setConfirmClear(false);
  }

  if (!hydrated) return <ScannerSkeleton />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">
            <Radar className="h-3 w-3 text-aqua" />
            URL scanner · 100% local
          </p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight text-frost sm:text-[1.9rem]">
            Read the link <span className="text-gradient-soft">before you click.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-dim">
            Inspect the structure and common deception patterns in any URL. The address is parsed in your browser —
            never fetched, visited or sent to a third party.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge tone="aqua" dot>
            No network requests
          </Badge>
          <Badge tone="neutral">
            <LockKeyhole className="h-3 w-3" /> Local heuristics
          </Badge>
        </div>
      </div>

      <div ref={formRef} className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="panel relative overflow-hidden p-5 sm:p-6" aria-labelledby="scanner-form-heading">
          <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-signal/[0.07] blur-[70px]" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="scanner-form-heading" className="text-[14px] font-semibold text-frost">
                  Enter a URL to analyze
                </h2>
                <p className="mt-0.5 text-[10px] text-dim">Plain text inspection · never executed or requested</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.07] px-2 py-1 text-[8.5px] font-medium uppercase tracking-[0.1em] text-dim sm:inline-flex">
                <CircleDot className="h-2.5 w-2.5 text-emerald-300" /> Ready
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-5" noValidate>
              <label htmlFor="url-input" className="sr-only">
                URL to analyze
              </label>
              <div className="relative">
                <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" aria-hidden="true" />
                <input
                  id="url-input"
                  ref={inputRef}
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="https://example.com/login"
                  aria-describedby="url-help"
                  aria-invalid={Boolean(error)}
                  className="input-cyber h-12 py-3 pl-10 pr-10 font-mono text-[12px]"
                />
                {input ? (
                  <button
                    type="button"
                    onClick={() => {
                      setInput("");
                      setError(null);
                      inputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-dim transition-colors hover:bg-white/[0.05] hover:text-frost"
                    aria-label="Clear URL input"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
              <p id="url-help" className="mt-2 flex items-start gap-1.5 text-[9.5px] leading-relaxed text-dim">
                <EyeOff className="mt-0.5 h-3 w-3 shrink-0 text-aqua/70" aria-hidden="true" />
                The scanner never visits the URL, follows redirects or loads page content. Analysis is based on the URL
                text only.
              </p>

              <AnimatePresence initial={false}>
                {error ? (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="mt-3 flex items-start gap-2 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2.5 text-[10.5px] leading-relaxed text-rose-200"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {error}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[9px] text-dim">
                  Educational heuristics · not antivirus or threat intelligence
                </p>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className={buttonStyles({
                    size: "md",
                    className: cn("w-full sm:w-auto", isAnalyzing && "cursor-wait opacity-80"),
                  })}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <ScanSearch className="h-4 w-4" aria-hidden="true" />
                      Analyze URL
                    </>
                  )}
                </button>
              </div>

              <div aria-live="polite">
                {isAnalyzing ? (
                  <div className="mt-4 space-y-1.5 rounded-lg border border-white/[0.06] bg-white/[0.015] p-3">
                    {loadingStages.map((label, index) => {
                      const done = stage > index;
                      const active = stage === index;
                      return (
                        <div key={label} className="flex items-center gap-2 text-[10px]">
                          {done ? (
                            <Check className="h-3 w-3 text-emerald-300" aria-hidden="true" />
                          ) : active ? (
                            <Loader2 className="h-3 w-3 animate-spin text-aqua" aria-hidden="true" />
                          ) : (
                            <span className="h-3 w-3 rounded-full border border-white/10" aria-hidden="true" />
                          )}
                          <span className={done || active ? "text-mist" : "text-dim"}>{label}</span>
                          {done ? <span className="ml-auto font-mono text-[8px] text-emerald-300/70">done</span> : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </form>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-dim">Try an example instead</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sampleUrls.map((sample) => (
                  <button
                    key={sample.url}
                    type="button"
                    onClick={() => {
                      setInput(sample.url);
                      setError(null);
                      inputRef.current?.focus();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[9.5px] text-mist transition-colors hover:border-aqua/25 hover:bg-aqua/[0.04] hover:text-frost"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-aqua/70" aria-hidden="true" />
                    {sample.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[8.5px] text-dim">
                Examples are illustrative. Their scores depend on the local rule set, not live reputation.
              </p>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="panel p-5" aria-labelledby="scanner-scope-heading">
            <h2 id="scanner-scope-heading" className="flex items-center gap-2 text-[12px] font-semibold text-frost">
              <ShieldQuestion className="h-4 w-4 text-aqua" aria-hidden="true" />
              What we look at
            </h2>
            <ul className="mt-3 space-y-2.5">
              {[
                { icon: Globe, label: "Transport & hostname", text: "HTTP vs HTTPS, IP hosts, subdomain depth and domain extensions." },
                { icon: Link2, label: "Deceptive structure", text: "@ symbols, punycode, ports, redirect parameters and extreme URL lengths." },
                { icon: FileWarning, label: "High-risk references", text: "Executable file extensions and links to known shorteners." },
                { icon: Radar, label: "Content patterns", text: "Account, urgency and payment keywords used in phishing lures." },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/[0.06] bg-white/[0.025] text-dim">
                    <item.icon className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-medium text-[#d5e3f6]">{item.label}</p>
                    <p className="mt-0.5 text-[9px] leading-relaxed text-dim">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-200">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Heuristics are not proof
            </p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-amber-200/65">
              A low score does not mean a site is safe. A high score does not prove malice. Attackers can use HTTPS,
              clean-looking domains and legitimate hosting.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.035] p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-200">
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              Private by construction
            </p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-emerald-100/60">
              No fetch, no screenshot, no API call. Results are saved only in this browser on this device.
            </p>
          </div>
        </aside>
      </div>

      <div ref={resultRef} className="scroll-mt-24">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <ScanResultPanel
                scan={selected}
                onAnalyzeAnother={startNewAnalysis}
                onRemove={state.scans.some((scan) => scan.id === selected.id) ? handleRemove : undefined}
              />
            </motion.div>
          ) : !isAnalyzing ? (
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel p-5 sm:p-6"
              aria-labelledby="scanner-empty-heading"
            >
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-aqua">
                    <ScanSearch className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 id="scanner-empty-heading" className="mt-4 text-lg font-semibold text-frost">
                    Nothing analyzed yet.
                  </h2>
                  <p className="mt-2 max-w-sm text-[11.5px] leading-relaxed text-mist">
                    Paste a URL above or choose a sample. You will get a transparent score, every triggered signal and
                    an explanation of what the scanner cannot know.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[9.5px] text-dim">
                    <span className="flex items-center gap-1.5">
                      <Check className="h-2.5 w-2.5 text-emerald-300" /> No URL visited
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-2.5 w-2.5 text-emerald-300" /> Plain-English explanations
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-2.5 w-2.5 text-emerald-300" /> History saved locally
                    </span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-dim">A URL anatomy lesson</p>
                  <UrlAnatomy />
                </div>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>

      <section className="panel p-5 sm:p-6" aria-labelledby="scanner-history-heading">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="scanner-history-heading" className="text-[14px] font-semibold text-frost">
                Analysis history
              </h2>
              <Badge tone="neutral">{state.scans.length}</Badge>
              {hasDemo ? <Badge tone="warning">Includes samples</Badge> : null}
            </div>
            <p className="mt-0.5 text-[10px] text-dim">
              {realCount} real {realCount === 1 ? "analysis" : "analyses"} · stored in this browser
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasDemo ? (
              <button
                type="button"
                onClick={handleRemoveDemo}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/20 px-2 py-1 text-[9px] font-medium text-amber-200/90 transition-colors hover:bg-amber-400/[0.06]"
              >
                Remove samples
              </button>
            ) : null}
            {state.scans.length > 0 ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] px-2 py-1 text-[9px] font-medium text-dim transition-colors hover:border-rose-400/20 hover:text-rose-300"
              >
                <Trash2 className="h-2.5 w-2.5" /> Clear all
              </button>
            ) : null}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {confirmClear ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-3 rounded-xl border border-rose-400/15 bg-rose-400/[0.045] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10.5px] text-rose-100/80">
                  Remove all {state.scans.length} saved analyses, including samples? This cannot be undone.
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => setConfirmClear(false)} className={buttonStyles({ variant: "ghost", size: "sm" })}>
                    Cancel
                  </button>
                  <button type="button" onClick={handleClearAll} className={buttonStyles({ variant: "danger", size: "sm" })}>
                    Clear history
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-4 flex flex-col gap-2.5 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {filterOptions.map((option) => {
              const count =
                option.value === "all"
                  ? state.scans.length
                  : state.scans.filter((scan) => scan.level === option.value).length;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRiskFilter(option.value)}
                  aria-pressed={riskFilter === option.value}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[9.5px] font-medium transition-colors",
                    riskFilter === option.value
                      ? "border-aqua/25 bg-aqua/[0.07] text-[#8df4eb]"
                      : "border-transparent text-dim hover:bg-white/[0.03] hover:text-mist",
                  )}
                >
                  {option.label}
                  <span className="ml-1.5 font-mono text-[8px] opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-dim" aria-hidden="true" />
            <label htmlFor="history-search" className="sr-only">
              Search analysis history
            </label>
            <input
              id="history-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search host or URL…"
              className="input-cyber h-8 py-1 pl-8 pr-2.5 text-[10px]"
            />
          </div>
        </div>

        {state.scans.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.03] text-dim">
              <ScanSearch className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[12px] font-medium text-frost">No saved analyses</p>
            <p className="mt-1 max-w-sm text-[10.5px] leading-relaxed text-dim">
              Every URL you analyze is saved here for quick reference. Nothing leaves your browser.
            </p>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
            <Search className="h-4 w-4 text-dim" />
            <p className="mt-3 text-[12px] font-medium text-frost">No analyses match</p>
            <p className="mt-1 text-[10.5px] text-dim">Try a different search term or clear the risk filter.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRiskFilter("all");
              }}
              className="mt-3 text-[10.5px] font-semibold text-aqua hover:text-[#8df4eb]"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <ul className="mt-2 max-h-[480px] divide-y divide-white/[0.05] overflow-y-auto pr-1 scrollbar-thin">
            {filteredScans.map((scan) => (
              <li key={scan.id}>
                <div
                  className={cn(
                    "group flex items-stretch rounded-lg transition-colors hover:bg-white/[0.025]",
                    selected?.id === scan.id && "bg-white/[0.03]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => openHistoryScan(scan)}
                    aria-pressed={selected?.id === scan.id}
                    className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2.5 text-left"
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
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate font-mono text-[10.5px] font-medium text-[#d5e3f6]">
                          {scan.hostname}
                        </span>
                        {scan.demo ? (
                          <span className="rounded border border-amber-400/20 px-1 py-0.5 text-[7px] font-bold uppercase tracking-[0.1em] text-amber-300/80">
                            sample
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-[9px] text-dim">
                        {truncate(scan.normalized, 80)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 sm:block">
                      <RiskBadge level={scan.level} />
                    </span>
                    <span className="w-10 shrink-0 text-right font-mono text-[10px] text-mist">{scan.score}</span>
                    <span className="hidden w-16 shrink-0 text-right text-[8.5px] text-dim md:block">
                      {formatRelativeTime(scan.analyzedAt)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(scan.id)}
                    className="grid w-9 shrink-0 place-items-center rounded-r-lg text-dim opacity-60 transition-all hover:bg-rose-400/[0.06] hover:text-rose-300 group-hover:opacity-100"
                    aria-label={`Remove analysis for ${scan.hostname}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-3 flex items-center gap-1.5 border-t border-white/[0.05] pt-3 text-[9px] text-dim">
          <Info className="h-2.5 w-2.5" /> History contains heuristic scores only. They are not reputation or safety
          labels.
        </p>
      </section>
    </div>
  );
}

