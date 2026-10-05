import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Send,
  AlertCircle,
  Sliders,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  COPILOT_SUGGESTED_PROMPTS,
  FALLBACK_COPILOT_RESPONSES,
  StructuredCopilotResponse,
} from "../lib/demo-data";
import { useNexora } from "../context/NexoraContext";

interface ChatTurn {
  id: string;
  userPrompt: string;
  response: StructuredCopilotResponse;
  source: string;
  timestamp: string;
}

export function CopilotPage() {
  const { addActivity } = useNexora();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "initial-turn",
      userPrompt: "Explain my technology exposure.",
      response: FALLBACK_COPILOT_RESPONSES.default,
      source: "demo_intelligence_engine",
      timestamp: "Today, 14:42 EST",
    },
  ]);

  const handleAsk = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Unable to generate AI insight.");
      }

      const newTurn: ChatTurn = {
        id: `turn-${Date.now()}`,
        userPrompt: trimmed,
        response: json.data,
        source: json.source || "gemini_live",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setTurns((prev) => [newTurn, ...prev]);

      addActivity({
        type: "AI analysis generated",
        title: `Copilot inquiry: "${trimmed.slice(0, 42)}${trimmed.length > 42 ? "..." : ""}"`,
        description: json.data.summary,
        status: "Completed",
      });
    } catch (err: any) {
      setError(err.message || "AI Copilot temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono-tabular text-slate-400 mb-1">
            <span>SERVER-SIDE GEMINI INTELLIGENCE</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>DEMO PORTFOLIO CONTEXT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100 tracking-tight">
            Nexora Copilot
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Turn portfolio data into decisions you can understand.
          </p>
        </div>

        <Link
          to="/simulator"
          className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Sliders className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Open Wealth Simulator</span>
        </Link>
      </div>

      {/* Mandatory Disclaimer Banner */}
      <div className="bg-[#11131A] border border-white/[0.08] rounded-xl px-4 py-3 flex items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span>
            <strong className="text-slate-200 font-medium">Disclaimer:</strong>{" "}
            AI-generated insights are informational and not financial advice.
            Analysis evaluates your Demo / Simulated Portfolio data.
          </span>
        </div>
        <span className="font-mono-tabular text-[11px] text-slate-500 hidden md:inline whitespace-nowrap">
          No Auto-Execution
        </span>
      </div>

      {/* Prompt Input & Suggested Prompts */}
      <div className="bg-[#11131A] border border-white/[0.08] rounded-xl p-5 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(input);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your portfolio concentration, daily attribution, or scenario trade-offs..."
            className="flex-1 bg-[#090A0F] border border-white/[0.1] focus:border-[#10B981] rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Analyze Portfolio</span>
              </>
            )}
          </button>
        </form>

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <div className="text-[11px] text-slate-400">Suggested Inquiries</div>
          <div className="flex flex-wrap gap-2">
            {COPILOT_SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => handleAsk(prompt)}
                className="px-3 py-1.5 text-xs text-slate-300 bg-[#090A0F] hover:bg-white/[0.06] border border-white/[0.08] rounded-lg transition-colors cursor-pointer text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => handleAsk(COPILOT_SUGGESTED_PROMPTS[0])}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-100 font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Typing / Loading Skeleton */}
      {loading && (
        <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-2 text-xs text-[#10B981] font-mono-tabular">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Nexora Copilot is evaluating portfolio weights and risk covariance...</span>
          </div>
          <div className="h-5 bg-white/[0.05] rounded w-3/4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="h-20 bg-white/[0.04] rounded-lg" />
            <div className="h-20 bg-white/[0.04] rounded-lg" />
            <div className="h-20 bg-white/[0.04] rounded-lg" />
          </div>
        </div>
      )}

      {/* Structured AI Response Cards */}
      <div className="space-y-6">
        {turns.map((turn) => {
          const r = turn.response;
          return (
            <div
              key={turn.id}
              className="bg-[#11131A] border border-white/[0.08] rounded-xl overflow-hidden"
            >
              {/* User Question Header */}
              <div className="px-6 py-4 bg-[#0B0D13] border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-sm font-semibold text-slate-100">
                    {turn.userPrompt}
                  </span>
                </div>
                <div className="text-xs font-mono-tabular text-slate-500">
                  <span>{turn.timestamp}</span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>Demo / Simulated Data</span>
                </div>
              </div>

              {/* Response Body */}
              <div className="p-6 space-y-6">
                {/* Primary Executive Summary */}
                <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                  “{r.summary}”
                </div>

                {/* Key Telemetry Strip (Technology exposure 48% | Portfolio risk Moderate | Concentration Elevated) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
                  {r.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-[#090A0F] border border-white/[0.05]"
                    >
                      <div className="text-xs text-slate-400">{m.label}</div>
                      <div className="text-xl font-mono-tabular font-semibold text-slate-100 mt-1">
                        {m.value}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {m.context}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Structured Analysis Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/[0.06]">
                  {/* Portfolio Observation */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono-tabular text-[#10B981]">
                      PORTFOLIO OBSERVATION
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {r.observation}
                    </p>
                  </div>

                  {/* Risk Analysis */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono-tabular text-amber-400">
                      RISK · {r.risk.level.toUpperCase()} (SCORE {r.risk.score}/100)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {r.risk.explanation}
                    </p>
                  </div>

                  {/* Concentration */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono-tabular text-sky-400">
                      CONCENTRATION · {r.concentration.primarySector.toUpperCase()} ({r.concentration.percentage})
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {r.concentration.detail}
                    </p>
                  </div>

                  {/* Potential Impact */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono-tabular text-purple-400">
                      POTENTIAL IMPACT
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {r.potentialImpact}
                    </p>
                  </div>
                </div>

                {/* Things to Consider */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="text-xs font-mono-tabular text-slate-400">
                      THINGS TO CONSIDER
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {r.thingsToConsider.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#10B981] font-mono-tabular">
                            0{i + 1}.
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
                    <Link
                      to="/simulator"
                      className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>Test in Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/asset/NVDA"
                      className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors"
                    >
                      Inspect NVDA
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
