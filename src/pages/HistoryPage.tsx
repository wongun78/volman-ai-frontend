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
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Archive</div>
          <h2 className="text-base font-medium text-slate-300">Signal History</h2>
        </div>
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-white/5">
            <div>
              <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
                Symbol
              </label>
              <select
                value={symbolCode}
                onChange={(e) => {
                  setSymbolCode(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
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
            </div>

            <div>
              <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              >
                <option value="M5">5M</option>
                <option value="M15">15M</option>
                <option value="M30">30M</option>
                <option value="H1">1H</option>
                <option value="H4">4H</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
                Page Size
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
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
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="text-xs text-slate-500">
                  Showing {data.content.length} of {data.totalElements} signals
                  (Page {currentPage + 1} of {data.totalPages || 1})
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={data.first}
                    className="px-4 py-2 bg-white/1 hover:bg-white/2 disabled:bg-transparent disabled:text-slate-700 border border-white/5 text-sm text-slate-400 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={data.last}
                    className="px-4 py-2 bg-white/1 hover:bg-white/2 disabled:bg-transparent disabled:text-slate-700 border border-white/5 text-sm text-slate-400 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
