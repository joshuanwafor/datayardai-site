export type Quote = {
  exchange: string;
  base: string;
  quote: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
};

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

export type StreamFrame = {
  status: string;
  data: {
    all_exchange_prices: Record<string, Record<string, Quote>>;
    opportunities: Opportunity[];
    analyzer_status?: string;
    ts?: number;
  };
};

export type ExchangePrices = Record<string, Record<string, Quote>>;
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