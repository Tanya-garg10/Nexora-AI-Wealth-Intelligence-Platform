import { z } from "zod";

export const AssetClassSchema = z.enum(["crypto", "stock"]);
export const VenueSchema = z.enum(["defi", "cefi"]);
export const ProductTypeSchema = z.enum(["spot", "perp"]);

export interface TrueMarketsAsset {
  id: string;
  symbol: string;
  name: string;
  chain: string | null;
  address?: string;
  decimals?: number;
  slug?: string;
  is_active: boolean;
  status: string;
  description?: string;
  website?: string;
  icon?: string;
  tradeable: boolean;
  stable: boolean;
  venue: "defi" | "cefi";
  type: "spot" | "perp";
  asset_class: "crypto" | "stock";
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
}

export interface TrueMarketsAssetsResponse {
  data: TrueMarketsAsset[];
}

export interface TrueMarketsTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: string;
}

export interface TrueMarketsWallet {
  address: string;
  chain_family: "solana" | "evm" | string;
}

export interface TrueMarketsUser {
  user_id: string;
  external_ref_id: string;
  created_at: string;
  wallets: TrueMarketsWallet[];
}

export interface TrueMarketsBalance {
  symbol: string;
  chain: string;
  available: string;
  total?: string;
}

export interface TrueMarketsOrderPayload {
  payload: string;
}

export interface TrueMarketsQuoteIssue {
  code?: string;
  message?: string;
}

export interface TrueMarketsOrderResponse {
  order_id: string;
  status: "initialized" | "complete" | "active" | "pending" | "failed" | "cancel_pending" | "canceled" | string;
  executed_qty?: string;
  quote?: {
    estimated_price?: string;
    estimated_qty?: string;
    issues?: TrueMarketsQuoteIssue[];
  };
  payloads?: TrueMarketsOrderPayload[];
}

export interface TrueMarketsExecuteOrderResponse {
  status: "complete" | "pending" | "failed" | "canceled" | string;
  executed_qty?: string;
  order_id?: string;
}

export const CreateUserRequestSchema = z.object({
  external_ref_id: z.string().min(1, "external_ref_id is required"),
  signer_public_key: z.string().optional(),
});

export const CreateOrderRequestSchema = z.object({
  asset_id: z.string().uuid("Valid True Markets asset_id UUID is required"),
  qty: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Quantity must be a positive decimal string",
  }),
  qty_unit: z.enum(["quote", "base"]),
  side: z.enum(["buy", "sell"]),
  type: z.enum(["market", "limit"]).default("market"),
  price: z.string().optional(),
  user_id: z.string().optional(),
  auto_execute: z.boolean().optional().default(true),
});

export type CreateOrderInput = z.infer<typeof CreateOrderRequestSchema>;
