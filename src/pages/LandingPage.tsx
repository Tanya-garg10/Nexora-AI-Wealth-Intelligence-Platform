import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Layers,
  Lock,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col">
      {/* 3-Zone Top Bar Contract */}
      <header className="h-16 border-b border-white/[0.07] bg-[#090A0F]/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-10 flex items-center justify-between max-w-[1440px] w-full mx-auto">
        {/* Zone 1: Single Text Wordmark */}
        <Link
          to="/"
          className="text-lg font-bold tracking-[0.18em] text-slate-100"
        >
          NEXORA
        </Link>

        {/* Zone 2: 4-5 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a
            href="#intelligence"
            className="hover:text-slate-100 transition-colors"
          >
            Intelligence
          </a>
          <a href="#copilot" className="hover:text-slate-100 transition-colors">
            AI Copilot
          </a>
          <a
            href="#simulator"
            className="hover:text-slate-100 transition-colors"
          >
            Simulator
          </a>
          <a href="#trading" className="hover:text-slate-100 transition-colors">
            Trading
          </a>
          <a
            href="#architecture"
            className="hover:text-slate-100 transition-colors"
          >
            Architecture
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/markets"
            className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
          >
            Explore Markets
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors whitespace-nowrap"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-10">
        {/* Hero Section */}
        <section className="pt-16 sm:pt-24 pb-16 text-center max-w-4xl mx-auto">
          <div className="text-xs font-mono-tabular text-slate-400 mb-6">
            <span>NEXORA</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>AI Wealth Intelligence</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>True Markets Gateway Integration</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-100 leading-[1.08]"
            style={{ textWrap: "balance" }}
          >
            Understand your wealth.{" "}
            <span className="font-serif-display italic font-normal text-[#10B981]">
              Act with confidence.
            </span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
            style={{ textWrap: "balance" }}
          >
            An intelligent wealth layer for modern investors — combining
            portfolio intelligence, risk analysis, scenario simulation, and
            seamless trading.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/markets"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#11131A] hover:bg-white/[0.06] border border-white/[0.1] text-slate-200 font-medium text-sm rounded-xl transition-colors whitespace-nowrap"
            >
              Explore Markets
            </Link>
          </div>
        </section>

        {/* Interactive Mock Dashboard Preview Below Hero */}
        <section className="pb-24">
          <div className="bg-[#11131A] border border-white/[0.09] rounded-2xl overflow-hidden shadow-2xl">
            {/* Window Top Bar */}
            <div className="px-6 py-3.5 border-b border-white/[0.07] bg-[#0B0D13] flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-semibold tracking-wider text-slate-200">
                  NEXORA WORKSPACE
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular text-slate-500">
                  Interactive Preview (Demo Portfolio Data)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono-tabular">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span>api.truemarkets.co</span>
              </div>
            </div>

            {/* Preview Content Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 8 Columns: KPIs + Visual Curve */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-white/[0.06]">
                  <div>
                    <div className="text-xs text-slate-400">Total Wealth</div>
                    <div className="text-xl font-mono-tabular font-semibold text-slate-100 mt-1">
                      $24,820.40
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Today’s P&amp;L</div>
                    <div className="text-xl font-mono-tabular font-semibold text-[#10B981] mt-1">
                      +$384.20 (+1.57%)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Invested</div>
                    <div className="text-xl font-mono-tabular font-semibold text-slate-100 mt-1">
                      $21,450.00
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Available Cash</div>
                    <div className="text-xl font-mono-tabular font-semibold text-slate-100 mt-1">
                      $3,370.40
                    </div>
                  </div>
                </div>

                {/* Stylized SVG Area Chart Preview */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>Portfolio Trajectory vs. Benchmark</span>
                    <span className="font-mono-tabular text-[#10B981]">
                      +15.9% (3M Demo Curve)
                    </span>
                  </div>
                  <div className="h-48 w-full bg-[#090A0F] border border-white/[0.05] rounded-xl p-4 flex flex-col justify-end relative overflow-hidden">
                    <svg
                      viewBox="0 0 600 140"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="heroChartGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10B981"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10B981"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,120 C80,115 140,95 220,88 C300,80 360,55 440,42 C510,30 560,18 600,10 L600,140 L0,140 Z"
                        fill="url(#heroChartGrad)"
                      />
                      <path
                        d="M0,120 C80,115 140,95 220,88 C300,80 360,55 440,42 C510,30 560,18 600,10"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M0,122 C100,118 180,108 260,102 C350,94 450,82 600,68"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right 4 Columns: Copilot & Simulator Snapshot */}
              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/[0.07] pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs font-mono-tabular text-[#10B981]">
                    AI PORTFOLIO COPILOT
                  </div>
                  <p className="text-sm text-slate-200 font-medium mt-2 leading-relaxed">
                    “Your technology allocation is currently 48% of the
                    portfolio. That makes technology the largest contributor to
                    portfolio concentration.”
                  </p>
                  <div className="mt-4 space-y-2 text-xs border-t border-white/[0.06] pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Technology exposure</span>
                      <span className="font-mono-tabular text-slate-100 font-semibold">
                        48%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Portfolio risk</span>
                      <span className="font-mono-tabular text-amber-400">
                        Moderate (62/100)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Concentration</span>
                      <span className="font-mono-tabular text-slate-200">
                        Elevated
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <Link
                    to="/simulator"
                    className="w-full py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Test +$2,000 NVDA in Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Required Architectural Sections */}
        <section id="intelligence" className="py-20 border-t border-white/[0.07]">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono-tabular text-[#10B981]">
              01. WEALTH INTELLIGENCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 mt-2">
              Institutional clarity across every position and sector.
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              See beyond raw account balances. Nexora decomposes your portfolio
              into sector weights, single-stock concentration metrics, and daily
              attribution so you always know what drives your performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6">
              <Layers className="w-5 h-5 text-[#10B981] mb-4" />
              <h3 className="text-base font-semibold text-slate-100">
                01. Exposure Decomposition
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Track exact capital allocation across Technology (48%),
                Healthcare (22%), Consumer, Financials, and liquid cash reserves
                in real time.
              </p>
            </div>

            <div id="copilot" className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6">
              <Sparkles className="w-5 h-5 text-[#10B981] mb-4" />
              <h3 className="text-base font-semibold text-slate-100">
                02. AI Portfolio Copilot
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ask natural-language questions powered by Gemini on the server.
                Receive structured analytical breakdowns of concentration,
                volatility, and trade-offs—never hype or automated execution.
              </p>
            </div>

            <div id="simulator" className="bg-[#11131A] border border-white/[0.07] rounded-xl p-6">
              <Sliders className="w-5 h-5 text-[#10B981] mb-4" />
              <h3 className="text-base font-semibold text-slate-100">
                03. Scenario Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Model single or multi-row portfolio changes before committing
                capital. Compare before-and-after sector weights and Risk Score
                impacts side by side.
              </p>
            </div>
          </div>
        </section>

        {/* Intelligent Trading & Secure Architecture */}
        <section
          id="trading"
          className="py-20 border-t border-white/[0.07] grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="bg-[#11131A] border border-white/[0.07] rounded-xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
                <span>04. INTELLIGENT TRADING</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mt-3">
                First-class True Markets Gateway integration.
              </h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Browse live tokenized stocks and spot digital assets directly
                from the True Markets Gateway catalog (`GET /v1/gateway/assets`).
                Stage orders with two-step review and explicit user confirmation
                before any payload is stamped and executed.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>Two-Step Order Confirmation</span>
              <Link
                to="/asset/NVDA"
                className="text-[#10B981] hover:underline font-medium flex items-center gap-1"
              >
                <span>Inspect NVDA Order Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div
            id="architecture"
            className="bg-[#11131A] border border-white/[0.07] rounded-xl p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#10B981]">
                <Lock className="w-4 h-4" />
                <span>05. SECURE ARCHITECTURE</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mt-3">
                Server-side key isolation &amp; transparent Demo Mode.
              </h3>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Organization API keys, ES256 JWT minting (`/v1/auth/api-key/token`),
                P-256 payload stamping (`SIGNATURE_SCHEME_TK_API_P256`), and
                Gemini API calls run strictly on the server. When credentials
                are not attached, Nexora operates in an honest Demo Mode and
                never fabricates live trade executions.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>Zod Request Validation · Server-Only Keys</span>
              <Link
                to="/settings"
                className="text-slate-200 hover:underline font-medium flex items-center gap-1"
              >
                <span>View Gateway Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-white/[0.07] py-10 px-6 sm:px-10 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            <span className="font-bold tracking-[0.16em] text-slate-300">
              NEXORA
            </span>
            <span className="mx-2">·</span>
            <span>
              AI-generated insights are informational and not financial advice.
              Portfolio values shown in Demo Mode represent simulated data.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-slate-300">
              Dashboard
            </Link>
            <Link to="/markets" className="hover:text-slate-300">
              Markets
            </Link>
            <Link to="/copilot" className="hover:text-slate-300">
              Copilot
            </Link>
            <Link to="/simulator" className="hover:text-slate-300">
              Simulator
            </Link>
            <Link to="/settings" className="hover:text-slate-300">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
