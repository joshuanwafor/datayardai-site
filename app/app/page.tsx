'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketStream } from '../hooks/useMarketStream';
import { useMarketData } from '../hooks/useMarketData';
import { useMarketAnalytics } from '../hooks/useMarketAnalytics';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { ArbitrageOpportunities } from '../components/ArbitrageOpportunities';
import { CoinCapDataView } from '../components/CoinCapDataView';
import { PublicFormatView } from '../components/PublicFormatView';
import { LogOut } from 'lucide-react';

type TabType = 'regular' | 'coincap' | 'public';

export default function AppPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('public');

  // Check authentication
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const { frame, isConnected, error, reconnectAttempts, reconnect, startStream, testConnection } = useMarketStream();
  const { marketData, coinCapFormatData } = useMarketData(frame?.data.all_exchange_prices || {});
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Market Overview */}
        {/* <MarketOverview {...analytics} topGainers={topGainers} topLosers={topLosers} /> */}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {/* <button
                  onClick={() => setActiveTab('regular')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'regular'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Trading Data
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {marketData.length}
                  </span>
                </button> */}
                <button
                  onClick={() => setActiveTab('coincap')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'coincap'
                    ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  CoinCap Format
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                    {coinCapFormatData.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('public')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'public'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  Public Format
                  <span className="ml-2 px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {marketData.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Regular Trading Data View */}
        {activeTab === 'regular' && (
          <>
            {/* Arbitrage Heatmap */}
            {/* <div className="mb-8">
              <ArbitrageHeatmap opportunities={frame?.data.opportunities || []} />
            </div> */}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Market Ticker */}
              {/* <div className="lg:col-span-2">
                <MarketTicker
                  marketData={marketData}
                  selectedPair={selectedPair}
                  onPairSelect={setSelectedPair}
                />
              </div> */}

              {/* Pair Details */}
              {/* <div className="lg:col-span-1">
                <PairDetails marketData={selectedMarketData} />
              </div> */}
            </div>

            {/* Price Chart for Selected Pair */}
            {/* {selectedMarketData && (
              <div className="mb-8">
                <PriceChart
                  pair={selectedMarketData.pair}
                  priceHistory={[]} // Would need historical data
                  currentPrice={selectedMarketData.midPrice}
                  previousPrice={selectedMarketData.midPrice * 0.98} // Mock previous price
                />
              </div>
            )} */}
          </>
        )}

        {/* CoinCap Format Data View */}
        {activeTab === 'coincap' && (
          <div className="mb-8">
            <CoinCapDataView data={coinCapFormatData} />
          </div>
        )}

        {/* Public Format Data View */}
        {activeTab === 'public' && (
          <div className="mb-8">
            <PublicFormatView data={marketData} />
          </div>
        )}



        {/* Arbitrage Opportunities */}
        <div className="mb-8">
          <ArbitrageOpportunities
            opportunities={frame?.data.opportunities || []}
            maxDisplay={15}
          />
        </div>



        <center className='my-4 md:w-1/2 mx-auto'>
          <ConnectionStatus
            isConnected={isConnected}
            error={error}
            reconnectAttempts={reconnectAttempts}
            onReconnect={reconnect}
            onStartStream={startStream}

          /></center>


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
