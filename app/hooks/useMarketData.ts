'use client';

import { useMemo } from 'react';
import { ExchangePrices, MarketData, Quote, CoinCapQuote } from '../types/streaming';

function isCoinCapQuote(data: Quote | CoinCapQuote): data is CoinCapQuote {
  return 'price_usd' in data;
}

function isStandardQuote(data: Quote | CoinCapQuote): data is Quote {
  return 'bid' in data && 'ask' in data && 'last' in data;
}

export type UseMarketDataReturn = {
  marketData: MarketData[];
  coinCapFormatData: CoinCapMarketData[];
};

export type CoinCapMarketData = {
  segment: string;
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
    const coinCapFormatData: CoinCapMarketData[] = [];

    // New structure: all_exchange_prices -> segment -> exchange -> pair/symbol
    Object.entries(exchangePrices).forEach(([segment, exchanges]) => {
      Object.entries(exchanges).forEach(([exchange, pairs]) => {
        Object.entries(pairs).forEach(([pairOrSymbol, quoteData]) => {
          if (segment === 'public' && isStandardQuote(quoteData)) {
            processQuote(exchange, pairOrSymbol, quoteData, pairMap);
            return;
          }

          if (isCoinCapQuote(quoteData)) {
            coinCapFormatData.push({
              segment,
              exchange,
              pair: pairOrSymbol,
              symbol: quoteData.symbol ?? pairOrSymbol,
              name: quoteData.name ?? pairOrSymbol,
              price: quoteData.price_usd,
              volume: quoteData.volume_24h_usd,
              change24h: quoteData.change_24h ?? 0,
              marketCap: quoteData.market_cap_usd ?? quoteData.global_price_usd ?? 0,
              rank: quoteData.rank ?? 0,
              timestamp: quoteData.timestamp
            });
          }
        });
      });
    });

    // Calculate mid prices and finalize data
    pairMap.forEach((market) => {
      if (market.bestBid > 0 && market.bestAsk < Infinity) {
        market.midPrice = (market.bestBid + market.bestAsk) / 2;
        marketData.push(market);
      }
    });

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
