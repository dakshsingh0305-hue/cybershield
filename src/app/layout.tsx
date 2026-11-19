import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress-store";
import { SiteBackground } from "@/components/site-background";

export const metadata: Metadata = {
  metadataBase: new URL("https://cybershield.demo"),
  title: {
    default: "CyberShield — Your Digital World. Protected.",
    template: "%s · CyberShield",
  },
  description:
    "An interactive cybersecurity awareness platform: analyze suspicious URLs locally, practise phishing detection and build safer digital habits.",
  applicationName: "CyberShield",
  keywords: [
    "cybersecurity awareness",
    "phishing simulation",
    "URL checker",
    "security education",
    "privacy",
  ],
  authors: [{ name: "CyberShield" }],
  openGraph: {
    title: "CyberShield — Your Digital World. Protected.",
    description:
      "Learn to spot phishing, inspect suspicious links and build practical digital safety habits.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04070e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-svh">
        <ProgressProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteBackground />
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
