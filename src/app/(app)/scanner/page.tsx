import type { Metadata } from "next";
import { Suspense } from "react";
import { ScannerSkeleton, ScannerView } from "@/components/scanner/scanner-view";

export const metadata: Metadata = {
  title: "URL scanner",
  description:
    "Inspect a suspicious URL's structure and heuristic risk signals locally. No URL is ever visited or transmitted.",
};

export default function ScannerPage() {
  return (
    <Suspense fallback={<ScannerSkeleton />}>
      <ScannerView />
    </Suspense>
  );
}
