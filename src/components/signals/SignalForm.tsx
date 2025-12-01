import { useState } from 'react';
import type { AiSuggestRequestDto, TradingMode } from '../../types/trading';
import { TRADING_MODE_CONFIG } from '../../types/trading';

interface SignalFormProps {
  onSubmit: (request: AiSuggestRequestDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  initialSymbol?: string;
  initialTimeframe?: string;
  initialMode?: TradingMode;
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
  const [mode, setMode] = useState<TradingMode>(initialMode);
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-[10px] text-slate-600 tracking-widest uppercase">
          Symbol
        </label>
        <select
          value={symbolCode}
          onChange={(e) => setSymbolCode(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/[0.01] border border-white/[0.05] text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
        >
          <optgroup label="Crypto">
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
            <option value="XRPUSDT">XRP/USDT</option>
          </optgroup>
          <optgroup label="Forex">
            <option value="XAUUSD">XAU/USD</option>
            <option value="EURUSD">EUR/USD</option>
            <option value="GBPUSD">GBP/USD</option>
          </optgroup>
        </select>
        {isCrypto && (
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-[#6b9080]"></div>
            <p className="text-[10px] text-[#6b9080] tracking-wide">Live Binance data</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-[10px] text-slate-600 tracking-widest uppercase">
            Timeframe
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/[0.01] border border-white/[0.05] text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
          >
            <option value="M5">5M</option>
            <option value="M15">15M</option>
            <option value="M30">30M</option>
            <option value="H1">1H</option>
            <option value="H4">4H</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] text-slate-600 tracking-widest uppercase">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as TradingMode)}
            className="w-full px-4 py-2.5 bg-white/[0.01] border border-white/[0.05] text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
          >
            <option value="SCALPING">{TRADING_MODE_CONFIG.SCALPING.label} ({TRADING_MODE_CONFIG.SCALPING.candleCount} candles)</option>
            <option value="INTRADAY">{TRADING_MODE_CONFIG.INTRADAY.label} ({TRADING_MODE_CONFIG.INTRADAY.candleCount} candles)</option>
            <option value="SWING">{TRADING_MODE_CONFIG.SWING.label} ({TRADING_MODE_CONFIG.SWING.candleCount} candles)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] text-slate-600 tracking-widest uppercase">
          Max Risk
        </label>
        <input
          type="number"
          value={maxRiskPerTrade}
          onChange={(e) =>
            setMaxRiskPerTrade(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full px-4 py-2.5 bg-white/[0.01] border border-white/[0.05] text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
          placeholder="Optional"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 disabled:bg-white/[0.02] disabled:cursor-not-allowed text-[#9ca8c8] disabled:text-slate-600 text-sm font-medium tracking-wide transition-all border border-[#7c8db5]/20 disabled:border-white/[0.03]"
      >
        {loading ? 'Analyzing...' : 'Generate Signal'}
      </button>

      {error && (
        <div className="p-4 bg-[#a16e7c]/5 border border-[#a16e7c]/10">
          <p className="text-[#a16e7c] text-xs">{error}</p>
        </div>
      )}
    </form>
  );
}
