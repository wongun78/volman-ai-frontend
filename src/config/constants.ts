// ==================== Trading Constants ====================

export const SYMBOLS = {
  BTCUSDT: 'BTCUSDT',
  ETHUSDT: 'ETHUSDT',
  BNBUSDT: 'BNBUSDT',
  XRPUSDT: 'XRPUSDT',
  SOLUSDT: 'SOLUSDT',
} as const;

export const TIMEFRAMES = {
  M1: 'M1',
  M5: 'M5',
  M15: 'M15',
  M30: 'M30',
  H1: 'H1',
  H4: 'H4',
  D1: 'D1',
  W1: 'W1',
} as const;

export const TRADING_MODES = {
  SCALPING: 'SCALPING',
  INTRADAY: 'INTRADAY',
  SWING: 'SWING',
} as const;

export const POSITION_STATUSES = {
  PENDING: 'PENDING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
} as const;

export const DIRECTIONS = {
  LONG: 'LONG',
  SHORT: 'SHORT',
  NEUTRAL: 'NEUTRAL',
} as const;

export const EXIT_REASONS = {
  TP1_HIT: 'TP1_HIT',
  TP2_HIT: 'TP2_HIT',
  TP3_HIT: 'TP3_HIT',
  SL_HIT: 'SL_HIT',
  MANUAL_EXIT: 'MANUAL_EXIT',
  TIME_EXIT: 'TIME_EXIT',
  TRAILING_STOP: 'TRAILING_STOP',
  RISK_MANAGEMENT: 'RISK_MANAGEMENT',
} as const;

// ==================== UI Constants ====================

export const COLORS = {
  LONG: '#22c55e',
  SHORT: '#ef4444',
  NEUTRAL: '#64748b',
  
  PRIMARY: '#7c8db5',
  SECONDARY: '#9ca8c8',
  DANGER: '#a16e7c',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  
  BG_PRIMARY: '#12141a',
  BG_SECONDARY: '#1a1d26',
  BG_TERTIARY: '#23262f',
  
  TEXT_PRIMARY: '#e2e8f0',
  TEXT_SECONDARY: '#94a3b8',
  TEXT_MUTED: '#64748b',
  
  BORDER: 'rgba(255, 255, 255, 0.05)',
  BORDER_LIGHT: 'rgba(255, 255, 255, 0.1)',
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ==================== App Constants ====================

export const LOCAL_STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  USER_INFO: 'user_info',
  SETTINGS: 'app_settings',
  THEME: 'theme',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_DEBOUNCE_DELAY = 500;
export const API_TIMEOUT = 30000; // 30 seconds

// ==================== API Routes ====================

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  SIGNALS: {
    LIST: '/api/signals',
    GENERATE: '/api/signals/ai-suggest',
    DETAIL: (id: number) => `/api/signals/${id}`,
  },
  POSITIONS: {
    LIST: '/api/positions',
    CREATE: '/api/positions',
    DETAIL: (id: number) => `/api/positions/${id}`,
    EXECUTE: (id: number) => `/api/positions/${id}/execute`,
    CLOSE: (id: number) => `/api/positions/${id}/close`,
    CANCEL: (id: number) => `/api/positions/${id}/cancel`,
    STATS: '/api/positions/stats',
    OPEN: '/api/positions/open',
  },
  CANDLES: {
    LIST: '/api/admin/candles',
    IMPORT_BINANCE: '/api/admin/candles/import-binance',
    BULK_IMPORT: '/api/admin/candles/bulk-import',
  },
} as const;

// ==================== App Routes ====================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SIGNALS: '/signals',
  POSITIONS: '/positions',
  HISTORY: '/history',
  SETTINGS: '/settings',
  BINANCE_ADMIN: '/binance-admin',
} as const;
