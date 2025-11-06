'use client';

import { useState, useMemo } from 'react';
import { ArbitrageOpportunity, Opportunity, CoinCapOpportunity, CrossRateOpportunity } from '../types/streaming';
import { TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight, Filter, Search, Coins, Globe, Shuffle } from 'lucide-react';

interface ArbitrageOpportunitiesProps {
  opportunities: ArbitrageOpportunity[];
  maxDisplay?: number;
}

// Type guard functions
function isCrossRateOpportunity(opp: ArbitrageOpportunity): opp is CrossRateOpportunity {
  return 'via' in opp && 'leg1' in opp && 'leg2' in opp && 'direct' in opp;
}

function isCoinCapOpportunity(opp: ArbitrageOpportunity): opp is CoinCapOpportunity {
  return 'symbol' in opp && 'lowest' in opp && 'highest' in opp;
}

function isPublicOpportunity(opp: ArbitrageOpportunity): opp is Opportunity {
  return !isCrossRateOpportunity(opp) && !isCoinCapOpportunity(opp) && 'pair' in opp && 'buy_exchange' in opp && 'sell_exchange' in opp;
}

export function ArbitrageOpportunities({ opportunities, maxDisplay = 20 }: ArbitrageOpportunitiesProps) {
  console.log(opportunities);
  console.log("opportunities");

  const [sortBy, setSortBy] = useState<'profit' | 'percentage' | 'time' | 'pair'>('percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterPair, setFilterPair] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'coincap' | 'crossrate'>('public');

  // Separate opportunities by type
  const { publicOpportunities, coinCapOpportunities, crossRateOpportunities } = useMemo(() => {
    const publicOps: Opportunity[] = [];
    const coinCapOps: CoinCapOpportunity[] = [];
    const crossRateOps: CrossRateOpportunity[] = [];

    opportunities.forEach(opp => {
      if (isCrossRateOpportunity(opp)) {
        crossRateOps.push(opp);
      } else if (isPublicOpportunity(opp)) {
        publicOps.push(opp);
      } else if (isCoinCapOpportunity(opp)) {
        coinCapOps.push(opp);
      }
    });

    return { 
      publicOpportunities: publicOps, 
      coinCapOpportunities: coinCapOps,
      crossRateOpportunities: crossRateOps 
    };
  }, [opportunities]);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || !isFinite(price)) return '0.00';
    if (price < 0.01) return price.toExponential(2);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
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

  // Filter and sort PUBLIC opportunities
  const filteredAndSortedPublicOps = useMemo(() => {
    const filtered = publicOpportunities.filter(opp =>
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
  }, [publicOpportunities, sortBy, sortOrder, filterPair, showAll, maxDisplay]);

  // Filter and sort COINCAP opportunities
  const filteredAndSortedCoinCapOps = useMemo(() => {
    const filtered = coinCapOpportunities.filter(opp =>
      opp.symbol.toLowerCase().includes(filterPair.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'profit':
          aValue = a.price_difference;
          bValue = b.price_difference;
          break;
        case 'percentage':
          aValue = a.percentage_difference;
          bValue = b.percentage_difference;
          break;
        case 'time':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'pair':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        default:
          aValue = a.percentage_difference;
          bValue = b.percentage_difference;
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
  }, [coinCapOpportunities, sortBy, sortOrder, filterPair, showAll, maxDisplay]);

  // Filter and sort CROSSRATE opportunities
  const filteredAndSortedCrossRateOps = useMemo(() => {
    const filtered = crossRateOpportunities.filter(opp =>
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
  }, [crossRateOpportunities, sortBy, sortOrder, filterPair, showAll, maxDisplay]);

  const currentOpportunities = activeTab === 'public' ? filteredAndSortedPublicOps : activeTab === 'coincap' ? filteredAndSortedCoinCapOps : filteredAndSortedCrossRateOps;
  const currentTotalCount = activeTab === 'public' ? publicOpportunities.length : activeTab === 'coincap' ? coinCapOpportunities.length : crossRateOpportunities.length;

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
              {opportunities.length} opportunities found ({publicOpportunities.length} Public, {coinCapOpportunities.length} CoinCap, {crossRateOpportunities.length} Cross-Rate)
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'public'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
          >
            <Globe className="w-4 h-4" />
            Public ({publicOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('coincap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'coincap'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
          >
            <Coins className="w-4 h-4" />
            CoinCap ({coinCapOpportunities.length})
          </button>
          <button
            onClick={() => setActiveTab('crossrate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'crossrate'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
          >
            <Shuffle className="w-4 h-4" />
            Cross-Rate ({crossRateOpportunities.length})
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={activeTab === 'coincap' ? "Filter by symbol..." : "Filter by pair..."}
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
              <option value="pair-asc">{activeTab === 'coincap' ? 'Symbol' : 'Pair'} A-Z</option>
              <option value="pair-desc">{activeTab === 'coincap' ? 'Symbol' : 'Pair'} Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* PUBLIC Opportunities List */}
      {activeTab === 'public' && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAndSortedPublicOps.map((opp, index) => (
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
                          {formatPrice(opp.buy_price)}
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
                          {formatPrice(opp.sell_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className={`text-2xl font-bold mb-1 ${opp.profit_percentage >= 1
                      ? 'text-green-600 dark:text-green-400'
                      : opp.profit_percentage >= 0.5
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    {opp.profit_percentage.toFixed(2)}%
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {formatPrice(opp.profit)}
                  </div>
                  <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${opp.profit_percentage >= 1
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
      )}

      {/* COINCAP Opportunities List */}
      {activeTab === 'coincap' && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAndSortedCoinCapOps.map((opp, index) => (
            <div key={`${opp.symbol}-${opp.timestamp}-${index}`} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {opp.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {opp.symbol} <span className="text-xs text-gray-500">({opp.currency})</span>
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
                          Buy on {opp.lowest.exchange}
                        </div>
                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          {formatPrice(opp.lowest.price)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Sell on {opp.highest.exchange}
                        </div>
                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                          {formatPrice(opp.highest.price)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional CoinCap info */}
                  <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {opp.via_currency && (
                      <div>Via: <span className="font-medium">{opp.via_currency}</span></div>
                    )}
                    {opp.confidence_score > 0 && (
                      <div>Confidence: <span className="font-medium">{(opp.confidence_score * 100).toFixed(0)}%</span></div>
                    )}
                    <div>Type: <span className="font-medium">{opp.type}</span></div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className={`text-2xl font-bold mb-1 ${opp.percentage_difference >= 1
                      ? 'text-green-600 dark:text-green-400'
                      : opp.percentage_difference >= 0.5
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    {opp.percentage_difference.toFixed(2)}%
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {formatPrice(opp.price_difference)}
                  </div>
                  <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${opp.percentage_difference >= 1
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : opp.percentage_difference >= 0.5
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {opp.percentage_difference >= 1 ? 'High Profit' : opp.percentage_difference >= 0.5 ? 'Medium Profit' : 'Low Profit'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CROSS-RATE Opportunities List */}
      {activeTab === 'crossrate' && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAndSortedCrossRateOps.map((opp, index) => (
            <div key={`${opp.pair}-${opp.timestamp}-${index}`} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {opp.pair.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {opp.pair}
                        <span className="text-xs font-normal px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                          via {opp.via}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(opp.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-3">
                    {/* Leg 1 */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {opp.leg1.pair} on {opp.leg1.exchange}
                        </div>
                        <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {formatPrice(opp.leg1.price)}
                        </div>
                      </div>
                    </div>

                    {/* Leg 2 */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {opp.leg2.pair} on {opp.leg2.exchange}
                        </div>
                        <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {formatPrice(opp.leg2.price)}
                        </div>
                      </div>
                    </div>

                    {/* Direct Rate */}
                    <div className="flex items-center gap-2 text-sm border-t pt-3 mt-3 dark:border-gray-600">
                      <ArrowUpRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Direct on {opp.direct.exchange}
                        </div>
                        <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {formatPrice(opp.direct.price)}
                        </div>
                      </div>
                    </div>

                    {/* Rate comparison */}
                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Implied Rate:</span>{' '}
                        <span className="font-mono font-medium text-gray-900 dark:text-white">{formatPrice(opp.implied_rate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Direct Rate:</span>{' '}
                        <span className="font-mono font-medium text-gray-900 dark:text-white">{formatPrice(opp.direct_rate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">Difference:</span>{' '}
                        <span className="font-mono font-medium text-gray-900 dark:text-white">{formatPrice(opp.diff)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className={`text-2xl font-bold mb-1 ${opp.profit_percentage >= 1
                      ? 'text-green-600 dark:text-green-400'
                      : opp.profit_percentage >= 0.5
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    {opp.profit_percentage.toFixed(2)}%
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {formatPrice(opp.profit)}
                  </div>
                  <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${opp.profit_percentage >= 1
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
      )}

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

      {currentOpportunities.length === 0 && filterPair && (
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
