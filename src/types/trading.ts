export type Direction = 'LONG' | 'SHORT' | 'NEUTRAL';

export interface AiSignalResponseDto {
  id: number;
  createdAt: string;
  symbolCode: string;
  timeframe: string;
  mode?: string;
  direction: Direction;
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit1: number | null;
  takeProfit2: number | null;
  takeProfit3: number | null;
  riskReward1: number | null;
  riskReward2: number | null;
  riskReward3: number | null;
  reasoning: string | null;
}

export interface AiSuggestRequestDto {
  symbolCode: string;
  timeframe: string;
  mode: string;
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
  defaultMode: string;
  backendBaseUrl: string;
}

export interface CandleDto {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}
