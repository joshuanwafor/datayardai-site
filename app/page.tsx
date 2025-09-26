'use client';

import { useState } from 'react';
import { useMarketStream } from './hooks/useMarketStream';
import { useMarketData } from './hooks/useMarketData';
import { useMarketAnalytics } from './hooks/useMarketAnalytics';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MarketTicker } from './components/MarketTicker';
import { ArbitrageOpportunities } from './components/ArbitrageOpportunities';
import { PairDetails } from './components/PairDetails';
import { MarketOverview } from './components/MarketOverview';
import { ArbitrageHeatmap } from './components/ArbitrageHeatmap';
import { PriceChart } from './components/PriceChart';

export default function Home() {
  const { frame, isConnected, error, reconnectAttempts, reconnect, startStream } = useMarketStream();
  const marketData = useMarketData(frame?.data.all_exchange_prices || {});
  const analytics = useMarketAnalytics(marketData, frame?.data.opportunities || []);
  const [selectedPair, setSelectedPair] = useState<string | undefined>();

  const selectedMarketData = selectedPair 
    ? marketData.find(m => m.pair === selectedPair) ?? null
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Crypto Market Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time market data and arbitrage opportunities across exchanges
              </p>
            </div>
            <ConnectionStatus
              isConnected={isConnected}
              error={error}
              reconnectAttempts={reconnectAttempts}
              onReconnect={reconnect}
              onStartStream={startStream}
            />
          </div>
        </header>

        {/* Market Overview */}
        <MarketOverview {...analytics} />

        {/* Arbitrage Heatmap */}
        <div className="mb-8">
          <ArbitrageHeatmap opportunities={frame?.data.opportunities || []} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Market Ticker */}
          <div className="lg:col-span-2">
            <MarketTicker
              marketData={marketData}
              selectedPair={selectedPair}
              onPairSelect={setSelectedPair}
            />
          </div>
          
          {/* Pair Details */}
          <div className="lg:col-span-1">
            <PairDetails marketData={selectedMarketData} />
          </div>
        </div>

        {/* Price Chart for Selected Pair */}
        {selectedMarketData && (
          <div className="mb-8">
            <PriceChart
              pair={selectedMarketData.pair}
              priceHistory={[]} // Would need historical data
              currentPrice={selectedMarketData.midPrice}
              previousPrice={selectedMarketData.midPrice * 0.98} // Mock previous price
            />
          </div>
        )}

        {/* Arbitrage Opportunities */}
        <div className="mb-8">
          <ArbitrageOpportunities
            opportunities={frame?.data.opportunities || []}
            maxDisplay={15}
          />
        </div>

        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            Data provided by Socket.IO API at{' '}
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_STREAM_URL || 'http://157.230.96.29'}
            </code>
          </p>
          <p className="mt-2">
            Last update: {frame?.data.ts ? new Date(frame.data.ts * 1000).toLocaleTimeString() : 'N/A'}
          </p>
        </footer>
      </div>
    </div>
  );
}
