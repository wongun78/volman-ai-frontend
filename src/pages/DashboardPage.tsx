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
        <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-slate-200">{stats.total}</div>
            <div className="text-[10px] text-slate-600 mt-2 tracking-widest uppercase">Total Signals</div>
          </div>
        </div>

        <div className="card-shadow bg-[#12141a]/60 border border-[#6b9080]/10 p-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-[#6b9080]">{stats.long}</div>
            <div className="text-[10px] text-slate-600 mt-2 tracking-widest uppercase">Long Signals</div>
          </div>
        </div>

        <div className="card-shadow bg-[#12141a]/60 border border-[#a16e7c]/10 p-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-[#a16e7c]">{stats.short}</div>
            <div className="text-[10px] text-slate-600 mt-2 tracking-widest uppercase">Short Signals</div>
          </div>
        </div>

        <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-slate-500">{stats.neutral}</div>
            <div className="text-[10px] text-slate-600 mt-2 tracking-widest uppercase">Neutral Signals</div>
          </div>
        </div>
      </div>

      {/* Latest Signals */}
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Recent Activity</div>
          <h2 className="text-base font-medium text-slate-300">Latest 5 Signals</h2>
        </div>
        {latestSignals.length > 0 ? (
          <div className="space-y-3">
            {latestSignals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-center justify-between p-4 bg-white/1 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <DirectionBadge direction={signal.direction} />
                  <div>
                    <div className="text-sm font-medium text-slate-300">
                      {signal.symbolCode} · {signal.timeframe}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      {new Date(signal.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">
                    {signal.entryPrice?.toFixed(2) || '—'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    SL: {signal.stopLoss?.toFixed(2) || '—'} · TP1: {signal.takeProfit1?.toFixed(2) || '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-600 text-xs">
            No signals generated yet
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Configuration</div>
          <h2 className="text-base font-medium text-slate-300">System Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-slate-600 mb-1 tracking-wide uppercase">Backend URL</div>
            <div className="text-sm text-slate-400">{settings.backendBaseUrl}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-600 mb-1 tracking-wide uppercase">Default Symbol</div>
            <div className="text-sm text-slate-400">{settings.defaultSymbolCode}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-600 mb-1 tracking-wide uppercase">Default Timeframe</div>
            <div className="text-sm text-slate-400">{settings.defaultTimeframe}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-600 mb-1 tracking-wide uppercase">Default Mode</div>
            <div className="text-sm text-slate-400">{settings.defaultMode}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
