import type { TradingMode } from './trading.types';

// ==================== Settings Types ====================
export interface AppSettings {
  defaultSymbolCode: string;
  defaultTimeframe: string;
  defaultMode: TradingMode;
  backendBaseUrl: string;
}
