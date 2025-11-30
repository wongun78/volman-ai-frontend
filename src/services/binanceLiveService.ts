import type { CandleDto } from '../types/trading';

/**
 * Fetch real-time candles directly from Binance public API (no backend needed)
 */
export async function fetchBinanceLiveCandles(params: {
  symbol: string;
  interval: string; // 5m, 15m, 1h, etc.
  limit: number;
}): Promise<CandleDto[]> {
  const { symbol, interval, limit } = params;
  
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Convert Binance format to CandleDto
  return data.map((kline: any[]) => ({
    time: new Date(kline[0]).toISOString(), // Open time
    open: parseFloat(kline[1]),
    high: parseFloat(kline[2]),
    low: parseFloat(kline[3]),
    close: parseFloat(kline[4]),
  }));
}
