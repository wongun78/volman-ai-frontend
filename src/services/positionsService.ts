import { apiFetch } from './apiClient';
import type {
  PositionResponseDto,
  OpenPositionRequestDto,
  ExecutePositionRequestDto,
  ClosePositionRequestDto,
  PortfolioStatsDto,
  PositionStatus,
} from '../types/trading';

const POSITIONS_BASE = '/api/positions';

/**
 * Open a new position (manual or from AI signal)
 */
export const openPosition = async (
  request: OpenPositionRequestDto
): Promise<PositionResponseDto> => {
  return apiFetch<PositionResponseDto>(POSITIONS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
};

/**
 * Execute a pending position (fill order)
 */
export const executePosition = async (
  positionId: number,
  request: ExecutePositionRequestDto
): Promise<PositionResponseDto> => {
  return apiFetch<PositionResponseDto>(`${POSITIONS_BASE}/${positionId}/execute`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
};

/**
 * Close an open position
 */
export const closePosition = async (
  positionId: number,
  request: ClosePositionRequestDto
): Promise<PositionResponseDto> => {
  return apiFetch<PositionResponseDto>(`${POSITIONS_BASE}/${positionId}/close`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
};

/**
 * Cancel a pending position
 */
export const cancelPosition = async (
  positionId: number
): Promise<PositionResponseDto> => {
  return apiFetch<PositionResponseDto>(`${POSITIONS_BASE}/${positionId}/cancel`, {
    method: 'PUT',
  });
};

/**
 * Get position by ID
 */
export const getPosition = async (
  positionId: number
): Promise<PositionResponseDto> => {
  return apiFetch<PositionResponseDto>(`${POSITIONS_BASE}/${positionId}`);
};

/**
 * List positions with optional filters
 */
export const getPositions = async (params?: {
  symbolCode?: string;
  status?: PositionStatus;
  page?: number;
  size?: number;
}): Promise<{ content: PositionResponseDto[]; totalElements: number }> => {
  const queryParams = new URLSearchParams();
  if (params?.symbolCode) queryParams.set('symbolCode', params.symbolCode);
  if (params?.status) queryParams.set('status', params.status);
  if (params?.page !== undefined) queryParams.set('page', params.page.toString());
  if (params?.size !== undefined) queryParams.set('size', params.size.toString());
  
  const query = queryParams.toString();
  return apiFetch<{ content: PositionResponseDto[]; totalElements: number }>(
    `${POSITIONS_BASE}${query ? `?${query}` : ''}`
  );
};

/**
 * Get all open positions
 */
export const getOpenPositions = async (
  userId = 'SYSTEM'
): Promise<PositionResponseDto[]> => {
  return apiFetch<PositionResponseDto[]>(
    `${POSITIONS_BASE}/open?userId=${userId}`
  );
};

/**
 * Get portfolio statistics
 */
export const getPortfolioStats = async (
  userId = 'SYSTEM'
): Promise<PortfolioStatsDto> => {
  return apiFetch<PortfolioStatsDto>(
    `${POSITIONS_BASE}/stats?userId=${userId}`
  );
};
