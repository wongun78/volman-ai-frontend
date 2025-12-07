# Project Structure Documentation

## 📁 Cấu trúc thư mục chuyên nghiệp

```
src/
├── api/                    # API client & endpoints
│   ├── client.ts          # Base API client với error handling
│   ├── endpoints/         # API endpoints theo domain
│   │   ├── auth.ts       # Authentication APIs
│   │   ├── signals.ts    # AI Signals APIs
│   │   ├── positions.ts  # Trading Positions APIs
│   │   └── candles.ts    # Market Data APIs
│   └── index.ts          # Export tập trung
│
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── ProtectedRoute.tsx
│   │   └── UserProfile.tsx
│   ├── charts/           # Chart components
│   │   └── CandlestickChart.tsx
│   ├── common/           # Shared UI components
│   │   └── DirectionBadge.tsx
│   ├── positions/        # Position components
│   │   └── PositionCard.tsx
│   └── signals/          # Signal components
│       ├── LatestSignalCard.tsx
│       ├── SignalForm.tsx
│       └── SignalHistoryTable.tsx
│
├── config/               # App configuration
│   ├── constants.ts     # Constants (colors, routes, API routes)
│   ├── env.ts          # Environment variables
│   └── index.ts        # Export tập trung
│
├── contexts/            # React contexts
│   ├── AuthContext.tsx # Authentication context
│   └── index.ts        # Export tập trung
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useWebSocket.ts # WebSocket hook with auto-reconnect
│   ├── useLocalStorage.ts # LocalStorage hook
│   ├── useDebounce.ts  # Debounce hook
│   └── index.ts        # Export tập trung
│
├── layout/              # Layout components
│   └── MainLayout.tsx
│
├── pages/               # Page components (routes)
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SignalsPage.tsx
│   ├── PositionsPage.tsx
│   ├── HistoryPage.tsx
│   ├── SettingsPage.tsx
│   └── BinanceAdminPage.tsx
│
├── services/            # Legacy services (tương thích ngược)
│   └── ... (deprecated - sử dụng api/ thay thế)
│
├── styles/              # Global styles
│   ├── variables.css   # CSS variables (colors, spacing, etc.)
│   └── globals.css     # Global styles & utilities
│
├── types/               # TypeScript type definitions
│   ├── common.types.ts     # Common types (ApiResponse, Page)
│   ├── auth.types.ts       # Authentication types
│   ├── trading.types.ts    # Trading types (Signal, Position)
│   ├── settings.types.ts   # Settings types
│   └── index.ts            # Export tập trung
│
├── utils/               # Utility functions
│   ├── formatters.ts   # Number/currency formatting
│   ├── validators.ts   # Input validation
│   ├── date.ts         # Date utilities
│   ├── trading.ts      # Trading calculations
│   ├── helpers.ts      # General helpers
│   └── index.ts        # Export tập trung
│
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## 🎯 Import Patterns

### ✅ Sử dụng barrel exports (khuyến nghị)

```typescript
// Types
import type { User, LoginRequest } from '@/types';

// API
import { authApi, signalsApi, positionsApi } from '@/api';

// Hooks
import { useAuth, useLocalStorage } from '@/hooks';

// Utils
import { formatCurrency, isValidEmail } from '@/utils';

// Config
import { ROUTES, COLORS, API_ROUTES } from '@/config';

// Contexts
import { useAuthContext } from '@/contexts';
```

### 📦 Direct imports (khi cần specific)

```typescript
import { formatCurrency } from '@/utils/formatters';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/endpoints/auth';
```

## 🔧 Sử dụng các modules

### 1. API Calls

```typescript
import { signalsApi, positionsApi } from '@/api';

// Generate signal
const signal = await signalsApi.generateSignal({
  symbolCode: 'BTCUSDT',
  timeframe: 'M5',
  mode: 'SCALPING'
});

// Open position
const position = await positionsApi.openPosition({
  symbolCode: 'BTCUSDT',
  direction: 'LONG',
  plannedEntryPrice: 45000,
  stopLoss: 44000,
  takeProfit1: 46000,
  quantity: 0.01
});
```

### 2. Custom Hooks

```typescript
import { useAuth, useLocalStorage, useWebSocket } from '@/hooks';

function MyComponent() {
  const { user, login, logout } = useAuth();
  const [settings, setSettings] = useLocalStorage('settings', {});
  const { isConnected, sendMessage } = useWebSocket('ws://localhost:8080/ws');
  
  // ...
}
```

### 3. Utils

```typescript
import { 
  formatCurrency, 
  formatPercent, 
  isValidEmail,
  calculateRiskReward 
} from '@/utils';

const formatted = formatCurrency(45000.123, 2); // "45,000.12"
const percent = formatPercent(2.5); // "+2.50%"
const valid = isValidEmail('user@example.com'); // true
const rr = calculateRiskReward(45000, 44000, 46000); // 1.0
```

### 4. Constants

```typescript
import { ROUTES, COLORS, SYMBOLS, API_ROUTES } from '@/config';

// Navigate
navigate(ROUTES.SIGNALS);

// Style
<div style={{ color: COLORS.LONG }}>...</div>

// API call
fetch(`${API_ROUTES.POSITIONS.LIST}`);
```

## 🎨 Styling

### CSS Variables

```css
/* Sử dụng CSS variables từ variables.css */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}
```

### Utility Classes

```tsx
<div className="flex items-center justify-between gap-4 p-4 bg-secondary border rounded">
  <span className="text-primary uppercase">BTCUSDT</span>
  <span className="text-long">+2.5%</span>
</div>
```

## 📝 Best Practices

### 1. **Type Safety**
- Luôn sử dụng TypeScript types
- Import types với `import type { ... }`
- Định nghĩa types mới trong `types/` folder

### 2. **Code Organization**
- Mỗi file chỉ export 1 component/function chính
- Sử dụng barrel exports (`index.ts`) để export tập trung
- Đặt tên file theo PascalCase cho components, camelCase cho utilities

### 3. **API Calls**
- Sử dụng `api/endpoints/` thay vì trực tiếp gọi fetch
- Error handling được xử lý tự động bởi `ApiError`
- Authentication tự động inject qua `Authorization` header

### 4. **State Management**
- Sử dụng React Context cho global state (auth, settings)
- Custom hooks cho logic tái sử dụng
- LocalStorage hook cho persistent data

### 5. **Styling**
- Ưu tiên CSS variables thay vì hardcode colors
- Sử dụng utility classes cho common patterns
- Component-specific styles trong file riêng

## 🔄 Migration Guide

### Từ old structure sang new structure:

```typescript
// ❌ Old way
import { ApiResponse } from '../types/trading';
import { apiFetch } from '../services/apiClient';

// ✅ New way
import type { ApiResponse } from '@/types';
import { api } from '@/api';

// ❌ Old way
import { login } from '../services/authService';

// ✅ New way
import { authApi } from '@/api';
await authApi.login({ username, password });

// ❌ Old way  
import { DIRECTION_METADATA } from '../types/trading';

// ✅ New way
import { DIRECTION_METADATA } from '@/types';
```

## 🚀 Next Steps

1. Migrate existing components to use new API structure
2. Replace old service imports with new API imports
3. Update all type imports to use barrel exports
4. Refactor components to use custom hooks
5. Apply utility classes and CSS variables
