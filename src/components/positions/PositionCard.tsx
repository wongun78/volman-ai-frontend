import { useState } from 'react';
import type { PositionResponseDto, ExitReason } from '../../types/trading';
import { DirectionBadge } from '../common/DirectionBadge';
import { executePosition, closePosition, cancelPosition } from '../../services/positionsService';

interface PositionCardProps {
  position: PositionResponseDto;
  onUpdate?: () => void;
}

const EXIT_REASON_LABELS: Record<ExitReason, string> = {
  TP1_HIT: 'TP1 Hit',
  TP2_HIT: 'TP2 Hit',
  TP3_HIT: 'TP3 Hit',
  SL_HIT: 'Stop Loss',
  MANUAL_EXIT: 'Manual',
  TIME_EXIT: 'Time Exit',
  TRAILING_STOP: 'Trailing Stop',
  RISK_MANAGEMENT: 'Risk Mgmt',
};

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  OPEN: '#7c8db5',
  CLOSED: '#64748b',
  CANCELLED: '#a16e7c',
};

export default function PositionCard({ position, onUpdate }: PositionCardProps) {
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [actualEntryPrice, setActualEntryPrice] = useState<string>(
    position.plannedEntryPrice.toFixed(2)
  );
  const [exitPrice, setExitPrice] = useState<string>('');
  const [exitReason, setExitReason] = useState<ExitReason>('MANUAL_EXIT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProfitable = position.realizedPnL && position.realizedPnL > 0;

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      await executePosition(position.id, {
        actualEntryPrice: parseFloat(actualEntryPrice),
      });
      setShowExecuteModal(false);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute position');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    setLoading(true);
    setError(null);
    try {
      await closePosition(position.id, {
        exitPrice: parseFloat(exitPrice),
        exitReason,
      });
      setShowCloseModal(false);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close position');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this pending position?')) return;
    
    setLoading(true);
    setError(null);
    try {
      await cancelPosition(position.id);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel position');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-4 hover:bg-[#12141a]/70 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-semibold text-slate-200">{position.symbolCode}</span>
            <DirectionBadge direction={position.direction} />
            <span
              className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase"
              style={{ color: STATUS_COLORS[position.status], opacity: 0.8 }}
            >
              {position.status}
            </span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-600 tracking-wide">#{position.id}</div>
            {position.realizedPnL !== null && (
              <div
                className={`text-base font-semibold font-mono ${
                  isProfitable ? 'text-[#6b9080]' : 'text-[#a16e7c]'
                }`}
              >
                {isProfitable ? '+' : ''}${position.realizedPnL.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/1 p-3 border border-white/5">
            <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Entry</div>
            <div className="font-mono text-sm font-medium text-slate-300">
              {position.actualEntryPrice
                ? `$${position.actualEntryPrice.toFixed(2)}`
                : `$${position.plannedEntryPrice.toFixed(2)}`}
            </div>
            {!position.actualEntryPrice && (
              <div className="text-[9px] text-slate-600 mt-0.5">Planned</div>
            )}
          </div>
          {position.exitPrice && (
            <div className="bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Exit</div>
              <div className="font-mono text-sm font-medium text-slate-300">${position.exitPrice.toFixed(2)}</div>
            </div>
          )}
          <div className="bg-white/1 p-3 border border-white/5">
            <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Stop Loss</div>
            <div className="font-mono text-sm font-medium text-[#a16e7c]">${position.stopLoss.toFixed(2)}</div>
          </div>
          <div className="bg-white/1 p-3 border border-white/5">
            <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">TP1</div>
            <div className="font-mono text-sm font-medium text-[#6b9080]">${position.takeProfit1.toFixed(2)}</div>
          </div>
        </div>

        {/* Metrics */}
        {position.status === 'CLOSED' && (
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5 mb-3">
            <div className="bg-white/1 p-2 border border-white/5">
              <div className="text-[9px] text-slate-600 tracking-widest uppercase mb-1">R:R</div>
              <div className="text-sm font-medium text-slate-300">
                {position.actualRiskReward?.toFixed(2) || '-'}
              </div>
            </div>
            <div className="bg-white/1 p-2 border border-white/5">
              <div className="text-[9px] text-slate-600 tracking-widest uppercase mb-1">Return</div>
              <div className={`text-sm font-medium ${isProfitable ? 'text-[#6b9080]' : 'text-[#a16e7c]'}`}>
                {position.realizedPnLPercent?.toFixed(2)}%
              </div>
            </div>
            <div className="bg-white/1 p-2 border border-white/5">
              <div className="text-[9px] text-slate-600 tracking-widest uppercase mb-1">Exit</div>
              <div className="text-xs font-medium text-slate-400">
                {position.exitReason ? EXIT_REASON_LABELS[position.exitReason] : '-'}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {position.notes && (
          <div className="mb-3 pt-3 border-t border-white/5">
            <div className="text-xs text-slate-500 italic">{position.notes}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {position.status === 'PENDING' && (
            <>
              <button
                onClick={() => setShowExecuteModal(true)}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 border border-[#7c8db5]/20 text-[#9ca8c8] text-xs font-medium tracking-wide transition-all disabled:opacity-50"
              >
                Execute
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-2 bg-white/1 hover:bg-white/2 border border-white/5 text-slate-400 text-xs font-medium tracking-wide transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          )}
          {position.status === 'OPEN' && (
            <button
              onClick={() => setShowCloseModal(true)}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-[#6b9080]/15 hover:bg-[#6b9080]/25 border border-[#6b9080]/20 text-[#6b9080] text-xs font-medium tracking-wide transition-all disabled:opacity-50"
            >
              Close Position
            </button>
          )}
        </div>

        {error && (
          <div className="mt-3 text-xs text-[#a16e7c] bg-[#a16e7c]/10 px-3 py-2 border border-[#a16e7c]/20">{error}</div>
        )}
      </div>

      {/* Execute Modal */}
      {showExecuteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Execute Position</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Entry Price
              </label>
              <input
                type="number"
                step="0.01"
                value={actualEntryPrice}
                onChange={(e) => setActualEntryPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-1 text-xs text-gray-500">
                Planned: ${position.plannedEntryPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExecute}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Executing...' : 'Execute'}
              </button>
              <button
                onClick={() => setShowExecuteModal(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Close Position</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit Price
              </label>
              <input
                type="number"
                step="0.01"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="Enter exit price"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exit Reason
              </label>
              <select
                value={exitReason}
                onChange={(e) => setExitReason(e.target.value as ExitReason)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Object.entries(EXIT_REASON_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                disabled={loading || !exitPrice}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Closing...' : 'Close Position'}
              </button>
              <button
                onClick={() => setShowCloseModal(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
