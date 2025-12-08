import { useState } from 'react';
import type { AiSignalResponseDto } from '../../types/trading';
import { openPosition } from '../../services/positionsService';

interface LatestSignalCardProps {
  signal: AiSignalResponseDto | null;
  onPositionCreated?: () => void;
}

const formatNum = (val: number | null) => (val !== null ? val.toFixed(2) : '—');

export function LatestSignalCard({ signal, onPositionCreated }: LatestSignalCardProps) {
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [quantity, setQuantity] = useState('0.01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecuteTrade = async () => {
    if (!signal || !signal.entryPrice) return;

    setLoading(true);
    setError(null);
    try {
      await openPosition({
        signalId: signal.id,
        symbolCode: signal.symbolCode,
        direction: signal.direction,
        plannedEntryPrice: signal.entryPrice,
        stopLoss: signal.stopLoss!,
        takeProfit: signal.takeProfit!,
        quantity: parseFloat(quantity),
        notes: `AI Signal #${signal.id} - ${signal.mode}`,
      });
      setShowTradeModal(false);
      onPositionCreated?.();
      alert('Position created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create position');
    } finally {
      setLoading(false);
    }
  };

  if (!signal) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border border-white/5 flex items-center justify-center mb-4">
          <div className="w-4 h-4 bg-white/2"></div>
        </div>
        <p className="text-slate-600 text-xs tracking-wide">No signal generated</p>
        <p className="text-slate-700 text-[10px] mt-1 tracking-wider">Request analysis to begin</p>
      </div>
    );
  }

  const isNeutral = signal.direction === 'NEUTRAL';
  
  // Define styles based on direction
  const getBadgeStyles = () => {
    if (signal.direction === 'LONG') {
      return 'bg-[#6b9080]/10 border-[#6b9080]/20 text-[#6b9080]';
    } else if (signal.direction === 'SHORT') {
      return 'bg-[#a16e7c]/10 border-[#a16e7c]/20 text-[#a16e7c]';
    }
    return 'bg-white/[0.02] border-white/[0.05] text-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* Signal Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className={`inline-flex px-4 py-1.5 border mb-3 ${getBadgeStyles()}`}>
            <span className="font-medium text-sm tracking-wide">
              {signal.direction}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-200 text-lg font-medium">{signal.symbolCode}</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-slate-500 text-xs">{signal.timeframe}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-700 tracking-widest uppercase mb-1">Time (UTC)</div>
          <div className="text-slate-500 text-xs">
            {new Date(signal.createdAt).toLocaleString('en-US', { 
              month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false 
            })}
          </div>
        </div>
      </div>

      {!isNeutral && (
        <>
          {/* Price Levels */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/1 p-4 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Entry</div>
              <div className="text-lg font-medium text-slate-300">
                {formatNum(signal.entryPrice)}
              </div>
            </div>
            <div className="bg-white/1 p-4 border border-[#a16e7c]/10">
              <div className="text-[10px] text-[#a16e7c]/70 tracking-widest uppercase mb-2">Stop Loss</div>
              <div className="text-lg font-medium text-[#a16e7c]">
                {formatNum(signal.stopLoss)}
              </div>
            </div>
          </div>

          {/* Take Profit */}
          <div className="bg-white/1 p-4 border border-[#6b9080]/10">
            <div className="text-[10px] text-[#6b9080]/70 tracking-widest uppercase mb-2">Take Profit</div>
            <div className="text-lg font-medium text-[#6b9080]">
              {formatNum(signal.takeProfit)}
            </div>
          </div>

          {/* Risk Reward */}
          <div className="bg-white/1 p-4 border border-white/5">
            <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Risk:Reward Ratio</div>
            <div className="text-lg font-medium text-slate-400">
              {formatNum(signal.riskReward)}x
            </div>
          </div>

          {/* Computed Fields from Backend */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Status</div>
              <div className={`text-sm font-medium ${
                signal.actionable 
                  ? 'text-[#6b9080]' 
                  : 'text-slate-500'
              }`}>
                {signal.actionable ? '✓ Actionable' : '✗ Not Ready'}
              </div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Risk Amount</div>
              <div className="text-sm font-medium text-slate-400">
                {formatNum(signal.riskAmount)}
              </div>
            </div>
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Potential Profit</div>
              <div className="text-sm font-medium text-[#6b9080]">
                {formatNum(signal.potentialProfit)}
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI Reasoning */}
      {signal.reasoning && (
        <div className="bg-white/0.5 p-5 border border-white/3">
          <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-3">AI Analysis</div>
          <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line font-mono">
            {signal.reasoning}
          </div>
        </div>
      )}

      {/* Execute Trade Button */}
      {!isNeutral && signal.actionable && signal.entryPrice && (
        <button
          onClick={() => setShowTradeModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          Execute Trade
        </button>
      )}

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Execute Trade from Signal</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Symbol:</span>
                <span className="text-white font-medium">{signal.symbolCode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Direction:</span>
                <span className="text-white font-medium">{signal.direction}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry:</span>
                <span className="text-white font-medium">${signal.entryPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Stop Loss:</span>
                <span className="text-red-400 font-medium">${signal.stopLoss?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Take Profit:</span>
                <span className="text-green-400 font-medium">${signal.takeProfit?.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleExecuteTrade}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Position'}
              </button>
              <button
                onClick={() => setShowTradeModal(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded font-medium hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
