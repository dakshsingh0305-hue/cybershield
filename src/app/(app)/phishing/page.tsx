import type { Metadata } from "next";
import { PhishingList } from "@/components/phishing/phishing-list";

export const metadata: Metadata = {
  title: "Phishing awareness lab",
  description:
    "Practise spotting phishing in fictional emails, SMS messages and DMs. Flag the clues, make a verdict and read a full explanation.",
};

export default function PhishingPage() {
  return <PhishingList />;
}
