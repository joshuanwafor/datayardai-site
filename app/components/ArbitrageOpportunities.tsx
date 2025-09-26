'use client';

import { useState, useMemo } from 'react';
import { Opportunity } from '../types/streaming';
import { TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';

interface ArbitrageOpportunitiesProps {
  opportunities: Opportunity[];
  maxDisplay?: number;
}

export function ArbitrageOpportunities({ opportunities, maxDisplay = 20 }: ArbitrageOpportunitiesProps) {
  const [sortBy, setSortBy] = useState<'profit' | 'percentage' | 'time' | 'pair'>('percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPair, setFilterPair] = useState<string>('');
  const [showAll, setShowAll] = useState(false);

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toExponential(2);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
  };

  const formatProfit = (profit: number) => {
    if (profit < 0.01) return profit.toExponential(2);
    if (profit < 1) return profit.toFixed(4);
    if (profit < 100) return profit.toFixed(2);
    return profit.toFixed(0);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Filter and sort opportunities
  const filteredAndSortedOpportunities = useMemo(() => {
    const filtered = opportunities.filter(opp => 
      opp.pair.toLowerCase().includes(filterPair.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'profit':
          aValue = a.profit;
          bValue = b.profit;
          break;
        case 'percentage':
          aValue = a.profit_percentage;
          bValue = b.profit_percentage;
          break;
        case 'time':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'pair':
          aValue = a.pair;
          bValue = b.pair;
          break;
        default:
          aValue = a.profit_percentage;
          bValue = b.profit_percentage;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return showAll ? filtered : filtered.slice(0, maxDisplay);
  }, [opportunities, sortBy, sortOrder, filterPair, showAll, maxDisplay]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (opportunities.length === 0) return null;
    
    const totalProfit = opportunities.reduce((sum, opp) => sum + opp.profit, 0);
    const avgProfit = opportunities.reduce((sum, opp) => sum + opp.profit_percentage, 0) / opportunities.length;
    const maxProfit = Math.max(...opportunities.map(opp => opp.profit_percentage));
    const uniquePairs = new Set(opportunities.map(opp => opp.pair)).size;

    return {
      totalProfit,
      avgProfit,
      maxProfit,
      uniquePairs,
      totalOpportunities: opportunities.length
    };
  }, [opportunities]);

  if (opportunities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Arbitrage Opportunities
          </h2>
        </div>
        <div className="p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <TrendingUp className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No arbitrage opportunities found
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Check back later for new opportunities
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Arbitrage Opportunities
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {opportunities.length} opportunities found
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter by pair..."
              value={filterPair}
              onChange={(e) => setFilterPair(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            >
              <option value="percentage-desc">Profit % High-Low</option>
              <option value="percentage-asc">Profit % Low-High</option>
              <option value="profit-desc">Profit $ High-Low</option>
              <option value="profit-asc">Profit $ Low-High</option>
              <option value="time-desc">Newest First</option>
              <option value="time-asc">Oldest First</option>
              <option value="pair-asc">Pair A-Z</option>
              <option value="pair-desc">Pair Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      {stats && (
        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">AVG PROFIT</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.avgProfit.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">MAX PROFIT</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.maxProfit.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">UNIQUE PAIRS</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.uniquePairs}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredAndSortedOpportunities.map((opp, index) => (
          <div key={`${opp.pair}-${opp.timestamp}-${index}`} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {opp.pair.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {opp.pair}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(opp.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Buy on {opp.buy_exchange}
                      </div>
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        ${formatPrice(opp.buy_price)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Sell on {opp.sell_exchange}
                      </div>
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        ${formatPrice(opp.sell_price)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-6">
                <div className={`text-2xl font-bold mb-1 ${
                  opp.profit_percentage >= 1 
                    ? 'text-green-600 dark:text-green-400'
                    : opp.profit_percentage >= 0.5
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {opp.profit_percentage.toFixed(2)}%
                </div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  ${formatProfit(opp.profit)}
                </div>
                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                  opp.profit_percentage >= 1 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : opp.profit_percentage >= 0.5
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {opp.profit_percentage >= 1 ? 'High Profit' : opp.profit_percentage >= 0.5 ? 'Medium Profit' : 'Low Profit'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {opportunities.length > maxDisplay && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {showAll 
              ? `Show Less (${maxDisplay} of ${opportunities.length})`
              : `Show All (${opportunities.length} opportunities)`
            }
          </button>
        </div>
      )}

      {filteredAndSortedOpportunities.length === 0 && filterPair && (
        <div className="p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No opportunities found
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your search criteria
          </div>
        </div>
      )}
    </div>
  );
}
