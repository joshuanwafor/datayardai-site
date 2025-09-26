## Streaming Data: Schema and Integration Guide

This document describes the realtime data frames your app receives over a WebSocket and how to consume them to build tickers, arbitrage monitors, and alerts.

### Overview

- **Transport**: Socket.IO (server base available at `http://157.230.96.29`).
- **Message shape**: Each message is a JSON "snapshot" with consolidated prices across multiple exchanges and a computed list of arbitrage opportunities.
- **Top-level keys**:
  - `status` (string): e.g., `"ok"`.
  - `data` (object): payload container.

### Data schema

```json
{
  "status": "ok",
  "data": {
    "all_exchange_prices": {
      "<exchange>": {
        "<PAIR>": {
          "exchange": "<exchange>",
          "base": "<baseSymbol>",
          "quote": "<quoteSymbol>",
          "bid": <number>,
          "ask": <number>,
          "last": <number>,
          "volume": <number>
        }
        // ... more pairs for the exchange ...
      }
      // ... more exchanges ...
    },
    "opportunities": [
      {
        "type": "direct",
        "pair": "<PAIR>",
        "buy_exchange": "<exchange>",
        "sell_exchange": "<exchange>",
        "buy_price": <number>,
        "sell_price": <number>,
        "profit": <number>,
        "profit_percentage": <number>,
        "timestamp": "<ISO8601>",
        "db_created_at": "<ISO8601>"
      }
      // ... more opportunities ...
    ],
    "analyzer_status": "unknown" | "ok" | "degraded",
    "ts": <number>
  }
}
```

Notes:
- `all_exchange_prices` organizes quotes by `exchange` and then by `PAIR` (e.g., `BTCUSDT`, `ETHNGN`).
- Inner `base` and `quote` strings may be exchange-specific abbreviations; prefer the map key `PAIR` as the canonical identifier.
- Some markets may report `0` for `bid/ask/last` if temporarily unavailable; treat `0` as missing.
- Fiat/stable pairs appear across currencies (e.g., `NGN`, `GHS`, `KES`, `USD`, `USDT`).
- `ts` is a server-side tick timestamp (floating seconds). `timestamp` fields in `opportunities` are ISO 8601.

### What you can derive from the stream

- Cross-exchange best bid/ask and mid-prices per pair.
- Per-exchange spread: `ask - bid`, and percent spread: `(ask - bid) / mid`.
- Live arbitrage candidates (`opportunities`) with gross `profit` and `profit_percentage`.
- Price parity across fiat/stable quotes (e.g., `USDTNGN` vs `USDNGN`).
- Realtime price widgets, market heatmaps, and alerts (e.g., spread > threshold).

### Example: minimal client (TypeScript/React)

```ts
import { io, Socket } from 'socket.io-client';

// Replace with your actual Socket.IO URL
const SOCKET_URL = process.env.NEXT_PUBLIC_STREAM_URL || "http://<YOUR_SOCKET_URL>";

type Quote = {
  exchange: string;
  base: string;
  quote: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
};

type Opportunity = {
  type: "direct";
  pair: string;
  buy_exchange: string;
  sell_exchange: string;
  buy_price: number;
  sell_price: number;
  profit: number;
  profit_percentage: number;
  timestamp: string; // ISO
  db_created_at: string; // ISO
};

type StreamFrame = {
  status: string;
  data: {
    all_exchange_prices: Record<string, Record<string, Quote>>;
    opportunities: Opportunity[];
    analyzer_status?: string;
    ts?: number;
  };
};

export function useMarketStream() {
  const [frame, setFrame] = React.useState<StreamFrame | null>(null);

  React.useEffect(() => {
    const socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    // Start the trading stream
    const payload = {
      task: "start_session",
      data: {
        user_id: "6c2c8c80-06fb-4b1e-bf6a-77c7d79962cb",
        opportunities_limit: 10
      }
    };
    socket.emit('trading/stream', payload);

    // Listen for trading update events
    socket.on('trading_update', (data: StreamFrame) => {
      setFrame(data);
    });

    return () => socket.disconnect();
  }, []);

  return frame;
}
```

### Rendering ideas

- Ticker table grouped by `exchange`, rows by `PAIR` showing bid/ask/last and spread.
- Aggregated view per `PAIR` across exchanges: best bid, best ask, and computed mid.
- Opportunities list ordered by `profit_percentage` with filter by `PAIR`.

### Implementation guidance

- Prefer the `PAIR` map key for symbol identity. Use `exchange` for scoping.
- Treat `bid/ask/last == 0` as missing; exclude from best-bid/ask calculations.
- For noisy streams, debounce UI updates (e.g., 250–500 ms) to reduce rerenders.
- Persist frames or deltas into time-series storage for charts/backtesting.
- Alerting: compare best cross-exchange `ask` vs `bid` and/or use `opportunities` list.

### Example frame (abridged)

```json
{
  "status": "ok",
  "data": {
    "all_exchange_prices": {
      "quidax": {
        "BTCUSDT": { "exchange": "quidax", "base": "BTCU", "quote": "SDT", "bid": 109430.54, "ask": 109467.57, "last": 109444.13, "volume": 0 }
      },
      "busha": {
        "USDTNGN": { "exchange": "busha", "base": "USDT", "quote": "NGN", "bid": 1496.82, "ask": 1480.41, "last": 1496.82, "volume": 0 }
      }
    },
    "opportunities": [
      {
        "type": "direct",
        "pair": "AAVEUSDT",
        "buy_exchange": "quidax",
        "sell_exchange": "huobi",
        "buy_price": 262.3186,
        "sell_price": 262.6795,
        "profit": 0.3609,
        "profit_percentage": 0.13758,
        "timestamp": "2025-09-26T08:16:33.123466+00:00",
        "db_created_at": "2025-09-26T08:16:33.127157+00:00"
      }
    ],
    "analyzer_status": "unknown",
    "ts": 307865.602
  }
}
```

### Session Start Payload

To start receiving market data, emit the `trading/stream` event with the following payload:

```json
{
  "task": "start_session",
  "data": {
    "user_id": "6c2c8c80-06fb-4b1e-bf6a-77c7d79962cb",
    "opportunities_limit": 10
  }
}
```

- `user_id`: Unique identifier for the session
- `opportunities_limit`: Maximum number of arbitrage opportunities to return

### Known server endpoint

- Server base responds with "Welcome to Streaming API!": `http://157.230.96.29`


