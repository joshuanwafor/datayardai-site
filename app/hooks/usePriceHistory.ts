'use client';

import { useState, useEffect, useRef } from 'react';
import { MarketData } from '../types/streaming';

export type PriceChange = {
  pair: string;
  currentPrice: number;
  initialPrice: number;
  change: number;
  changePercent: number;
  lastUpdate: number;
};

export function usePriceHistory(marketData: MarketData[]) {
  const [priceHistory, setPriceHistory] = useState<Map<string, { initialPrice: number; timestamp: number }>>(new Map());
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (marketData.length === 0) return;

    const now = Date.now();
    const newPriceHistory = new Map(priceHistory);
    const changes: PriceChange[] = [];

    marketData.forEach((market) => {
      const currentPrice = market.midPrice;
      
      if (!currentPrice || currentPrice === 0) return;

      const existing = newPriceHistory.get(market.pair);

      if (!existing) {
        // First time seeing this pair, store initial price
        newPriceHistory.set(market.pair, {
          initialPrice: currentPrice,
          timestamp: now
        });
      } else {
        // Calculate change from initial price
        const initialPrice = existing.initialPrice;
        const change = currentPrice - initialPrice;
        const changePercent = initialPrice > 0 ? (change / initialPrice) * 100 : 0;

        changes.push({
          pair: market.pair,
          currentPrice,
          initialPrice,
          change,
          changePercent,
          lastUpdate: now
        });
      }
    });

    setPriceHistory(newPriceHistory);
    setPriceChanges(changes);

    if (!isInitialized.current && marketData.length > 0) {
      isInitialized.current = true;
    }
  }, [marketData]);

  // Get top gainers (sorted by highest positive change)
  const topGainers = priceChanges
    .filter(item => item.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5)
    .map(item => ({
      pair: item.pair,
      change: item.change,
      changePercent: item.changePercent
    }));

  // Get top losers (sorted by most negative change)
  const topLosers = priceChanges
    .filter(item => item.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5)
    .map(item => ({
      pair: item.pair,
      change: item.change,
      changePercent: item.changePercent
    }));

  // Reset function to clear history (useful for new sessions)
  const resetHistory = () => {
    setPriceHistory(new Map());
    setPriceChanges([]);
    isInitialized.current = false;
  };

  return {
    topGainers,
    topLosers,
    priceChanges,
    resetHistory,
    isInitialized: isInitialized.current
  };
}

