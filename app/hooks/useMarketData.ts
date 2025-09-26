'use client';

import { useMemo } from 'react';
import { ExchangePrices, MarketData } from '../types/streaming';

export function useMarketData(exchangePrices: ExchangePrices) {
  return useMemo(() => {
    const marketData: MarketData[] = [];
    const pairMap = new Map<string, MarketData>();

    // Process all exchange prices
    Object.entries(exchangePrices).forEach(([exchange, pairs]) => {
      Object.entries(pairs).forEach(([pair, quote]) => {
        if (quote.bid === 0 && quote.ask === 0 && quote.last === 0) {
          return; // Skip invalid quotes
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
          bid: quote.bid,
          ask: quote.ask,
          last: quote.last,
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
      });
    });

    // Calculate mid prices and finalize data
    pairMap.forEach((market) => {
      if (market.bestBid > 0 && market.bestAsk < Infinity) {
        market.midPrice = (market.bestBid + market.bestAsk) / 2;
        marketData.push(market);
      }
    });

    // Sort by pair name
    return marketData.sort((a, b) => a.pair.localeCompare(b.pair));
  }, [exchangePrices]);
}
