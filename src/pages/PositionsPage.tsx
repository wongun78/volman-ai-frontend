import { useState, useEffect } from 'react';
import { getOpenPositions, getPortfolioStats, getPositions } from '../services/positionsService';
import type { PositionResponseDto, PortfolioStatsDto, PositionStatus } from '../types/trading';
import PositionCard from '../components/positions/PositionCard';

export default function PositionsPage() {
  const [stats, setStats] = useState<PortfolioStatsDto | null>(null);
  const [openPositions, setOpenPositions] = useState<PositionResponseDto[]>([]);
  const [allPositions, setAllPositions] = useState<PositionResponseDto[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PositionStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, openData, allData] = await Promise.all([
        getPortfolioStats(),
        getOpenPositions(),
        getPositions({ size: 50 }),
      ]);
      setStats(statsData);
      setOpenPositions(openData);
      setAllPositions(allData.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPositions =
    selectedStatus === 'ALL'
      ? allPositions
      : allPositions.filter((p) => p.status === selectedStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading positions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
            Portfolio Management
          </div>
          <h1 className="text-xl font-semibold text-slate-200">Positions & Performance</h1>
        </div>
        <button
          onClick={loadData}
          className="px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 border border-[#7c8db5]/20 text-[#9ca8c8] text-sm font-medium tracking-wide transition-all"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-[#a16e7c]/10 border border-[#a16e7c]/20 text-[#a16e7c] px-4 py-3">
          {error}
        </div>
      )}

      {/* Portfolio Stats */}
      {stats && (
        <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
          <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-6">
            Portfolio Overview
          </div>
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/1 p-4 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Total Positions</div>
              <div className="text-2xl font-semibold text-slate-200">{stats.totalPositions}</div>
            </div>
            <div className="bg-white/1 p-4 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Open</div>
              <div className="text-2xl font-semibold text-[#7c8db5]">{stats.openPositions}</div>
            </div>
            <div className="bg-white/1 p-4 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Win Rate</div>
              <div className="text-2xl font-semibold text-[#6b9080]">{stats.winRate.toFixed(1)}%</div>
            </div>
            <div className="bg-white/1 p-4 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Total P&L</div>
              <div
                className={`text-2xl font-semibold ${
                  stats.totalPnL >= 0 ? 'text-[#6b9080]' : 'text-[#a16e7c]'
                }`}
              >
                {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/5">
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Avg P&L</div>
              <div className="text-sm font-medium text-slate-300">${stats.averagePnL.toFixed(2)}</div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Avg R:R</div>
              <div className="text-sm font-medium text-slate-300">{stats.averageRiskReward.toFixed(2)}</div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Best Trade</div>
              <div className="text-sm font-medium text-[#6b9080]">
                ${stats.bestTradePnL.toFixed(2)}
              </div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Worst Trade</div>
              <div className="text-sm font-medium text-[#a16e7c]">
                ${stats.worstTradePnL.toFixed(2)}
              </div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Long Win Rate</div>
              <div className="text-sm font-medium text-slate-300">{stats.longWinRate.toFixed(1)}%</div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Short Win Rate</div>
              <div className="text-sm font-medium text-slate-300">{stats.shortWinRate.toFixed(1)}%</div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Closed</div>
              <div className="text-sm font-medium text-slate-300">{stats.closedPositions}</div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Pending</div>
              <div className="text-sm font-medium text-slate-300">{stats.pendingPositions}</div>
            </div>
          </div>
        </div>
      )}

      {/* Open Positions Section */}
      {openPositions.length > 0 && (
        <div>
          <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-4">
            Open Positions ({openPositions.length})
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {openPositions.map((position) => (
              <PositionCard key={position.id} position={position} onUpdate={loadData} />
            ))}
          </div>
        </div>
      )}

      {/* All Positions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] text-slate-600 tracking-widest uppercase">
            All Positions
          </div>
          <div className="flex gap-2">
            {(['ALL', 'PENDING', 'OPEN', 'CLOSED', 'CANCELLED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 text-xs font-medium tracking-wide transition-all ${
                  selectedStatus === status
                    ? 'bg-[#7c8db5]/15 text-[#9ca8c8] border border-[#7c8db5]/20'
                    : 'bg-white/1 text-slate-500 border border-white/5 hover:bg-white/2'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredPositions.length === 0 ? (
          <div className="bg-white/1 border border-white/5 p-8 text-center">
            <div className="text-sm text-slate-500">No positions found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositions.map((position) => (
              <PositionCard key={position.id} position={position} onUpdate={loadData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
