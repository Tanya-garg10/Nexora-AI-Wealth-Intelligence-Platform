import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ActivityEvent,
  ALL_DEMO_ASSETS,
  DemoHolding,
  DEMO_HOLDINGS,
  INITIAL_ACTIVITIES,
} from "../lib/demo-data";
import { TrueMarketsAsset } from "../lib/true-markets/types";
import { TrueMarketsStatusInfo } from "../lib/true-markets/client";

interface OrderTicketState {
  isOpen: boolean;
  symbol: string;
  side: "buy" | "sell";
  initialAmount?: number;
}

interface NexoraContextValue {
  holdings: DemoHolding[];
  marketAssets: DemoHolding[];
  liveCatalog: TrueMarketsAsset[];
  catalogLoading: boolean;
  catalogError: string | null;
  refreshCatalog: () => Promise<void>;
  tmStatus: TrueMarketsStatusInfo | null;
  statusLoading: boolean;
  refreshStatus: () => Promise<void>;
  activities: ActivityEvent[];
  addActivity: (event: Omit<ActivityEvent, "id" | "timestamp">) => void;
  orderTicket: OrderTicketState;
  openOrderTicket: (symbol: string, side: "buy" | "sell", initialAmount?: number) => void;
  closeOrderTicket: () => void;
}

const NexoraContext = createContext<NexoraContextValue | undefined>(undefined);

export function NexoraProvider({ children }: { children: React.ReactNode }) {
  const [holdings] = useState<DemoHolding[]>(DEMO_HOLDINGS);
  const [marketAssets, setMarketAssets] = useState<DemoHolding[]>(ALL_DEMO_ASSETS);
  const [liveCatalog, setLiveCatalog] = useState<TrueMarketsAsset[]>([]);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [tmStatus, setTmStatus] = useState<TrueMarketsStatusInfo | null>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(true);

  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  const [orderTicket, setOrderTicket] = useState<OrderTicketState>({
    isOpen: false,
    symbol: "NVDA",
    side: "buy",
  });

  const refreshStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await fetch("/api/true-markets/status");
      if (res.ok) {
        const json = await res.json();
        setTmStatus(json);
      }
    } catch {
      setTmStatus({
        configured: false,
        hasOrgApiKey: false,
        hasSignerKey: false,
        organizationId: null,
        defaultUserId: null,
        apiBaseUrl: "https://api.truemarkets.co",
        mode: "demo",
        message: "True Markets connection unavailable.",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const refreshCatalog = async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const res = await fetch("/api/true-markets/assets?asset_class=stock,crypto");
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Market data unavailable.");
      }
      const catalog: TrueMarketsAsset[] = json.data || [];
      setLiveCatalog(catalog);

      // Enrich our marketAssets with real True Markets catalog IDs & chains where matched
      setMarketAssets((prev) =>
        prev.map((item) => {
          const match = catalog.find(
            (c) =>
              c.symbol.toUpperCase() === item.symbol.toUpperCase() ||
              c.symbol.toUpperCase() === item.tmSymbol.toUpperCase()
          );
          if (match) {
            return {
              ...item,
              trueMarketsAssetId: match.id,
              chain: match.chain || item.chain,
              venue: match.venue || item.venue,
            };
          }
          return item;
        })
      );
    } catch (err: any) {
      setCatalogError(err.message || "Market data unavailable.");
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
    refreshCatalog();
  }, []);

  const addActivity = (event: Omit<ActivityEvent, "id" | "timestamp">) => {
    const nowStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}`,
      timestamp: `Today, ${nowStr}`,
    };
    setActivities((prev) => [newEvent, ...prev]);
  };

  const openOrderTicket = (
    symbol: string,
    side: "buy" | "sell",
    initialAmount?: number
  ) => {
    setOrderTicket({
      isOpen: true,
      symbol: symbol.toUpperCase(),
      side,
      initialAmount,
    });
  };

  const closeOrderTicket = () => {
    setOrderTicket((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <NexoraContext.Provider
      value={{
        holdings,
        marketAssets,
        liveCatalog,
        catalogLoading,
        catalogError,
        refreshCatalog,
        tmStatus,
        statusLoading,
        refreshStatus,
        activities,
        addActivity,
        orderTicket,
        openOrderTicket,
        closeOrderTicket,
      }}
    >
      {children}
    </NexoraContext.Provider>
  );
}

export function useNexora() {
  const ctx = useContext(NexoraContext);
  if (!ctx) {
    throw new Error("useNexora must be used inside NexoraProvider");
  }
  return ctx;
}
