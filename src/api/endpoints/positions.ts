import type {
  PositionResponseDto,
  OpenPositionRequestDto,
  ClosePositionRequestDto,
  ExecutePositionRequestDto,
  PortfolioStatsDto,
  SpringPage,
  PositionStatus,
} from '../../types';
import { api } from '../client';
import { API_ROUTES } from '../../config';

/**
 * Open new position
 */
export async function openPosition(
  request: OpenPositionRequestDto
): Promise<PositionResponseDto> {
  return api.post<PositionResponseDto>(API_ROUTES.POSITIONS.CREATE, request);
}

/**
 * Execute pending position
 */
export async function executePosition(
  id: number,
  request: ExecutePositionRequestDto
): Promise<PositionResponseDto> {
  return api.put<PositionResponseDto>(API_ROUTES.POSITIONS.EXECUTE(id), request);
}

/**
 * Close open position
 */
export async function closePosition(
  id: number,
  request: ClosePositionRequestDto
): Promise<PositionResponseDto> {
  return api.put<PositionResponseDto>(API_ROUTES.POSITIONS.CLOSE(id), request);
}

/**
 * Cancel pending position
 */
export async function cancelPosition(id: number): Promise<PositionResponseDto> {
  return api.put<PositionResponseDto>(API_ROUTES.POSITIONS.CANCEL(id), {});
}

/**
 * Get position by ID
 */
export async function getPositionById(id: number): Promise<PositionResponseDto> {
  return api.get<PositionResponseDto>(API_ROUTES.POSITIONS.DETAIL(id));
}

/**
 * Get positions with pagination and filtering
 */
export async function getPositions(params: {
  symbolCode?: string;
  status?: PositionStatus;
  page?: number;
  size?: number;
}): Promise<SpringPage<PositionResponseDto>> {
  const queryParams = new URLSearchParams();
  if (params.symbolCode) queryParams.append('symbolCode', params.symbolCode);
  if (params.status) queryParams.append('status', params.status);
  queryParams.append('page', String(params.page ?? 0));
  queryParams.append('size', String(params.size ?? 20));

  return api.get<SpringPage<PositionResponseDto>>(
    `${API_ROUTES.POSITIONS.LIST}?${queryParams.toString()}`
  );
}

/**
 * Get open positions
 */
export async function getOpenPositions(
  userId: string = 'system'
): Promise<PositionResponseDto[]> {
  return api.get<PositionResponseDto[]>(
    `${API_ROUTES.POSITIONS.OPEN}?userId=${userId}`
  );
}

/**
 * Get portfolio statistics
 */
export async function getPortfolioStats(
  userId: string = 'system'
): Promise<PortfolioStatsDto> {
  return api.get<PortfolioStatsDto>(`${API_ROUTES.POSITIONS.STATS}?userId=${userId}`);
}
