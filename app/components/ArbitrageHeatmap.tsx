'use client';

import { useState, useMemo } from 'react';
import { Opportunity } from '../types/streaming';
import { TrendingUp, DollarSign, Activity, Target } from 'lucide-react';

interface ArbitrageHeatmapProps {
  opportunities: Opportunity[];
}


export function ArbitrageHeatmap({ opportunities }: ArbitrageHeatmapProps) {
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'profit' | 'count' | 'pair'>('profit');

  // Process opportunities data
  const pairData = useMemo(() => {
    const opportunitiesByPair = opportunities.reduce((acc, opp) => {
      if (!acc[opp.pair]) {
        acc[opp.pair] = [];
      }
      acc[opp.pair].push(opp);
      return acc;
    }, {} as Record<string, Opportunity[]>);

    return Object.entries(opportunitiesByPair).map(([pair, opps]) => {
      const maxProfit = Math.max(...opps.map(o => o.profit_percentage));
      const avgProfit = opps.reduce((sum, o) => sum + o.profit_percentage, 0) / opps.length;
      const totalProfit = opps.reduce((sum, o) => sum + o.profit, 0);
      const bestOpportunity = opps.reduce((best, current) => 
        current.profit_percentage > best.profit_percentage ? current : best
      );

      return {
        pair,
        maxProfit,
        avgProfit,
        count: opps.length,
        totalProfit,
        bestOpportunity
      };
    });
  }, [opportunities]);

  // Sort data based on selected criteria
  const sortedPairData = useMemo(() => {
    return [...pairData].sort((a, b) => {
      switch (sortBy) {
        case 'profit':
          return b.maxProfit - a.maxProfit;
        case 'count':
          return b.count - a.count;
        case 'pair':
          return a.pair.localeCompare(b.pair);
        default:
          return b.maxProfit - a.maxProfit;
      }
    });
  }, [pairData, sortBy]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    if (opportunities.length === 0) return null;
    
    const totalOpportunities = opportunities.length;
    const avgProfit = opportunities.reduce((sum, o) => sum + o.profit_percentage, 0) / totalOpportunities;
    const maxProfit = Math.max(...opportunities.map(o => o.profit_percentage));
    const totalProfit = opportunities.reduce((sum, o) => sum + o.profit, 0);
    const uniquePairs = new Set(opportunities.map(o => o.pair)).size;

    return {
      totalOpportunities,
      avgProfit,
      maxProfit,
      totalProfit,
      uniquePairs
    };
  }, [opportunities]);

  const getProfitColor = (profit: number) => {
    if (profit >= 2) return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
    if (profit >= 1) return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    if (profit >= 0.5) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
    if (profit >= 0.1) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
    return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
  };

  const getProfitTextColor = (profit: number) => {
    if (profit >= 2) return 'text-green-700 dark:text-green-300';
    if (profit >= 1) return 'text-blue-700 dark:text-blue-300';
    if (profit >= 0.5) return 'text-yellow-700 dark:text-yellow-300';
    if (profit >= 0.1) return 'text-orange-700 dark:text-orange-300';
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Arbitrage Heatmap
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Real-time profit opportunities across trading pairs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'profit' | 'count' | 'pair')}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="profit" className="text-gray-900">Sort by Profit</option>
              <option value="count" className="text-gray-900">Sort by Count</option>
              <option value="pair" className="text-gray-900">Sort by Pair</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {stats && (
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">TOTAL OPPORTUNITIES</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.totalOpportunities}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">AVG PROFIT</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.avgProfit.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-xs font-medium">MAX PROFIT</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.maxProfit.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">TOTAL PROFIT</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${stats.totalProfit.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium">UNIQUE PAIRS</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.uniquePairs}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {sortedPairData.map((pairData) => (
            <div
              key={pairData.pair}
              className={`relative ${getProfitColor(pairData.maxProfit)} rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-all duration-200 group border-2`}
              onClick={() => setSelectedPair(selectedPair === pairData.pair ? null : pairData.pair)}
            >
              {/* Pair Symbol */}
              <div className={`font-semibold text-sm mb-1 ${getProfitTextColor(pairData.maxProfit)}`}>
                {pairData.pair}
              </div>
              
              {/* Max Profit */}
              <div className={`text-lg font-bold mb-1 ${getProfitTextColor(pairData.maxProfit)}`}>
                {pairData.maxProfit.toFixed(2)}%
              </div>
              
              {/* Opportunity Count */}
              <div className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                {pairData.count} opps
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gray-200/20 dark:bg-gray-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Selection Indicator */}
              {selectedPair === pairData.pair && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800" />
              )}
            </div>
          ))}
        </div>

        {sortedPairData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Target className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              No arbitrage opportunities found
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Check back later for new opportunities
            </div>
          </div>
        )}
      </div>

      {/* Selected Pair Details */}
      {selectedPair && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          {(() => {
            const pair = sortedPairData.find(p => p.pair === selectedPair);
            if (!pair) return null;
            
            return (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {pair.pair} - Best Opportunity
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Buy on {pair.bestOpportunity.buy_exchange} • Sell on {pair.bestOpportunity.sell_exchange}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {pair.bestOpportunity.profit_percentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ${pair.bestOpportunity.profit.toFixed(2)} profit
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">0-0.1%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-200 dark:border-orange-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">0.1-0.5%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">0.5-1%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">1-2%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">2%+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
