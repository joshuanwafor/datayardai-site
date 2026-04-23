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
  global_price_usd?: number;
  volume_24h_usd: number;
  change_24h?: number;
  market_cap_usd?: number;
  rank?: number;
  exchange: string;
  timestamp: string;
  has_real_market_cap?: boolean;
};

export type OpportunityType = "direct" | "triangular" | "cross_rate";

// Unified opportunity format for all segments.
export type Opportunity = {
  type: OpportunityType | string;
  seg: string;
  pair?: string;
  symbol?: string;
  buy_exchange: string;
  sell_exchange: string;
  buy_price: number;
  sell_price: number;
  profit: number;
  profit_percentage: number;
  timestamp: string; // ISO
  db_created_at?: string; // ISO
};

export type ArbitrageOpportunity = Opportunity;
export type SegmentExchangePrices = Record<string, Record<string, Quote | CoinCapQuote>>;
export type AllExchangePrices = Record<string, SegmentExchangePrices>;

export type StreamFrame = {
  status: string;
  data: {
    all_exchange_prices: AllExchangePrices;
    opportunities: ArbitrageOpportunity[];
    analyzer_status?: string;
    ts?: number;
  };
};

export type ExchangePrices = AllExchangePrices;
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