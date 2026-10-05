import { tmFetch } from "./client";
import { TrueMarketsAsset, TrueMarketsAssetsResponse } from "./types";

let cachedAssets: TrueMarketsAsset[] | null = null;
let cachedAt = 0;

/**
 * Fetches the live asset catalog from True Markets Gateway (`GET /v1/gateway/assets`).
 * No API key is required for this endpoint per official True Markets documentation.
 */
export async function getTrueMarketsAssets(
  assetClass: string = "stock,crypto"
): Promise<{
  assets: TrueMarketsAsset[];
  source: "true_markets_live" | "cache";
  fetchedAt: string;
}> {
  const now = Date.now();
  if (cachedAssets && now - cachedAt < 120_000) {
    return {
      assets: cachedAssets,
      source: "cache",
      fetchedAt: new Date(cachedAt).toISOString(),
    };
  }

  const query = assetClass ? `?asset_class=${encodeURIComponent(assetClass)}` : "";
  const response = await tmFetch<TrueMarketsAssetsResponse>(
    "GET",
    `/v1/gateway/assets${query}`,
    { requiresAuth: false }
  );

  const list = Array.isArray(response?.data) ? response.data : [];
  cachedAssets = list;
  cachedAt = now;

  return {
    assets: list,
    source: "true_markets_live",
    fetchedAt: new Date(now).toISOString(),
  };
}
