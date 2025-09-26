'use client';

import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react';

interface MarketOverviewProps {
  totalPairs: number;
  totalExchanges: number;
  totalOpportunities: number;
  avgSpread: number;
  topGainers: Array<{
    pair: string;
    change: number;
    changePercent: number;
  }>;
  topLosers: Array<{
    pair: string;
    change: number;
    changePercent: number;
  }>;
}

export function MarketOverview({ 
  totalPairs, 
  totalExchanges, 
  totalOpportunities, 
  avgSpread,
  topGainers,
  topLosers 
}: MarketOverviewProps) {
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Pairs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pairs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPairs}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Total Exchanges */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exchanges</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalExchanges}</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Arbitrage Opportunities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Opportunities</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOpportunities}</p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
            <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Average Spread */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Spread</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgSpread.toFixed(2)}%</p>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Top Gainers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Top Gainers
        </h3>
        <div className="space-y-3">
          {topGainers.slice(0, 3).map((gainer, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{gainer.pair}</span>
              <span className="text-sm font-semibold text-green-600">
                +{formatPercent(gainer.changePercent)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-600" />
          Top Losers
        </h3>
        <div className="space-y-3">
          {topLosers.slice(0, 3).map((loser, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{loser.pair}</span>
              <span className="text-sm font-semibold text-red-600">
                {formatPercent(loser.changePercent)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
