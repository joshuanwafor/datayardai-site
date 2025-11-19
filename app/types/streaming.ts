export type Quote = {
  exchange: string;
  base: string;
  quote: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
};


export type CoinCapQuote = {
  symbol: string;
  name: string;
  price_usd: number;
  global_price_usd: number;
  volume_24h_usd: number;
  change_24h: number;
  market_cap_usd: number;
  rank: number;
  exchange: string;
  timestamp: string;
  has_real_market_cap: boolean;
};

// Public endpoint format
export type Opportunity = {
  type: "direct";
  seg: string;
  pair: string;
  buy_exchange: string;
  sell_exchange: string;
  buy_price: number;
  sell_price: number;
  profit: number;
  profit_percentage: number;
  timestamp: string; // ISO
  db_created_at: string; // ISO
};

// CoinCap format
export type CoinCapOpportunity = {
  type: string;
  seg: string;
  symbol: string;
  lowest: {
    price: number;
    exchange: string;
    volume_24h_usd: string | number;
    path?: string;
  };
  highest: {
    price: number;
    exchange: string;
    volume_24h_usd: string | number;
    path?: string;
  };
  price_difference: number;
  percentage_difference: number;
  currency: string;
  timestamp: string;
  via_currency: string | null;
  confidence_score: number;
  profit_percentage: number;
  profit_pct: number;
  volume_24h: number;
  volume_24h_usd: number;
  db_created_at: string;
};

// Public cross-rate format (from public segment)
export type CrossRateOpportunity = {
  type: "cross_rate";
  seg: string;
  strategy?: string;
  path?: string;
  base_currency?: string;
  leg1?: {
    exchange: string;
    pair: string;
    action: string;
    price: number;
    description: string;
  };
  leg2?: {
    exchange: string;
    pair: string;
    action: string;
    price: number;
    description: string;
  };
  direct_alternative?: {
    exchange: string;
    pair: string;
    price: number;
    description: string;
  };
  triangular_yield?: number;
  direct_yield?: number;
  profit_per_unit?: number;
  profit_percentage: number;
  implied_rate?: number;
  actual_rate?: number;
  timestamp: string;
  db_created_at: string;
  db_updated_at?: string;
};

// Union type for both formats
export type ArbitrageOpportunity = Opportunity | CoinCapOpportunity | CrossRateOpportunity;

export type StreamFrame = {
  status: string;
  data: {
    all_exchange_prices: Record<string, Record<string, Quote | CoinCapQuote>>;
    opportunities: ArbitrageOpportunity[];
    analyzer_status?: string;
    ts?: number;
  };
};

export type ExchangePrices = Record<string, Record<string, Quote | CoinCapQuote>>;
export type MarketData = {
  pair: string;
  exchanges: {
    exchange: string;
    base: string;
    quote: string;
    bid: number;
    ask: number;
    last: number;
    volume: number;
    spread: number;
    spreadPercent: number;
  }[];
  bestBid: number;
  bestAsk: number;
  bestBidExchange: string;
  bestAskExchange: string;
  midPrice: number;
};

// Trading event response types
export type TradingSessionStatus = {
  message: string;
  status: string;
};

export type TradingResponse = {
  message?: string;
  status: string;
  data?: unknown;
};

export type TradingConnectionStatus = {
  status: string;
  message?: string;
  data?: unknown;
};