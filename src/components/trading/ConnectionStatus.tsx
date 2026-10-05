import React from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { useNexora } from "../../context/NexoraContext";
import { Link } from "react-router-dom";

export function ConnectionStatus({ compact = false }: { compact?: boolean }) {
  const { tmStatus, statusLoading } = useNexora();

  if (statusLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-2 w-2 rounded-full bg-slate-600 animate-pulse" />
        <span>Checking gateway...</span>
      </div>
    );
  }

  const isConnected = tmStatus?.configured;

  if (compact) {
    return (
      <Link
        to="/settings"
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        title={tmStatus?.message}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            isConnected ? "bg-[#10B981]" : "bg-[#F59E0B]"
          }`}
        />
        <span className="font-mono-tabular tracking-tight">
          {isConnected ? "TRUE MARKETS CONNECTED" : "DEMO MODE"}
        </span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="text-slate-500 hidden sm:inline">
          {isConnected ? "Live Gateway" : "Simulated Portfolio"}
        </span>
      </Link>
    );
  }

  return (
    <div className="border border-white/[0.08] bg-[#11131A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        {isConnected ? (
          <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
        )}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tabular">
            <span
              className={
                isConnected ? "text-[#10B981] font-medium" : "text-[#F59E0B] font-medium"
              }
            >
              {isConnected ? "TRUE MARKETS CONNECTED" : "DEMO MODE"}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">
              api.truemarkets.co
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {isConnected
              ? "Server-side Organization API key and P-256 Signer key verified. Orders execute on-chain via True Markets Gateway."
              : "True Markets organization credentials are not configured. Portfolio metrics and order previews run safely in Demo Mode without moving real funds."}
          </p>
        </div>
      </div>
      <Link
        to="/settings"
        className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg transition-colors whitespace-nowrap self-start sm:self-center"
      >
        Gateway Settings
      </Link>
    </div>
  );
}
