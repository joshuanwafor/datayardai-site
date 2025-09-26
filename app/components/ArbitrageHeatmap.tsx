'use client';

import { Opportunity } from '../types/streaming';

interface ArbitrageHeatmapProps {
  opportunities: Opportunity[];
}

export function ArbitrageHeatmap({ opportunities }: ArbitrageHeatmapProps) {
  // Group opportunities by pair
  const opportunitiesByPair = opportunities.reduce((acc, opp) => {
    if (!acc[opp.pair]) {
      acc[opp.pair] = [];
    }
    acc[opp.pair].push(opp);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  // Calculate max profit for each pair
  const pairMaxProfits = Object.entries(opportunitiesByPair).map(([pair, opps]) => ({
    pair,
    maxProfit: Math.max(...opps.map(o => o.profit_percentage)),
    count: opps.length
  })).sort((a, b) => b.maxProfit - a.maxProfit);

  const getProfitColor = (profit: number) => {
    if (profit >= 2) return 'bg-green-500';
    if (profit >= 1) return 'bg-green-400';
    if (profit >= 0.5) return 'bg-yellow-400';
    if (profit >= 0.1) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getProfitIntensity = (profit: number) => {
    if (profit >= 2) return 'opacity-100';
    if (profit >= 1) return 'opacity-90';
    if (profit >= 0.5) return 'opacity-80';
    if (profit >= 0.1) return 'opacity-70';
    return 'opacity-60';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Arbitrage Opportunities Heatmap
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Color intensity represents profit percentage. Hover for details.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {pairMaxProfits.map(({ pair, maxProfit, count }) => (
          <div
            key={pair}
            className={`${getProfitColor(maxProfit)} ${getProfitIntensity(maxProfit)} rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform`}
            title={`${pair}: ${maxProfit.toFixed(2)}% profit (${count} opportunities)`}
          >
            <div className="text-white font-semibold text-sm">{pair}</div>
            <div className="text-white text-xs opacity-90">
              {maxProfit.toFixed(2)}%
            </div>
            <div className="text-white text-xs opacity-75">
              {count} opps
            </div>
          </div>
        ))}
      </div>

      {pairMaxProfits.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No arbitrage opportunities found
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>0-0.1%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-400 rounded"></div>
          <span>0.1-0.5%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
          <span>0.5-1%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span>1-2%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>2%+</span>
        </div>
      </div>
    </div>
  );
}
