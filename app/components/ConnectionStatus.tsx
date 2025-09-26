'use client';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
  reconnectAttempts: number;
  onReconnect: () => void;
  onStartStream?: () => void;
}

export function ConnectionStatus({ 
  isConnected, 
  error, 
  reconnectAttempts, 
  onReconnect,
  onStartStream
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isConnected ? 'Live' : 'Offline'}
        </span>
      </div>
      
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
          {error}
        </span>
      )}
      
      {reconnectAttempts > 0 && (
        <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
          Reconnecting... ({reconnectAttempts}/5)
        </span>
      )}
      
      <div className="flex gap-2">
        {!isConnected && (
          <button
            onClick={onReconnect}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reconnect
          </button>
        )}
        {isConnected && onStartStream && (
          <button
            onClick={onStartStream}
            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Start Stream
          </button>
        )}
      </div>
    </div>
  );
}
