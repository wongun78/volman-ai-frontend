import { useState } from 'react';
import toast from 'react-hot-toast';
import { importBinanceCandles } from '../services/binanceAdminService';
import type { BinanceImportResult } from '../types/trading';
import { Card } from '../components/common/Card';

export function BinanceAdminPage() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [timeframe, setTimeframe] = useState('M5');
  const [limit, setLimit] = useState(200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BinanceImportResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await importBinanceCandles({ symbol, timeframe, limit });
      setResult(data);
      
      // Show success toast
      toast.success(
        `Imported ${data.importedCount} candles for ${symbol} (${timeframe}) from Binance.`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed';
      setError(errorMessage);
      
      // Show error toast
      toast.error('Failed to import candles from Binance. Please check the symbol/timeframe and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Data Import</div>
          <h2 className="text-base font-medium text-slate-300">Import Binance Data</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              placeholder="BTCUSDT"
              required
            />
            <p className="text-[10px] text-slate-600 mt-1.5">
              Binance trading pair (e.g. BTCUSDT, ETHUSDT)
            </p>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
            >
              <option value="M5">5M</option>
              <option value="M15">15M</option>
              <option value="M30">30M</option>
              <option value="H1">1H</option>
              <option value="H4">4H</option>
              <option value="D1">1D</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Limit
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              required
            />
            <p className="text-[10px] text-slate-600 mt-1.5">
              Number of candles (max: 1000)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 disabled:bg-white/2 disabled:cursor-not-allowed text-[#9ca8c8] disabled:text-slate-600 text-sm font-medium tracking-wide transition-all border border-[#7c8db5]/20 disabled:border-white/5"
          >
            {loading ? 'Importing...' : 'Import from Binance'}
          </button>

          {error && (
            <div className="p-4 bg-[#a16e7c]/5 border border-[#a16e7c]/10">
              <p className="text-[#a16e7c] text-xs">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-5 bg-[#6b9080]/5 border border-[#6b9080]/10 space-y-3">
              <div className="text-[#6b9080] font-medium text-sm">
                Import Successful
              </div>
              <div className="text-xs text-slate-400 space-y-1.5">
                <div>
                  <span className="text-slate-600">Symbol:</span> {result.symbol}
                </div>
                <div>
                  <span className="text-slate-600">Timeframe:</span> {result.timeframe}
                </div>
                <div>
                  <span className="text-slate-600">Imported:</span>{' '}
                  <span className="text-[#6b9080] font-medium">
                    {result.importedCount} candles
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Source:</span> {result.source}
                </div>
                {result.message && (
                  <div>
                    <span className="text-slate-600">Message:</span> {result.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-4">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Information</div>
          <h2 className="text-base font-medium text-slate-300">Instructions</h2>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p>
            Import real-time candlestick data from Binance public API.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-500 text-xs">
            <li>No API key required (public endpoints)</li>
            <li>Supports all USDT trading pairs</li>
            <li>Data is stored in the database for AI analysis</li>
            <li>Old candles are replaced when importing same symbol/timeframe</li>
            <li>Auto-sync runs every 5 minutes for crypto symbols</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
