import { useState } from 'react';
import type { AiSuggestRequestDto } from '../../types/trading';

interface SignalFormProps {
  onSubmit: (request: AiSuggestRequestDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  initialSymbol?: string;
  initialTimeframe?: string;
  initialMode?: string;
}

export function SignalForm({
  onSubmit,
  loading,
  error,
  initialSymbol = 'BTCUSDT',
  initialTimeframe = 'M5',
  initialMode = 'SCALPING',
}: SignalFormProps) {
  const [symbolCode, setSymbolCode] = useState(initialSymbol);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [mode, setMode] = useState(initialMode);
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState<number | ''>('');

  const isCrypto = symbolCode.endsWith('USDT') || symbolCode.endsWith('BTC') || symbolCode.endsWith('ETH');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: AiSuggestRequestDto = {
      symbolCode,
      timeframe,
      mode,
      ...(maxRiskPerTrade !== '' && { maxRiskPerTrade }),
    };

    await onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Symbol Code
        </label>
        <select
          value={symbolCode}
          onChange={(e) => setSymbolCode(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <optgroup label="🪙 Cryptocurrencies (Real-time Binance Data)">
            <option value="BTCUSDT">BTC/USDT - Bitcoin</option>
            <option value="ETHUSDT">ETH/USDT - Ethereum</option>
            <option value="BNBUSDT">BNB/USDT - Binance Coin</option>
            <option value="SOLUSDT">SOL/USDT - Solana</option>
            <option value="XRPUSDT">XRP/USDT - Ripple</option>
          </optgroup>
          <optgroup label="💰 Forex / Commodities (Mock Data)">
            <option value="XAUUSD">XAU/USD - Gold</option>
            <option value="EURUSD">EUR/USD - Euro</option>
            <option value="GBPUSD">GBP/USD - Pound</option>
          </optgroup>
        </select>
        {isCrypto && (
          <p className="text-xs text-emerald-400 mt-1">
            ✓ Real-time data from Binance API
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Timeframe
        </label>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="M5">M5 (5 minutes)</option>
          <option value="M15">M15 (15 minutes)</option>
          <option value="M30">M30 (30 minutes)</option>
          <option value="H1">H1 (1 hour)</option>
          <option value="H4">H4 (4 hours)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="SCALPING">SCALPING</option>
          <option value="INTRADAY">INTRADAY</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Max Risk Per Trade (optional)
        </label>
        <input
          type="number"
          value={maxRiskPerTrade}
          onChange={(e) =>
            setMaxRiskPerTrade(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 100"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
      >
        {loading ? 'Generating...' : 'Generate AI Signal'}
      </button>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-md text-rose-300 text-sm">
          {error}
        </div>
      )}
    </form>
  );
}
