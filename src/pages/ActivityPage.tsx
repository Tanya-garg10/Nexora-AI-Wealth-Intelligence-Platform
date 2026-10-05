import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useNexora } from "../context/NexoraContext";
import { ActivityEvent } from "../lib/demo-data";

const FILTER_TYPES: ("All" | ActivityEvent["status"])[] = [
  "All",
  "Completed",
  "Simulated",
  "Pending",
  "Failed",
];

export function ActivityPage() {
  const { activities } = useNexora();
  const [statusFilter, setStatusFilter] = useState<
    "All" | ActivityEvent["status"]
  >("All");

  const filtered =
    statusFilter === "All"
      ? activities
      : activities.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-slate-400 mb-1">
            <span>AUDIT &amp; EVENT STREAM</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>CHRONOLOGICAL LOG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            Activity Timeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete record of portfolio snapshots, AI Copilot analyses,
            scenario simulations, and True Markets order events.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#11131A] border border-white/[0.07] rounded-lg self-start sm:self-auto overflow-x-auto max-w-full">
          {FILTER_TYPES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Activity className="w-6 h-6 text-slate-500 mx-auto" />
            <div className="text-sm font-medium text-slate-300">
              No activity events match the selected status filter.
            </div>
            <p className="text-xs text-slate-500">
              Select "All" or run a scenario in the Wealth Simulator to log new
              events.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-white/[0.08] space-y-8">
            {filtered.map((item) => {
              const isCompleted = item.status === "Completed";
              const isSimulated = item.status === "Simulated";
              const isPending = item.status === "Pending";

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <span
                    className={`absolute -left-[33px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border ${
                      isCompleted
                        ? "bg-[#090A0F] border-[#10B981] text-[#10B981]"
                        : isSimulated
                        ? "bg-[#090A0F] border-[#F59E0B] text-[#F59E0B]"
                        : isPending
                        ? "bg-[#090A0F] border-sky-400 text-sky-400"
                        : "bg-[#090A0F] border-rose-400 text-rose-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : isSimulated ? (
                      <Sparkles className="w-2.5 h-2.5" />
                    ) : isPending ? (
                      <Clock className="w-2.5 h-2.5" />
                    ) : (
                      <AlertTriangle className="w-2.5 h-2.5" />
                    )}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular text-slate-400">
                      <span className="text-slate-300 font-medium">
                        {item.type}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.timestamp}</span>
                      {item.asset && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-200">{item.asset}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono-tabular">
                      {item.amount && (
                        <span className="text-slate-200 font-semibold">
                          {item.amount}
                        </span>
                      )}
                      <span
                        className={
                          isCompleted
                            ? "text-[#10B981]"
                            : isSimulated
                            ? "text-[#F59E0B]"
                            : isPending
                            ? "text-sky-400"
                            : "text-rose-400"
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                  {item.txHashOrOrderId && (
                    <div className="mt-1.5 text-[11px] font-mono-tabular text-slate-500">
                      True Markets Order ID: {item.txHashOrOrderId}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
