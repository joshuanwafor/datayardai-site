'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pair}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(currentPrice)}
            </span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
              isPositive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">24h Change</div>
          <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatPrice(priceChange)}
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              className="text-xs"
            />
            <YAxis 
              tickFormatter={formatPrice}
              className="text-xs"
            />
            <Tooltip 
              labelFormatter={(value) => formatTime(Number(value))}
              formatter={(value: number) => [formatPrice(value), 'Price']}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--foreground)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
