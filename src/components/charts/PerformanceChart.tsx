import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DEMO_PERFORMANCE_HISTORY } from "../../lib/demo-data";

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
const RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export function PerformanceChart() {
  const [range, setRange] = useState<TimeRange>("1M");
  const data = DEMO_PERFORMANCE_HISTORY[range];

  const startVal = data[0]?.value || 1;
  const endVal = data[data.length - 1]?.value || 1;
  const diff = endVal - startVal;
  const diffPct = ((diff / startVal) * 100).toFixed(2);

  return (
    <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Portfolio Performance</span>
            <span aria-hidden="true">·</span>
            <span>Simulated Historical Curve</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-xl font-semibold font-mono-tabular text-slate-100">
              $24,820.40
            </span>
            <span className="text-xs font-mono-tabular text-[#10B981]">
              {diff >= 0 ? "+" : ""}
              ${diff.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({diff >= 0 ? "+" : ""}
              {diffPct}% in {range})
            </span>
          </div>
        </div>

        {/* Interactive Time Filters */}
        <div className="flex items-center gap-1 p-1 bg-[#090A0F] border border-white/[0.06] rounded-lg self-start sm:self-auto">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-xs font-mono-tabular font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                range === r
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="nexoraPerfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.26} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              width={52}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0D13",
                borderColor: "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono, monospace",
              }}
              formatter={(value: any, name: any) => [
                `$${Number(value).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                name === "value" ? "Nexora Portfolio" : "Benchmark",
              ]}
            />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#475569"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#nexoraPerfGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
