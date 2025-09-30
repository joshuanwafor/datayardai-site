'use client';

import { useState } from 'react';
import { getAnalyzerStatus, pauseAnalyzer, resumeAnalyzer, type AnalyzerStatusResponse, type AnalyzerInfo } from '../hooks/service';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  reconnectAttempts: number;
  onReconnect: () => void;
  onStartStream?: () => void;
}

interface AnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyzerData: AnalyzerStatusResponse | null;
  isLoading: boolean;
  onPause: () => void;
  onResume: () => void;
  isPausing: boolean;
  isResuming: boolean;
}

function AnalyzerModal({
  isOpen,
  onClose,
  analyzerData,
  isLoading,
  onPause,
  onResume,
  isPausing,
  isResuming
}: AnalyzerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Analyzer Status Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          ) : analyzerData ? (
            <div className="space-y-4">
              {Object.entries(analyzerData.analyzers).map(([name, analyzer]) => (
                <div key={name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                      {name} Analyzer
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${analyzer.status === 'running' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      <span className={`text-sm font-medium ${analyzer.status === 'running'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                        {analyzer.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{analyzer.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Paused:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {analyzer.is_paused ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Running:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {analyzer.analyzer_running ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Streamers:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{analyzer.streamers_count}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onPause}
                  disabled={isPausing || isResuming}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPausing ? 'Pausing...' : 'Pause All Analyzers'}
                </button>
                <button
                  onClick={onResume}
                  disabled={isPausing || isResuming}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResuming ? 'Resuming...' : 'Resume All Analyzers'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No analyzer data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ConnectionStatus({
  isConnected,
  error,
  reconnectAttempts,
  onReconnect,
  onStartStream
}: ConnectionStatusProps) {
  const [analyzerData, setAnalyzerData] = useState<AnalyzerStatusResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  const fetchAnalyzerStatus = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalyzerStatus();
      setAnalyzerData(data);
    } catch (err) {
      console.error('Failed to fetch analyzer status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    setIsPausing(true);
    try {
      await pauseAnalyzer();
      await fetchAnalyzerStatus(); // Refresh status
    } catch (err) {
      console.error('Failed to pause analyzers:', err);
    } finally {
      setIsPausing(false);
    }
  };

  const handleResume = async () => {
    setIsResuming(true);
    try {
      await resumeAnalyzer();
      await fetchAnalyzerStatus(); // Refresh status
    } catch (err) {
      console.error('Failed to resume analyzers:', err);
    } finally {
      setIsResuming(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    if (!analyzerData) {
      fetchAnalyzerStatus();
    }
  };

  // Get overall analyzer status
  const getOverallStatus = () => {
    if (!analyzerData) return 'unknown';
    const analyzers = Object.values(analyzerData.analyzers);
    if (analyzers.every(a => a.status === 'running' && !a.is_paused)) return 'running';
    if (analyzers.every(a => a.status === 'paused' || a.is_paused)) return 'paused';
    return 'mixed';
  };

  const overallStatus = getOverallStatus();

  return (
    <>
      <div className="flex items-center justify-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
        {/*         
        {error && (
          <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
            {error}
          </span>
        )} */}

        {reconnectAttempts > 0 && (
          <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
            Reconnecting... ({reconnectAttempts}/5)
          </span>
        )}

        <div className="flex gap-2">
          {!isConnected && (
            <>
              <button
                onClick={onReconnect}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Reconnect
              </button>
            </>
          )}
          {isConnected && onStartStream && (
            <button
              onClick={onStartStream}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Start Stream
            </button>
          )}

          {/* Analyzer Controls */}
          <button
            onClick={openModal}
            className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Analyzers
          </button>

          {overallStatus === 'running' && (
            <button
              onClick={handlePause}
              disabled={isPausing || isResuming}
              className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
            >
              {isPausing ? 'Pausing...' : 'Pause'}
            </button>
          )}

          {overallStatus === 'paused' && (
            <button
              onClick={handleResume}
              disabled={isPausing || isResuming}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {isResuming ? 'Resuming...' : 'Resume'}
            </button>
          )}
        </div>
      </div>

      <AnalyzerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        analyzerData={analyzerData}
        isLoading={isLoading}
        onPause={handlePause}
        onResume={handleResume}
        isPausing={isPausing}
        isResuming={isResuming}
      />
    </>
  );
}
