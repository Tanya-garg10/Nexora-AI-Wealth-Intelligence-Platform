/**
 * NEXORA Centralized Demo Data
 * Explicitly labeled as Demo / Simulated Portfolio Data.
 * Paired with real True Markets Gateway catalog UUIDs where available.
 */

export interface DemoHolding {
  symbol: string;
  tmSymbol: string;
  name: string;
  fullName: string;
  sector: "Technology" | "Healthcare" | "Financials" | "Consumer" | "Crypto" | "Cash";
  price: number;
  changePercent: number;
  changeValue: number;
  shares: number;
  avgPrice: number;
  value: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocation: number;
  trueMarketsAssetId: string;
  chain: string;
  venue: "defi" | "cefi";
  assetClass: "stock" | "crypto";
  description: string;
  marketCap: string;
  peRatio: string;
  dayHigh: number;
  dayLow: number;
  sparkline: number[];
  priceHistory: {
    "1D": { time: string; price: number }[];
    "1W": { time: string; price: number }[];
    "1M": { time: string; price: number }[];
    "3M": { time: string; price: number }[];
    "1Y": { time: string; price: number }[];
  };
}

export interface PortfolioAllocationItem {
  name: "Technology" | "Healthcare" | "Financials" | "Consumer" | "Cash";
  value: number;
  amount: number;
  color: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: "Portfolio updated" | "AI analysis generated" | "Order preview created" | "Trade submitted" | "Market alert";
  title: string;
  description: string;
  status: "Completed" | "Pending" | "Simulated" | "Failed";
  asset?: string;
  amount?: string;
  txHashOrOrderId?: string;
}

export interface StructuredCopilotResponse {
  summary: string;
  observation: string;
  risk: {
    level: "Low" | "Moderate" | "Elevated" | "High";
    score: number;
    explanation: string;
  };
  concentration: {
    primarySector: string;
    percentage: string;
    status: "Balanced" | "Moderate" | "Elevated" | "High";
    detail: string;
  };
  potentialImpact: string;
  thingsToConsider: string[];
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  isSimulatedData: boolean;
}

export const DEMO_PORTFOLIO_SUMMARY = {
  isDemoData: true,
  ownerName: "Tanya",
  totalWealth: 24820.40,
  todaysPnL: 384.20,
  todaysPnLPercent: 1.57,
  invested: 21450.00,
  availableCash: 3370.40,
  riskScore: 62,
  riskLabel: "Moderate",
  sharpeEstimate: 1.42,
  betaEstimate: 1.18,
  topConcentrationSector: "Technology",
  topConcentrationPercent: 48.0,
};

export const DEMO_ALLOCATION: PortfolioAllocationItem[] = [
  { name: "Technology", value: 48.0, amount: 11913.79, color: "#10B981" },
  { name: "Healthcare", value: 22.0, amount: 5460.49, color: "#38BDF8" },
  { name: "Consumer", value: 10.4, amount: 2581.32, color: "#A78BFA" },
  { name: "Financials", value: 6.0, amount: 1494.40, color: "#F59E0B" },
  { name: "Cash", value: 13.6, amount: 3370.40, color: "#64748B" },
];

function generatePriceSeries(basePrice: number, points: number, volatility: number, trend: number, labels: string[]) {
  const result: { time: string; price: number }[] = [];
  let current = basePrice * (1 - trend);
  for (let i = 0; i < points; i++) {
    const progress = i / Math.max(1, points - 1);
    const wave = Math.sin(i * 0.7) * volatility + Math.cos(i * 0.3) * (volatility * 0.6);
    const val = i === points - 1 ? basePrice : Number(( basePrice * (1 - trend + trend * progress) + wave ).toFixed(2));
    result.push({
      time: labels[i] || `${i}`,
      price: Math.max(1, val),
    });
    current = val;
  }
  return result;
}

