import { ArrowRight, Compass, ScanSearch, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-svh flex-col items-center justify-center px-5 py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]">
        <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-signal/[0.1] blur-[120px]" />
      </div>

      <Logo href="/" size="lg" showTagline />

      <div className="panel relative mt-10 w-full max-w-lg overflow-hidden p-7 text-center sm:p-9">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-aqua/60 to-transparent" />
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-aqua">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-dim">
          Error 404 · Route not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-frost sm:text-3xl">This page slipped past the shield.</h1>
        <p className="mx-auto mt-3 max-w-sm text-[12px] leading-relaxed text-mist">
          The address you followed does not match anything in the workspace. It may have been mistyped, or the page may
          have moved.
        </p>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link href="/dashboard" className={buttonStyles({ size: "md" })}>
            <ShieldQuestion className="h-4 w-4" aria-hidden="true" />
            Open dashboard
          </Link>
          <Link href="/scanner" className={buttonStyles({ variant: "secondary", size: "md" })}>
            <ScanSearch className="h-4 w-4 text-aqua" aria-hidden="true" />
            URL scanner
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-white/[0.06] pt-4 text-[10px] text-dim">
          <Link href="/" className="transition-colors hover:text-aqua">
            Landing page
          </Link>
          <span className="h-2.5 w-px bg-white/10" />
          <Link href="/phishing" className="transition-colors hover:text-aqua">
            Phishing lab
          </Link>
          <span className="h-2.5 w-px bg-white/10" />
          <Link href="/academy" className="inline-flex items-center gap-1 transition-colors hover:text-aqua">
            Cyber academy <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-[9px] text-dim">
        Educational prototype · local heuristics, not antivirus or threat intelligence.
      </p>
    </main>
  );
}
