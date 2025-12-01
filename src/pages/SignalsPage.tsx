import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { AiSignalResponseDto, AiSuggestRequestDto, CandleDto } from '../types/trading';
import { requestAiSignal, fetchSignalHistory } from '../services/aiSignalsService';
import { fetchBinanceLiveCandles } from '../services/binanceLiveService';
import { loadSettings } from '../services/settingsService';
import { SignalForm } from '../components/signals/SignalForm';
import { LatestSignalCard } from '../components/signals/LatestSignalCard';
import { SignalHistoryTable } from '../components/signals/SignalHistoryTable';
import { CandlestickChart } from '../components/charts/CandlestickChart';
import { ApiError } from '../services/apiClient';

export function SignalsPage() {
  const settings = loadSettings();
  
  const [latestSignal, setLatestSignal] = useState<AiSignalResponseDto | null>(null);
  const [history, setHistory] = useState<AiSignalResponseDto[]>([]);
  const [candles, setCandles] = useState<CandleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const data = await fetchSignalHistory({
        symbolCode: settings.defaultSymbolCode,
        timeframe: settings.defaultTimeframe,
        page: 0,
        size: 20,
      });
      setHistory(data.content);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const loadCandles = async () => {
    try {
      // Fetch directly from Binance API (real-time, no backend/database)
      const data = await fetchBinanceLiveCandles({
        symbol: settings.defaultSymbolCode,
        interval: '5m', // Map M5 to Binance format
        limit: 100,
      });
      setCandles(data);
    } catch (err) {
      console.error('Failed to load candles:', err);
      toast.error('Failed to load chart data from Binance');
    }
  };

  useEffect(() => {
    loadHistory();
    loadCandles();

    // Auto-refresh candles every 1 second for M5 real-time updates
    const intervalId = setInterval(() => {
      loadCandles();
    }, 1000); // 1 second

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (request: AiSuggestRequestDto) => {
    setLoading(true);
    setError(null);

    try {
      const signal = await requestAiSignal(request);
      setLatestSignal(signal);
      await loadHistory();
      
      // Show success toast
      toast.success(
        `AI signal generated: ${signal.direction} ${signal.symbolCode} ${signal.timeframe}`
      );
    } catch (err) {
      // Enhanced error handling with ApiError
      let errorMessage = 'An unknown error occurred';
      
      if (err instanceof ApiError) {
        errorMessage = err.getUserMessage();
        
        // Show specific toast based on error code
        if (err.code === 'SYMBOL_NOT_FOUND') {
          toast.error('Symbol not found. Please check the symbol code.');
        } else if (err.code === 'INVALID_SIGNAL') {
          toast.error('Invalid signal detected. Try different parameters.');
        } else if (err.code === 'MARKET_DATA_ERROR') {
          toast.error('Cannot fetch market data. Try again later.');
        } else if (err.code === 'AI_SERVICE_ERROR') {
          toast.error('AI service unavailable. Please try again.');
        } else {
          toast.error(errorMessage);
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="relative overflow-hidden bg-white/[0.01] border border-white/[0.03] p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-[#9ca8c8] mb-1">
                AI Trading Signals
              </h1>
              <p className="text-slate-600 text-xs tracking-wide">Bob Volman Price Action Analysis</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-700 tracking-wider uppercase mb-1">Market Time</div>
              <div className="text-sm text-slate-400">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Signal Generator */}
        <div className="lg:col-span-1">
          <div className="card-shadow bg-[#12141a]/60 border border-white/[0.03] p-6 sticky top-6">
            <div className="mb-6">
              <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Signal Generator</div>
              <h2 className="text-base font-medium text-slate-300">Request Analysis</h2>
            </div>
            <SignalForm
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              initialSymbol={settings.defaultSymbolCode}
              initialTimeframe={settings.defaultTimeframe}
              initialMode={settings.defaultMode}
            />
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Signal */}
          <div className="card-shadow bg-[#12141a]/60 border border-white/[0.03] p-6">
            <div className="mb-6">
              <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Latest Signal</div>
              <h2 className="text-base font-medium text-slate-300">AI Recommendation</h2>
            </div>
            <LatestSignalCard signal={latestSignal} />
          </div>

          {/* Price Chart */}
          <div className="card-shadow bg-[#12141a]/60 border border-white/[0.03] p-6">
            <div className="mb-6">
              <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Price Action</div>
              <h2 className="text-base font-medium text-slate-300">Live Chart</h2>
            </div>
            <CandlestickChart candles={candles} height={320} />
          </div>
        </div>
      </div>

      {/* Signal History */}
      <div className="card-shadow bg-[#12141a]/60 border border-white/[0.03] p-6">
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">History</div>
          <h2 className="text-base font-medium text-slate-300">Previous Signals</h2>
        </div>
        <SignalHistoryTable signals={history} onRefresh={loadHistory} />
      </div>
    </div>
  );
}
