import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { getConnectionStatus } from "./src/lib/true-markets/client.ts";
import { getTrueMarketsAssets } from "./src/lib/true-markets/assets.ts";
import {
  createOrGetTrueMarketsUser,
  getTrueMarketsUserBalances,
} from "./src/lib/true-markets/users.ts";
import {
  createAndExecuteTrueMarketsOrder,
  getTrueMarketsOrder,
  listTrueMarketsOrders,
} from "./src/lib/true-markets/orders.ts";
import {
  CreateOrderRequestSchema,
  CreateUserRequestSchema,
} from "./src/lib/true-markets/types.ts";
import {
  DEMO_ALLOCATION,
  DEMO_HOLDINGS,
  DEMO_PORTFOLIO_SUMMARY,
  FALLBACK_COPILOT_RESPONSES,
} from "./src/lib/demo-data.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ============================================================================
  // 1. TRUE MARKETS GATEWAY API ROUTES
  // Official documentation: https://docs.truemarkets.co/
  // ============================================================================

  // GET /api/true-markets/status
  app.get("/api/true-markets/status", (_req, res) => {
    const status = getConnectionStatus();
    res.json(status);
  });

  // GET /api/true-markets/assets
  // Calls real public endpoint `GET https://api.truemarkets.co/v1/gateway/assets`
  app.get("/api/true-markets/assets", async (req, res) => {
    try {
      const assetClass =
        typeof req.query.asset_class === "string"
          ? req.query.asset_class
          : "stock,crypto";
      const result = await getTrueMarketsAssets(assetClass);
      res.json({
        ok: true,
        source: result.source,
        fetchedAt: result.fetchedAt,
        count: result.assets.length,
        data: result.assets,
      });
    } catch (err: any) {
      res.status(err.status || 502).json({
        ok: false,
        error: "Market data unavailable from True Markets Gateway.",
        detail: err.message || "Failed to fetch /v1/gateway/assets",
        code: err.code || "ASSETS_FETCH_FAILED",
      });
    }
  });

  // POST /api/true-markets/users
  // Calls `POST /v1/account/organizations/{organizationId}/users`
  app.post("/api/true-markets/users", async (req, res) => {
    const parsed = CreateUserRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid user creation request.",
        issues: parsed.error.issues,
      });
      return;
    }

    try {
      const user = await createOrGetTrueMarketsUser(
        parsed.data.external_ref_id,
        parsed.data.signer_public_key
      );
      res.status(201).json({
        ok: true,
        user,
      });
    } catch (err: any) {
      res.status(err.status || 503).json({
        ok: false,
        error:
          err.code === "CREDENTIALS_MISSING"
            ? "True Markets connection unavailable. Configure server-side credentials to provision live users."
            : "Unable to create or retrieve True Markets user.",
        detail: err.message,
        code: err.code || "USER_CREATE_ERROR",
        request_id: err.request_id,
      });
    }
  });

  // GET /api/true-markets/balances
  // Calls `GET /v1/gateway/balances` with `TM-On-Behalf-Of`
  app.get("/api/true-markets/balances", async (req, res) => {
    try {
      const userId =
        typeof req.query.user_id === "string" ? req.query.user_id : undefined;
      const balances = await getTrueMarketsUserBalances(userId);
      res.json({
        ok: true,
        data: balances.data,
      });
    } catch (err: any) {
      res.status(err.status || 503).json({
        ok: false,
        error: "Unable to read True Markets wallet balances.",
        detail: err.message,
        code: err.code || "BALANCES_ERROR",
      });
    }
  });

  // POST /api/true-markets/orders
  // Calls `POST /v1/gateway/orders` and signs/executes via `POST /v1/gateway/orders/{id}/execute`
  // Never fakes a live execution if credentials are missing.
  app.post("/api/true-markets/orders", async (req, res) => {
    const parsed = CreateOrderRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid order request parameters.",
        issues: parsed.error.issues,
      });
      return;
    }

    const status = getConnectionStatus();
    if (!status.configured) {
      res.status(503).json({
        ok: false,
        mode: "demo",
        code: "CREDENTIALS_MISSING",
        error: "True Markets connection unavailable.",
        detail:
          "Server-side True Markets organization API key (TM_KEY_FILE / TRUE_MARKETS_API_KEY_ID) and signer key are not configured. No live order was sent. Use Demo Preview to simulate order flow safely.",
      });
      return;
    }

    try {
      const result = await createAndExecuteTrueMarketsOrder(parsed.data);
      res.status(200).json({
        ok: true,
        mode: "connected",
        order: result.order,
        execution: result.execution,
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        ok: false,
        mode: "connected",
        code: err.code || "ORDER_EXECUTION_ERROR",
        error: "Unable to create or execute order on True Markets.",
        detail: err.message,
        issues: err.issues,
        request_id: err.request_id,
      });
    }
  });

  // GET /api/true-markets/orders
  app.get("/api/true-markets/orders", async (req, res) => {
    try {
      const statusFilter =
        typeof req.query.status === "string" ? req.query.status : "active";
      const userId =
        typeof req.query.user_id === "string" ? req.query.user_id : undefined;
      const orders = await listTrueMarketsOrders(statusFilter, userId);
      res.json({
        ok: true,
        data: orders.data,
      });
    } catch (err: any) {
      res.status(err.status || 503).json({
        ok: false,
        error: "Unable to list True Markets orders.",
        detail: err.message,
        code: err.code || "ORDERS_LIST_ERROR",
      });
    }
  });

  // GET /api/true-markets/orders/:id
  app.get("/api/true-markets/orders/:id", async (req, res) => {
    try {
      const userId =
        typeof req.query.user_id === "string" ? req.query.user_id : undefined;
      const order = await getTrueMarketsOrder(req.params.id, userId);
      res.json({
        ok: true,
        order,
      });
    } catch (err: any) {
      res.status(err.status || 503).json({
        ok: false,
        error: "Unable to fetch order details from True Markets.",
        detail: err.message,
        code: err.code || "ORDER_GET_ERROR",
      });
    }
  });

  // ============================================================================
  // 2. GEMINI AI WEALTH COPILOT & SIMULATOR EXPLANATION ROUTES
  // Server-side only using @google/genai and gemini-3.8-flash
  // ============================================================================

  app.post("/api/copilot", async (req, res) => {
    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
    if (!prompt) {
      res.status(400).json({ ok: false, error: "Prompt is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Deterministic structured fallback when GEMINI_API_KEY is not set
      const lower = prompt.toLowerCase();
      let fallback = FALLBACK_COPILOT_RESPONSES.default;
      if (lower.includes("move") || lower.includes("today") || lower.includes("p&l")) {
        fallback = FALLBACK_COPILOT_RESPONSES.move_today;
      } else if (lower.includes("simulate") || lower.includes("1,000") || lower.includes("2,000") || lower.includes("add")) {
        fallback = FALLBACK_COPILOT_RESPONSES.simulate_nvda;
      }
      res.json({
        ok: true,
        source: "demo_intelligence_engine",
        data: fallback,
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const portfolioContext = JSON.stringify({
        note: "DEMO / SIMULATED PORTFOLIO DATA",
        summary: DEMO_PORTFOLIO_SUMMARY,
        allocation: DEMO_ALLOCATION,
        holdings: DEMO_HOLDINGS.map((h) => ({
          symbol: h.symbol,
          name: h.name,
          sector: h.sector,
          price: h.price,
          changePercent: h.changePercent,
          value: h.value,
          allocation: h.allocation,
          unrealizedPnL: h.unrealizedPnL,
        })),
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `User question: "${prompt}"\n\nPortfolio Context (Demo Data): ${portfolioContext}`,
        config: {
          systemInstruction:
            "You are Nexora Copilot, an institutional-grade AI wealth intelligence analyst. " +
            "Analyze the provided demo portfolio data accurately. " +
            "NEVER give guaranteed investment advice, never predict guaranteed future stock rises, and never offer to auto-execute trades. " +
            "Always frame insights as analytical explanations of concentration, risk, and scenario trade-offs. " +
            "Explicitly acknowledge that portfolio metrics reflect the demo portfolio snapshot.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              observation: { type: Type.STRING },
              risk: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                },
                required: ["level", "score", "explanation"],
              },
              concentration: {
                type: Type.OBJECT,
                properties: {
                  primarySector: { type: Type.STRING },
                  percentage: { type: Type.STRING },
                  status: { type: Type.STRING },
                  detail: { type: Type.STRING },
                },
                required: ["primarySector", "percentage", "status", "detail"],
              },
              potentialImpact: { type: Type.STRING },
              thingsToConsider: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              metrics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    context: { type: Type.STRING },
                  },
                  required: ["label", "value", "context"],
                },
              },
            },
            required: [
              "summary",
              "observation",
              "risk",
              "concentration",
              "potentialImpact",
              "thingsToConsider",
              "metrics",
            ],
          },
        },
      });

      const rawText = response.text?.trim() || "";
      const structured = JSON.parse(rawText);
      res.json({
        ok: true,
        source: "gemini_live",
        data: {
          ...structured,
          isSimulatedData: true,
        },
      });
    } catch (err: any) {
      // Graceful fallback if Gemini API call fails
      const lower = prompt.toLowerCase();
      let fallback = FALLBACK_COPILOT_RESPONSES.default;
      if (lower.includes("move") || lower.includes("today")) {
        fallback = FALLBACK_COPILOT_RESPONSES.move_today;
      } else if (lower.includes("simulate") || lower.includes("add")) {
        fallback = FALLBACK_COPILOT_RESPONSES.simulate_nvda;
      }
      res.json({
        ok: true,
        source: "demo_fallback",
        warning: err.message,
        data: fallback,
      });
    }
  });

  // ============================================================================
  // 3. VITE MIDDLEWARE / STATIC ASSETS
  // ============================================================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NEXORA Server running on http://localhost:${PORT}`);
  });
}

startServer();
