# Volman AI Frontend - Bob Volman Trading Assistant

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)](https://tailwindcss.com/)

Modern React frontend cho AI Trading System dựa trên phương pháp Bob Volman Price Action. Enterprise-grade với type-safe enums, enhanced error handling, và real-time chart integration.

## 📋 Mục Lục

- [Tính Năng Chính](#-tính-năng-chính)
- [Công Nghệ](#-công-nghệ)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Sử Dụng](#-sử-dụng)
- [Kiến Trúc](#-kiến-trúc)
- [Type Safety](#-type-safety)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Deployment](#-deployment)

## ✨ Tính Năng Chính

### 🎯 AI Trading Signals
- **Real-time Signal Generation**: Request AI trading signals từ backend
- **Multi-mode Support**: SCALPING (50 candles), INTRADAY (100 candles), SWING (200 candles)
- **Volman Guards Integration**: Hiển thị actionable status (✓/✗) từ backend validation
- **Computed Fields**: Risk amount, potential profit tự động tính từ backend

### 📊 Interactive Charts
- **Lightweight Charts**: Sử dụng TradingView's lightweight-charts library
- **Real-time Updates**: Auto-refresh mỗi 1 giây cho M5 charts
- **Binance Live Data**: Direct integration với Binance WebSocket API
- **Multi-timeframe**: M1, M5, M15, M30, H1, H4, D1, W1

### 🛡️ Enterprise-Grade Features
- **Type-safe Enums**: TradingMode, Direction với compile-time validation
- **ApiResponse Wrapper**: Consistent error handling across all endpoints
- **Custom ApiError Class**: User-friendly messages theo error code
- **Computed Fields Display**: Actionable status, risk amount, potential profit

### 🎨 Modern UI/UX
- **Minimalist Design**: Clean, professional trading interface
- **Dark Theme**: Eye-friendly for long trading sessions
- **Responsive Layout**: Desktop-first, mobile-optimized
- **Real-time Notifications**: Toast messages cho success/error states

## 🛠️ Công Nghệ

### Frontend Framework
- **React 19**: Latest stable version với concurrent features
- **TypeScript 5.9**: Strict type safety
- **Vite 7.2.4**: Lightning-fast HMR và build
- **React Router 7.9**: Client-side routing

### UI & Styling
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **Tailwind Vite Plugin**: First-class Vite integration
- **Custom Design System**: Documented in DESIGN_SYSTEM.md

### Charts & Visualization
- **lightweight-charts 4.2.0**: High-performance candlestick charts
- **Custom Chart Wrapper**: TypeScript-safe wrapper around TradingView library

### State & Data
- **React Hot Toast 2.6**: Beautiful toast notifications
- **Native Fetch API**: Type-safe HTTP client với ApiResponse unwrapping
- **LocalStorage**: Settings persistence

### Development Tools
- **ESLint 9**: Code quality enforcement
- **TypeScript ESLint 8**: TypeScript-specific rules
- **Vite Plugin React 5**: Fast Refresh support

## 📦 Yêu Cầu Hệ Thống

### Required
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher (hoặc pnpm/yarn)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Backend Dependency
- **Trading AI Backend**: Must be running on `http://localhost:8080`
- **Backend Version**: Compatible với enterprise-grade backend (commit 19b33b2+)

### System Resources
- **RAM**: Minimum 1GB available
- **Disk**: 500MB for node_modules + build cache

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/wongun78/volman-ai-frontend.git
cd volman-ai-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Tạo file `.env`:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080

# Optional: Development settings
VITE_DEV_MODE=true
```

### 4. Start Development Server

```bash
npm run dev
```

Application sẽ chạy tại `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## ⚙️ Cấu Hình

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:8080  # Backend URL
```

### Application Settings

Settings được lưu trong localStorage:

```typescript
interface AppSettings {
  defaultSymbolCode: string;      // Default: "BTCUSDT"
  defaultTimeframe: string;        // Default: "M5"
  defaultMode: TradingMode;        // Default: "SCALPING"
  backendBaseUrl: string;          // From VITE_API_BASE_URL
}
```

Thay đổi settings qua Settings Page (`/settings`).

## 📖 Sử Dụng

### 1. Generate AI Signal

1. Navigate to **Signals Page** (`/`)
2. Chọn Symbol (BTCUSDT, ETHUSDT, XAUUSD, etc.)
3. Chọn Timeframe (M5, M15, H1, etc.)
4. Chọn Mode:
   - **Scalping (50 candles)**: Quick trades
   - **Intraday (100 candles)**: Day trades
   - **Swing (200 candles)**: Position trades
5. Click **Generate Signal**
6. Xem kết quả:
   - **✓ Actionable**: Safe to trade
   - **✗ Not Ready**: Wait for better setup

### 2. View Signal History

Navigate to **History Page** (`/history`) để xem:
- All previous signals
- Filtered by symbol/timeframe
- Paginated results
- Sortable columns

### 3. Binance Admin (Data Import)

Navigate to **Binance Admin** (`/binance-admin`) để:
- Import candles từ Binance API
- Bulk import historical data
- Manage candle database

### 4. Settings Configuration

Navigate to **Settings Page** (`/settings`) để:
- Set default symbol
- Set default timeframe
- Set default trading mode
- Configure backend URL

## 🏗️ Kiến Trúc

### Project Structure

```
volman-ai-frontend/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── CandlestickChart.tsx    # Lightweight charts wrapper
│   │   ├── common/
│   │   │   └── DirectionBadge.tsx      # ↑ Long, ↓ Short, → Neutral
│   │   └── signals/
│   │       ├── SignalForm.tsx          # AI signal request form
│   │       ├── LatestSignalCard.tsx    # Latest signal display
│   │       └── SignalHistoryTable.tsx  # Signal history table
│   ├── layout/
│   │   └── MainLayout.tsx              # App layout với navigation
│   ├── pages/
│   │   ├── SignalsPage.tsx             # Main signals page
│   │   ├── HistoryPage.tsx             # Signal history
│   │   ├── BinanceAdminPage.tsx        # Binance data import
│   │   └── SettingsPage.tsx            # App settings
│   ├── services/
│   │   ├── apiClient.ts                # ApiResponse unwrapping client
│   │   ├── aiSignalsService.ts         # AI signals API
│   │   ├── binanceAdminService.ts      # Binance admin API
│   │   ├── binanceLiveService.ts       # Binance live data
│   │   ├── candlesService.ts           # Candles API
│   │   └── settingsService.ts          # LocalStorage settings
│   ├── types/
│   │   └── trading.ts                  # TypeScript types & enums
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles
├── DESIGN_SYSTEM.md                    # UI design guidelines
├── FRONTEND_UPGRADE.md                 # Enterprise upgrade docs
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Component Hierarchy

```
App
└── MainLayout
    ├── Header (Navigation)
    └── Router
        ├── SignalsPage
        │   ├── SignalForm
        │   ├── LatestSignalCard
        │   ├── CandlestickChart
        │   └── SignalHistoryTable
        ├── HistoryPage
        │   └── SignalHistoryTable
        ├── BinanceAdminPage
        └── SettingsPage
```

## 🔒 Type Safety

### Type-safe Enums

```typescript
// TradingMode enum
export type TradingMode = 'SCALPING' | 'INTRADAY' | 'SWING';

export const TRADING_MODE_CONFIG: Record<TradingMode, { candleCount: number; label: string }> = {
  SCALPING: { candleCount: 50, label: 'Scalping' },
  INTRADAY: { candleCount: 100, label: 'Intraday' },
  SWING: { candleCount: 200, label: 'Swing Trading' },
};

// Usage
const mode: TradingMode = 'SCALPING';
const config = TRADING_MODE_CONFIG[mode]; // Type-safe!
```

### Direction Metadata

```typescript
export const DIRECTION_METADATA: Record<Direction, DirectionMetadata> = {
  LONG: { action: 'Buy', label: 'Long', arrow: '↑', color: '#22c55e' },
  SHORT: { action: 'Sell', label: 'Short', arrow: '↓', color: '#ef4444' },
  NEUTRAL: { action: 'Hold', label: 'Neutral', arrow: '→', color: '#64748b' },
};
```

### API Response Types

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorDetail | null;
  timestamp: string;
}

export interface AiSignalResponseDto {
  // Core fields
  id: number;
  symbolCode: string;
  direction: Direction;
  mode: TradingMode;
  
  // Price levels
  entryPrice: number | null;
  stopLoss: number | null;
  
  // Computed fields from backend
  actionable: boolean;
  potentialProfitTp1: number | null;
  riskAmount: number | null;
}
```

## 🚨 Error Handling

### ApiError Class

```typescript
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  getUserMessage(): string {
    switch (this.code) {
      case 'SYMBOL_NOT_FOUND':
        return 'The requested symbol was not found.';
      case 'INVALID_SIGNAL':
        return 'Invalid trading signal detected.';
      case 'MARKET_DATA_ERROR':
        return 'Unable to fetch market data.';
      case 'AI_SERVICE_ERROR':
        return 'AI service is temporarily unavailable.';
      default:
        return this.message;
    }
  }

  isRetryable(): boolean {
    return this.status >= 500 || 
           this.code === 'MARKET_DATA_ERROR' || 
           this.code === 'AI_SERVICE_ERROR';
  }
}
```

### Usage in Components

```typescript
try {
  const signal = await requestAiSignal(request);
  toast.success(`Signal generated: ${signal.direction}`);
} catch (err) {
  if (err instanceof ApiError) {
    toast.error(err.getUserMessage());
    
    if (err.isRetryable()) {
      // Show retry option
    }
  }
}
```

## 🧪 Testing

### Run TypeScript Check

```bash
npx tsc -b
```

### Run Linter

```bash
npm run lint
```

### Build Test

```bash
npm run build
```

Expected output: `✓ built in XXXms`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://backend:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

**Build & Run:**

```bash
docker build -t volman-ai-frontend .
docker run -p 80:80 volman-ai-frontend
```

## 📝 Development Guide

### Code Style

- **Functional Components**: Use hooks, không dùng class components
- **TypeScript Strict**: Không dùng `any`, luôn type explicitly
- **Tailwind Classes**: Sử dụng utility classes, tránh custom CSS
- **Component Size**: Giữ components nhỏ (< 200 lines)

### Naming Conventions

- **Components**: PascalCase (e.g., `SignalForm.tsx`)
- **Services**: camelCase (e.g., `apiClient.ts`)
- **Types**: PascalCase interfaces (e.g., `AiSignalResponseDto`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TRADING_MODE_CONFIG`)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit with meaningful message
git commit -m "feat: Add new feature description"

# Push và create PR
git push origin feature/new-feature
```

## 🔗 Related Documentation

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI/UX design guidelines
- [FRONTEND_UPGRADE.md](./FRONTEND_UPGRADE.md) - Enterprise upgrade details
- [Backend README](../trading-ai/README.md) - Backend documentation

## 📞 Contact

**Repository**: [volman-ai-frontend](https://github.com/wongun78/volman-ai-frontend)  
**Backend**: [trading-ai](https://github.com/wongun78/trading-ai)  
**Issues**: [GitHub Issues](https://github.com/wongun78/volman-ai-frontend/issues)

---

**Built with React 19 + TypeScript 5 + Vite 7 + Tailwind CSS 4**

## 🎓 Key Features Explained

### ApiResponse Auto-unwrapping

Backend trả về ApiResponse wrapper, frontend tự động unwrap:

```typescript
// Backend response
{
  "success": true,
  "data": { "id": 1, "direction": "LONG", ... },
  "error": null,
  "timestamp": "2025-12-01T10:00:00Z"
}

// Frontend receives (auto-unwrapped by apiFetch)
const signal: AiSignalResponseDto = await requestAiSignal(request);
// signal = { "id": 1, "direction": "LONG", ... }
```

### Computed Fields

Backend tính toán, frontend chỉ hiển thị:

```typescript
// Backend computed fields
signal.actionable = (direction !== 'NEUTRAL' && 
                     entryPrice && stopLoss && 
                     riskReward1 >= 1.0);

signal.riskAmount = Math.abs(entryPrice - stopLoss);
signal.potentialProfitTp1 = Math.abs(takeProfit1 - entryPrice);

// Frontend displays
<div>
  Status: {signal.actionable ? '✓ Actionable' : '✗ Not Ready'}
  Risk: {signal.riskAmount}
  Profit: {signal.potentialProfitTp1}
</div>
```

### Real-time Chart Updates

```typescript
// Auto-refresh every 1 second
useEffect(() => {
  const intervalId = setInterval(() => {
    loadCandles(); // Fetch from Binance live API
  }, 1000);
  
  return () => clearInterval(intervalId);
}, []);
```

## 🔄 Changelog

### v2.0.0 - Enterprise Upgrade (2025-12-01)
- ✅ Added ApiResponse<T> wrapper với auto-unwrapping
- ✅ Type-safe TradingMode enum (SCALPING/INTRADAY/SWING)
- ✅ Direction metadata với arrow indicators (↑↓→)
- ✅ ApiError class với getUserMessage() và isRetryable()
- ✅ Computed fields display (actionable, riskAmount, potentialProfitTp1)
- ✅ Enhanced error handling theo error codes
- ✅ SignalHistoryTable: Added Mode, R:R, Status columns
- ✅ FRONTEND_UPGRADE.md documentation

### v1.0.0 - Initial Release
- ✅ React 19 + TypeScript 5 + Vite 7
- ✅ Tailwind CSS 4 design system
- ✅ Lightweight charts integration
- ✅ Binance live data support
- ✅ AI signal generation
- ✅ Signal history tracking

## ⚠️ Troubleshooting

### Backend Connection Error

```
Error: Failed to fetch
```

**Solution**: Kiểm tra backend đang chạy tại `http://localhost:8080`

```bash
# Test backend health
curl http://localhost:8080/actuator/health
```

### TypeScript Errors

```
error TS2322: Type 'string' is not assignable to type 'TradingMode'
```

**Solution**: Use type assertion:

```typescript
const mode = formValue as TradingMode;
```

### Build Errors

```
npm ERR! code ELIFECYCLE
```

**Solution**: Clear cache và reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Learning Resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)

---

**⚠️ Disclaimer**: This is an educational project. Trading carries risk. Not financial advice.
