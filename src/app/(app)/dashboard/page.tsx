import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Security dashboard",
  description: "Your security awareness score, URL analysis history, learning progress and next steps.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
