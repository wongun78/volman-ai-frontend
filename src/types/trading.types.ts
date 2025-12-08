// ==================== Trading Enums ====================
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

export type PositionStatus = 'PENDING' | 'OPEN' | 'CLOSED' | 'CANCELLED';

export type ExitReason = 
  | 'TP_HIT' 
  | 'SL_HIT' 
  | 'MANUAL_EXIT' 
  | 'TIME_EXIT' 
  | 'TRAILING_STOP' 
  | 'RISK_MANAGEMENT';

export const TRADING_MODE_CONFIG: Record<TradingMode, { candleCount: number; label: string }> = {
  SCALPING: { candleCount: 50, label: 'Scalping' },
  INTRADAY: { candleCount: 100, label: 'Intraday' },
  SWING: { candleCount: 200, label: 'Swing Trading' },
};

// ==================== Signal Types ====================
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
  takeProfit: number | null;
  
  // Risk/Reward ratio
  riskReward: number | null;
  
  // AI reasoning
  reasoning: string | null;
  
  // Computed fields from backend
  actionable: boolean;
  potentialProfit: number | null;
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

// ==================== Position Types ====================
export interface PositionResponseDto {
  id: number;
  signalId: number | null;
  symbolCode: string;
  status: PositionStatus;
  direction: Direction;
  
  // Prices
  plannedEntryPrice: number;
  actualEntryPrice: number | null;
  stopLoss: number;
  takeProfit: number;
  exitPrice: number | null;
  
  // Trade metrics
  quantity: number;
  realizedPnL: number | null;
  realizedPnLPercent: number | null;
  actualRiskReward: number | null;
  exitReason: ExitReason | null;
  
  // Timestamps
  openedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  
  // Audit fields
  createdBy: string;
  lastModifiedBy?: string;
  updatedAt?: string;
  
  // Additional
  fees: number;
  slippage: number | null;
  durationMs: number | null;
  notes: string | null;
}

export interface OpenPositionRequestDto {
  signalId?: number;
  symbolCode: string;
  direction: Direction;
  plannedEntryPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  notes?: string;
}

export interface ClosePositionRequestDto {
  exitPrice: number;
  exitReason: ExitReason;
  fees?: number;
  notes?: string;
}

export interface ExecutePositionRequestDto {
  actualEntryPrice: number;
}

export interface PortfolioStatsDto {
  totalPositions: number;
  openPositions: number;
  closedPositions: number;
  pendingPositions: number;
  totalPnL: number;
  averagePnL: number;
  bestTradePnL: number;
  worstTradePnL: number;
  winRate: number;
  averageRiskReward: number;
  totalFees: number;
  averageTradeDuration: number;
}

// ==================== Market Data Types ====================
export interface CandleDto {
  time: string; // ISO 8601 timestamp from backend
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface BinanceImportResult {
  importedCount: number;
  source: string;
  symbol: string;
  timeframe: string;
  message: string;
  [key: string]: unknown;
}
