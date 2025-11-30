import { useState, useEffect } from 'react';
import type { AiSignalResponseDto, AiSuggestRequestDto } from '../types/trading';
import { requestAiSignal, fetchSignalHistory } from '../services/aiSignalsService';
import { loadSettings } from '../services/settingsService';
import { Card } from '../components/common/Card';
import { SignalForm } from '../components/signals/SignalForm';
import { LatestSignalCard } from '../components/signals/LatestSignalCard';
import { SignalHistoryTable } from '../components/signals/SignalHistoryTable';

export function SignalsPage() {
  const settings = loadSettings();
  
  const [latestSignal, setLatestSignal] = useState<AiSignalResponseDto | null>(null);
  const [history, setHistory] = useState<AiSignalResponseDto[]>([]);
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

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (request: AiSuggestRequestDto) => {
    setLoading(true);
    setError(null);

    try {
      const signal = await requestAiSignal(request);
      setLatestSignal(signal);
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

      <Card title="Signal History">
        <SignalHistoryTable signals={history} onRefresh={loadHistory} />
      </Card>
    </div>
  );
}
