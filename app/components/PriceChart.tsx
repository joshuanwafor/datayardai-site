'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Clock, DollarSign } from 'lucide-react';

interface PriceChartProps {
  pair: string;
  priceHistory: Array<{
    timestamp: number;
    price: number;
    exchange: string;
  }>;
  currentPrice: number;
  previousPrice: number;
}

export function PriceChart({ pair, priceHistory, currentPrice, previousPrice }: PriceChartProps) {
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toExponential(2);
    if (price < 1) return price.toFixed(4);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Generate mock data if no history provided
  const chartData = priceHistory.length > 0 ? priceHistory : Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 60 * 60 * 1000,
    price: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
    exchange: 'mock'
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {pair} Price Chart
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              24-hour price movement
            </p>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono">
                ${formatPrice(currentPrice)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current Price
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              isPositive 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
            }`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">24h Change</div>
            <div className={`text-lg font-semibold font-mono ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}${formatPrice(priceChange)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                className="text-xs text-gray-500 dark:text-gray-400"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={formatPrice}
                className="text-xs text-gray-500 dark:text-gray-400"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                labelFormatter={(value) => formatTime(Number(value))}
                formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{
                  color: '#374151',
                  fontWeight: '500'
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: isPositive ? "#10b981" : "#ef4444",
                  stroke: 'white',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Stats */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h High</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
              ${formatPrice(Math.max(...chartData.map(d => d.price)))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Low</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
              ${formatPrice(Math.min(...chartData.map(d => d.price)))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volume</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              N/A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
