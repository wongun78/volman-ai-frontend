// ==================== API Response Wrapper ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorDetail | null;
  timestamp: string;
}

export interface ErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ==================== Enums ====================
export type Direction = 'LONG' | 'SHORT' | 'NEUTRAL';

export interface DirectionMetadata {
  action: string;
  label: string;
  arrow: string;
  color: string;
}

export const DIRECTION_METADATA: Record<Direction, DirectionMetadata> = {
  LONG: { action: 'Buy', label: 'Long', arrow: '↑', color: '#22c55e' },
  SHORT: { action: 'Sell', label: 'Short', arrow: '↓', color: '#ef4444' },
  NEUTRAL: { action: 'Hold', label: 'Neutral', arrow: '→', color: '#64748b' },
};

export type TradingMode = 'SCALPING' | 'INTRADAY' | 'SWING';

export const TRADING_MODE_CONFIG: Record<TradingMode, { candleCount: number; label: string }> = {
  SCALPING: { candleCount: 50, label: 'Scalping' },
  INTRADAY: { candleCount: 100, label: 'Intraday' },
  SWING: { candleCount: 200, label: 'Swing Trading' },
};

// ==================== DTOs ====================
export interface AiSignalResponseDto {
  // Core fields
  id: number;
  createdAt: string;
  symbolCode: string;
  timeframe: string;
  mode: TradingMode;
  direction: Direction;
  
  // Price levels
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit1: number | null;
  takeProfit2: number | null;
  takeProfit3: number | null;
  
  // Risk/Reward ratios
  riskReward1: number | null;
  riskReward2: number | null;
  riskReward3: number | null;
  
  // AI reasoning
  reasoning: string | null;
  
  // Computed fields from backend
  actionable: boolean;
  potentialProfitTp1: number | null;
  riskAmount: number | null;
  
  // Audit fields
  createdBy?: string;
  lastModifiedAt?: string;
  lastModifiedBy?: string;
  version?: number;
}

export interface AiSuggestRequestDto {
  symbolCode: string;
  timeframe: string;
  mode: TradingMode;
  candleCount?: number;
  maxRiskPerTrade?: number;
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface BinanceImportResult {
  importedCount: number;
  source: string;
  symbol: string;
  timeframe: string;
  message: string;
  [key: string]: unknown;
}

export interface AppSettings {
  defaultSymbolCode: string;
  defaultTimeframe: string;
  defaultMode: TradingMode;
  backendBaseUrl: string;
}

export interface CandleDto {
  time: string; // ISO 8601 timestamp from backend
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number; // Optional volume data
}
