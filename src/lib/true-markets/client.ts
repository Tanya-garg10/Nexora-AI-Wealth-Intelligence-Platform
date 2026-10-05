import { createECDH, createPrivateKey, generateKeyPairSync, sign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

export const TRUE_MARKETS_API_BASE = "https://api.truemarkets.co";

export interface TrueMarketsCredentials {
  keyId: string;
  privateKeyJwk: Record<string, any>;
  organizationId?: string;
  signerPublicKey?: string;
  signerPrivateKey?: string;
  defaultUserId?: string;
}

export interface TrueMarketsStatusInfo {
  configured: boolean;
  hasOrgApiKey: boolean;
  hasSignerKey: boolean;
  organizationId: string | null;
  defaultUserId: string | null;
  apiBaseUrl: string;
  mode: "connected" | "demo";
  message: string;
}

let cachedToken: string | null = null;
let cachedTokenExpiry = 0;
let cachedOrgId: string | null = null;

/**
 * Loads True Markets credentials safely from server environment variables or key files.
 * Never exposes private keys to callers.
 */
export function loadCredentials(): TrueMarketsCredentials | null {
  try {
    let keyId = process.env.TRUE_MARKETS_API_KEY_ID || "";
    let privateKeyJwk: Record<string, any> | null = null;

    if (!keyId || !privateKeyJwk) {
      return null;
    }

    let signerPublicKey = "";
    let signerPrivateKey = "";

    return {
      keyId,
      privateKeyJwk,
      organizationId: undefined,
      signerPublicKey: undefined,
      signerPrivateKey: undefined,
      defaultUserId: undefined,
    };
  } catch {
    return null;
  }
}

export function getConnectionStatus(): TrueMarketsStatusInfo {
  const creds = loadCredentials();
  const hasOrgApiKey = Boolean(creds?.keyId && creds?.privateKeyJwk);
  const hasSignerKey = Boolean(creds?.signerPrivateKey);

  if (hasOrgApiKey) {
    return {
      configured: true,
      hasOrgApiKey: true,
      hasSignerKey,
      organizationId: creds?.organizationId || cachedOrgId || null,
      defaultUserId: creds?.defaultUserId || null,
      apiBaseUrl: TRUE_MARKETS_API_BASE,
      mode: "connected",
      message: "True Markets Gateway credentials configured.",
    };
  }

  return {
    configured: false,
    hasOrgApiKey: false,
    hasSignerKey: false,
    organizationId: null,
    defaultUserId: null,
    apiBaseUrl: TRUE_MARKETS_API_BASE,
    mode: "demo",
    message:
      "True Markets organization API key is not configured. Public catalog endpoints remain live; authenticated trading runs in Demo Preview mode.",
  };
}

/**
 * Mints an organization token per official True Markets docs:
 * Signs `{key_id}.{timestamp}` using ES256 (P-256 + SHA-256) with `dsaEncoding: "ieee-p1363"`
 * and exchanges it at `POST /v1/auth/api-key/token`.
 */
export async function getOrganizationToken(): Promise<{
  token: string;
  organizationId: string;
}> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedOrgId && cachedTokenExpiry > now + 60) {
    return { token: cachedToken, organizationId: cachedOrgId };
  }

  const creds = loadCredentials();
  if (!creds) {
    const err = new Error(
      "True Markets API credentials are not configured on the server. Set TM_KEY_FILE or TRUE_MARKETS_API_KEY_ID and TRUE_MARKETS_PRIVATE_KEY_JWK."
    );
    Object.assign(err, { status: 503, code: "CREDENTIALS_MISSING" });
    throw err;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign(
    "sha256",
    Buffer.from(`${creds.keyId}.${timestamp}`),
    {
      key: createPrivateKey({ key: creds.privateKeyJwk as any, format: "jwk" }),
      dsaEncoding: "ieee-p1363",
    }
  ).toString("base64url");

  const res = await fetch(`${TRUE_MARKETS_API_BASE}/v1/auth/api-key/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key_id: creds.keyId,
      timestamp,
      signature,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const reason = json.code ?? json.type ?? "auth_error";
    const err = new Error(
      `POST /v1/auth/api-key/token failed (${res.status} ${reason}): ${json.message ?? "Unable to mint organization token"}`
    );
    Object.assign(err, {
      status: res.status,
      code: reason,
      request_id: json.request_id,
    });
    throw err;
  }

  const token: string = json.access_token;
  const claims = JSON.parse(
    Buffer.from(token.split(".")[1], "base64url").toString("utf8")
  );
  const organizationId: string =
    creds.organizationId || claims?.tm?.organization_id || "";

  cachedToken = token;
  cachedOrgId = organizationId;
  cachedTokenExpiry = now + 3300; // ~55 mins

  return { token, organizationId };
}

/**
 * Stamps a wallet transaction payload using node:crypto exactly as documented in
 * https://docs.truemarkets.co/gateway/requests-and-signing (stamp.ts).
 */
export function stampPayload(payload: string): string {
  const creds = loadCredentials();
  if (!creds?.signerPrivateKey) {
    const err = new Error(
      "True Markets signer private key is not configured. Set SIGNER_KEY_FILE or TRUE_MARKETS_SIGNER_PRIVATE_KEY."
    );
    Object.assign(err, { status: 503, code: "SIGNER_KEY_MISSING" });
    throw err;
  }

  const ecdh = createECDH("prime256v1");
  ecdh.setPrivateKey(Buffer.from(creds.signerPrivateKey, "hex"));
  const point = ecdh.getPublicKey(); // 0x04 || x || y
  const key = createPrivateKey({
    format: "jwk",
    key: {
      kty: "EC",
      crv: "P-256",
      d: Buffer.from(creds.signerPrivateKey, "hex").toString("base64url"),
      x: point.subarray(1, 33).toString("base64url"),
      y: point.subarray(33).toString("base64url"),
    },
  });
  const publicKey = ecdh.getPublicKey("hex", "compressed");

  const signature = sign("sha256", Buffer.from(payload), key).toString("hex");
  const json = JSON.stringify({
    publicKey,
    signature,
    scheme: "SIGNATURE_SCHEME_TK_API_P256",
  });
  return Buffer.from(json).toString("base64url");
}

/**
 * Helper to generate a fresh P-256 signer keypair in hex format if needed.
 */
export function generateSignerKeyPairHex(): {
  signer_public_key: string;
  signer_private_key: string;
} {
  const ecdh = createECDH("prime256v1");
  ecdh.generateKeys();
  return {
    signer_public_key: ecdh.getPublicKey("hex", "compressed"),
    signer_private_key: ecdh.getPrivateKey("hex"),
  };
}

/**
 * Performs an HTTP call to True Markets Gateway API.
 */
export async function tmFetch<T = any>(
  method: "GET" | "POST",
  path: string,
  options: {
    body?: unknown;
    requiresAuth?: boolean;
    onBehalfOfUserId?: string;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.requiresAuth) {
    const { token } = await getOrganizationToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.onBehalfOfUserId) {
    headers["TM-On-Behalf-Of"] = options.onBehalfOfUserId;
  }

  const res = await fetch(`${TRUE_MARKETS_API_BASE}${path}`, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const reason = json.code ?? json.type ?? "api_error";
    const detail = `${res.status} ${reason} ${json.message ?? ""}`.trim();
    const err = new Error(`${method} ${path}: ${detail}`);
    Object.assign(err, {
      status: res.status,
      code: reason,
      request_id: json.request_id,
      raw: json,
    });
    throw err;
  }

  return json as T;
}
