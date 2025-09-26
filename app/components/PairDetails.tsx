'use client';

import { MarketData } from '../types/streaming';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';

interface PairDetailsProps {
  marketData: MarketData | null;
}

export function PairDetails({ marketData }: PairDetailsProps) {
  if (!marketData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Pair Details
          </h2>
        </div>
        <div className="p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <BarChart3 className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No pair selected
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Select a trading pair from the ticker to view detailed information
          </div>
        </div>
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

  const spread = marketData.bestAsk - marketData.bestBid;
  const spreadPercent = marketData.midPrice > 0 ? (spread / marketData.midPrice) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {marketData.pair} Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {marketData.exchanges.length} exchanges • Spread: {formatPercent(spreadPercent)}
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Best Bid
              </h3>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 font-mono">
              ${formatPrice(marketData.bestBid)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {marketData.bestBidExchange}
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Best Ask
              </h3>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 font-mono">
              ${formatPrice(marketData.bestAsk)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-300 mt-1">
              {marketData.bestAskExchange}
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Mid Price
              </h3>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 font-mono">
              ${formatPrice(marketData.midPrice)}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-300 mt-1">
              Spread: {formatPercent(spreadPercent)}
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Details */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Exchange Comparison
          </h3>
        </div>
        
        <div className="space-y-3">
          {marketData.exchanges.map((exchange, index) => (
            <div key={exchange.exchange} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {exchange.exchange}
                    </h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Spread: {formatPercent(exchange.spreadPercent)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${formatPrice(exchange.last)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last Price
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid</div>
                  <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    ${formatPrice(exchange.bid)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ask</div>
                  <div className="text-sm font-mono text-green-600 dark:text-green-400">
                    ${formatPrice(exchange.ask)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spread</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    ${formatPrice(exchange.spread)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
