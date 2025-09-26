'use client';

import { MarketData } from '../types/streaming';

interface MarketTickerProps {
  marketData: MarketData[];
  selectedPair?: string;
  onPairSelect?: (pair: string) => void;
}

export function MarketTicker({ marketData, selectedPair, onPairSelect }: MarketTickerProps) {
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
        <h2 className="text-lg font-semibold">Market Ticker</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {marketData.length} pairs across exchanges
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pair
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Best Bid
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Best Ask
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mid Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Spread
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Exchanges
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {marketData.map((market) => {
              const spread = market.bestAsk - market.bestBid;
              const spreadPercent = market.midPrice > 0 ? (spread / market.midPrice) * 100 : 0;
              const isSelected = selectedPair === market.pair;
              
              return (
                <tr 
                  key={market.pair}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => onPairSelect?.(market.pair)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {market.pair}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    <div>
                      <div className="font-mono">{formatPrice(market.bestBid)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {market.bestBidExchange}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    <div>
                      <div className="font-mono">{formatPrice(market.bestAsk)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {market.bestAskExchange}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                    {formatPrice(market.midPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-mono text-gray-900 dark:text-gray-100">
                        {formatPrice(spread)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPercent(spreadPercent)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {market.exchanges.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
