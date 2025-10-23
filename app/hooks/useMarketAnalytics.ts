'use client';

import { useMemo } from 'react';
import { MarketData, ArbitrageOpportunity } from '../types/streaming';

export type MarketAnalytics = {
  totalPairs: number;
  totalExchanges: number;
  totalOpportunities: number;
  avgSpread: number;
};

export function useMarketAnalytics(marketData: MarketData[], opportunities: ArbitrageOpportunity[]): MarketAnalytics {
  return useMemo(() => {
    // Calculate total pairs and exchanges
    const totalPairs = marketData.length;
    const exchanges = new Set<string>();
    marketData.forEach(market => {
      market.exchanges.forEach(ex => exchanges.add(ex.exchange));
    });
    const totalExchanges = exchanges.size;

    // Calculate average spread
    const allSpreads = marketData.flatMap(market => 
      market.exchanges.map(ex => ex.spreadPercent)
    ).filter(spread => spread > 0);
    const avgSpread = allSpreads.length > 0 
      ? allSpreads.reduce((sum, spread) => sum + spread, 0) / allSpreads.length 
      : 0;

    return {
      totalPairs,
      totalExchanges,
      totalOpportunities: opportunities.length,
      avgSpread
    };
  }, [marketData, opportunities]);
}
