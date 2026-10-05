import React, { useState } from "react";
import {
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Lock,
  UserCheck,
  Sparkles,
  Sliders,
} from "lucide-react";
import { useNexora } from "../context/NexoraContext";

export function SettingsPage() {
  const { tmStatus, statusLoading, refreshStatus, addActivity } = useNexora();
  const [riskProfile, setRiskProfile] = useState("Moderate");
  const [copilotDetail, setCopilotDetail] = useState("Institutional Breakdown");
  const [provisioningUser, setProvisioningUser] = useState(false);
  const [userProvisionMessage, setUserProvisionMessage] = useState<string | null>(
    null
  );

  const isConnected = Boolean(tmStatus?.configured);

  const handleTestCreateUser = async () => {
    setProvisioningUser(true);
    setUserProvisionMessage(null);
    try {
      const res = await fetch("/api/true-markets/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          external_ref_id: "nexora_user_tanya_1",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setUserProvisionMessage(
          json.error ||
            json.detail ||
            "True Markets credentials are required on the server to provision a user wallet."
        );
      } else {
        setUserProvisionMessage(
          `Provisioned True Markets User ID: ${json.user?.user_id}`
        );
        addActivity({
          type: "Portfolio updated",
          title: "True Markets User Wallets Verified",
          description: `Verified Solana & EVM wallets for user ${json.user?.user_id}.`,
          status: "Completed",
        });
      }
    } catch (err: any) {
      setUserProvisionMessage(
        err.message || "Unable to reach True Markets user endpoint."
      );
    } finally {
      setProvisioningUser(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="text-xs font-mono-tabular text-slate-400 mb-1">
          <span>SYSTEM &amp; ACCOUNT CONFIGURATION</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>SERVER-SIDE SECRET ISOLATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your profile, connected True Markets Gateway account status, AI
          Copilot preferences, and security controls.
        </p>
      </div>

      {/* 1. Connected Trading Account (True Markets Gateway) */}
      <div className="bg-[#11131A] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div className="flex items-start gap-3">
            {isConnected ? (
              <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
            )}
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Connected Trading Account — True Markets Connection
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono-tabular mt-1">
                <span>Status:</span>
                <span
                  className={
                    isConnected
                      ? "text-[#10B981] font-semibold"
                      : "text-[#F59E0B] font-semibold"
                  }
                >
                  {isConnected ? "Connected" : "Not Connected (Demo Mode)"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={refreshStatus}
              disabled={statusLoading}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${statusLoading ? "animate-spin" : ""}`}
              />
              <span>Verify Connection</span>
            </button>
            <button
              type="button"
              onClick={handleTestCreateUser}
              disabled={provisioningUser}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {provisioningUser ? "Checking..." : "Test User Provisioning"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#090A0F] border border-white/[0.05]">
            <div className="text-slate-400">Gateway Base URL</div>
            <div className="font-mono-tabular text-slate-200 font-medium mt-1">
              {tmStatus?.apiBaseUrl || "https://api.truemarkets.co"}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#090A0F] border border-white/[0.05]">
            <div className="text-slate-400">Organization API Key (ES256)</div>
            <div className="font-mono-tabular text-slate-200 font-medium mt-1">
              {tmStatus?.hasOrgApiKey
                ? "Configured (Server-Only)"
                : "Not Configured"}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#090A0F] border border-white/[0.05]">
            <div className="text-slate-400">Turnkey P-256 Signer Key</div>
            <div className="font-mono-tabular text-slate-200 font-medium mt-1">
              {tmStatus?.hasSignerKey
                ? "Configured (Server-Only)"
                : "Not Configured"}
            </div>
          </div>
        </div>

        {userProvisionMessage && (
          <div className="p-3.5 rounded-lg bg-[#090A0F] border border-white/[0.08] text-xs font-mono-tabular text-slate-300">
            {userProvisionMessage}
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          Private API credentials (<code className="font-mono-tabular text-slate-300">TM_KEY_FILE</code>,{" "}
          <code className="font-mono-tabular text-slate-300">TRUE_MARKETS_PRIVATE_KEY_JWK</code>, and{" "}
          <code className="font-mono-tabular text-slate-300">TRUE_MARKETS_SIGNER_PRIVATE_KEY</code>) are
          read strictly on the backend and are never exposed to client components.
        </p>
      </div>

      {/* 2. Profile & Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100">Profile</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-white/[0.05]">
              <span className="text-slate-400">Investor Name</span>
              <span className="text-slate-200 font-medium">Tanya Garg</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.05]">
              <span className="text-slate-400">Email</span>
              <span className="font-mono-tabular text-slate-300">
                taniyagarg1007@gmail.com
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Workspace Mode</span>
              <span className="font-mono-tabular text-[#10B981]">
                {isConnected ? "True Markets Connected" : "Demo Portfolio"}
              </span>
            </div>
          </div>
        </div>

        {/* AI Preferences & Portfolio Preferences */}
        <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-base font-semibold text-slate-100">
              AI &amp; Portfolio Preferences
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5">
                Target Risk Tolerance Benchmark
              </label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full bg-[#090A0F] border border-white/[0.1] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#10B981]"
              >
                <option value="Conservative">Conservative (Risk Score &lt; 45)</option>
                <option value="Moderate">Moderate (Risk Score 45 – 65)</option>
                <option value="Growth">Growth (Risk Score 65 – 80)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">
                Nexora Copilot Explanation Style
              </label>
              <select
                value={copilotDetail}
                onChange={(e) => setCopilotDetail(e.target.value)}
                className="w-full bg-[#090A0F] border border-white/[0.1] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#10B981]"
              >
                <option value="Institutional Breakdown">
                  Institutional Breakdown (Structured Risk + Attribution)
                </option>
                <option value="Concise Executive Summary">
                  Concise Executive Summary
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Security & Execution Safeguards */}
      <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#10B981]" />
          <h2 className="text-base font-semibold text-slate-100">
            Security &amp; Execution Safeguards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#090A0F] border border-white/[0.05] space-y-1">
            <div className="font-semibold text-slate-200">
              Explicit Trade Confirmation
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every order requires a two-step review and explicit user
              confirmation. AI Copilot and Wealth Simulator cannot auto-execute
              trades.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#090A0F] border border-white/[0.05] space-y-1">
            <div className="font-semibold text-slate-200">
              Server-Side Signing Only
            </div>
            <p className="text-slate-400 leading-relaxed">
              ECDSA P-256 organization token signing and Turnkey payload
              stamping execute exclusively in Node.js backend routes.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[#090A0F] border border-white/[0.05] space-y-1">
            <div className="font-semibold text-slate-200">
              Honest Execution Reporting
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nexora never displays "Trade executed" unless the True Markets
              Gateway API confirms execution status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
