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
  symbol: string;
  lowest: {
    price: number;
    exchange: string;
  };
  highest: {
    price: number;
    exchange: string;
  };
  price_difference: number;
  percentage_difference: number;
  currency: string;
  timestamp: string;
  via_currency: string | null;
  confidence_score: number;
};

// Union type for both formats
export type ArbitrageOpportunity = Opportunity | CoinCapOpportunity;

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
    bid: number;
    ask: number;
    last: number;
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