# Volman AI Trading System - Price Action Terminal

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)](https://tailwindcss.com/)

A modern, high-performance, Bloomberg-inspired trading terminal built for the **Volman AI Trading System**. This Single Page Application (SPA) serves as the primary visual interface for consuming institutional-grade AI signals and executing the **Bob Volman Price Action** methodology. 

Engineered with severe strictness for performance and type safety, the UI eliminates noise in favor of raw data throughput, ensuring an uninterrupted flow between market visualization and trade execution.

## ✨ Enterprise Capabilities

### 🎨 Bloomberg-Inspired Design System
- **Dark Premium Minimalist:** Exclusively engineered for professional traders. No rounded corners, gradients, or animations. Deep black backgrounds (`#0d0f14`), muted accents, sharp rectangles, and high-contrast typography reduce eye strain.
- **Micro-Typography:** Implementation of letter-spaced tracking (`uppercase tracking-widest`) for critical labels, reminiscent of command-line interfaces and traditional financial readouts.
- **Component Reusability:** Unified styling relying on custom-defined CSS variables (`globals.css` and `variables.css`) powered by utility-first Tailwind classes.

### 📊 Institutional Data Visualization
- **Real-Time Interactive Charting:** Embedded lightweight-charts (TradingView library) engineered to process high-throughput WebSocket streams directly from the Binance API.
- **Multi-Timeframe Correlation:** Seamless toggling between sub-minute scalping (M1, M5) and intraday configurations with persistent state and dynamic sub-components.
- **Volman Guards Interface:** Visual validation of Stop-Loss and Risk-Reward properties (e.g., actionable status rendering, exact risk exposure computations) sourced straight from the backend validation engine.

### 🏗️ Scalable Modern Architecture
- **Strict Folder Conventions:** Barrel exports (`index.ts`) for modularized Contexts, Hooks, Utilities, and Types (`@/types`, `@/hooks`, etc.) keeping imports impossibly clean.
- **Custom React Hooks Lifecycle:** Decentralized state management using `useAuth` (JWT caching), `useWebSocket` (resilient auto-reconnecting connections), and `useDebounce` (rate-limiting aggressive UI inputs).
- **Client-Side Routing Layers:** Protected hierarchical routing via React Router DOM, guaranteeing restricted rendering states.

### 🛡️ End-to-End Type Safety
- **Strict TypeScript Mirroring:** Complete mapping of all backend Enums (`TradingMode`, `Timeframe`, `Direction`) and comprehensive interfaces dictating precise shape contracts for Data Transfer Objects (DTOs).
- **Centralized API Interceptors:** All HTTP traffic runs through a unified generic client, unboxing `ApiResponse` structures and handling global interceptors (like `401 Unauthorized` token wipes or auto-refreshes) seamlessly.

## 🛠️ Technology Stack

- **Framework:** React 19 (Concurrent Features Enabled)
- **Language:** TypeScript 5.9 (Strict Mode)
- **Build Tool:** Vite 7.2.4 (Ultra-fast HMR)
- **Styling:** Tailwind CSS 4.1, Native CSS Variables
- **Charts:** lightweight-charts 4.2.0
- **Routing:** React Router DOM v7.9
- **Linters:** ESLint 9 + TypeScript ESLint 8

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0+
- Custom Engine Backend (trading-ai) running on `http://localhost:8080`

### Installation & Initialization

1. **Install Dependencies:**
   Built to run across ecosystem tools (npm, yarn, pnpm).
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env` and set up the target URLs for the API and WebSocket connections:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_WS_URL=ws://localhost:8080/ws
   ```

3. **Development Build:**
   Leveraging Vite cache, the startup is practically instantaneous.
   ```bash
   npm run dev
   ```
   *Terminal accessible at `http://localhost:5173`.*

4. **Production Build:**
   Optimized static assets with strict TypeScript compilation verification.
   ```bash
   npm run build
   ```

## 📄 License
Designed for Volman price-action analysis validation. Licensed under MIT.
