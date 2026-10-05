import React from "react";
import { DEMO_PORTFOLIO_SUMMARY } from "../../lib/demo-data";

export function PortfolioValueCard() {
  const s = DEMO_PORTFOLIO_SUMMARY;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Wealth */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Total Wealth</span>
          <span className="font-mono-tabular text-[11px] text-slate-500">
            Demo Portfolio
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-semibold font-mono-tabular tracking-tight text-slate-100">
            $
            {s.totalWealth.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[#10B981] font-mono-tabular font-medium">
              +{s.todaysPnLPercent.toFixed(2)}%
            </span>
            <span aria-hidden="true">·</span>
            <span>All-weather allocation</span>
          </div>
        </div>
      </div>

      {/* Today's P&L */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Today’s P&amp;L</span>
          <span className="font-mono-tabular text-[11px] text-slate-500">
            Session
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-semibold font-mono-tabular tracking-tight text-[#10B981]">
            +$
            {s.todaysPnL.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[#10B981] font-mono-tabular font-medium">
              +{s.todaysPnLPercent.toFixed(2)}%
            </span>
            <span aria-hidden="true">·</span>
            <span>Led by NVDA (+2.41%)</span>
          </div>
        </div>
      </div>

      {/* Invested */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Invested</span>
          <span className="font-mono-tabular text-[11px] text-slate-500">
            86.4% of Wealth
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-semibold font-mono-tabular tracking-tight text-slate-100">
            $
            {s.invested.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            <span>5 Core Equities</span>
            <span aria-hidden="true">·</span>
            <span>Risk Score {s.riskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Available Cash */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Available Cash</span>
          <span className="font-mono-tabular text-[11px] text-slate-500">
            13.6% of Wealth
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-semibold font-mono-tabular tracking-tight text-slate-100">
            $
            {s.availableCash.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            <span>Uninvested reserve</span>
            <span aria-hidden="true">·</span>
            <span>Ready for deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
