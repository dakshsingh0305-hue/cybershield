import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhishingSimulator } from "@/components/phishing/phishing-simulator";
import { getScenario, phishingScenarios } from "@/lib/data/phishing";

interface ScenarioPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return phishingScenarios.map((scenario) => ({ id: scenario.id }));
}

export async function generateMetadata({ params }: ScenarioPageProps): Promise<Metadata> {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) return { title: "Simulation not found" };
  return {
    title: `${scenario.senderName} simulation`,
    description: `Fictional ${scenario.channel.toUpperCase()} phishing simulation: ${scenario.subject}`,
  };
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) notFound();
  return <PhishingSimulator key={scenario.id} scenario={scenario} />;
}
