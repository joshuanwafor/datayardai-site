'use client';

import { io, Socket } from 'socket.io-client';
import { makeObservable, observable, runInAction } from 'mobx';
import { StreamFrame } from '../types/streaming';

class MarketDataState {
  private socket: Socket | null = null;
  public isConnected: boolean = false;
  public error: string | null = null;
  public reconnectAttempts: number = 0;
  public frame: StreamFrame | null = null;
  public socketStatus: "connected" | "connection_error" | "disconnected" = "disconnected";

  constructor() {
    makeObservable(this, {
      isConnected: observable,
      error: observable,
      reconnectAttempts: observable,
      frame: observable,
      socketStatus: observable,
    });
    
    // Only initialize connection on client side
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  connect(): void {
    const SOCKET_URL = process.env.NEXT_PUBLIC_STREAM_URL || "http://157.230.96.29";
    
    console.log('Attempting to connect to:', SOCKET_URL);
    
    this.socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      timeout: 30000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected - updating state');
      runInAction(() => {
        this.socketStatus = "connected";
        this.isConnected = true;
        this.error = null;
        this.reconnectAttempts = 0;
      });
      console.log('Socket.IO connected - state updated:', {
        isConnected: this.isConnected,
        socketStatus: this.socketStatus,
        error: this.error
      });
      
      // Start the trading stream
      console.log('Emitting trading/stream event');
      const payload = {
        task: "start_session",
        data: {
          user_id: "6c2c8c80-06fb-4b1e-bf6a-77c7d79962cb",
          opportunities_limit: 10
        }
      };
      this.socket?.emit('trading/stream', payload);
    });

    this.socket.on('connect_error', (error: unknown) => {
      runInAction(() => {
        this.socketStatus = "connection_error";
        this.isConnected = false;
        this.error = `Connection error: ${error}`;
        this.reconnectAttempts += 1;
      });
      console.error('Socket.IO connection error:', error);
      console.error('Error details:', {
        message: error,
        type: typeof error,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
    });

    this.socket.on('disconnect', (reason: string) => {
      runInAction(() => {
        this.socketStatus = "disconnected";
        this.isConnected = false;
      });
      console.log('Socket.IO disconnected:', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
      runInAction(() => {
        this.socketStatus = "connected";
        this.isConnected = true;
        this.error = null;
        this.reconnectAttempts = 0;
      });
    });

    this.socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log('Socket.IO reconnect attempt:', attemptNumber);
      runInAction(() => {
        this.reconnectAttempts = attemptNumber;
      });
    });

    this.socket.on('reconnect_error', (err: unknown) => {
      console.error('Socket.IO reconnect error:', err);
      runInAction(() => {
        this.error = 'Reconnection failed';
      });
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket.IO reconnection failed');
      runInAction(() => {
        this.error = 'Max reconnection attempts reached';
      });
    });

    // Listen for trading update events
    this.socket.on('trading_update', (data: StreamFrame) => {
      console.log('Received trading_update:', data);
      runInAction(() => {
        this.frame = data;
        // Also ensure connection status is updated when we receive data
        if (!this.isConnected) {
          this.isConnected = true;
          this.socketStatus = "connected";
          this.error = null;
        }
      });
      console.log('Frame updated, isConnected:', this.isConnected);
    });

    // Listen for trading connection status
    this.socket.on('trading_connection_status', (data: unknown) => {
      console.log('Received trading_connection_status:', data);
      // Check if this contains the market data
      if (data && typeof data === 'object' && data !== null && 'data' in data) {
        runInAction(() => {
          this.frame = data as StreamFrame;
          // Also ensure connection status is updated when we receive data
          if (!this.isConnected) {
            this.isConnected = true;
            this.socketStatus = "connected";
            this.error = null;
          }
        });
        console.log('Trading connection status updated, isConnected:', this.isConnected);
      }
    });

    // Debug: Listen for any events to see what's being emitted
    this.socket.onAny((eventName: string, ...args: unknown[]) => {
      console.log('Socket event received:', eventName, args);
      // If it's trading_connection_status, let's see the full structure
      if (eventName === 'trading_connection_status') {
        console.log('Full trading_connection_status data:', JSON.stringify(args, null, 2));
      }
    });

    // Add connection timeout handling
    setTimeout(() => {
      if (!this.isConnected) {
        console.warn('Connection timeout - socket still not connected after 30 seconds');
        runInAction(() => {
          this.error = 'Connection timeout - please check server status';
        });
      }
    }, 30000);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      runInAction(() => {
        this.isConnected = false;
        this.socketStatus = "disconnected";
      });
      console.log('Socket disconnected');
    }
  }

  reconnect(): void {
    this.disconnect();
    this.connect();
  }

  startStream(): void {
    if (this.socket?.connected) {
      console.log('Manually emitting trading/stream event');
      const payload = {
        task: "start_session",
        data: {
          user_id: "6c2c8c80-06fb-4b1e-bf6a-77c7d79962cb",
          opportunities_limit: 10
        }
      };
      this.socket.emit('trading/stream', payload);
    }
  }

  emit(event: string, data?: unknown): void {
    if (this.socket) {
      this.socket.emit(event, data);
      console.log('Event emitted:', event, data);
    } else {
      console.log('No socket connection');
    }
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.log('No socket connection');
    }
  }

  // Manual connection test
  testConnection(): void {
    console.log('Testing connection...');
    if (this.socket) {
      console.log('Socket exists, connected:', this.socket.connected);
      console.log('Socket ID:', this.socket.id);
      console.log('Socket transport:', this.socket.io.engine.transport.name);
    } else {
      console.log('No socket instance');
    }
  }

}

// Create singleton instance
export const marketDataState = new MarketDataState();
