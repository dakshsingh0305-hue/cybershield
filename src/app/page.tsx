import { LandingNav } from "@/components/marketing/landing-nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { DemoStats } from "@/components/marketing/demo-stats";
import { Faq, LandingCta } from "@/components/marketing/faq-cta";
import { LandingFooter } from "@/components/marketing/landing-footer";

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <LandingNav />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <DemoStats />
        <Faq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
