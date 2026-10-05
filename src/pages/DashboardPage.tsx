import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Sliders, ArrowRight } from "lucide-react";
import { PortfolioValueCard } from "../components/dashboard/PortfolioValueCard";
import { PerformanceChart } from "../components/charts/PerformanceChart";
import { AllocationChart } from "../components/charts/AllocationChart";
import { HoldingsTable } from "../components/portfolio/HoldingsTable";
import { ConnectionStatus } from "../components/trading/ConnectionStatus";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-slate-400 mb-1">
            <span>DEMO PORTFOLIO SNAPSHOT</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>SIMULATED FUNDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            Good evening, Tanya
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here’s what’s happening across your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/simulator"
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Wealth Simulator</span>
          </Link>
          <Link
            to="/copilot"
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Copilot</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Cards */}
      <PortfolioValueCard />

      {/* Performance Chart + Allocation Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-4">
          <AllocationChart />
        </div>
      </div>

      {/* Quick AI Concentration Insight Banner */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#10B981]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXORA COPILOT OBSERVATION</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Risk Score: 62 / 100 (Moderate)</span>
          </div>
          <p className="text-sm text-slate-200">
            Your technology allocation is currently 48% of the portfolio (NVDA,
            AAPL, MSFT). That makes technology the largest contributor to
            portfolio concentration.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/copilot"
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Analyze Risk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Holdings Table */}
      <HoldingsTable />

      {/* True Markets Connection Banner */}
      <ConnectionStatus />
    </div>
  );
}
