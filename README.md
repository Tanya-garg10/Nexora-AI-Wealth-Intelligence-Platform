# NEXORA — AI Wealth Intelligence

> **“Understand your wealth. Act with confidence.”**

Nexora is an AI-powered wealth intelligence platform built for the **True Markets “Build the Next Wealth App”** builder challenge. It helps investors understand their portfolio concentration, analyze risk, simulate investment scenarios, monitor markets, and execute trades through the **True Markets Gateway API**.

## 1. Product Overview

Modern investors often face a fragmented experience: portfolio trackers show static charts without explaining risk concentration, and trading terminals execute orders without showing how a trade alters overall portfolio balance.

**Nexora** bridges this gap in one cohesive workflow:
1. **Portfolio & Risk Intelligence**: Decomposes total wealth ($24,820.40 demo snapshot) across sectors, daily P&L contributors, and composite risk scores.
2. **Nexora AI Copilot**: Uses server-side Gemini (`gemini-3.8-flash`) to turn portfolio telemetry into structured, human-readable explanations of concentration, risk, and scenario trade-offs.
3. **Interactive Wealth Simulator**: Lets users model single or multi-row portfolio adjustments (e.g., `NVDA +$2,000`) and compare **BEFORE** vs. **AFTER SIMULATION** sector weights and Risk Scores (`62` → `68`) with a clear `SIMULATION — NO TRADE EXECUTED` boundary.
4. **True Markets Gateway Trading**: Connects directly to the official True Markets Gateway API (`https://api.truemarkets.co`) for live asset catalog discovery (`GET /v1/gateway/assets`), ES256 organization token minting, user wallet provisioning, and P-256 stamped order execution.

## 2. Features & Routes

