import type { CandleDto } from '../types/trading';
import { apiFetch } from './apiClient';

export async function fetchCandles(params: {
  symbolCode: string;
  timeframe: string;
  limit?: number;
}): Promise<CandleDto[]> {
  const queryParams = new URLSearchParams({
    symbolCode: params.symbolCode,
    timeframe: params.timeframe,
    limit: (params.limit || 200).toString(),
  });

  return apiFetch<CandleDto[]>(`/api/admin/candles?${queryParams}`);
}
