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
  const [selectedPair, setSelectedPair] = useState<string | undefined>();

  const selectedMarketData = selectedPair 
    ? marketData.find(m => m.pair === selectedPair) ?? null
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crypto Market Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time market data and arbitrage opportunities across exchanges
          </p>
          <div className="mt-4">
            <ConnectionStatus
              isConnected={isConnected}
              error={error}
              reconnectAttempts={reconnectAttempts}
              onReconnect={reconnect}
              onStartStream={startStream}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="lg:col-span-1">
            <MarketTicker
              marketData={marketData}
              selectedPair={selectedPair}
              onPairSelect={setSelectedPair}
            />
          </div>
          <div className="lg:col-span-1">
            <PairDetails marketData={selectedMarketData} />
          </div>
        </div>

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
