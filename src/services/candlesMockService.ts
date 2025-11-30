import type { CandleDto } from '../types/trading';

/**
 * Generates mock candle data for chart visualization.
 * TODO: Replace this with real API call to /api/candles when backend endpoint is ready.
 */
export function generateMockCandles(count: number = 50): CandleDto[] {
  const candles: CandleDto[] = [];
  const basePrice = 2000;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  let currentPrice = basePrice;

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - (count - i - 1) * fiveMinutes).toISOString();
    
    // Generate realistic OHLC data
    const volatility = 0.015; // 1.5% volatility
    const change = (Math.random() - 0.5) * currentPrice * volatility;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * currentPrice * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * currentPrice * volatility * 0.5;
    const volume = 100 + Math.random() * 500;

    candles.push({
      timestamp,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(2)),
    });

    currentPrice = close;
  }

  return candles;
}
