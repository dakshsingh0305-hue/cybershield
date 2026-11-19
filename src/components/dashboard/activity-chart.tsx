"use client";

import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/types";
import { getWeeklyActivity } from "@/lib/progress-store";

export function ActivityChart({ activity, hasRealActivity }: { activity: ActivityEvent[]; hasRealActivity: boolean }) {
  const [includeDemo, setIncludeDemo] = useState(true);
  const data = getWeeklyActivity(activity, includeDemo);
  const total = data.reduce((sum, day) => sum + day.events, 0);
  const demoCount = data.reduce((sum, day) => sum + day.demo, 0);
  const hasDemo = activity.some((event) => event.demo);
  const empty = total === 0;

  return (
    <div className="panel relative flex h-full flex-col overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-aqua/15 bg-aqua/[0.06] text-aqua">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-[14px] font-semibold text-frost">Practice activity</h2>
              <p className="text-[10px] text-dim">Last 7 days · lessons, lab &amp; scans</p>
            </div>
          </div>
        </div>
        {hasDemo ? (
          <button
            type="button"
            onClick={() => setIncludeDemo((value) => !value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[9.5px] font-medium transition-colors",
              includeDemo
                ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200/90 hover:bg-amber-400/[0.1]"
                : "border-white/[0.08] bg-white/[0.02] text-dim hover:text-mist",
            )}
            aria-pressed={includeDemo}
          >
            {includeDemo ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {includeDemo ? "Sample included" : "My activity only"}
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-frost">{total}</p>
          <p className="mt-0.5 text-[10px] text-dim">
            activities this week
            {includeDemo && demoCount > 0 ? ` · ${demoCount} sample` : ""}
          </p>
        </div>
        <Badge tone={hasRealActivity ? "aqua" : hasDemo ? "warning" : "neutral"} dot={hasRealActivity}>
          {hasRealActivity ? "Live progress" : hasDemo ? "Demo preview" : "No activity yet"}
        </Badge>
      </div>

      <div className="relative mt-3 min-h-[190px] flex-1">
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={data} margin={{ top: 10, right: 6, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2ee6d6" stopOpacity={0.28} />
                <stop offset="70%" stopColor="#4d8dff" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#4d8dff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.055)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              dy={8}
              tick={{ fill: "#7287a8", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={34}
              tick={{ fill: "#7287a8", fontSize: 10 }}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.12)", strokeDasharray: "4 4" }}
              contentStyle={{
                background: "#0a1424",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                fontSize: 11,
                padding: "8px 10px",
              }}
              labelStyle={{ color: "#96a8c7", marginBottom: 3 }}
              itemStyle={{ color: "#2ee6d6" }}
            />
            <Area
              type="monotone"
              dataKey="events"
              name="Activities"
              stroke="#2ee6d6"
              strokeWidth={2}
              fill="url(#activity-fill)"
              activeDot={{ r: 4, fill: "#2ee6d6", stroke: "#04070e", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {empty ? (
          <div className="absolute inset-0 grid place-items-center rounded-xl bg-[#08111f]/55 backdrop-blur-[2px]">
            <div className="px-6 text-center">
              <p className="text-[12px] font-medium text-frost">No practice recorded yet</p>
              <p className="mt-1 text-[10.5px] text-dim">
                Complete a lesson or analyse a message to start your timeline.
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-[9px] text-dim">
        {hasDemo
          ? "Sample activity is seeded for first-time visitors and clearly marked. Toggle it off to see only your actions."
          : "Activity is calculated from your local practice and never leaves this browser."}
      </p>
    </div>
  );
}
