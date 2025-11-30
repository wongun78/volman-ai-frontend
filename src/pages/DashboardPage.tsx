import { useState, useEffect } from 'react';
import { fetchSignalHistory } from '../services/aiSignalsService';
import { loadSettings } from '../services/settingsService';
import { Card } from '../components/common/Card';
import { DirectionBadge } from '../components/common/DirectionBadge';

export function DashboardPage() {
  const settings = loadSettings();
  
  const [stats, setStats] = useState({
    total: 0,
    long: 0,
    short: 0,
    neutral: 0,
  });
  const [latestSignals, setLatestSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchSignalHistory({
          symbolCode: settings.defaultSymbolCode,
          timeframe: settings.defaultTimeframe,
          page: 0,
          size: 50,
        });

        // Calculate stats
        const counts = data.content.reduce(
          (acc, signal) => {
            acc.total++;
            if (signal.direction === 'LONG') acc.long++;
            else if (signal.direction === 'SHORT') acc.short++;
            else if (signal.direction === 'NEUTRAL') acc.neutral++;
            return acc;
          },
          { total: 0, long: 0, short: 0, neutral: 0 }
        );

        setStats(counts);
        setLatestSignals(data.content.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-100">{stats.total}</div>
            <div className="text-sm text-slate-400 mt-1">Total Signals</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{stats.long}</div>
            <div className="text-sm text-slate-400 mt-1">LONG Signals</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-400">{stats.short}</div>
            <div className="text-sm text-slate-400 mt-1">SHORT Signals</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-400">{stats.neutral}</div>
            <div className="text-sm text-slate-400 mt-1">NEUTRAL Signals</div>
          </div>
        </Card>
      </div>

      {/* Latest Signals */}
      <Card title="Latest 5 Signals">
        {latestSignals.length > 0 ? (
          <div className="space-y-3">
            {latestSignals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <DirectionBadge direction={signal.direction} />
                  <div>
                    <div className="text-sm font-medium text-slate-200">
                      {signal.symbolCode} · {signal.timeframe}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(signal.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">
                    Entry: {signal.entryPrice?.toFixed(2) || '—'}
                  </div>
                  <div className="text-xs text-slate-500">
                    SL: {signal.stopLoss?.toFixed(2) || '—'} | 
                    TP1: {signal.takeProfit1?.toFixed(2) || '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No signals generated yet.
          </div>
        )}
      </Card>

      {/* System Info */}
      <Card title="System Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-400 mb-1">Backend URL</div>
            <div className="text-sm text-slate-200 font-mono">{settings.backendBaseUrl}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Default Symbol</div>
            <div className="text-sm text-slate-200">{settings.defaultSymbolCode}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Default Timeframe</div>
            <div className="text-sm text-slate-200">{settings.defaultTimeframe}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">Default Mode</div>
            <div className="text-sm text-slate-200">{settings.defaultMode}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
