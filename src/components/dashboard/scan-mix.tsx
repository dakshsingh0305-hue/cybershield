"use client";

import { ScanSearch } from "lucide-react";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import type { ScanResult } from "@/lib/types";

const tones = [
  { key: "low", label: "Low risk", color: "#34d399" },
  { key: "medium", label: "Suspicious", color: "#fbbf24" },
  { key: "high", label: "High risk", color: "#fb7185" },
] as const;

export function ScanMix({ scans }: { scans: ScanResult[] }) {
  const data = tones
    .map((tone) => ({
      ...tone,
      value: scans.filter((scan) => scan.level === tone.key).length,
    }))
    .filter((entry) => entry.value > 0);
  const total = scans.length;
  const hasDemo = scans.some((scan) => scan.demo);

  return (
    <div className="panel flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-semibold text-frost">Scan risk mix</h2>
          <p className="mt-0.5 text-[10px] text-dim">Heuristic results from saved analyses</p>
        </div>
        {hasDemo ? <Badge tone="warning">Includes samples</Badge> : null}
      </div>

      {total === 0 ? (
        <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-5 py-10 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.03] text-dim">
            <ScanSearch className="h-4 w-4" />
          </span>
          <p className="mt-3 text-[12px] font-medium text-frost">No analyses yet</p>
          <p className="mt-1 max-w-[220px] text-[10.5px] leading-relaxed text-dim">
            Results appear here after you scan a URL. Heuristic scores are not reputation verdicts.
          </p>
          <Link href="/scanner" className="mt-3 text-[11px] font-semibold text-aqua hover:text-[#8df4eb]">
            Analyze a URL →
          </Link>
        </div>
      ) : (
        <>
          <div className="relative mt-3 h-[170px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={3}
                  cornerRadius={5}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} fillOpacity={0.9} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0a1424",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    fontSize: 11,
                  }}
                  itemStyle={{ color: "#e9f1ff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-frost">{total}</span>
              <span className="text-[9px] uppercase tracking-[0.14em] text-dim">analyses</span>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            {tones.map((tone) => {
              const count = scans.filter((scan) => scan.level === tone.key).length;
              return (
                <div key={tone.key} className="flex items-center justify-between text-[10.5px]">
                  <span className="flex items-center gap-2 text-mist">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.color }} />
                    {tone.label}
                  </span>
                  <span className="font-mono text-[10px] text-dim">
                    {count} · {Math.round((count / total) * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
