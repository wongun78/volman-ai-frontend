// ==================== Environment Configuration ====================

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080/ws',
  ENV_MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// ==================== Feature Flags ====================

export const FEATURES = {
  ENABLE_WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET === 'true',
  ENABLE_ADVANCED_CHARTS: import.meta.env.VITE_ENABLE_ADVANCED_CHARTS !== 'false',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
} as const;

// ==================== App Configuration ====================

export const APP_CONFIG = {
  name: 'Volman AI Trading',
  version: '1.0.0',
  description: 'AI-powered trading platform based on Bob Volman price action',
  defaultSymbol: 'BTCUSDT',
  defaultTimeframe: 'M5',
  defaultMode: 'SCALPING' as const,
} as const;
