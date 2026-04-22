import { StreamFrame } from '../types/streaming';

export const sampleStreamFrame: StreamFrame = {
  status: 'ok',
  data: {
    all_exchange_prices: {
      public: {
        huobi: {
          'BTC/USDT': {
            exchange: 'huobi',
            base: 'BTC',
            quote: 'USDT',
            bid: 64000.5,
            ask: 64001.2,
            last: 64000.85,
            volume: 120.5
          }
        }
      },
      coincap: {
        binance: {
          BTC: {
            symbol: 'BTC',
            name: 'Bitcoin',
            price_usd: 64005.1,
            volume_24h_usd: 15000000,
            change_24h: 0.55,
            exchange: 'binance',
            timestamp: '2026-04-21T21:18:43.592Z'
          }
        }
      },
      coingecko: {
        okx: {
          BTC: {
            symbol: 'BTC',
            name: 'bitcoin',
            price_usd: 64002.3,
            global_price_usd: 64003.1,
            volume_24h_usd: 8000000,
            rank: 1,
            exchange: 'okx',
            timestamp: '2026-04-21T21:18:43.592Z'
          }
        }
      }
    },
    opportunities: [
      {
        seg: 'public',
        type: 'direct',
        pair: 'BTC/USDT',
        buy_exchange: 'huobi',
        sell_exchange: 'quidax',
        buy_price: 64000.5,
        sell_price: 64200.1,
        profit: 199.6,
        profit_percentage: 0.31,
        timestamp: '2026-04-21T21:18:43.592Z'
      },
      {
        seg: 'coingecko',
        type: 'triangular',
        symbol: 'ETH',
        buy_exchange: 'okx',
        sell_exchange: 'bybit',
        buy_price: 3450.2,
        sell_price: 3465.8,
        profit: 15.6,
        profit_percentage: 0.45,
        timestamp: '2026-04-21T21:19:10.123Z'
      },
      {
        seg: 'coincap',
        type: 'cross_rate',
        symbol: 'SOL',
        buy_exchange: 'binance',
        sell_exchange: 'kraken',
        buy_price: 145.5,
        sell_price: 147.2,
        profit: 1.7,
        profit_percentage: 1.16,
        timestamp: '2026-04-21T21:20:05.456Z'
      }
    ],
    analyzer_status: 'ok',
    ts: Date.now() / 1000
  }
};
