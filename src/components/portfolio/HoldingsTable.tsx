import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useNexora } from "../../context/NexoraContext";

export function HoldingsTable() {
  const { holdings, openOrderTicket } = useNexora();
  const navigate = useNavigate();

  return (
    <div className="bg-[#11131A] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Holdings</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demo portfolio positions mapped to True Markets Gateway catalog identifiers. Click any row to inspect or trade.
          </p>
        </div>
        <div className="text-xs font-mono-tabular text-slate-400">
          {holdings.length} Active Positions
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] text-slate-400 font-medium">
              <th className="py-3 px-6">Symbol</th>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Today</th>
              <th className="py-3 px-4 text-right">Value</th>
              <th className="py-3 px-4 text-right">Allocation</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-sm">
            {holdings.map((h) => {
              const isPos = h.changePercent >= 0;
              return (
                <tr
                  key={h.symbol}
                  onClick={() => navigate(`/asset/${h.symbol}`)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-6 font-mono-tabular font-semibold text-slate-100 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{h.symbol}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    <div>{h.name}</div>
                    <div className="text-[11px] text-slate-500">{h.sector}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-200 whitespace-nowrap">
                    ${h.price.toFixed(2)}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono-tabular font-medium whitespace-nowrap ${
                      isPos ? "text-[#10B981]" : "text-rose-400"
                    }`}
                  >
                    {isPos ? "+" : ""}
                    {h.changePercent.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-tabular font-semibold text-slate-100 whitespace-nowrap">
                    ${h.value.toLocaleString("en-US")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-300 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-[#10B981]"
                          style={{ width: `${Math.min(100, h.allocation * 2.5)}%` }}
                        />
                      </div>
                      <span>{h.allocation.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td
                    className="py-3.5 px-6 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => openOrderTicket(h.symbol, "buy")}
                      className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-[#10B981] hover:text-slate-950 rounded-md transition-colors cursor-pointer"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
