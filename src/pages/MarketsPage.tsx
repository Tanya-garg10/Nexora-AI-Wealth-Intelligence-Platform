import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import { useNexora } from "../context/NexoraContext";

export function MarketsPage() {
  const {
    marketAssets,
    liveCatalog,
    catalogLoading,
    catalogError,
    refreshCatalog,
    openOrderTicket,
  } = useNexora();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"featured" | "catalog">("featured");
  const navigate = useNavigate();

  const filteredFeatured = marketAssets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sector.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCatalog = liveCatalog
    .filter(
      (a) =>
        a.symbol.toLowerCase().includes(search.toLowerCase()) ||
        (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (a.chain || "").toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-slate-400 mb-1">
            <span>TRUE MARKETS GATEWAY CATALOG</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>DEMO REFERENCE PRICING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            Markets
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore featured equities and live tradable assets synced from{" "}
            <span className="font-mono-tabular text-slate-300">
              api.truemarkets.co/v1/gateway/assets
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshCatalog}
            disabled={catalogLoading}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${catalogLoading ? "animate-spin" : ""}`}
            />
            <span>Sync Gateway Catalog</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol, company, or settlement chain..."
            className="w-full bg-[#11131A] border border-white/[0.08] focus:border-[#10B981] rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#11131A] border border-white/[0.07] rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab("featured")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              tab === "featured"
                ? "bg-white/[0.1] text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Featured Markets ({marketAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("catalog")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              tab === "catalog"
                ? "bg-white/[0.1] text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Live Gateway Catalog ({liveCatalog.length || "..."})
          </button>
        </div>
      </div>

      {/* Error State with Retry */}
      {catalogError && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Market data unavailable from True Markets Gateway: {catalogError}
            </span>
          </div>
          <button
            type="button"
            onClick={refreshCatalog}
            className="px-3 py-1.5 text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Featured Markets Table */}
      {tab === "featured" && (
        <div className="bg-[#11131A] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
            <div className="text-xs text-slate-400">
              <span>Showing {filteredFeatured.length} assets</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>
                Prices &amp; sparklines reflect Demo Market Data; Catalog IDs
                synced from True Markets Gateway
              </span>
            </div>
          </div>

          {filteredFeatured.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="text-sm font-medium text-slate-300">
                No matching market assets found.
              </div>
              <p className="text-xs text-slate-500">
                Try clearing your search filter or switching to the full Live
                Gateway Catalog tab.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] text-slate-400 font-medium">
                    <th className="py-3 px-6">Symbol</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4 text-right">Price (Demo)</th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4 text-center">7D Trend</th>
                    <th className="py-3 px-4">Gateway Settlement</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-sm">
                  {filteredFeatured.map((asset) => {
                    const isPos = asset.changePercent >= 0;
                    const min = Math.min(...asset.sparkline);
                    const max = Math.max(...asset.sparkline);
                    const points = asset.sparkline
                      .map((val, idx) => {
                        const x = (idx / (asset.sparkline.length - 1)) * 80;
                        const y =
                          24 - ((val - min) / Math.max(0.01, max - min)) * 20;
                        return `${x},${y}`;
                      })
                      .join(" ");

                    return (
                      <tr
                        key={asset.symbol}
                        onClick={() => navigate(`/asset/${asset.symbol}`)}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6 font-mono-tabular font-semibold text-slate-100 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{asset.symbol}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-slate-200 font-medium">
                            {asset.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {asset.sector} · Market Cap {asset.marketCap}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono-tabular font-semibold text-slate-100 whitespace-nowrap">
                          ${asset.price.toFixed(2)}
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-mono-tabular font-medium whitespace-nowrap ${
                            isPos ? "text-[#10B981]" : "text-rose-400"
                          }`}
                        >
                          {isPos ? "+" : ""}
                          {asset.changePercent.toFixed(2)}%
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <svg width="84" height="28" className="overflow-visible">
                              <polyline
                                fill="none"
                                stroke={isPos ? "#10B981" : "#F43F5E"}
                                strokeWidth="1.75"
                                points={points}
                              />
                            </svg>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs font-mono-tabular text-slate-400 whitespace-nowrap">
                          <span>{asset.venue.toUpperCase()}</span>
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          <span>{asset.chain}</span>
                        </td>
                        <td
                          className="py-4 px-6 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openOrderTicket(asset.symbol, "buy")}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-md transition-colors cursor-pointer"
                            >
                              Buy
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/asset/${asset.symbol}`)}
                              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-colors cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Live True Markets Gateway Catalog Tab */}
      {tab === "catalog" && (
        <div className="bg-[#11131A] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-3.5 h-3.5 text-[#10B981]" />
              <span>
                Live response from{" "}
                <code className="font-mono-tabular text-slate-300">
                  GET https://api.truemarkets.co/v1/gateway/assets
                </code>
              </span>
            </div>
            <span className="text-xs font-mono-tabular text-slate-400">
              {liveCatalog.length} Total Assets
            </span>
          </div>

          {catalogLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-10 bg-white/[0.03] rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredCatalog.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No catalog assets matched your filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] text-slate-400 font-medium">
                    <th className="py-3 px-6">Symbol</th>
                    <th className="py-3 px-4">Asset Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Settlement Chain</th>
                    <th className="py-3 px-6">True Markets Asset UUID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-xs">
                  {filteredCatalog.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-6 font-mono-tabular font-semibold text-slate-100">
                        {item.symbol}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{item.name}</td>
                      <td className="py-3 px-4 font-mono-tabular text-slate-400">
                        {item.asset_class}
                      </td>
                      <td className="py-3 px-4 font-mono-tabular text-slate-400">
                        {item.venue}
                      </td>
                      <td className="py-3 px-4 font-mono-tabular text-slate-300">
                        {item.chain || "cefi-direct"}
                      </td>
                      <td className="py-3 px-6 font-mono-tabular text-slate-500">
                        {item.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
