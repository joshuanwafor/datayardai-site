'use client';

import { TrendingUp, TrendingDown, Activity, BarChart3, Target, ArrowUp, ArrowDown } from 'lucide-react';

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
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pairs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Pairs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPairs}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Active trading pairs</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Exchanges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-green-300 dark:hover:border-green-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Exchanges</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalExchanges}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Connected platforms</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Arbitrage Opportunities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Opportunities</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOpportunities}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Live arbitrage chances</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <Target className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Average Spread */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg Spread</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgSpread.toFixed(2)}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Market spread</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              Top Gainers
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Best performing pairs today
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topGainers.slice(0, 5).map((gainer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{gainer.pair}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ${gainer.change.toFixed(2)} change
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      +{formatPercent(gainer.changePercent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              Top Losers
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Underperforming pairs today
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topLosers.slice(0, 5).map((loser, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-700 dark:text-red-300 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{loser.pair}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ${loser.change.toFixed(2)} change
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      {formatPercent(loser.changePercent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
