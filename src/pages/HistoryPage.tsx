import { useState, useEffect } from 'react';
import type { SpringPage, AiSignalResponseDto } from '../types/trading';
import { fetchSignalHistory } from '../services/aiSignalsService';
import { loadSettings } from '../services/settingsService';
import { Card } from '../components/common/Card';
import { SignalHistoryTable } from '../components/signals/SignalHistoryTable';

export function HistoryPage() {
  const settings = loadSettings();
  
  const [symbolCode, setSymbolCode] = useState(settings.defaultSymbolCode);
  const [timeframe, setTimeframe] = useState(settings.defaultTimeframe);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<SpringPage<AiSignalResponseDto> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchSignalHistory({
        symbolCode,
        timeframe,
        page: currentPage,
        size: pageSize,
      });
      setData(result);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [symbolCode, timeframe, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <Card title="Signal History">
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-800">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Symbol
              </label>
              <select
                value={symbolCode}
                onChange={(e) => {
                  setSymbolCode(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="🪙 Cryptocurrencies">
                  <option value="BTCUSDT">BTC/USDT</option>
                  <option value="ETHUSDT">ETH/USDT</option>
                  <option value="BNBUSDT">BNB/USDT</option>
                  <option value="SOLUSDT">SOL/USDT</option>
                  <option value="XRPUSDT">XRP/USDT</option>
                </optgroup>
                <optgroup label="💰 Forex / Commodities">
                  <option value="XAUUSD">XAU/USD</option>
                  <option value="EURUSD">EUR/USD</option>
                  <option value="GBPUSD">GBP/USD</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="M5">M5</option>
                <option value="M15">M15</option>
                <option value="M30">M30</option>
                <option value="H1">H1</option>
                <option value="H4">H4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-8 text-slate-400">
              Loading...
            </div>
          )}

          {/* Table */}
          {!loading && data && (
            <>
              <SignalHistoryTable signals={data.content} />

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-sm text-slate-400">
                  Showing {data.content.length} of {data.totalElements} signals
                  (Page {currentPage + 1} of {data.totalPages || 1})
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={data.first}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 border border-slate-700 rounded-md text-sm transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={data.last}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 border border-slate-700 rounded-md text-sm transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
