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
    <div className="flex items-center gap-2 p-3 rounded-lg border">
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm font-medium">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
      {error && (
        <span className="text-sm text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
      {reconnectAttempts > 0 && (
        <span className="text-sm text-yellow-600 dark:text-yellow-400">
          Reconnecting... ({reconnectAttempts}/5)
        </span>
      )}
      {!isConnected && (
        <button
          onClick={onReconnect}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reconnect
        </button>
      )}
      {isConnected && onStartStream && (
        <button
          onClick={onStartStream}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start Stream
        </button>
      )}
    </div>
  );
}
