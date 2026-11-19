import { ArrowRight, GraduationCap, ScanSearch, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    icon: ScanSearch,
    title: "Check the link",
    description:
      "Paste a URL you do not trust. We break down its structure and score the patterns — without visiting the site or sending the address anywhere.",
    href: "/scanner",
    cta: "Open the scanner",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Train your eye",
    description:
      "Work through fictional phishing messages. Flag suspicious elements, make a call, then read why each detail matters — including the ones you missed.",
    href: "/phishing",
    cta: "Enter the lab",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Build the habit",
    description:
      "Short lessons and a transparent awareness score keep the skills moving from theory to reflex. Your progress is saved on this device.",
    href: "/academy",
    cta: "Start learning",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 border-y border-white/[0.055] py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-signal/[0.025] via-transparent to-transparent" />
      <div className="container-shell">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              align="left"
              title={
                <>
                  Three steps to a
                  <br /> <span className="text-gradient-soft">safer reflex.</span>
                </>
              }
              description="No setup, no certificate, no 40-page policy. Just deliberate practice in the moments where security actually happens: before you click."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-[11px] text-mist">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-aqua/[0.08] text-aqua">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-frost">Local by default</span>
                Nothing you paste is transmitted
              </span>
            </div>
          </Reveal>
        </div>

        <div className="relative mt-14 grid gap-4 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[3.2rem] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.08}>
              <div className="panel panel-hover group relative h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-aqua/15 bg-aqua/[0.055] text-aqua">
                    <step.icon className="h-[19px] w-[19px]" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-[#405372]">{step.number}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-frost">{step.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-mist">{step.description}</p>
                <Link
                  href={step.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#9dc0ef] transition-colors hover:text-aqua"
                >
                  {step.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-signal/[0.06] via-transparent to-iris/[0.06] px-6 py-5 sm:flex-row">
            <div className="flex items-center gap-3 text-left">
              <Sparkles className="h-5 w-5 shrink-0 text-aqua" aria-hidden="true" />
              <p className="text-[13px] text-mist">
                <span className="font-semibold text-frost">Start anywhere.</span> A score and recommendations appear
                after your first action.
              </p>
            </div>
            <Link href="/dashboard" className={buttonStyles({ variant: "secondary", size: "sm" })}>
              Open your dashboard
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
