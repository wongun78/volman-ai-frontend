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
      <Card title="🪙 Import Binance Data">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Symbol (Binance Trading Pair)
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="BTCUSDT"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Examples: BTCUSDT, ETHUSDT, BNBUSDT
            </p>
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
              <option value="D1">D1 (1 day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Limit (Number of Candles)
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Max: 1000 candles per request
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'Importing...' : 'Import from Binance'}
          </button>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-md text-rose-300 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-md space-y-2">
              <div className="text-emerald-300 font-medium">
                ✓ Import Successful
              </div>
              <div className="text-sm text-slate-300 space-y-1">
                <div>
                  <span className="text-slate-400">Symbol:</span> {result.symbol}
                </div>
                <div>
                  <span className="text-slate-400">Timeframe:</span> {result.timeframe}
                </div>
                <div>
                  <span className="text-slate-400">Imported:</span>{' '}
                  <span className="text-emerald-300 font-semibold">
                    {result.importedCount} candles
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Source:</span> {result.source}
                </div>
                {result.message && (
                  <div>
                    <span className="text-slate-400">Message:</span> {result.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </Card>

      <Card title="ℹ️ Instructions">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            This tool imports real-time candlestick data from Binance public API.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>No API key required (uses public endpoints)</li>
            <li>Supports all USDT trading pairs (BTC, ETH, BNB, etc.)</li>
            <li>Data is stored in the database for AI analysis</li>
            <li>Old candles are replaced when importing same symbol/timeframe</li>
            <li>Auto-sync runs every 5 minutes for crypto symbols</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
