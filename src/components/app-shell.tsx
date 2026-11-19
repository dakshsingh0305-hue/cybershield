"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  MailWarning,
  Menu,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { RadialScore } from "@/components/ui/radial-score";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Security overview",
    shortLabel: "Overview",
    icon: LayoutDashboard,
  },
  { href: "/scanner", label: "URL scanner", shortLabel: "Scanner", icon: ScanSearch },
  { href: "/phishing", label: "Phishing lab", shortLabel: "Phishing lab", icon: MailWarning },
  { href: "/academy", label: "Cyber academy", shortLabel: "Academy", icon: GraduationCap },
];

const pageTitles: Record<string, { title: string; section: string }> = {
  "/dashboard": { title: "Security overview", section: "Workspace" },
  "/scanner": { title: "URL scanner", section: "Workspace" },
  "/phishing": { title: "Phishing awareness lab", section: "Workspace" },
  "/academy": { title: "Cyber academy", section: "Workspace" },
};

function getPageMeta(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/phishing/")) return { title: "Phishing simulation", section: "Phishing lab" };
  if (pathname.startsWith("/academy/")) return { title: "Lesson", section: "Cyber academy" };
  return { title: "Workspace", section: "CyberShield" };
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace navigation" className="space-y-1">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
              active
                ? "border-white/[0.09] bg-gradient-to-r from-signal/[0.14] via-white/[0.035] to-transparent text-frost shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                : "border-transparent text-mist hover:border-white/[0.055] hover:bg-white/[0.035] hover:text-frost",
            )}
          >
            {active ? (
              <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-gradient-to-b from-aqua to-signal shadow-[0_0_10px_1px_rgba(46,230,214,0.55)]" />
            ) : null}
            <item.icon
              className={cn(
                "h-[17px] w-[17px] transition-colors",
                active ? "text-aqua" : "text-dim group-hover:text-[#b7c9e4]",
              )}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { score, state } = useProgress();
  const realXp = useMemo(
    () => state.activity.filter((event) => !event.demo).reduce((total, event) => total + event.xp, 0),
    [state.activity],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[76px] shrink-0 items-center px-5">
        <Logo href="/" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 pb-5 scrollbar-thin">
        <p className="mb-2 px-3 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.19em] text-[#4d617f]">
          Workspace
        </p>
        <NavList onNavigate={onNavigate} />

        <div className="my-5 h-px bg-white/[0.06]" />

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-dim">Awareness</p>
            <Badge tone="aqua" className="px-1.5 py-0.5 text-[9px]">
              Local
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <RadialScore value={score.total} size={58} strokeWidth={6} ariaLabel={`Awareness score ${score.total} of 100`}>
              <span className="text-[13px] font-semibold text-frost">{score.total}</span>
            </RadialScore>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-tight text-frost">{score.level}</p>
              <p className="mt-1 text-[9.5px] leading-snug text-dim">Built from lessons, lab &amp; practice</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
            <span className="flex items-center gap-1.5 text-[9.5px] text-dim">
              <Flame className="h-3 w-3 text-amber-300/80" /> {realXp} XP earned
            </span>
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="text-[9.5px] font-semibold text-[#8db4e7] transition-colors hover:text-aqua"
            >
              Details
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-2.5">
          <LockKeyhole className="mt-0.5 h-3 w-3 shrink-0 text-aqua/70" aria-hidden="true" />
          <p className="text-[9px] leading-relaxed text-dim">
            Your progress is saved only in this browser. No account, no server.
          </p>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-signal/70 via-aqua/60 to-iris/70 p-[1.5px]">
              <span className="grid h-full w-full place-items-center rounded-full bg-[#091423] text-[11px] font-semibold text-frost">
                Y
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-frost">Local learner</p>
              <p className="truncate text-[9px] text-dim">
                {score.lessonsCompleted}/{5} lessons · {score.phishingCompleted}/6 lab
              </p>
            </div>
            <Link
              href="/dashboard"
              onClick={onNavigate}
              className="grid h-7 w-7 place-items-center rounded-lg text-dim transition-colors hover:bg-white/[0.05] hover:text-frost"
              aria-label="Open security overview"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-3 px-2 text-center text-[8.5px] uppercase tracking-[0.18em] text-[#3d4f6a]">
            CyberShield · Demo build
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { resetProgress } = useProgress();
  const reduceMotion = useReducedMotion();
  const meta = getPageMeta(pathname);

  useEffect(() => {
    const open = mobileOpen || resetOpen;
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setResetOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, resetOpen]);

  return (
    <div className="min-h-svh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-white/[0.065] bg-[#050b15]/80 backdrop-blur-2xl lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-h-svh flex-col lg:pl-[272px]">
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-void/70 backdrop-blur-xl">
          <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-frost lg:hidden"
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-sidebar"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
              <div className="min-w-0 lg:hidden">
                <Logo href="/" size="sm" />
              </div>
              <div className="hidden min-w-0 lg:block">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-dim">
                  <span>{meta.section}</span>
                  <span className="text-[#3c4e6a]">/</span>
                  <span className="text-[#8da6c8]">{meta.title}</span>
                </div>
                <h1 className="mt-0.5 truncate text-[17px] font-semibold leading-tight text-frost">{meta.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.045] px-2.5 py-1 text-[10px] font-medium text-emerald-300/90 sm:inline-flex">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Privacy-first workspace
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.09] bg-gradient-to-br from-[#122036] to-[#0a1424] text-[11px] font-semibold text-[#c8d9f0]">
                Y
              </span>
            </div>
          </div>
        </header>

        <main id="main" className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1380px]">{children}</div>
          <footer className="mx-auto mt-10 flex w-full max-w-[1380px] flex-col gap-2 border-t border-white/[0.05] pt-4 text-[9.5px] text-[#4d617f] sm:flex-row sm:items-center sm:justify-between">
            <p>CyberShield · Educational prototype · local heuristics, not antivirus or threat intelligence.</p>
            <div className="flex items-center gap-4">
              <span>No URLs are transmitted</span>
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="inline-flex items-center gap-1 transition-colors hover:text-mist"
              >
                <RotateCcw className="h-2.5 w-2.5" /> Reset local data
              </button>
            </div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />
            <motion.aside
              id="mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={reduceMotion ? false : { x: -300 }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: -300 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute inset-y-0 left-0 w-[286px] border-r border-white/[0.08] bg-[#050b15]/97 shadow-[30px_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-5 z-10 grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-mist hover:text-frost"
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {resetOpen ? (
          <div className="fixed inset-0 z-[60] grid place-items-center px-4">
            <motion.button
              type="button"
              aria-label="Cancel reset"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResetOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-title"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="panel relative w-full max-w-md p-6"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300">
                  <RotateCcw className="h-4 w-4" />
                </span>
                <div>
                  <h2 id="reset-title" className="text-lg font-semibold text-frost">
                    Reset all local data?
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-mist">
                    This removes scan history, lesson progress, lab scores and sample data stored in this browser. It
                    cannot be undone.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setResetOpen(false)}
                  className={buttonStyles({ variant: "secondary", size: "sm" })}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetProgress();
                    setResetOpen(false);
                  }}
                  className={buttonStyles({ variant: "danger", size: "sm" })}
                >
                  Yes, reset everything
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
