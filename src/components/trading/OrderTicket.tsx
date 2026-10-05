import React, { useState, useEffect } from "react";
import {
  X,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useNexora } from "../../context/NexoraContext";

export function OrderTicket() {
  const {
    orderTicket,
    closeOrderTicket,
    marketAssets,
    tmStatus,
    addActivity,
  } = useNexora();

  const [step, setStep] = useState<"input" | "review" | "result">("input");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<string>("10");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    ok: boolean;
    mode: "connected" | "demo";
    statusText: string;
    message: string;
    orderId?: string;
    requestId?: string;
    isSimulatedPreview?: boolean;
  } | null>(null);

  const asset =
    marketAssets.find(
      (a) => a.symbol.toUpperCase() === orderTicket.symbol.toUpperCase()
    ) || marketAssets[0];

  useEffect(() => {
    if (orderTicket.isOpen) {
      setStep("input");
      setSide(orderTicket.side);
      if (orderTicket.initialAmount && asset) {
        const calcShares = Math.max(
          1,
          Math.round((orderTicket.initialAmount / asset.price) * 100) / 100
        );
        setQuantity(String(calcShares));
      } else {
        setQuantity("10");
      }
      setExecutionResult(null);
    }
  }, [orderTicket.isOpen, orderTicket.symbol, orderTicket.side, orderTicket.initialAmount]);

  if (!orderTicket.isOpen || !asset) return null;

  const numericQty = Math.max(0, Number(quantity) || 0);
  const estimatedValue = numericQty * asset.price;
  const isConnected = Boolean(tmStatus?.configured);

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericQty <= 0) return;

    addActivity({
      type: "Order preview created",
      title: `Order preview: ${side.toUpperCase()} ${numericQty} ${asset.symbol}`,
      description: `Prepared ${orderType} ${side} order for ${numericQty} ${asset.symbol} (Est. $${estimatedValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`,
      status: "Simulated",
      asset: asset.symbol,
      amount: `$${estimatedValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    });

    setStep("review");
  };

  const handleConfirmLiveOrder = async () => {
    setSubmitting(true);
    setExecutionResult(null);

    try {
      // Per official True Markets Gateway docs:
      // Market buy uses qty_unit: "quote" (USDC amount to spend)
      // Market sell uses qty_unit: "base" (shares/tokens to sell)
      const qtyToSend =
        side === "buy" && orderType === "market"
          ? estimatedValue.toFixed(2)
          : String(numericQty);
      const qtyUnit =
        side === "buy" && orderType === "market" ? "quote" : "base";

      const res = await fetch("/api/true-markets/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: asset.trueMarketsAssetId,
          qty: qtyToSend,
          qty_unit: qtyUnit,
          side,
          type: orderType,
          auto_execute: true,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        addActivity({
          type: "Trade submitted",
          title: `True Markets Order Rejected: ${side.toUpperCase()} ${numericQty} ${asset.symbol}`,
          description: json.detail || json.error || "True Markets Gateway returned a configuration or execution error.",
          status: "Failed",
          asset: asset.symbol,
          amount: `$${estimatedValue.toFixed(2)}`,
        });

        setExecutionResult({
          ok: false,
          mode: json.mode || (isConnected ? "connected" : "demo"),
          statusText: json.code || "CONFIGURATION_REQUIRED",
          message:
            json.detail ||
            json.error ||
            "Unable to create order on True Markets Gateway.",
          requestId: json.request_id,
          isSimulatedPreview: false,
        });
        setStep("result");
        return;
      }

      const finalStatus =
        json.execution?.status || json.order?.status || "submitted";

      addActivity({
        type: "Trade submitted",
        title: `True Markets Order (${finalStatus.toUpperCase()}): ${side.toUpperCase()} ${numericQty} ${asset.symbol}`,
        description: `Executed via True Markets Gateway (Order ID: ${json.order?.order_id}).`,
        status: finalStatus === "complete" ? "Completed" : "Pending",
        asset: asset.symbol,
        amount: `$${estimatedValue.toFixed(2)}`,
        txHashOrOrderId: json.order?.order_id,
      });

      setExecutionResult({
        ok: true,
        mode: "connected",
        statusText: finalStatus.toUpperCase(),
        message: `True Markets Gateway confirmed order status: ${finalStatus}.`,
        orderId: json.order?.order_id,
        isSimulatedPreview: false,
      });
      setStep("result");
    } catch (err: any) {
      setExecutionResult({
        ok: false,
        mode: "demo",
        statusText: "NETWORK_ERROR",
        message: err.message || "Unable to reach backend True Markets adapter.",
      });
      setStep("result");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulateDemoPreview = () => {
    addActivity({
      type: "Order preview created",
      title: `Simulated Order Preview: ${side.toUpperCase()} ${numericQty} ${asset.symbol}`,
      description: `Demo Mode order simulation recorded ($${estimatedValue.toFixed(2)}). No real True Markets transaction was executed.`,
      status: "Simulated",
      asset: asset.symbol,
      amount: `$${estimatedValue.toFixed(2)}`,
    });

    setExecutionResult({
      ok: true,
      mode: "demo",
      statusText: "SIMULATED PREVIEW — NO TRADE EXECUTED",
      message:
        "This order was recorded as a Demo Mode simulation. No real funds were moved and no live order was executed on True Markets.",
      isSimulatedPreview: true,
    });
    setStep("result");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="w-full sm:max-w-md bg-[#11131A] border-t sm:border border-white/[0.1] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-ticket-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tabular">
              <span>{asset.symbol}</span>
              <span aria-hidden="true">·</span>
              <span>{asset.chain ? `Chain: ${asset.chain}` : "True Markets"}</span>
              <span aria-hidden="true">·</span>
              <span className={isConnected ? "text-[#10B981]" : "text-[#F59E0B]"}>
                {isConnected ? "LIVE GATEWAY" : "DEMO MODE"}
              </span>
            </div>
            <h2
              id="order-ticket-title"
              className="text-lg font-semibold text-slate-100 mt-0.5"
            >
              {step === "input" && `${side.toUpperCase()} ${asset.symbol}`}
              {step === "review" && "Review Order"}
              {step === "result" && "Order Status"}
            </h2>
          </div>
          <button
            onClick={closeOrderTicket}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.05] transition-colors"
            aria-label="Close order ticket"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Order Input */}
        {step === "input" && (
          <form onSubmit={handleReviewOrder} className="p-6 space-y-5">
            {/* Buy / Sell Segmented Toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#090A0F] border border-white/[0.06] rounded-lg">
              <button
                type="button"
                onClick={() => setSide("buy")}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  side === "buy"
                    ? "bg-[#10B981] text-slate-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                BUY {asset.symbol}
              </button>
              <button
                type="button"
                onClick={() => setSide("sell")}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  side === "sell"
                    ? "bg-rose-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                SELL {asset.symbol}
              </button>
            </div>

            {/* Reference Price & True Markets Catalog UUID */}
            <div className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-[#090A0F]/80 border border-white/[0.05] text-xs">
              <span className="text-slate-400">Reference Market Price (Demo)</span>
              <span className="font-mono-tabular font-semibold text-slate-100">
                ${asset.price.toFixed(2)}
              </span>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">
                Quantity (Shares / Units)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[#090A0F] border border-white/[0.12] focus:border-[#10B981] rounded-lg px-4 py-3 text-base font-mono-tabular text-slate-100 focus:outline-none transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {[1, 5, 10, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantity(String(preset))}
                      className="px-2 py-1 text-[11px] font-mono-tabular bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 rounded transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Order Type
                </label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as "market" | "limit")}
                  className="w-full bg-[#090A0F] border border-white/[0.1] rounded-lg px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#10B981]"
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  Estimated Value
                </label>
                <div className="w-full bg-[#090A0F] border border-white/[0.06] rounded-lg px-3 py-2.5 text-xs font-mono-tabular font-semibold text-slate-100">
                  $
                  {estimatedValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* True Markets Gateway Metadata */}
            <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Execution Venue</span>
                <span className="text-slate-300 font-mono-tabular">
                  True Markets Gateway ({asset.venue.toUpperCase()})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Catalog Asset ID</span>
                <span className="text-slate-400 font-mono-tabular truncate max-w-[190px]">
                  {asset.trueMarketsAssetId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sizing Unit</span>
                <span className="text-slate-300 font-mono-tabular">
                  {side === "buy" ? 'qty_unit: "quote" (USDC)' : 'qty_unit: "base"'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Review Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Explicit Confirmation Screen */}
        {step === "review" && (
          <div className="p-6 space-y-5">
            <div className="bg-[#090A0F] border border-white/[0.08] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Action</span>
                <span
                  className={`font-mono-tabular font-semibold ${
                    side === "buy" ? "text-[#10B981]" : "text-rose-400"
                  }`}
                >
                  {side.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Asset</span>
                <span className="font-mono-tabular font-semibold text-slate-100">
                  {asset.symbol} · {asset.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Quantity</span>
                <span className="font-mono-tabular text-slate-100">
                  {numericQty}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Order Type</span>
                <span className="font-mono-tabular text-slate-200 capitalize">
                  {orderType}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.05]">
                <span className="text-slate-400">Estimated Value</span>
                <span className="font-mono-tabular font-semibold text-sm text-slate-100">
                  $
                  {estimatedValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Account</span>
                <span className="font-mono-tabular text-slate-200">
                  Nexora / True Markets
                </span>
              </div>
            </div>

            {/* Mandatory Warning */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Trading executes through True Markets and may involve real funds.
                Review the order carefully before confirmation.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setStep("input")}
                  className="py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmLiveOrder}
                  className="py-2.5 px-4 bg-[#10B981] hover:bg-[#059669] text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm Order</span>
                  )}
                </button>
              </div>

              {!isConnected && (
                <button
                  type="button"
                  onClick={handleSimulateDemoPreview}
                  className="w-full py-2.5 px-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Simulate Order Preview (Demo Mode — No Live Execution)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: API Result / Honest Status */}
        {step === "result" && executionResult && (
          <div className="p-6 space-y-5">
            <div
              className={`p-4 rounded-xl border ${
                executionResult.ok && !executionResult.isSimulatedPreview
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : executionResult.isSimulatedPreview
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-rose-500/10 border-rose-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                {executionResult.ok && !executionResult.isSimulatedPreview ? (
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                ) : executionResult.isSimulatedPreview ? (
                  <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono-tabular font-semibold tracking-wide text-slate-100">
                    {executionResult.statusText}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {executionResult.message}
                  </p>
                  {executionResult.orderId && (
                    <p className="text-[11px] font-mono-tabular text-slate-400 pt-1">
                      Order ID: {executionResult.orderId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!executionResult.ok && !isConnected && (
              <div className="p-3.5 rounded-lg bg-[#090A0F] border border-white/[0.06] space-y-2.5">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Because True Markets credentials are not configured on the server,
                  Nexora refuses to fabricate a live trade confirmation. You can
                  record a clearly labeled Demo Preview instead:
                </p>
                <button
                  type="button"
                  onClick={handleSimulateDemoPreview}
                  className="w-full py-2 px-3 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Record as Simulated Order Preview
                </button>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeOrderTicket}
                className="w-full py-2.5 px-4 bg-white/[0.08] hover:bg-white/[0.12] text-slate-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
