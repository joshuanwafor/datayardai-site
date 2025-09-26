'use client';

import { useEffect, useCallback, useState } from 'react';
import { reaction } from 'mobx';
import { marketDataState } from './useMarketDataState';

export function useMarketStream() {
  // Force re-renders when MobX state changes
  const [, forceUpdate] = useState({});
  const forceRerender = useCallback(() => forceUpdate({}), []);

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

  const testConnection = useCallback(() => {
    marketDataState.testConnection();
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

  // Subscribe to MobX state changes
  useEffect(() => {
    const disposer = reaction(
      () => ({
        isConnected: marketDataState.isConnected,
        error: marketDataState.error,
        reconnectAttempts: marketDataState.reconnectAttempts,
        frame: marketDataState.frame,
        socketStatus: marketDataState.socketStatus
      }),
      () => {
        // Force re-render when any of these values change
        forceRerender();
      }
    );

    return disposer;
  }, [forceRerender]);

  return {
    frame: marketDataState.frame,
    isConnected: marketDataState.isConnected,
    error: marketDataState.error,
    reconnectAttempts: marketDataState.reconnectAttempts,
    reconnect,
    disconnect,
    startStream,
    testConnection
  };
}
