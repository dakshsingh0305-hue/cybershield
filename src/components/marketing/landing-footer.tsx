import { ArrowUpRight, Boxes, GraduationCap, ScanSearch, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

const productLinks = [
  { href: "/dashboard", label: "Security dashboard" },
  { href: "/scanner", label: "URL scanner" },
  { href: "/phishing", label: "Phishing lab" },
  { href: "/academy", label: "Cyber academy" },
];

const learnLinks = [
  { href: "/academy/spot-the-hook", label: "Phishing fundamentals" },
  { href: "/academy/passwords-that-hold", label: "Password hygiene" },
  { href: "/academy/trust-but-verify", label: "Social engineering" },
  { href: "/academy/public-wifi-playbook", label: "Public Wi-Fi" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.065] bg-[#03060c]/60">
      <div className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
          <div>
            <Logo href="/" showTagline />
            <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-dim">
              Practical cybersecurity awareness for everyday people. Inspect links, recognise manipulation and build
              habits that hold up when you are busy.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-mist">
                <ShieldCheck className="h-3 w-3 text-aqua" /> Local-first
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-mist">
                <GraduationCap className="h-3 w-3 text-[#c3b2ff]" /> Educational
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-frost">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-mist transition-colors hover:text-aqua"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-frost">Learn</h3>
            <ul className="mt-4 space-y-2.5">
              {learnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-mist transition-colors hover:text-aqua"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-frost">A clear disclaimer</h3>
            <p className="mt-4 text-[11.5px] leading-relaxed text-dim">
              CyberShield is an educational hackathon prototype. The scanner uses local heuristics and is{" "}
              <span className="text-[#c4d3e8]">not</span> antivirus, threat intelligence or proof that a site is safe
              or malicious. It never visits submitted URLs.
            </p>
            <a
              href="#faq"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#8db4e7] hover:text-aqua"
            >
              Read the limitations
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10.5px] text-dim">
            © 2026 CyberShield · Your digital world. Protected. · Built as a hackathon demo.
          </p>
          <div className="flex items-center gap-4 text-[10.5px] text-dim">
            <span className="inline-flex items-center gap-1.5">
              <ShieldAlert className="h-3 w-3 text-amber-300/80" /> Fictional training content
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ScanSearch className="h-3 w-3 text-aqua/80" /> No URLs transmitted
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Boxes className="h-3 w-3" /> MVP build
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
