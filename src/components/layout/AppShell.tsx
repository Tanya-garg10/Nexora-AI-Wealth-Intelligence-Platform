import React, { useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Globe,
  Sparkles,
  Sliders,
  Activity,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { ConnectionStatus } from "../trading/ConnectionStatus";
import { OrderTicket } from "../trading/OrderTicket";
import { useNexora } from "../../context/NexoraContext";

const NAV_ITEMS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Portfolio", path: "/portfolio", icon: Briefcase },
  { label: "Markets", path: "/markets", icon: Globe },
  { label: "AI Copilot", path: "/copilot", icon: Sparkles },
  { label: "Simulator", path: "/simulator", icon: Sliders },
  { label: "Activity", path: "/activity", icon: Activity },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { marketAssets, openOrderTicket, activities } = useNexora();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredAssets = searchQuery.trim()
    ? marketAssets.filter(
        (a) =>
          a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex">
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/[0.07] bg-[#0B0D13] select-none">
        {/* Brand Wordmark */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/[0.07]">
          <Link
            to="/"
            className="text-lg font-bold tracking-[0.16em] text-slate-100 hover:text-white transition-colors"
          >
            NEXORA
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/[0.07] text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Trade Trigger */}
        <div className="px-4 py-3">
          <button
            type="button"
            onClick={() => openOrderTicket("NVDA", "buy")}
            className="w-full py-2.5 px-4 bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold rounded-lg transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Quick Order Ticket</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Settings & Profile */}
        <div className="p-3 border-t border-white/[0.07] space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/[0.07] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
              }`
            }
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </NavLink>

          <Link
            to="/settings"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-semibold text-[#10B981]">
              TG
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-slate-200 truncate">
                Tanya Garg
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Demo Portfolio
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-[#0B0D13] border-r border-white/[0.08] flex flex-col z-10">
            <div className="h-16 px-6 flex items-center justify-between border-b border-white/[0.07]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold tracking-[0.16em] text-slate-100"
              >
                NEXORA
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`
                }
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/[0.07] bg-[#090A0F]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.04]"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search Input */}
            <div className="relative w-48 sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol (NVDA, AAPL, SOL)..."
                className="w-full bg-[#11131A] border border-white/[0.07] focus:border-white/[0.2] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              {searchFocused && filteredAssets.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-[#11131A] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-50">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.symbol}
                      type="button"
                      onMouseDown={() => {
                        navigate(`/asset/${asset.symbol}`);
                        setSearchQuery("");
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-white/[0.05] flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-mono-tabular font-semibold text-slate-100">
                          {asset.symbol}
                        </span>
                        <span className="text-slate-400 ml-2">{asset.name}</span>
                      </div>
                      <span className="font-mono-tabular text-slate-300">
                        ${asset.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Status + Notifications + Avatar */}
          <div className="flex items-center gap-4">
            <ConnectionStatus compact />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.04] transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#11131A] border border-white/[0.1] rounded-xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.07]">
                    <span className="text-xs font-semibold text-slate-200">
                      Recent Intelligence & Activity
                    </span>
                    <Link
                      to="/activity"
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] text-[#10B981] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {activities.slice(0, 3).map((act) => (
                      <div
                        key={act.id}
                        className="text-xs space-y-0.5 pb-2 border-b border-white/[0.04] last:border-none"
                      >
                        <div className="font-medium text-slate-200">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-2">
                          {act.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/settings"
              className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-xs font-semibold text-slate-200 hover:border-white/[0.25] transition-colors"
              title="Profile & Settings"
            >
              TG
            </Link>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Order Ticket Modal */}
      <OrderTicket />
    </div>
  );
}
