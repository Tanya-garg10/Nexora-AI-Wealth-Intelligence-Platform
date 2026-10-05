import React from "react";
import { Link } from "react-router-dom";
import { Sliders, Sparkles, ShieldAlert } from "lucide-react";
import { AllocationChart } from "../components/charts/AllocationChart";
import { HoldingsTable } from "../components/portfolio/HoldingsTable";
import { DEMO_PORTFOLIO_SUMMARY } from "../lib/demo-data";

export function PortfolioPage() {
  const s = DEMO_PORTFOLIO_SUMMARY;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-slate-400 mb-1">
            <span>PORTFOLIO INTELLIGENCE</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>DEMO PORTFOLIO DATA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            Portfolio &amp; Risk Breakdown
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive exposure analysis, unrealized P&amp;L attribution, and
            sector concentration metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/simulator"
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Simulate Rebalance</span>
          </Link>
          <Link
            to="/copilot"
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explain Exposure</span>
          </Link>
        </div>
      </div>

      {/* Risk & Concentration Architecture Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <AllocationChart />
        </div>

        <div className="lg:col-span-7 bg-[#11131A] border border-white/[0.07] rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Risk &amp; Concentration Telemetry</span>
              <span className="font-mono-tabular text-amber-400">
                Moderate Risk ({s.riskScore}/100)
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mt-1">
              Concentration &amp; Volatility Profile
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your top three technology holdings (NVDA, AAPL, MSFT) account for
              43.8% of total portfolio equity. While high-conviction technology
              exposure has driven +$1,085.66 in cumulative unrealized gains, it
              elevates sensitivity to semiconductor and cloud valuation multiples.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
            <div>
              <div className="text-xs text-slate-400">Composite Risk Score</div>
              <div className="text-2xl font-mono-tabular font-semibold text-slate-100 mt-1">
                {s.riskScore} <span className="text-xs text-slate-500">/ 100</span>
              </div>
              <div className="text-[11px] text-amber-400 mt-1">
                Moderate · Tech-weighted
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Portfolio Beta (Est.)</div>
              <div className="text-2xl font-mono-tabular font-semibold text-slate-100 mt-1">
                {s.betaEstimate}x
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                vs. S&amp;P 500 Benchmark
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">Liquid Cash Buffer</div>
              <div className="text-2xl font-mono-tabular font-semibold text-[#10B981] mt-1">
                13.6%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                $3,370.40 Available
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#090A0F] border border-white/[0.05] flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-100">
                Concentration Note:
              </span>{" "}
              Adding further capital to Technology above 50% shifts the portfolio
              into an Elevated risk tier. Test prospective trades in the{" "}
              <Link to="/simulator" className="text-[#10B981] hover:underline">
                Wealth Simulator
              </Link>{" "}
              before placing an order.
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <HoldingsTable />
    </div>
  );
}
