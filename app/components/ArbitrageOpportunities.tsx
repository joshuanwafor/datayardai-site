'use client';

import { Opportunity } from '../types/streaming';

interface ArbitrageOpportunitiesProps {
  opportunities: Opportunity[];
  maxDisplay?: number;
}

export function ArbitrageOpportunities({ opportunities, maxDisplay = 10 }: ArbitrageOpportunitiesProps) {
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
    return new Date(timestamp).toLocaleTimeString();
  };

  const sortedOpportunities = opportunities
    .sort((a, b) => b.profit_percentage - a.profit_percentage)
    .slice(0, maxDisplay);

  if (opportunities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Arbitrage Opportunities</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No arbitrage opportunities found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b">
        <h2 className="text-lg font-semibold">Arbitrage Opportunities</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {opportunities.length} opportunities found
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
                Buy @
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sell @
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                %
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedOpportunities.map((opp, index) => (
              <tr key={`${opp.pair}-${opp.timestamp}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {opp.pair}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <div>
                    <div className="font-mono">{formatPrice(opp.buy_price)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {opp.buy_exchange}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  <div>
                    <div className="font-mono">{formatPrice(opp.sell_price)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {opp.sell_exchange}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {formatProfit(opp.profit)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    opp.profit_percentage > 1 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : opp.profit_percentage > 0.5
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {opp.profit_percentage.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(opp.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
