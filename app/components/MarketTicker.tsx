'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { MarketData } from '../types/streaming';

interface MarketTickerProps {
  marketData: MarketData[];
  selectedPair?: string;
  onPairSelect?: (pair: string) => void;
}

export function MarketTicker({ marketData, selectedPair, onPairSelect }: MarketTickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'pair' | 'price' | 'change' | 'volume' | 'exchanges'>('pair');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const formatPrice = (price: number) => {
    if (price === 0) return 'N/A';
    if (price < 0.01) return price.toExponential(2);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
  };

  const formatVolume = (volume: number) => {
    if (volume === 0) return 'N/A';
    if (volume < 1000) return volume.toFixed(2);
    if (volume < 1000000) return `${(volume / 1000).toFixed(1)}K`;
    if (volume < 1000000000) return `${(volume / 1000000).toFixed(1)}M`;
    return `${(volume / 1000000000).toFixed(1)}B`;
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  // Simulate 24h change based on spread (for demo purposes)
  const getSimulatedChange = (market: MarketData) => {
    // Simulate change between -5% to +5% based on spread
    const baseChange = (Math.random() - 0.5) * 10;
    return baseChange;
  };

  // Simulate volume based on number of exchanges and spread
  const getSimulatedVolume = (market: MarketData) => {
    const baseVolume = market.exchanges.length * 1000000;
    const spreadFactor = market.midPrice > 0 ? ((market.bestAsk - market.bestBid) / market.midPrice) * 100 : 0;
    return baseVolume * (1 + spreadFactor / 10);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = marketData.filter(market =>
      market.pair.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'pair':
          aValue = a.pair;
          bValue = b.pair;
          break;
        case 'price':
          aValue = a.midPrice;
          bValue = b.midPrice;
          break;
        case 'change':
          aValue = getSimulatedChange(a);
          bValue = getSimulatedChange(b);
          break;
        case 'volume':
          aValue = getSimulatedVolume(a);
          bValue = getSimulatedVolume(b);
          break;
        case 'exchanges':
          aValue = a.exchanges.length;
          bValue = b.exchanges.length;
          break;
        default:
          aValue = a.pair;
          bValue = b.pair;
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

    return filtered;
  }, [marketData, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const handleSort = (column: 'pair' | 'price' | 'change' | 'volume' | 'exchanges') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const SortButton = ({ column, children }: { column: 'pair' | 'price' | 'change' | 'volume' | 'exchanges'; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      {children}
      {sortBy === column && (
        sortOrder === 'asc' ? <TrendingUp size={12} /> : <TrendingDown size={12} />
      )}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Market Ticker</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedData.length} of {marketData.length} pairs
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search pairs..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as ['pair' | 'price' | 'change' | 'volume' | 'exchanges', 'asc' | 'desc'];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            >
              <option value="pair-asc">Pair A-Z</option>
              <option value="pair-desc">Pair Z-A</option>
              <option value="price-desc">Price High-Low</option>
              <option value="price-asc">Price Low-High</option>
              <option value="change-desc">Change High-Low</option>
              <option value="change-asc">Change Low-High</option>
              <option value="volume-desc">Volume High-Low</option>
              <option value="volume-asc">Volume Low-High</option>
              <option value="exchanges-desc">Most Exchanges</option>
              <option value="exchanges-asc">Least Exchanges</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">
                <SortButton column="pair">Pair</SortButton>
              </th>
              <th className="px-4 py-3 text-right">
                <SortButton column="price">Price</SortButton>
              </th>
              <th className="px-4 py-3 text-right">
                <SortButton column="change">24h Change</SortButton>
              </th>
              <th className="px-4 py-3 text-right">
                <SortButton column="volume">24h Volume</SortButton>
              </th>
              <th className="px-4 py-3 text-center">
                <SortButton column="exchanges">Exchanges</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((market) => {
              const spread = market.bestAsk - market.bestBid;
              const spreadPercent = market.midPrice > 0 ? (spread / market.midPrice) * 100 : 0;
              const isSelected = selectedPair === market.pair;
              const change24h = getSimulatedChange(market);
              const volume24h = getSimulatedVolume(market);
              const isPositive = change24h >= 0;
              
              return (
                <tr 
                  key={market.pair}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => onPairSelect?.(market.pair)}
                >
                  {/* Pair */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {market.pair.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {market.pair}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {market.pair.substring(0, 3)}/{market.pair.substring(3)}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Price */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${formatPrice(market.midPrice)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Bid: ${formatPrice(market.bestBid)} | Ask: ${formatPrice(market.bestAsk)}
                    </div>
                  </td>
                  
                  {/* 24h Change */}
                  <td className="px-4 py-3 text-right">
                    <div className={`flex items-center justify-end gap-1 font-mono text-sm font-semibold ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {formatPercent(change24h)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Spread: {formatPercent(spreadPercent)}
                    </div>
                  </td>
                  
                  {/* 24h Volume */}
                  <td className="px-4 py-3 text-right">
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                      ${formatVolume(volume24h)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {market.exchanges.length} exchanges
                    </div>
                  </td>
                  
                  {/* Exchanges */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="flex -space-x-1">
                        {market.exchanges.slice(0, 4).map((ex, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-2 border-white dark:border-gray-800 text-xs flex items-center justify-center text-white font-medium shadow-sm"
                            title={ex.exchange}
                          >
                            {ex.exchange.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {market.exchanges.length > 4 && (
                          <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800 text-xs flex items-center justify-center text-white font-medium shadow-sm">
                            +{market.exchanges.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of {filteredAndSortedData.length} pairs
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedData.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No pairs found
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Try adjusting your search criteria or filters
          </div>
        </div>
      )}
    </div>
  );
}
