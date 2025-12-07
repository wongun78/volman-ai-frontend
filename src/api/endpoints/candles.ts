import type { CandleDto, BinanceImportResult } from '../../types';
import { api } from '../client';
import { API_ROUTES } from '../../config';

/**
 * Get candles for symbol and timeframe
 */
export async function getCandles(params: {
  symbolCode: string;
  timeframe: string;
  limit?: number;
}): Promise<CandleDto[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('symbolCode', params.symbolCode);
  queryParams.append('timeframe', params.timeframe);
  if (params.limit) queryParams.append('limit', String(params.limit));

  return api.get<CandleDto[]>(`${API_ROUTES.CANDLES.LIST}?${queryParams.toString()}`);
}

/**
 * Import candles from Binance
 */
export async function importFromBinance(params: {
  symbol: string;
  timeframe: string;
  limit?: number;
}): Promise<BinanceImportResult> {
  const queryParams = new URLSearchParams();
  queryParams.append('symbol', params.symbol);
  queryParams.append('timeframe', params.timeframe);
  if (params.limit) queryParams.append('limit', String(params.limit));

  return api.post<BinanceImportResult>(
    `${API_ROUTES.CANDLES.IMPORT_BINANCE}?${queryParams.toString()}`
  );
}

/**
 * Delete candles by symbol and timeframe
 */
export async function deleteCandles(params: {
  symbolCode?: string;
  timeframe?: string;
}): Promise<{ deletedCount: number }> {
  const queryParams = new URLSearchParams();
  if (params.symbolCode) queryParams.append('symbolCode', params.symbolCode);
  if (params.timeframe) queryParams.append('timeframe', params.timeframe);

  return api.delete<{ deletedCount: number }>(
    `${API_ROUTES.CANDLES.LIST}?${queryParams.toString()}`
  );
}
