'use client';

import { useEffect, useCallback, useState } from 'react';
import { reaction } from 'mobx';
import { marketDataState } from './useMarketDataState';
import { sampleStreamFrame } from '../mocks/sampleStreamFrame';

export function useMarketStream() {
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_STREAM === 'true';
  const [mockFrame] = useState(sampleStreamFrame);

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
    if (isMockMode) {
      return;
    }

    // Only connect on client side
    if (typeof window !== 'undefined') {
      connect();
    }
    
    return () => {
      // Disconnect on unmount
      disconnect();
    };
  }, [connect, disconnect, isMockMode]);

  // Subscribe to MobX state changes
  useEffect(() => {
    if (isMockMode) {
      return;
    }

    const disposer = reaction(
      () => ({
        isConnected: marketDataState.isConnected,
        error: marketDataState.error,
        reconnectAttempts: marketDataState.reconnectAttempts,
        frame: marketDataState.frame,
        socketStatus: marketDataState.socketStatus,
        tradingSessionStatus: marketDataState.tradingSessionStatus,
        tradingResponse: marketDataState.tradingResponse,
        tradingConnectionStatus: marketDataState.tradingConnectionStatus
      }),
      () => {
        // Force re-render when any of these values change
        forceRerender();
      }
    );

    return disposer;
  }, [forceRerender, isMockMode]);

  if (isMockMode) {
    return {
      frame: mockFrame,
      isConnected: true,
      error: null,
      reconnectAttempts: 0,
      tradingSessionStatus: { status: 'mock', message: 'Mock stream mode enabled' },
      tradingResponse: { status: 'mock', message: 'Using local mock stream payload' },
      tradingConnectionStatus: { status: 'connected', message: 'Mock mode' },
      reconnect: () => undefined,
      disconnect: () => undefined,
      startStream: () => undefined,
      testConnection: () => undefined
    };
  }

  return {
    frame: marketDataState.frame,
    isConnected: marketDataState.isConnected,
    error: marketDataState.error,
    reconnectAttempts: marketDataState.reconnectAttempts,
    tradingSessionStatus: marketDataState.tradingSessionStatus,
    tradingResponse: marketDataState.tradingResponse,
    tradingConnectionStatus: marketDataState.tradingConnectionStatus,
    reconnect,
    disconnect,
    startStream,
    testConnection
  };
}
