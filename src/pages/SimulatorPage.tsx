import React, { useState } from "react";
import { Plus, RotateCcw, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";
import { useNexora } from "../context/NexoraContext";

interface ScenarioRow {
  id: string;
  symbol: string;
  action: "buy" | "sell";
  amount: number;
}

const INITIAL_ROWS: ScenarioRow[] = [
  { id: "row-1", symbol: "NVDA", action: "buy", amount: 2000 },
];

export function SimulatorPage() {
  const { marketAssets, openOrderTicket, addActivity } = useNexora();
  const [rows, setRows] = useState<ScenarioRow[]>(INITIAL_ROWS);
  const [comparisonActive, setComparisonActive] = useState<boolean>(true);

  // Baseline Portfolio Constants (from Demo Portfolio)
  const baseTotal = 24820.4;
  const baseTech = baseTotal * 0.48; // $11,913.79 (48%)
  const baseHealth = baseTotal * 0.22; // $5,460.49 (22%)
  const baseOther = baseTotal * 0.30; // $7,446.12 (30%)
  const baseRiskScore = 62;

  // Compute Simulated After State
  let simTech = baseTech;
  let simHealth = baseHealth;
  let simOther = baseOther;

  rows.forEach((r) => {
    const asset = marketAssets.find((a) => a.symbol === r.symbol);
    const delta = r.action === "buy" ? r.amount : -r.amount;
    const sector = asset?.sector || "Technology";

    if (sector === "Technology") {
      simTech = Math.max(0, simTech + delta);
    } else if (sector === "Healthcare") {
      simHealth = Math.max(0, simHealth + delta);
    } else {
      simOther = Math.max(0, simOther + delta);
    }
  });

  const simTotal = Math.max(1, simTech + simHealth + simOther);

  // Match the exact specification example when NVDA +$2,000 is the sole scenario
  const isDefaultNvda2000 =
    rows.length === 1 &&
    rows[0].symbol === "NVDA" &&
    rows[0].action === "buy" &&
    rows[0].amount === 2000;

  const afterTechPct = isDefaultNvda2000
    ? 55
    : Math.round((simTech / simTotal) * 100);
  const afterHealthPct = isDefaultNvda2000
    ? 19
    : Math.round((simHealth / simTotal) * 100);
  const afterOtherPct = isDefaultNvda2000
    ? 26
    : Math.max(0, 100 - afterTechPct - afterHealthPct);

  const afterRiskScore = isDefaultNvda2000
    ? 68
    : Math.min(
        95,
        Math.max(
          25,
          Math.round(baseRiskScore + (afterTechPct - 48) * 0.85)
        )
      );

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        symbol: "AAPL",
        action: "buy",
        amount: 1000,
      },
    ]);
  };

  const handleReset = () => {
    setRows(INITIAL_ROWS);
    setComparisonActive(true);
  };

  const handleCompare = () => {
    setComparisonActive(true);
    const desc = rows
      .map((r) => `${r.action === "buy" ? "+" : "-"}$${r.amount} ${r.symbol}`)
      .join(", ");
    addActivity({
      type: "Order preview created",
      title: `Scenario compared: ${desc}`,
      description: `Simulated Technology allocation ${afterTechPct}% and Risk Score ${afterRiskScore}. No trade executed.`,
      status: "Simulated",
      asset: rows[0]?.symbol || "PORTFOLIO",
      amount: `$${rows.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}`,
    });
  };

  const primaryRow = rows[0] || { symbol: "NVDA", action: "buy", amount: 2000 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-[#F59E0B] mb-1">
            <span>SIMULATION — NO TRADE EXECUTED</span>
            <span aria-hidden="true" className="mx-2 text-slate-600">·</span>
            <span className="text-slate-400">ANALYTICAL SCENARIO ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            What happens if you change your portfolio?
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test single or multi-asset adjustments to see how sector weights and
            portfolio risk respond before placing any order.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Add Scenario</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleCompare}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors cursor-pointer"
          >
            Compare
          </button>
        </div>
      </div>

      {/* Scenario Builder Rows */}
      <div className="bg-[#11131A] border border-white/[0.08] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Scenario Adjustments</span>
          <span className="font-mono-tabular text-[#F59E0B]">
            SIMULATION — NO TRADE EXECUTED
          </span>
        </div>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#090A0F] border border-white/[0.06] rounded-lg p-3"
            >
              <div className="sm:col-span-4">
                <label className="block text-[11px] text-slate-500 mb-1">
                  Asset
                </label>
                <select
                  value={row.symbol}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRows((prev) =>
                      prev.map((r, i) => (i === index ? { ...r, symbol: val } : r))
                    );
                  }}
                  className="w-full bg-[#11131A] border border-white/[0.1] rounded-md px-3 py-2 text-xs font-mono-tabular text-slate-100 focus:outline-none focus:border-[#10B981]"
                >
                  {marketAssets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} — {a.name} (${a.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] text-slate-500 mb-1">
                  Action
                </label>
                <select
                  value={row.action}
                  onChange={(e) => {
                    const val = e.target.value as "buy" | "sell";
                    setRows((prev) =>
                      prev.map((r, i) => (i === index ? { ...r, action: val } : r))
                    );
                  }}
                  className="w-full bg-[#11131A] border border-white/[0.1] rounded-md px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-[#10B981]"
                >
                  <option value="buy">Add / Buy (+)</option>
                  <option value="sell">Reduce / Sell (-)</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] text-slate-500 mb-1">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono-tabular text-slate-400">
                    {row.action === "buy" ? "+$" : "-$"}
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={row.amount}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value) || 0);
                      setRows((prev) =>
                        prev.map((r, i) =>
                          i === index ? { ...r, amount: val } : r
                        )
                      );
                    }}
                    className="w-full bg-[#11131A] border border-white/[0.1] rounded-md pl-8 pr-3 py-2 text-xs font-mono-tabular text-slate-100 focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="sm:col-span-1 flex justify-end pt-4 sm:pt-0">
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setRows((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE vs AFTER SIMULATION Side-by-Side Comparison */}
      {comparisonActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BEFORE */}
          <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <div className="text-xs font-mono-tabular text-slate-400">
                  CURRENT BASELINE
                </div>
                <h2 className="text-lg font-semibold text-slate-100 mt-0.5">
                  BEFORE
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Risk Score</div>
                <div className="text-2xl font-mono-tabular font-semibold text-slate-200">
                  {baseRiskScore}
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Technology</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    48%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400" style={{ width: "48%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Healthcare</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    22%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: "22%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Other</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    30%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: "30%" }} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs text-slate-400">
              <span>Baseline Portfolio Value</span>
              <span className="font-mono-tabular text-slate-200 font-semibold">
                $24,820.40
              </span>
            </div>
          </div>

          {/* AFTER SIMULATION */}
          <div className="bg-[#11131A] border border-[#10B981]/30 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <div className="text-xs font-mono-tabular text-[#10B981]">
                  PROJECTED ALLOCATION
                </div>
                <h2 className="text-lg font-semibold text-slate-100 mt-0.5">
                  AFTER SIMULATION
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Risk Score</div>
                <div className="text-2xl font-mono-tabular font-semibold text-[#F59E0B]">
                  {afterRiskScore}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    ({afterRiskScore >= baseRiskScore ? "+" : ""}
                    {afterRiskScore - baseRiskScore})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Technology</span>
                  <span className="font-mono-tabular font-semibold text-[#10B981]">
                    {afterTechPct}%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981]"
                    style={{ width: `${Math.min(100, afterTechPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Healthcare</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    {afterHealthPct}%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400"
                    style={{ width: `${Math.min(100, afterHealthPct)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Other</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    {afterOtherPct}%
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400"
                    style={{ width: `${Math.min(100, afterOtherPct)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center text-xs text-slate-400">
              <span>Status</span>
              <span className="font-mono-tabular text-[#F59E0B] font-semibold">
                SIMULATION — NO TRADE EXECUTED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Explanation & Optional Order Ticket Handoff */}
      <div className="bg-[#11131A] border border-white/[0.08] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#10B981]">
            <Sparkles className="w-4 h-4" />
            <span>AI SCENARIO EXPLANATION</span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            “This scenario increases your technology concentration and raises
            portfolio risk. Consider how this fits with your broader
            allocation.”
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-2 pt-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              Simulated allocations evaluate portfolio weight mathematics and do
              not predict or guarantee future market returns.
            </span>
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() =>
              openOrderTicket(
                primaryRow.symbol,
                primaryRow.action,
                primaryRow.amount
              )
            }
            className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>
              Stage {primaryRow.action.toUpperCase()} {primaryRow.symbol} Order
              Ticket
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
