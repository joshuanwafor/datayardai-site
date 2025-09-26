'use client';

import { useMemo } from 'react';
import { MarketData, Opportunity } from '../types/streaming';

export function useMarketAnalytics(marketData: MarketData[], opportunities: Opportunity[]) {
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

    // Calculate top gainers and losers (mock data for now - would need price history)
    const topGainers = marketData
      .map(market => ({
        pair: market.pair,
        change: Math.random() * 10 - 5, // Mock data
        changePercent: Math.random() * 10 - 5
      }))
      .filter(item => item.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);

    const topLosers = marketData
      .map(market => ({
        pair: market.pair,
        change: Math.random() * 10 - 5, // Mock data
        changePercent: Math.random() * 10 - 5
      }))
      .filter(item => item.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);

    return {
      totalPairs,
      totalExchanges,
      totalOpportunities: opportunities.length,
      avgSpread,
      topGainers,
      topLosers
    };
  }, [marketData, opportunities]);
}
