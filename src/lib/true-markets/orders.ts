import {
  getOrganizationToken,
  loadCredentials,
  stampPayload,
  tmFetch,
} from "./client";
import {
  CreateOrderInput,
  TrueMarketsExecuteOrderResponse,
  TrueMarketsOrderResponse,
} from "./types";

/**
 * Creates an order on True Markets Gateway (`POST /v1/gateway/orders`) and,
 * if `auto_execute` is true and payloads are returned, stamps each payload with
 * the signer key (`SIGNATURE_SCHEME_TK_API_P256`) and calls
 * `POST /v1/gateway/orders/{order_id}/execute`.
 *
 * Follows https://docs.truemarkets.co/gateway/place-orders and quickstart.ts.
 */
export async function createAndExecuteTrueMarketsOrder(
  input: CreateOrderInput
): Promise<{
  order: TrueMarketsOrderResponse;
  execution?: TrueMarketsExecuteOrderResponse;
}> {
  const creds = loadCredentials();
  if (!creds) {
    const err = new Error(
      "True Markets API credentials are not configured. Cannot execute real on-chain order without organization API key and signer key."
    );
    Object.assign(err, { status: 503, code: "CREDENTIALS_MISSING" });
    throw err;
  }

  const userId = input.user_id || creds.defaultUserId;
  if (!userId) {
    const err = new Error(
      "True Markets User ID (TM-On-Behalf-Of) is not configured. Create a user or set TRUE_MARKETS_USER_ID first."
    );
    Object.assign(err, { status: 400, code: "USER_ID_MISSING" });
    throw err;
  }

  // Ensure token is valid before placing order
  await getOrganizationToken();

  // Official sizing rules:
  // Market buy uses qty_unit: "quote" (USDC spent)
  // Market sell or limit order uses qty_unit: "base" (shares/tokens sold)
  const orderBody: Record<string, any> = {
    asset_id: input.asset_id,
    qty: input.qty,
    qty_unit: input.qty_unit,
    side: input.side,
    type: input.type,
  };

  if (input.type === "limit" && input.price) {
    orderBody.price = input.price;
  }

  const order = await tmFetch<TrueMarketsOrderResponse>(
    "POST",
    "/v1/gateway/orders",
    {
      requiresAuth: true,
      onBehalfOfUserId: userId,
      body: orderBody,
    }
  );

  // Per official docs: "An empty order_id means no order was created, and quote.issues says why."
  if (!order.order_id) {
    const issues = JSON.stringify(order.quote?.issues ?? []);
    const err = new Error(
      `True Markets order could not be created (wallet funding or quote issue): ${issues}`
    );
    Object.assign(err, {
      status: 422,
      code: "EMPTY_ORDER_ID",
      issues: order.quote?.issues,
    });
    throw err;
  }

  if (
    input.auto_execute !== false &&
    Array.isArray(order.payloads) &&
    order.payloads.length > 0
  ) {
    const signatures = order.payloads.map((p) => stampPayload(p.payload));
    const execution = await tmFetch<TrueMarketsExecuteOrderResponse>(
      "POST",
      `/v1/gateway/orders/${order.order_id}/execute`,
      {
        requiresAuth: true,
        onBehalfOfUserId: userId,
        body: {
          signatures,
          auth_type: "api_key",
        },
      }
    );

    return { order, execution };
  }

  return { order };
}

/**
 * Reads an order by ID (`GET /v1/gateway/orders/{id}`).
 */
export async function getTrueMarketsOrder(
  orderId: string,
  userId?: string
): Promise<TrueMarketsOrderResponse> {
  const creds = loadCredentials();
  const resolvedUserId = userId || creds?.defaultUserId;
  if (!resolvedUserId) {
    const err = new Error("TM-On-Behalf-Of user_id is required to read order.");
    Object.assign(err, { status: 400, code: "USER_ID_MISSING" });
    throw err;
  }

  return tmFetch<TrueMarketsOrderResponse>(
    "GET",
    `/v1/gateway/orders/${encodeURIComponent(orderId)}`,
    {
      requiresAuth: true,
      onBehalfOfUserId: resolvedUserId,
    }
  );
}

/**
 * Lists active or filtered orders for a user (`GET /v1/gateway/orders`).
 */
export async function listTrueMarketsOrders(
  status: string = "active",
  userId?: string
): Promise<{ data: TrueMarketsOrderResponse[] }> {
  const creds = loadCredentials();
  const resolvedUserId = userId || creds?.defaultUserId;
  if (!resolvedUserId) {
    const err = new Error("TM-On-Behalf-Of user_id is required to list orders.");
    Object.assign(err, { status: 400, code: "USER_ID_MISSING" });
    throw err;
  }

  return tmFetch<{ data: TrueMarketsOrderResponse[] }>(
    "GET",
    `/v1/gateway/orders?status=${encodeURIComponent(status)}`,
    {
      requiresAuth: true,
      onBehalfOfUserId: resolvedUserId,
    }
  );
}
