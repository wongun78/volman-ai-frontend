import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { AiSignalResponseDto, AiSuggestRequestDto, CandleDto } from '../types/trading';
import { requestAiSignal, fetchSignalHistory } from '../services/aiSignalsService';
import { fetchCandles } from '../services/candlesService';
import { loadSettings } from '../services/settingsService';
import { Card } from '../components/common/Card';
import { SignalForm } from '../components/signals/SignalForm';
import { LatestSignalCard } from '../components/signals/LatestSignalCard';
import { SignalHistoryTable } from '../components/signals/SignalHistoryTable';
import { CandlestickChart } from '../components/charts/CandlestickChart';

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
      const data = await fetchCandles({
        symbolCode: settings.defaultSymbolCode,
        timeframe: settings.defaultTimeframe,
        limit: 100,
      });
      setCandles(data);
    } catch (err) {
      console.error('Failed to load candles:', err);
      toast.error('Failed to load chart data');
    }
  };

  useEffect(() => {
    loadHistory();
    loadCandles();
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
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Show error toast with special handling for Groq 401
      if (errorMessage.includes('Groq AI unauthorized') || errorMessage.includes('401')) {
        toast.error('Groq AI unauthorized. Please check GROQ_API_KEY on the backend.');
      } else {
        toast.error('Failed to generate AI signal. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Request AI Trade Signal">
          <SignalForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            initialSymbol={settings.defaultSymbolCode}
            initialTimeframe={settings.defaultTimeframe}
            initialMode={settings.defaultMode}
          />
        </Card>

        <Card title="Latest AI Signal">
          <LatestSignalCard signal={latestSignal} />
        </Card>
      </div>

      <Card title="Price Action Candles">
        <CandlestickChart candles={candles} height={320} />
      </Card>

      <Card title="Signal History">
        <SignalHistoryTable signals={history} onRefresh={loadHistory} />
      </Card>
    </div>
  );
}
