import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { DEMO_ALLOCATION } from "../../lib/demo-data";

export function AllocationChart() {
  return (
    <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Portfolio Allocation</span>
          <span className="font-mono-tabular text-slate-500">By Sector</span>
        </div>
        <h3 className="text-base font-semibold text-slate-100 mt-1">
          Asset &amp; Sector Breakdown
        </h3>
      </div>

      <div className="h-52 w-full my-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DEMO_ALLOCATION}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {DEMO_ALLOCATION.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0D13",
                borderColor: "rgba(255,255,255,0.12)",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono, monospace",
              }}
              formatter={(value: any) => [`${value}%`, "Allocation"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400">Top Sector</span>
          <span className="text-base font-semibold font-mono-tabular text-slate-100">
            48.0%
          </span>
          <span className="text-[11px] text-[#10B981]">Technology</span>
        </div>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
        {DEMO_ALLOCATION.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 font-mono-tabular">
              <span className="text-slate-400">
                ${item.amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
              <span className="text-slate-100 font-medium w-12 text-right">
                {item.value.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
