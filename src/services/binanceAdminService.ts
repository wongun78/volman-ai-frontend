import type { BinanceImportResult } from '../types/trading';
import { apiFetch } from './apiClient';

export async function importBinanceCandles(params: {
  symbol: string;
  timeframe: string;
  limit: number;
}): Promise<BinanceImportResult> {
  const { symbol, timeframe, limit } = params;
  const qs = new URLSearchParams({
    symbol,
    timeframe,
    limit: String(limit),
  });
  return apiFetch<BinanceImportResult>(`/api/admin/candles/import-binance?${qs.toString()}`, {
    method: 'POST',
  });
}
