import { AiSignalResponseDto, AiSuggestRequestDto, SpringPage } from '../types/trading';
import { apiFetch } from './apiClient';

export async function requestAiSignal(body: AiSuggestRequestDto): Promise<AiSignalResponseDto> {
  return apiFetch<AiSignalResponseDto>('/api/signals/ai-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function fetchSignalHistory(params: {
  symbolCode: string;
  timeframe: string;
  page?: number;
  size?: number;
}): Promise<SpringPage<AiSignalResponseDto>> {
  const { symbolCode, timeframe, page = 0, size = 20 } = params;
  const query = new URLSearchParams({
    symbolCode,
    timeframe,
    page: String(page),
    size: String(size),
  });
  return apiFetch<SpringPage<AiSignalResponseDto>>(`/api/signals?${query.toString()}`);
}
