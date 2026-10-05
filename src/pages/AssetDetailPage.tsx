import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ArrowLeft, Sliders, Sparkles } from "lucide-react";
import { useNexora } from "../context/NexoraContext";

type AssetRange = "1D" | "1W" | "1M" | "3M" | "1Y";
const ASSET_RANGES: AssetRange[] = ["1D", "1W", "1M", "3M", "1Y"];

export function AssetDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { marketAssets, openOrderTicket } = useNexora();
  const [range, setRange] = useState<AssetRange>("1M");

  const asset =
    marketAssets.find(
      (a) => a.symbol.toUpperCase() === (symbol || "NVDA").toUpperCase()
    ) || marketAssets[0];

  const isPos = asset.changePercent >= 0;
  const chartData = asset.priceHistory[range] || asset.priceHistory["1M"];

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/markets"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Markets</span>
        </Link>
        <div className="text-xs font-mono-tabular text-slate-400">
          <span>DEMO REFERENCE DATA</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>True Markets ID: {asset.trueMarketsAssetId.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Asset Header + Buy/Sell Actions */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-slate-400">
            <span className="text-slate-200 font-semibold">{asset.symbol}</span>
            <span aria-hidden="true">·</span>
            <span>{asset.sector}</span>
            <span aria-hidden="true">·</span>
            <span>Chain: {asset.chain}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 mt-1">
            {asset.fullName}
          </h1>
          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-3xl sm:text-4xl font-mono-tabular font-semibold text-slate-100">
              ${asset.price.toFixed(2)}
            </span>
            <span
              className={`text-sm font-mono-tabular font-semibold ${
                isPos ? "text-[#10B981]" : "text-rose-400"
              }`}
            >
              {isPos ? "+" : ""}
              {asset.changePercent.toFixed(2)}% ({isPos ? "+" : ""}$
              {asset.changeValue.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Buy & Sell Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => openOrderTicket(asset.symbol, "buy")}
            className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Buy {asset.symbol}
          </button>
          <button
            type="button"
            onClick={() => openOrderTicket(asset.symbol, "sell")}
            className="px-6 py-3 bg-white/[0.06] hover:bg-rose-500/20 hover:text-rose-300 border border-white/[0.1] text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Sell {asset.symbol}
          </button>
          <Link
            to={`/simulator?symbol=${asset.symbol}`}
            className="px-4 py-3 bg-[#090A0F] hover:bg-white/[0.05] border border-white/[0.08] text-slate-300 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Sliders className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Simulate Position</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Price Chart + Position & Gateway Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Price Chart */}
        <div className="lg:col-span-8 bg-[#11131A] border border-white/[0.07] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs text-slate-400">
                Price Trajectory ({range}) · Demo Market Feed
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Day Range: ${asset.dayLow.toFixed(2)} – ${asset.dayHigh.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#090A0F] border border-white/[0.06] rounded-lg self-start sm:self-auto">
              {ASSET_RANGES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-2.5 py-1 text-xs font-mono-tabular font-medium rounded-md transition-colors cursor-pointer ${
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

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="assetChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPos ? "#10B981" : "#F43F5E"}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPos ? "#10B981" : "#F43F5E"}
                      stopOpacity={0.0}
                    />
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
                  tickFormatter={(v) => `$${v}`}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0D13",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                  formatter={(value: any) => [
                    `$${Number(value).toFixed(2)}`,
                    asset.symbol,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPos ? "#10B981" : "#F43F5E"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#assetChartGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Position Card & True Markets Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* Position Card */}
          <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-100">
                Your Position
              </h3>
              <span className="text-[11px] font-mono-tabular text-slate-400">
                Demo Holding
              </span>
            </div>

            {asset.shares > 0 ? (
              <div className="space-y-3 pt-2 border-t border-white/[0.06] text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Your Position</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    {asset.shares} shares
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Average Price</span>
                  <span className="font-mono-tabular text-slate-200">
                    ${asset.avgPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Market Value</span>
                  <span className="font-mono-tabular font-semibold text-slate-100">
                    ${asset.value.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Unrealized P&amp;L</span>
                  <span className="font-mono-tabular font-semibold text-[#10B981]">
                    +${asset.unrealizedPnL.toFixed(2)} (+
                    {asset.unrealizedPnLPercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Portfolio Weight</span>
                  <span className="font-mono-tabular text-slate-200">
                    {asset.allocation.toFixed(1)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2 border-t border-white/[0.06]">
                <div className="text-xs text-slate-400">
                  No active shares held in demo portfolio.
                </div>
                <button
                  type="button"
                  onClick={() => openOrderTicket(asset.symbol, "buy")}
                  className="text-xs text-[#10B981] hover:underline font-medium cursor-pointer"
                >
                  Open Order Ticket to initiate position
                </button>
              </div>
            )}
          </div>

          {/* True Markets Gateway Execution Card */}
          <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-3">
            <div className="text-xs font-mono-tabular text-[#10B981]">
              TRUE MARKETS GATEWAY METADATA
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {asset.description}
            </p>
            <div className="pt-3 border-t border-white/[0.06] space-y-2 text-xs font-mono-tabular">
              <div className="flex justify-between">
                <span className="text-slate-500">Catalog ID</span>
                <span className="text-slate-300 truncate max-w-[180px]">
                  {asset.trueMarketsAssetId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Venue / Class</span>
                <span className="text-slate-300">
                  {asset.venue.toUpperCase()} · {asset.assetClass.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement Network</span>
                <span className="text-slate-300">{asset.chain}</span>
              </div>
            </div>
            <div className="pt-3">
              <Link
                to="/copilot"
                className="w-full py-2.5 px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] rounded-lg text-xs text-slate-200 font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Ask AI Copilot about {asset.symbol}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
