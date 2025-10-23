'use client';

import { useMemo } from 'react';
import { ExchangePrices, MarketData, Quote, CoinCapQuote } from '../types/streaming';

// Type guard to check if data is CoinCapQuote
function isCoinCapQuote(data: Quote | CoinCapQuote): data is CoinCapQuote {
  return 'price_usd' in data && 'volume_24h_usd' in data;
}

export type UseMarketDataReturn = {
  marketData: MarketData[];
  coinCapFormatData: CoinCapMarketData[];
};

export type CoinCapMarketData = {
  exchange: string;
  pair: string;
  symbol: string;
  name: string;
  price: number;
  volume: number;
  change24h: number;
  marketCap: number;
  rank: number;
  timestamp: string;
};

export function useMarketData(exchangePrices: ExchangePrices): UseMarketDataReturn {
  return useMemo(() => {
    const marketData: MarketData[] = [];
    const pairMap = new Map<string, MarketData>();
    
    // Separate list for CoinCap format data (kept as-is for separate rendering)
    const coinCapFormatData: CoinCapMarketData[] = [];

    // Process all exchange prices
    Object.entries(exchangePrices).forEach(([exchange, pairs]) => {
      Object.entries(pairs).forEach(([pair, quoteData]) => {
        // Check if this is CoinCap format
        if (isCoinCapQuote(quoteData)) {
          // Keep CoinCap format data separate without transformation
          coinCapFormatData.push({
            exchange,
            pair,
            symbol: quoteData.symbol,
            name: quoteData.name,
            price: quoteData.price_usd,
            volume: quoteData.volume_24h_usd,
            change24h: quoteData.change_24h,
            marketCap: quoteData.market_cap_usd,
            rank: quoteData.rank,
            timestamp: quoteData.timestamp
          });
        } else {
          // Process normal Quote format only
          processQuote(exchange, pair, quoteData, pairMap);
        }
      });
    });

    // Calculate mid prices and finalize data
    pairMap.forEach((market) => {
      if (market.bestBid > 0 && market.bestAsk < Infinity) {
        market.midPrice = (market.bestBid + market.bestAsk) / 2;
        marketData.push(market);
      }
    });

    // Log CoinCap format occurrences for debugging
    if (coinCapFormatData.length > 0) {
      console.warn(`⚠️ Found ${coinCapFormatData.length} CoinCap format entries (kept separate):`, {
        exchanges: [...new Set(coinCapFormatData.map(d => d.exchange))],
        count: coinCapFormatData.length,
        pairs: coinCapFormatData.length
      });
    }

    // Sort by pair name
    return {
      marketData: marketData.sort((a, b) => a.pair.localeCompare(b.pair)),
      coinCapFormatData: coinCapFormatData.sort((a, b) => a.pair.localeCompare(b.pair))
    };
  }, [exchangePrices]);
}

// Helper function to process a quote (both normal and transformed)
function processQuote(
  exchange: string,
  pair: string,
  quote: Quote,
  pairMap: Map<string, MarketData>
) {
  // Skip invalid quotes
  if (quote.bid === 0 && quote.ask === 0 && quote.last === 0) {
    return;
  }

  const spread = quote.ask - quote.bid;
  const midPrice = (quote.ask + quote.bid) / 2;
  const spreadPercent = midPrice > 0 ? (spread / midPrice) * 100 : 0;

  if (!pairMap.has(pair)) {
    pairMap.set(pair, {
      pair,
      exchanges: [],
      bestBid: 0,
      bestAsk: Infinity,
      bestBidExchange: '',
      bestAskExchange: '',
      midPrice: 0
    });
  }

  const market = pairMap.get(pair)!;
  market.exchanges.push({
    exchange,
    base: quote.base || '',
    quote: quote.quote || '',
    bid: quote.bid,
    ask: quote.ask,
    last: quote.last,
    volume: quote.volume || 0,
    spread,
    spreadPercent
  });

  // Update best bid/ask
  if (quote.bid > market.bestBid) {
    market.bestBid = quote.bid;
    market.bestBidExchange = exchange;
  }
  if (quote.ask < market.bestAsk) {
    market.bestAsk = quote.ask;
    market.bestAskExchange = exchange;
  }
}
