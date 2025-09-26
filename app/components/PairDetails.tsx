'use client';

import { MarketData } from '../types/streaming';

interface PairDetailsProps {
  marketData: MarketData | null;
}

export function PairDetails({ marketData }: PairDetailsProps) {
  if (!marketData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Pair Details</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Select a pair to view detailed information
        </p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'N/A';
    if (price < 0.01) return price.toExponential(2);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
  };

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b">
        <h2 className="text-lg font-semibold">Pair Details: {marketData.pair}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {marketData.exchanges.length} exchanges
        </p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Best Bid
            </h3>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 font-mono">
              {formatPrice(marketData.bestBid)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              {marketData.bestBidExchange}
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              Best Ask
            </h3>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 font-mono">
              {formatPrice(marketData.bestAsk)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-300">
              {marketData.bestAskExchange}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
              Mid Price
            </h3>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 font-mono">
              {formatPrice(marketData.midPrice)}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-300">
              Spread: {formatPercent(((marketData.bestAsk - marketData.bestBid) / marketData.midPrice) * 100)}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Exchange
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bid
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ask
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Spread
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Spread %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {marketData.exchanges.map((exchange) => (
                <tr key={exchange.exchange} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {exchange.exchange}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {formatPrice(exchange.bid)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {formatPrice(exchange.ask)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {formatPrice(exchange.last)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {formatPrice(exchange.spread)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {formatPercent(exchange.spreadPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
