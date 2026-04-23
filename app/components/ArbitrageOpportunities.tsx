'use client';

import { useState, useMemo } from 'react';
import { ArbitrageOpportunity } from '../types/streaming';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';

interface ArbitrageOpportunitiesProps {
  opportunities: ArbitrageOpportunity[];
  maxDisplay?: number;
}

function getOpportunityLabel(opp: ArbitrageOpportunity): string {
  return opp.pair || opp.symbol || 'Unknown';
}

export function ArbitrageOpportunities({ opportunities, maxDisplay = 20 }: ArbitrageOpportunitiesProps) {
  const [sortBy, setSortBy] = useState<'profit' | 'percentage' | 'time' | 'label'>('percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string>('all');

  const segments = useMemo(() => {
    const unique = Array.from(new Set(opportunities.map((opp) => opp.seg))).filter(Boolean);
    return ['all', ...unique.sort()];
  }, [opportunities]);

  const filteredAndSortedOpportunities = useMemo(() => {
    const search = searchTerm.toLowerCase();
    const filtered = opportunities.filter((opp) => {
      if (activeSegment !== 'all' && opp.seg !== activeSegment) return false;
      if (!search) return true;
      const label = getOpportunityLabel(opp).toLowerCase();
      return (
        label.includes(search) ||
        opp.buy_exchange.toLowerCase().includes(search) ||
        opp.sell_exchange.toLowerCase().includes(search) ||
        opp.type.toLowerCase().includes(search) ||
        opp.seg.toLowerCase().includes(search)
      );
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'profit':
          aValue = a.profit;
          bValue = b.profit;
          break;
        case 'time':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'label':
          aValue = getOpportunityLabel(a);
          bValue = getOpportunityLabel(b);
          break;
        case 'percentage':
        default:
          aValue = a.profit_percentage;
          bValue = b.profit_percentage;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return showAll ? filtered : filtered.slice(0, maxDisplay);
  }, [opportunities, activeSegment, searchTerm, sortBy, sortOrder, showAll, maxDisplay]);

  const currentTotalCount = opportunities.filter((opp) => activeSegment === 'all' || opp.seg === activeSegment).length;

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
              {opportunities.length} opportunities found across {segments.length - 1} segments
            </p>
          </div>
        </div>

        {/* Segment tabs */}
        <div className="flex gap-2 mb-4">
          {segments.map((segment) => {
            const count = segment === 'all'
              ? opportunities.length
              : opportunities.filter((opp) => opp.seg === segment).length;
            return (
              <button
                key={segment}
                onClick={() => setActiveSegment(segment)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeSegment === segment
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
              >
                {segment === 'all' ? 'All' : segment} ({count})
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter by segment, symbol/pair, exchange, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="label-asc">Pair/Symbol A-Z</option>
              <option value="label-desc">Pair/Symbol Z-A</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredAndSortedOpportunities.map((opp, index) => {
          const label = getOpportunityLabel(opp);
          const isHighProfit = opp.profit_percentage > 0.5;
          return (
            <div key={`${label}-${opp.timestamp}-${index}`} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {label.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {label}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {opp.seg} • {opp.type} • {new Date(opp.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Buy on {opp.buy_exchange}</div>
                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{opp.buy_price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Sell on {opp.sell_exchange}</div>
                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{opp.sell_price}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className={`text-2xl font-bold mb-1 ${isHighProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {opp.profit_percentage.toFixed(2)}%
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{opp.profit}</div>
                  <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${isHighProfit
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                    {isHighProfit ? 'High Profit' : 'Low Profit'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {currentTotalCount > maxDisplay && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {showAll
              ? `Show Less (${maxDisplay} of ${currentTotalCount})`
              : `Show All (${currentTotalCount} opportunities)`
            }
          </button>
        </div>
      )}

      {filteredAndSortedOpportunities.length === 0 && searchTerm && (
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
