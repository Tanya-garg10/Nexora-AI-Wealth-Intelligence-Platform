import { getOrganizationToken, loadCredentials, tmFetch } from "./client";
import { TrueMarketsBalance, TrueMarketsUser } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates or retrieves a user and their Solana + EVM wallets via
 * `POST /v1/account/organizations/{organizationId}/users`.
 * Handles 503 retry behavior while wallets finish provisioning per official quickstart.
 */
export async function createOrGetTrueMarketsUser(
  externalRefId: string,
  signerPublicKey?: string
): Promise<TrueMarketsUser> {
  const { organizationId } = await getOrganizationToken();
  const creds = loadCredentials();
  const resolvedSignerPub = signerPublicKey || creds?.signerPublicKey;

  if (!resolvedSignerPub) {
    const err = new Error(
      "A signer_public_key is required to create a True Markets user. Configure TRUE_MARKETS_SIGNER_PUBLIC_KEY or pass signer_public_key."
    );
    Object.assign(err, { status: 400, code: "SIGNER_PUBLIC_KEY_REQUIRED" });
    throw err;
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const user = await tmFetch<TrueMarketsUser>(
        "POST",
        `/v1/account/organizations/${organizationId}/users`,
        {
          requiresAuth: true,
          body: {
            external_ref_id: externalRefId,
            signer_public_key: resolvedSignerPub,
          },
        }
      );
      if (user.wallets && user.wallets.length > 0) {
        return user;
      }
    } catch (err: any) {
      if (err.status !== 503 || attempt === 5) {
        throw err;
      }
    }
    await sleep(2000);
  }

  throw new Error("Timed out waiting for True Markets user wallets to initialize.");
}

/**
 * Reads a user's wallet balances via `GET /v1/gateway/balances` with `TM-On-Behalf-Of`.
 */
export async function getTrueMarketsUserBalances(
  userId?: string
): Promise<{ data: TrueMarketsBalance[] }> {
  const creds = loadCredentials();
  const resolvedUserId = userId || creds?.defaultUserId;
  if (!resolvedUserId) {
    const err = new Error(
      "user_id is required for TM-On-Behalf-Of header when checking balances."
    );
    Object.assign(err, { status: 400, code: "USER_ID_REQUIRED" });
    throw err;
  }

  return tmFetch<{ data: TrueMarketsBalance[] }>("GET", "/v1/gateway/balances", {
    requiresAuth: true,
    onBehalfOfUserId: resolvedUserId,
  });
}
