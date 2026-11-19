import { ChevronDown, LockKeyhole, ScanSearch, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    question: "Is CyberShield an antivirus or a threat-intelligence service?",
    answer:
      "No. CyberShield is an educational awareness prototype. The URL scanner uses transparent, local pattern rules — not malware analysis, blocklists or threat intelligence. A low score does not mean a website is safe, and a high score is not proof that it is malicious.",
  },
  {
    question: "Does the scanner visit the link I paste?",
    answer:
      "Never. The URL text is parsed in your browser and compared against heuristic patterns. There is no fetch, DNS lookup, screenshot or third-party scan API. That also means the scanner cannot see the page's actual content, certificate details or current reputation.",
  },
  {
    question: "Where is my progress stored?",
    answer:
      "In your browser's local storage on this device. There is no account system and no server database. Clearing site data or using private browsing removes the history. You can also remove sample history from the scanner and reset local data from the sidebar.",
  },
  {
    question: "Are the phishing emails and messages real?",
    answer:
      "No. Every scenario is fictional and created for training. Names, domains and links are invented. The lab never opens external links or downloads attachments. It is designed to teach pattern recognition, not to reproduce a live campaign.",
  },
  {
    question: "How is the awareness score calculated?",
    answer:
      "It is a progress metric, not a device security audit. The score combines a 10-point starting baseline, up to 40 points for lessons completed, up to 35 points for phishing lab coverage and accuracy, and up to 15 points for deliberate URL checks. The dashboard exposes every component so you can see where the number comes from.",
  },
  {
    question: "Can I use this on a phone?",
    answer:
      "Yes. The interface is responsive, including the dashboard navigation, scanner results, interactive phishing messages and lesson quizzes. Everything runs client-side in the browser.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading
            eyebrow="Honest by design"
            align="left"
            title={
              <>
                Questions worth
                <br /> <span className="text-gradient-soft">asking.</span>
              </>
            }
            description="Cybersecurity products often overclaim. Here is what CyberShield actually does — and what it cannot do."
          />
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <ShieldQuestion className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
            <p className="text-[11.5px] leading-relaxed text-dim">
              Educational prototype. Do not use a CyberShield result as the only basis for trusting or distrusting a
              website.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[13px] font-medium text-[#d8e5f7] marker:hidden">
                  {faq.question}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-dim transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 max-w-2xl pr-6 text-[12.5px] leading-relaxed text-mist">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LandingCta() {
  return (
    <section className="relative pb-24 pt-4 sm:pb-28">
      <div className="container-shell">
        <Reveal>
          <div className="panel relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-signal/15 blur-[90px]" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-iris/15 blur-[90px]" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <span className="eyebrow">
                <LockKeyhole className="h-3 w-3" />
                No account needed
              </span>
              <h2 className="mt-5 text-3xl font-semibold leading-tight text-frost sm:text-4xl lg:text-[2.75rem]">
                Your next click is
                <br />
                <span className="text-gradient">already safer.</span>
              </h2>
              <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-mist">
                Start with a link you were unsure about, or jump straight into a phishing simulation. Ten minutes now
                can save a very bad day later.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="btn btn-primary h-12 px-6 text-sm shadow-[0_18px_50px_-18px_rgba(46,230,214,0.55)]"
                >
                  <ScanSearch className="h-4 w-4" aria-hidden="true" />
                  Open your dashboard
                </Link>
                <Link href="/phishing" className="btn btn-secondary h-12 px-6 text-sm">
                  Try a phishing challenge
                </Link>
              </div>
              <p className="mt-4 text-[10px] text-dim">Sample history included · real progress starts with you</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
