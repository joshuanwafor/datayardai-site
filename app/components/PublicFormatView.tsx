'use client';

import { useState, useMemo, useEffect } from 'react';
import { MarketData } from '../types/streaming';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

type PublicFormatViewProps = {
  data: MarketData[];
};

type SortField = 'pair' | 'exchange' | 'ask' | 'bid' | 'last' | 'volume';
type SortDirection = 'asc' | 'desc';

// Flatten the market data to show each exchange separately
type FlatMarketData = {
  pair: string;
  exchange: string;
  base: string;
  quote: string;
  ask: number;
  bid: number;
  last: number;
  volume: number;
  spread: number;
  spreadPercent: number;
};

export function PublicFormatView({ data }: PublicFormatViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('pair');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Safe number formatter
  const formatNumber = (num: number | null | undefined, options?: Intl.NumberFormatOptions) => {
    const value = num ?? 0;
    if (isNaN(value) || !isFinite(value)) return '0.00';
    return value.toLocaleString(undefined, options);
  };

  // Flatten the data structure
  const flattenedData = useMemo(() => {
    const flattened: FlatMarketData[] = [];
    data.forEach((market) => {
      market.exchanges.forEach((exchangeData) => {
        flattened.push({
          pair: market.pair,
          exchange: exchangeData.exchange,
          base: exchangeData.base || '',
          quote: exchangeData.quote || '',
          ask: exchangeData.ask ?? 0,
          bid: exchangeData.bid ?? 0,
          last: exchangeData.last ?? 0,
          volume: exchangeData.volume ?? 0,
          spread: exchangeData.spread ?? 0,
          spreadPercent: exchangeData.spreadPercent ?? 0,
        });
      });
    });
    return flattened;
  }, [data]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    const filtered = flattenedData.filter(item => 
      item.exchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quote.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [flattenedData, searchTerm, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  if (flattenedData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Market Data Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Waiting for market data stream to connect...
        </p>
      </div>
    );
  }

  const uniqueExchanges = new Set(flattenedData.map(d => d.exchange)).size;
  const uniquePairs = new Set(flattenedData.map(d => d.pair)).size;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 inline-block">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-blue-500">📊</span>
              Public Format Data
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Standard market data format with bid/ask pricing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-semibold border border-blue-200 dark:border-blue-800">
              {flattenedData.length} total
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
              {filteredData.length} filtered
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by exchange, pair, base, or quote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th 
                onClick={() => handleSort('exchange')}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Exchange <SortIcon field="exchange" />
              </th>
              <th 
                onClick={() => handleSort('pair')}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Pair <SortIcon field="pair" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Base
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Quote
              </th>
              <th 
                onClick={() => handleSort('bid')}
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Bid <SortIcon field="bid" />
              </th>
              <th 
                onClick={() => handleSort('ask')}
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Ask <SortIcon field="ask" />
              </th>
              <th 
                onClick={() => handleSort('last')}
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Last <SortIcon field="last" />
              </th>
              <th 
                onClick={() => handleSort('volume')}
                className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Volume <SortIcon field="volume" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Spread
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {currentData.map((item, idx) => (
              <tr key={`${item.exchange}-${item.pair}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-4 text-gray-900 dark:text-white font-semibold capitalize">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {item.exchange}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-900 dark:text-white font-mono font-medium">
                  {item.pair}
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400 font-mono">
                  {item.base}
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400 font-mono">
                  {item.quote}
                </td>
                <td className="px-4 py-4 text-right text-green-600 dark:text-green-400 font-mono font-medium">
                  ${formatNumber(item.bid, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 8 
                  })}
                </td>
                <td className="px-4 py-4 text-right text-red-600 dark:text-red-400 font-mono font-medium">
                  ${formatNumber(item.ask, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 8 
                  })}
                </td>
                <td className="px-4 py-4 text-right text-gray-900 dark:text-white font-mono font-medium">
                  ${formatNumber(item.last, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 8 
                  })}
                </td>
                <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-400 font-mono">
                  {formatNumber(item.volume, { 
                    maximumFractionDigits: 2 
                  })}
                </td>
                <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-400 font-mono text-xs">
                  ${(item.spread ?? 0).toFixed(4)}
                  <span className="text-gray-500 ml-1">
                    ({(item.spreadPercent ?? 0).toFixed(2)}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(endIndex, filteredData.length)}</span> of{' '}
            <span className="font-semibold">{filteredData.length}</span> entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {flattenedData.length}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
              Total Entries
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {uniqueExchanges}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
              Exchanges
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {uniquePairs}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
              Trading Pairs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