export const DEMO_HOLDINGS: DemoHolding[] = [
  {
    symbol: "NVDA",
    tmSymbol: "NVDA",
    name: "NVIDIA",
    fullName: "NVIDIA Corporation",
    sector: "Technology",
    price: 177.82,
    changePercent: 2.41,
    changeValue: 4.18,
    shares: 25,
    avgPrice: 161.40,
    value: 4520.00,
    unrealizedPnL: 410.50,
    unrealizedPnLPercent: 10.17,
    allocation: 18.2,
    trueMarketsAssetId: "17d110fb-cc58-4959-b61c-9833ddf8f305",
    chain: "robinhood",
    venue: "defi",
    assetClass: "stock",
    description:
      "NVIDIA Corporation designs and manufactures accelerated computing platforms, data center GPUs, and AI infrastructure software.",
    marketCap: "$4.32T",
    peRatio: "46.8x",
    dayHigh: 179.40,
    dayLow: 173.15,
    sparkline: [171.2, 172.5, 171.9, 174.1, 175.8, 176.4, 177.82],
    priceHistory: {
      "1D": generatePriceSeries(177.82, 8, 1.1, 0.024, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(177.82, 7, 2.8, 0.048, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(177.82, 10, 4.5, 0.085, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(177.82, 12, 7.2, 0.16, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(177.82, 12, 12.0, 0.34, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
  {
    symbol: "AAPL",
    tmSymbol: "AAPLC",
    name: "Apple",
    fullName: "Apple Inc.",
    sector: "Technology",
    price: 256.31,
    changePercent: 1.12,
    changeValue: 2.84,
    shares: 13.54,
    avgPrice: 234.10,
    value: 3470.00,
    unrealizedPnL: 300.70,
    unrealizedPnLPercent: 9.49,
    allocation: 14.0,
    trueMarketsAssetId: "6ed20aa3-e8f2-490a-9626-b97b1e6496f4",
    chain: "base",
    venue: "defi",
    assetClass: "stock",
    description:
      "Apple Inc. designs, manufactures, and markets consumer ecosystems including iPhone, Mac, iPad, wearables, and integrated Silicon services.",
    marketCap: "$3.89T",
    peRatio: "34.2x",
    dayHigh: 257.80,
    dayLow: 253.40,
    sparkline: [252.8, 253.4, 254.0, 253.9, 255.1, 255.8, 256.31],
    priceHistory: {
      "1D": generatePriceSeries(256.31, 8, 0.9, 0.011, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(256.31, 7, 2.1, 0.025, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(256.31, 10, 4.0, 0.054, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(256.31, 12, 6.4, 0.11, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(256.31, 12, 10.5, 0.21, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
  {
    symbol: "MSFT",
    tmSymbol: "MSFT",
    name: "Microsoft",
    fullName: "Microsoft Corporation",
    sector: "Technology",
    price: 514.21,
    changePercent: 0.84,
    changeValue: 4.28,
    shares: 5.62,
    avgPrice: 478.50,
    value: 2890.00,
    unrealizedPnL: 200.69,
    unrealizedPnLPercent: 7.46,
    allocation: 11.6,
    trueMarketsAssetId: "43904934-8427-4d0d-94c1-751b6e5c4243",
    chain: "robinhood",
    venue: "defi",
    assetClass: "stock",
    description:
      "Microsoft Corporation develops enterprise cloud infrastructure (Azure), productivity software, and enterprise AI systems.",
    marketCap: "$3.82T",
    peRatio: "36.1x",
    dayHigh: 516.50,
    dayLow: 509.80,
    sparkline: [509.5, 510.2, 511.4, 510.8, 512.6, 513.5, 514.21],
    priceHistory: {
      "1D": generatePriceSeries(514.21, 8, 1.5, 0.008, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(514.21, 7, 3.8, 0.019, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(514.21, 10, 6.2, 0.042, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(514.21, 12, 9.5, 0.095, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(514.21, 12, 16.0, 0.19, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
  {
    symbol: "TSLA",
    tmSymbol: "TSLA",
    name: "Tesla",
    fullName: "Tesla, Inc.",
    sector: "Consumer",
    price: 455.20,
    changePercent: -0.81,
    changeValue: -3.72,
    shares: 4.66,
    avgPrice: 412.00,
    value: 2120.00,
    unrealizedPnL: 201.31,
    unrealizedPnLPercent: 10.48,
    allocation: 8.5,
    trueMarketsAssetId: "798d1877-9fab-4102-b558-188a83f0951d",
    chain: "robinhood",
    venue: "defi",
    assetClass: "stock",
    description:
      "Tesla, Inc. designs, manufactures, and sells electric vehicles, grid-scale battery energy storage, and autonomous driving systems.",
    marketCap: "$1.44T",
    peRatio: "88.4x",
    dayHigh: 462.10,
    dayLow: 451.80,
    sparkline: [459.5, 458.2, 460.1, 457.4, 456.0, 455.8, 455.20],
    priceHistory: {
      "1D": generatePriceSeries(455.20, 8, 2.4, -0.008, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(455.20, 7, 5.5, 0.032, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(455.20, 10, 9.2, 0.074, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(455.20, 12, 14.0, 0.14, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(455.20, 12, 24.0, 0.28, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
  {
    symbol: "AMZN",
    tmSymbol: "AMZN",
    name: "Amazon",
    fullName: "Amazon.com, Inc.",
    sector: "Consumer",
    price: 231.44,
    changePercent: 1.74,
    changeValue: 3.96,
    shares: 8.38,
    avgPrice: 210.80,
    value: 1940.00,
    unrealizedPnL: 172.96,
    unrealizedPnLPercent: 9.79,
    allocation: 7.8,
    trueMarketsAssetId: "5db130ea-fa9c-4fb6-aae1-929b3d785b2f",
    chain: "robinhood",
    venue: "defi",
    assetClass: "stock",
    description:
      "Amazon.com, Inc. operates global e-commerce marketplaces, hyperscale cloud infrastructure (AWS), and digital streaming networks.",
    marketCap: "$2.43T",
    peRatio: "39.5x",
    dayHigh: 233.10,
    dayLow: 227.90,
    sparkline: [227.5, 228.1, 229.0, 228.7, 230.2, 230.9, 231.44],
    priceHistory: {
      "1D": generatePriceSeries(231.44, 8, 1.1, 0.017, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(231.44, 7, 2.9, 0.036, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(231.44, 10, 4.8, 0.068, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(231.44, 12, 7.1, 0.12, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(231.44, 12, 11.4, 0.25, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
];

export const EXTRA_MARKET_ASSETS: DemoHolding[] = [
  {
    symbol: "SOL",
    tmSymbol: "SOL",
    name: "Solana",
    fullName: "Solana Network (Spot DeFi)",
    sector: "Technology",
    price: 195.31,
    changePercent: 3.18,
    changeValue: 6.02,
    shares: 12.0,
    avgPrice: 168.00,
    value: 2343.72,
    unrealizedPnL: 327.72,
    unrealizedPnLPercent: 16.25,
    allocation: 9.4,
    trueMarketsAssetId: "495e07ac-fa3e-4179-85b7-b1e8cece3dc4",
    chain: "solana",
    venue: "defi",
    assetClass: "crypto",
    description:
      "High-throughput Layer 1 blockchain settlement network supported natively on True Markets Gateway for DeFi spot execution.",
    marketCap: "$94.8B",
    peRatio: "N/A",
    dayHigh: 198.40,
    dayLow: 189.20,
    sparkline: [189.2, 190.5, 191.8, 193.0, 192.4, 194.1, 195.31],
    priceHistory: {
      "1D": generatePriceSeries(195.31, 8, 1.8, 0.031, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(195.31, 7, 4.2, 0.064, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(195.31, 10, 7.5, 0.11, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(195.31, 12, 11.2, 0.22, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(195.31, 12, 18.0, 0.45, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
  {
    symbol: "AMD",
    tmSymbol: "AMD",
    name: "AMD",
    fullName: "Advanced Micro Devices • Robinhood Token",
    sector: "Technology",
    price: 164.80,
    changePercent: 1.45,
    changeValue: 2.35,
    shares: 0,
    avgPrice: 0,
    value: 0,
    unrealizedPnL: 0,
    unrealizedPnLPercent: 0,
    allocation: 0,
    trueMarketsAssetId: "fba09e23-1a75-4a2b-bb83-35555bd03615",
    chain: "robinhood",
    venue: "defi",
    assetClass: "stock",
    description:
      "Advanced Micro Devices designs high-performance compute processors, server EPYC CPUs, and Instinct AI accelerators.",
    marketCap: "$266.4B",
    peRatio: "41.2x",
    dayHigh: 166.20,
    dayLow: 161.90,
    sparkline: [162.1, 162.8, 163.5, 163.1, 164.0, 164.3, 164.80],
    priceHistory: {
      "1D": generatePriceSeries(164.80, 8, 1.2, 0.014, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(164.80, 7, 3.1, 0.029, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(164.80, 10, 5.2, 0.051, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(164.80, 12, 8.4, 0.09, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(164.80, 12, 14.0, 0.18, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
  {
    symbol: "AVGO",
    tmSymbol: "AVGO",
    name: "Broadcom",
    fullName: "Broadcom Inc. • Robinhood Token",
    sector: "Technology",
    price: 182.90,
    changePercent: 1.92,
    changeValue: 3.45,
    shares: 0,
    avgPrice: 0,
    value: 0,
    unrealizedPnL: 0,
    unrealizedPnLPercent: 0,
    allocation: 0,
    trueMarketsAssetId: "aed0d225-ab21-4421-a7c4-37970b5c6ab3",
    chain: "robinhood",
    venue: "defi",
    assetClass: "stock",
    description:
      "Broadcom Inc. designs custom AI ASICs, high-speed networking switches, and infrastructure software solutions.",
    marketCap: "$854.0B",
    peRatio: "37.9x",
    dayHigh: 184.10,
    dayLow: 179.40,
    sparkline: [179.4, 180.1, 180.9, 181.2, 181.8, 182.3, 182.90],
    priceHistory: {
      "1D": generatePriceSeries(182.90, 8, 1.3, 0.019, ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:00"]),
      "1W": generatePriceSeries(182.90, 7, 3.4, 0.041, ["Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Today"]),
      "1M": generatePriceSeries(182.90, 10, 5.8, 0.078, ["W1", "D4", "W2", "D10", "W3", "D16", "D20", "W4", "D26", "Today"]),
      "3M": generatePriceSeries(182.90, 12, 9.1, 0.15, ["Jul", "Mid-Jul", "Aug", "Mid-Aug", "Sep", "Mid-Sep", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Yesterday", "Today"]),
      "1Y": generatePriceSeries(182.90, 12, 15.2, 0.31, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]),
    },
  },
];

export const ALL_DEMO_ASSETS: DemoHolding[] = [...DEMO_HOLDINGS, ...EXTRA_MARKET_ASSETS];

export const DEMO_PERFORMANCE_HISTORY: Record<
  "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL",
  { time: string; value: number; benchmark: number }[]
> = {
  "1D": [
    { time: "09:30", value: 24436.20, benchmark: 24436.20 },
    { time: "10:30", value: 24510.80, benchmark: 24470.00 },
    { time: "11:30", value: 24488.40, benchmark: 24462.10 },
    { time: "12:30", value: 24605.10, benchmark: 24512.40 },
    { time: "13:30", value: 24692.50, benchmark: 24550.80 },
    { time: "14:30", value: 24740.90, benchmark: 24585.00 },
    { time: "15:30", value: 24788.10, benchmark: 24610.20 },
    { time: "16:00", value: 24820.40, benchmark: 24632.00 },
  ],
  "1W": [
    { time: "Mon", value: 24120.00, benchmark: 24120.00 },
    { time: "Tue", value: 24280.50, benchmark: 24190.00 },
    { time: "Wed", value: 24195.20, benchmark: 24160.00 },
    { time: "Thu", value: 24460.80, benchmark: 24310.00 },
    { time: "Fri", value: 24590.10, benchmark: 24395.00 },
    { time: "Mon", value: 24685.00, benchmark: 24450.00 },
    { time: "Today", value: 24820.40, benchmark: 24518.00 },
  ],
  "1M": [
    { time: "Sep 5", value: 23150.00, benchmark: 23150.00 },
    { time: "Sep 9", value: 23340.20, benchmark: 23280.00 },
    { time: "Sep 13", value: 23210.80, benchmark: 23210.00 },
    { time: "Sep 17", value: 23680.40, benchmark: 23490.00 },
    { time: "Sep 21", value: 23940.00, benchmark: 23640.00 },
    { time: "Sep 25", value: 24110.60, benchmark: 23780.00 },
    { time: "Sep 29", value: 24420.10, benchmark: 23950.00 },
    { time: "Oct 2", value: 24610.90, benchmark: 24090.00 },
    { time: "Today", value: 24820.40, benchmark: 24210.00 },
  ],
  "3M": [
    { time: "Jul 15", value: 21400.00, benchmark: 21400.00 },
    { time: "Jul 28", value: 21950.00, benchmark: 21720.00 },
    { time: "Aug 10", value: 21780.00, benchmark: 21610.00 },
    { time: "Aug 24", value: 22540.00, benchmark: 22120.00 },
    { time: "Sep 06", value: 23190.00, benchmark: 22480.00 },
    { time: "Sep 19", value: 23890.00, benchmark: 22890.00 },
    { time: "Oct 01", value: 24490.00, benchmark: 23240.00 },
    { time: "Today", value: 24820.40, benchmark: 23460.00 },
  ],
  "1Y": [
    { time: "Nov '25", value: 18400.00, benchmark: 18400.00 },
    { time: "Dec '25", value: 19120.00, benchmark: 18890.00 },
    { time: "Jan '26", value: 19650.00, benchmark: 19240.00 },
    { time: "Feb '26", value: 20180.00, benchmark: 19580.00 },
    { time: "Mar '26", value: 19890.00, benchmark: 19410.00 },
    { time: "Apr '26", value: 20940.00, benchmark: 20120.00 },
    { time: "May '26", value: 21680.00, benchmark: 20650.00 },
    { time: "Jun '26", value: 22310.00, benchmark: 21090.00 },
    { time: "Jul '26", value: 22950.00, benchmark: 21540.00 },
    { time: "Aug '26", value: 23640.00, benchmark: 21980.00 },
    { time: "Sep '26", value: 24310.00, benchmark: 22410.00 },
    { time: "Oct '26", value: 24820.40, benchmark: 22780.00 },
  ],
  "ALL": [
    { time: "Q1 '25", value: 15000.00, benchmark: 15000.00 },
    { time: "Q2 '25", value: 16450.00, benchmark: 15890.00 },
    { time: "Q3 '25", value: 17820.00, benchmark: 16720.00 },
    { time: "Q4 '25", value: 19120.00, benchmark: 17640.00 },
    { time: "Q1 '26", value: 20450.00, benchmark: 18590.00 },
    { time: "Q2 '26", value: 22310.00, benchmark: 19680.00 },
    { time: "Q3 '26", value: 24310.00, benchmark: 20840.00 },
    { time: "Today", value: 24820.40, benchmark: 21290.00 },
  ],
};

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-1",
    timestamp: "Today, 16:04 EST",
    type: "Portfolio updated",
    title: "End-of-day valuation snapshot",
    description: "Demo portfolio valued at $24,820.40 (+1.57% today). NVDA (+2.41%) and AMZN (+1.74%) led session gains.",
    status: "Completed",
    asset: "PORTFOLIO",
    amount: "+$384.20",
  },
  {
    id: "act-2",
    timestamp: "Today, 14:42 EST",
    type: "AI analysis generated",
    title: "Technology sector concentration review",
    description: "Nexora Copilot analyzed 48.0% Technology exposure across NVDA, AAPL, and MSFT. Risk score evaluated at 62/100.",
    status: "Completed",
    asset: "NVDA",
  },
  {
    id: "act-3",
    timestamp: "Today, 11:18 EST",
    type: "Order preview created",
    title: "Simulated addition: +$2,000 NVDA",
    description: "Wealth Simulator evaluated adding $2,000 to NVIDIA. Projected Technology weight shifts from 48% to 55%, Risk Score 62 → 68.",
    status: "Simulated",
    asset: "NVDA",
    amount: "$2,000.00",
  },
  {
    id: "act-4",
    timestamp: "Yesterday, 15:50 EST",
    type: "Market alert",
    title: "True Markets Gateway catalog synced",
    description: "Verified 104 tokenized equities and 215 spot DeFi assets from api.truemarkets.co/v1/gateway/assets.",
    status: "Completed",
  },
  {
    id: "act-5",
    timestamp: "Oct 3, 2026, 10:12 EST",
    type: "Trade submitted",
    title: "Order preview: BUY 10 NVDA (Demo Mode)",
    description: "Order ticket tested in Demo Mode ($1,778.20 estimated value). No live funds moved because True Markets credentials were not attached.",
    status: "Simulated",
    asset: "NVDA",
    amount: "$1,778.20",
  },
];

export const COPILOT_SUGGESTED_PROMPTS = [
  "Why did my portfolio move today?",
  "Where am I most concentrated?",
  "What are my biggest portfolio risks?",
  "Simulate adding $1,000 to NVDA",
  "Explain my technology exposure.",
];

export const FALLBACK_COPILOT_RESPONSES: Record<string, StructuredCopilotResponse> = {
  default: {
    summary:
      "Your technology allocation is currently 48% of the portfolio. That makes technology the largest contributor to portfolio concentration.",
    observation:
      "Across your $24,820.40 demo portfolio, NVIDIA ($4,520, 18.2%), Apple ($3,470, 14.0%), and Microsoft ($2,890, 11.6%) account for the majority of your equity risk budget.",
    risk: {
      level: "Moderate",
      score: 62,
      explanation:
        "Portfolio beta is estimated at 1.18 relative to the broader equity benchmark. High correlation among mega-cap semiconductor and cloud holdings amplifies drawdown sensitivity during rate or AI-capex shifts.",
    },
    concentration: {
      primarySector: "Technology",
      percentage: "48%",
      status: "Elevated",
      detail:
        "Top 3 holdings represent 43.8% of total portfolio value. Healthcare (22%) and Cash ($3,370.40, 13.6%) provide partial ballast.",
    },
    potentialImpact:
      "A 10% pullback in large-cap technology equities would reduce total portfolio value by approximately $1,191 (-4.8%), assuming non-tech holdings remain neutral.",
    thingsToConsider: [
      "Review whether a 48% allocation to Technology aligns with your target volatility tolerance.",
      "Your $3,370.40 cash reserve (13.6%) gives you dry powder to rebalance into uncorrelated sectors such as Healthcare or Financials without selling core winners.",
      "Use the Wealth Simulator to test how incremental additions to NVDA or defensive sectors shift your overall Risk Score.",
    ],
    metrics: [
      { label: "Technology exposure", value: "48%", context: "Largest sector weight" },
      { label: "Portfolio risk", value: "Moderate", context: "Score: 62 / 100" },
      { label: "Concentration", value: "Elevated", context: "Top 3 = 43.8% of wealth" },
    ],
    isSimulatedData: true,
  },
  move_today: {
    summary:
      "Your demo portfolio gained +$384.20 (+1.57%) today, driven primarily by semiconductor strength in NVIDIA (+2.41%) and e-commerce momentum in Amazon (+1.74%).",
    observation:
      "Four of your five core equity holdings traded higher today. NVIDIA contributed +$106.40 to today's P&L, while Apple (+1.12%) and Microsoft (+0.84%) added steady mega-cap support. Tesla (-0.81%) was the sole detractor.",
    risk: {
      level: "Moderate",
      score: 62,
      explanation:
        "Daily return dispersion remained contained because gains were broad-based across cloud and consumer leaders, offsetting modest EV weakness.",
    },
    concentration: {
      primarySector: "Technology",
      percentage: "48%",
      status: "Elevated",
      detail:
        "Over 72% of today's positive P&L originated from Technology holdings, underscoring how daily portfolio swings closely track AI infrastructure sentiment.",
    },
    potentialImpact:
      "Continued momentum in semiconductor and cloud names directly expands your Technology weight above 48% unless periodically rebalanced.",
    thingsToConsider: [
      "Monitor NVDA's position weight (18.2%) as price appreciation naturally increases single-stock concentration.",
      "Notice how TSLA's -0.81% move had a muted portfolio impact (-$17.30) due to its smaller 8.5% allocation.",
      "Compare today's +1.57% portfolio return against the benchmark curve on the Overview chart.",
    ],
    metrics: [
      { label: "Today's P&L", value: "+$384.20", context: "+1.57% session change" },
      { label: "Top contributor", value: "NVDA (+2.41%)", context: "$4,520 position" },
      { label: "Technology exposure", value: "48%", context: "Primary driver of daily variance" },
    ],
    isSimulatedData: true,
  },
  simulate_nvda: {
    summary:
      "Simulating a +$1,000 addition to NVDA increases your NVIDIA position to $5,520 (21.4% of portfolio) and raises your overall Technology allocation from 48% to 51.5%.",
    observation:
      "Funding a $1,000 NVDA purchase from available cash reduces your cash buffer from $3,370.40 to $2,370.40 (9.2%) while increasing single-issuer exposure to NVIDIA above one-fifth of total wealth.",
    risk: {
      level: "Elevated",
      score: 65,
      explanation:
        "Portfolio risk score rises from 62 to 65 (+3 points) due to higher single-stock semiconductor beta and reduced cash cushion.",
    },
    concentration: {
      primarySector: "Technology",
      percentage: "51.5%",
      status: "Elevated",
      detail:
        "More than half of your total net worth would be concentrated in a single sector.",
    },
    potentialImpact:
      "Higher upside participation if AI infrastructure outperforms, paired with steeper drawdown exposure if semiconductor multiples compress.",
    thingsToConsider: [
      "Open the interactive Wealth Simulator (/simulator) to compare +$1,000 NVDA vs. +$2,000 NVDA side by side.",
      "Consider whether keeping at least 10% in Available Cash is important for near-term liquidity.",
      "Remember that simulations are analytical previews—no order is placed unless you explicitly confirm a trade ticket.",
    ],
    metrics: [
      { label: "Simulated Tech Weight", value: "51.5%", context: "Up from 48.0%" },
      { label: "Simulated Risk Score", value: "65 / 100", context: "Up from 62 / 100" },
      { label: "Remaining Cash", value: "$2,370.40", context: "Down from $3,370.40" },
    ],
    isSimulatedData: true,
  },
};