- **`/` (Landing Page)**: Executive product overview, interactive workspace preview, and architectural walkthrough.
- **`/dashboard` (Overview)**: Greeting header, 4 primary KPI cards (Total Wealth, Today's P&L, Invested, Available Cash), interactive Recharts performance chart (`1D`, `1W`, `1M`, `3M`, `1Y`, `ALL`), sector allocation donut chart, and holdings table.
- **`/portfolio` (Portfolio & Risk)**: Deep-dive sector allocation, beta/volatility profile, and holdings attribution.
- **`/markets` (Markets & Live True Markets Catalog)**: Searchable featured equities (`NVDA`, `AAPL`, `MSFT`, `TSLA`, `AMZN`, `SOL`, `AMD`, `AVGO`) plus a live tab displaying all 300+ tokenized equities and spot crypto assets fetched from `GET https://api.truemarkets.co/v1/gateway/assets`.
- **`/asset/[symbol]` (Asset Detail & Trading)**: Interactive price history chart (`1D`, `1W`, `1M`, `3M`, `1Y`), position card, True Markets Gateway metadata, and **Buy / Sell** order ticket triggers.
- **`/copilot` (AI Wealth Copilot)**: Conversational portfolio analyst with suggested prompts and structured insight cards (*Portfolio Observation*, *Risk*, *Concentration*, *Potential Impact*, *Things to Consider*).
- **`/simulator` (Wealth Simulator)**: Multi-row scenario builder comparing baseline vs. simulated allocations and risk scores.
- **`/activity` (Activity Timeline)**: Filterable audit log of portfolio updates, AI analyses, order previews, and trade submissions.
- **`/settings` (Settings & Gateway Status)**: Live True Markets connection verification, test user wallet provisioning, AI preferences, and security safeguards.

## 3. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, React Router v7, Recharts, Lucide React
- **Backend**: Node.js + Express (`server.ts`) with Vite middleware for full-stack API routing
- **AI Engine**: Google GenAI SDK (`@google/genai`) running strictly server-side (`POST /api/copilot`)
- **Trading Integration**: Official True Markets Gateway REST API (`https://api.truemarkets.co`) using native Node.js `node:crypto` ECDSA P-256 signing
- **Validation**: Zod request/schema validation

## 4. Architecture & True Markets Gateway Integration

All True Markets Gateway operations live in `src/lib/true-markets/` and are exposed through server-side API routes in `server.ts`, following [https://docs.truemarkets.co/](https://docs.truemarkets.co/):

```text
src/lib/true-markets/
├── types.ts     # TypeScript interfaces & Zod schemas for assets, users, and orders
├── client.ts    # ES256 JWT minting (/v1/auth/api-key/token) & P-256 payload stamping
├── assets.ts    # Public catalog discovery (GET /v1/gateway/assets?asset_class=stock,crypto)
├── users.ts     # User & Solana/EVM wallet provisioning (/v1/account/organizations/{orgId}/users)
└── orders.ts    # Order creation (POST /v1/gateway/orders) & execution (/v1/gateway/orders/{id}/execute)
```

### Official Authentication & Stamping Flow Implemented
1. **Asset Catalog (`GET /v1/gateway/assets`)**: Called without authentication to load live asset UUIDs, symbols, venues (`defi` / `cefi`), and settlement chains (`base`, `robinhood`, `solana`).
2. **Organization Token (`POST /v1/auth/api-key/token`)**: Signs `{key_id}.{timestamp}` using ECDSA P-256 (`SHA-256`, `dsaEncoding: "ieee-p1363"`), exchanges it for a 1-hour Bearer JWT, and extracts `claims.tm.organization_id`.
3. **User Creation (`POST /v1/account/organizations/{organizationId}/users`)**: Registers `external_ref_id` and `signer_public_key`, retrying on HTTP `503` while Solana and EVM wallets finish provisioning.
4. **Order Placement & Execution (`POST /v1/gateway/orders` → `POST /v1/gateway/orders/{id}/execute`)**:
   - Sends `Authorization: Bearer <token>` and `TM-On-Behalf-Of: <user_id>`.
   - Sizes market buys with `qty_unit: "quote"` and sells/limits with `qty_unit: "base"`.
   - Stamps each returned unsigned transaction payload using P-256 ECDSA (`SIGNATURE_SCHEME_TK_API_P256`) and submits `signatures[]` with `auth_type: "api_key"`.

## 5. Demo Mode vs. Connected Mode

- **Demo Mode (`DEMO MODE`)**: When True Markets organization credentials are not configured in `.env`, Nexora still fetches the **live public asset catalog** from `api.truemarkets.co`, displays clearly labeled demo portfolio/market pricing, and allows full two-step order previews. If a user attempts to execute a live order without server credentials, the backend returns a transparent configuration error and offers to record a labeled `Simulated` order preview—**never** pretending a real trade occurred.
- **Connected Mode (`TRUE MARKETS CONNECTED`)**: When server credentials (`TM_KEY_FILE` or `TRUE_MARKETS_API_KEY_ID` + `TRUE_MARKETS_PRIVATE_KEY_JWK` + `TRUE_MARKETS_SIGNER_PRIVATE_KEY`) are provided, orders are created, signed, and executed against the True Markets Gateway API.

## 6. Local Setup & Environment Variables

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and configure any optional keys:
   ```bash
   cp .env.example .env
   ```
   - `GEMINI_API_KEY`: For live server-side Gemini Copilot analysis.
   - `TM_KEY_FILE` (or `TRUE_MARKETS_API_KEY_ID` + `TRUE_MARKETS_PRIVATE_KEY_JWK`): Organization API key from the True Markets Developer Console.
   - `SIGNER_KEY_FILE` (or `TRUE_MARKETS_SIGNER_PUBLIC_KEY` + `TRUE_MARKETS_SIGNER_PRIVATE_KEY`): P-256 hex signer keypair for stamping user wallet transactions.
   - `TRUE_MARKETS_USER_ID`: Default user UUID for `TM-On-Behalf-Of`.
3. Start the full-stack development server on port `3000`:
   ```bash
   npm run dev
   ```
4. Verify TypeScript compilation and production build:
   ```bash
   npm run build
   ```

## 7. Security Considerations

- **Zero Client-Side Secrets**: Neither `GEMINI_API_KEY` nor True Markets private keys are ever imported or bundled into client code.
- **Zod Input Validation**: All `POST /api/true-markets/*` payloads are validated with Zod schemas before execution.
- **Human-in-the-Loop Trading**: AI Copilot and the Wealth Simulator are strictly analytical. Every trade requires a two-step review and explicit user confirmation in the Order Ticket.
