import type { Metadata } from "next";
import { AcademyList } from "@/components/academy/academy-list";

export const metadata: Metadata = {
  title: "Cyber academy",
  description:
    "Five short cybersecurity lessons covering phishing, passwords, social engineering, public Wi-Fi and privacy, each with a knowledge check.",
};

export default function AcademyPage() {
  return <AcademyList />;
}
