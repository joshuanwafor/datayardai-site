'use client';

import { useEffect, useCallback } from 'react';
import { marketDataState } from './useMarketDataState';

export function useMarketStream() {

  const connect = useCallback(() => {
    marketDataState.connect();
  }, []);

  const disconnect = useCallback(() => {
    marketDataState.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    marketDataState.reconnect();
  }, []);

  const startStream = useCallback(() => {
    marketDataState.startStream();
  }, []);

  useEffect(() => {
    // Only connect on client side
    if (typeof window !== 'undefined') {
      connect();
    }
    
    return () => {
      // Disconnect on unmount
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    frame: marketDataState.frame,
    isConnected: marketDataState.isConnected,
    error: marketDataState.error,
    reconnectAttempts: marketDataState.reconnectAttempts,
    reconnect,
    disconnect,
    startStream
  };
}
