import type {
  AiSignalResponseDto,
  AiSuggestRequestDto,
  SpringPage,
} from '../../types';
import { api } from '../client';
import { API_ROUTES } from '../../config';

/**
 * Generate AI trading signal
 */
export async function generateSignal(
  request: AiSuggestRequestDto
): Promise<AiSignalResponseDto> {
  return api.post<AiSignalResponseDto>(API_ROUTES.SIGNALS.GENERATE, request);
}

/**
 * Get signal history with pagination
 */
export async function getSignals(params: {
  symbolCode: string;
  timeframe: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<SpringPage<AiSignalResponseDto>> {
  const queryParams = new URLSearchParams();
  queryParams.append('symbolCode', params.symbolCode);
  queryParams.append('timeframe', params.timeframe);
  if (params.from) queryParams.append('from', params.from);
  if (params.to) queryParams.append('to', params.to);
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('size', String(params.size ?? 20));

  return api.get<SpringPage<AiSignalResponseDto>>(
    `${API_ROUTES.SIGNALS.LIST}?${queryParams.toString()}`
  );
}

/**
 * Get signal by ID
 */
export async function getSignalById(id: number): Promise<AiSignalResponseDto> {
  return api.get<AiSignalResponseDto>(API_ROUTES.SIGNALS.DETAIL(id));
}
