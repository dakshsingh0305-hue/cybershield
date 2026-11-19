import {
  ArrowUpRight,
  BookOpenCheck,
  EyeOff,
  Fingerprint,
  Gauge,
  KeyRound,
  LockKeyhole,
  MailWarning,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const featureLinks = {
  scanner: "/scanner",
  lab: "/phishing",
  academy: "/academy",
};

function FeatureCard({
  icon: Icon,
  title,
  description,
  link,
  href,
  accent,
  className,
  children,
}: {
  icon: typeof ScanSearch;
  title: string;
  description: string;
  link: string;
  href: string;
  accent: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`panel panel-hover card-sheen group relative flex flex-col overflow-hidden p-5 sm:p-6 ${className ?? ""}`}
    >
      <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-[60px] ${accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-aqua">
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <ArrowUpRight
          className="h-4 w-4 -translate-y-0.5 text-dim transition-all duration-300 group-hover:-translate-y-1 group-hover:text-aqua"
          aria-hidden="true"
        />
      </div>
      <div className="relative mt-5">
        <h3 className="text-[17px] font-semibold text-frost">{title}</h3>
        <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-mist">{description}</p>
      </div>
      {children}
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8db4e7] transition-colors group-hover:text-aqua">
        {link}
      </span>
    </Link>
  );
}

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-shell">
        <Reveal>
          <SectionHeading
            eyebrow="One studio, four defensive habits"
            title={
              <>
                Everything you need to
                <br className="hidden sm:block" /> <span className="text-gradient-soft">think before you click.</span>
              </>
            }
            description="Not another wall of security jargon. Short, interactive tools that turn caution into a repeatable reflex."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4">
            <FeatureCard
              icon={ScanSearch}
              title="URL Scanner"
              description="Paste any link and see its structure dissected: transport, domain deception, bait patterns and file references. Nothing is opened, fetched or sent to a third party."
              link="Inspect a link"
              href={featureLinks.scanner}
              accent="bg-signal/15"
              className="h-full min-h-[300px]"
            >
              <div className="relative mt-6 rounded-xl border border-white/[0.07] bg-black/20 p-3.5">
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#050b14] px-2.5 py-2">
                  <LockKeyhole className="h-3 w-3 shrink-0 text-dim" aria-hidden="true" />
                  <span className="truncate font-mono text-[10px] text-[#9fb6d5] sm:text-[11px]">
                    https://cloudvault.com.account-verify.xyz/signin
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-rose-400/15 bg-rose-400/[0.05] px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-dim">Risk</p>
                    <p className="mt-1 text-lg font-semibold leading-none text-rose-300">78</p>
                    <p className="mt-1 text-[9.5px] text-rose-200/70">High risk</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-dim">Transport</p>
                    <p className="mt-1 text-[11px] font-medium text-amber-300">HTTPS · encrypted</p>
                    <p className="mt-1 text-[9.5px] text-dim">1 warning below</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-dim">Signals</p>
                    <p className="mt-1 text-[11px] font-medium text-frost">4 found</p>
                    <p className="mt-1 text-[9.5px] text-dim">Explained in plain English</p>
                  </div>
                </div>
                <span className="mt-2.5 inline-flex items-center gap-1 text-[9px] text-dim">
                  <EyeOff className="h-2.5 w-2.5" /> Illustrative preview · no live request made
                </span>
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-2">
            <FeatureCard
              icon={MailWarning}
              title="Phishing Lab"
              description="Work through realistic fictional emails, texts and DMs. Flag the clues, make a decision, then read the full breakdown."
              link="Enter the lab"
              href={featureLinks.lab}
              accent="bg-iris/15"
              className="h-full min-h-[300px]"
            >
              <div className="relative mt-6 space-y-2">
                <div className="rounded-lg border border-rose-400/20 bg-rose-400/[0.06] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#ffd2da]">Billing · action required</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  </div>
                  <p className="mt-1 truncate text-[9.5px] text-rose-200/60">billing@cloudvault-invoices.help</p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium text-[#c6d6eb]">Project workshop · Thu</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <p className="mt-1 truncate text-[9.5px] text-dim">maya.chen@figtree.design</p>
                </div>
                <Badge tone="violet" className="mt-1.5">
                  <Sparkles className="h-3 w-3" /> Spot · Decide · Understand
                </Badge>
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.04} className="md:col-span-2">
            <FeatureCard
              icon={BookOpenCheck}
              title="Cyber Academy"
              description="Five focused lessons on phishing, passwords, social engineering, public Wi-Fi and privacy. Read, check your understanding, move on."
              link="Open academy"
              href={featureLinks.academy}
              accent="bg-aqua/10"
              className="h-full min-h-[250px]"
            >
              <div className="relative mt-6 space-y-2.5">
                {[
                  { label: "Phishing fundamentals", value: "Done", tone: "text-emerald-300" },
                  { label: "Password hygiene", value: "2 / 3", tone: "text-[#c3b2ff]" },
                  { label: "Public Wi-Fi", value: "Next", tone: "text-dim" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="truncate text-mist">{item.label}</span>
                    <span className={`shrink-0 font-medium ${item.tone}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.08} className="md:col-span-2">
            <FeatureCard
              icon={Gauge}
              title="Awareness score"
              description="One honest metric built from lessons, lab decisions and deliberate practice — with a transparent breakdown you can inspect."
              link="See the dashboard"
              href="/dashboard"
              accent="bg-amber-400/10"
              className="h-full min-h-[250px]"
            >
              <div className="relative mt-6 flex items-center gap-3">
                <div className="relative grid h-16 w-16 place-items-center rounded-full border border-white/[0.07]">
                  <div className="absolute inset-[4px] rounded-full [background:conic-gradient(from_0deg,#4d8dff_0deg,#2ee6d6_180deg,rgba(255,255,255,0.06)_181deg)]" />
                  <div className="relative grid h-[48px] w-[48px] place-items-center rounded-full bg-[#07101d] text-sm font-semibold text-frost">
                    58
                  </div>
                </div>
                <div>
                  <Badge tone="aqua">Confident learner</Badge>
                  <p className="mt-1.5 text-[10px] text-dim">Preview score · calculated locally</p>
                </div>
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={0.12} className="md:col-span-2">
            <FeatureCard
              icon={Fingerprint}
              title="Privacy by design"
              description="No accounts, no analytics beacons, no submitted URLs leaving your browser. Progress is saved in local storage on this device."
              link="Privacy note"
              href="#faq"
              accent="bg-emerald-400/10"
              className="h-full min-h-[250px]"
            >
              <ul className="relative mt-6 space-y-2">
                {["No URL is fetched or executed", "No third-party scan API", "You can clear your data anytime"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[10.5px] text-mist">
                    <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-300" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </FeatureCard>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-3.5 text-[11px] font-medium text-dim">
            <span className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-aqua/70" /> No sign-up
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-1.5">
              <LockKeyhole className="h-3.5 w-3.5 text-aqua/70" /> No third-party scanning
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-aqua/70" /> Built for everyday users
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
