import type { AiSignalResponseDto } from '../../types/trading';
import { DirectionBadge } from '../common/DirectionBadge';

interface SignalHistoryTableProps {
  signals: AiSignalResponseDto[];
  onRefresh?: () => void;
}

const formatNum = (val: number | null) => (val !== null ? val.toFixed(2) : '—');

export function SignalHistoryTable({ signals, onRefresh }: SignalHistoryTableProps) {
  if (signals.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No signals yet. Generate one to see it here.
      </div>
    );
  }

  return (
    <>
      {onRefresh && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800">
            <tr className="text-left text-slate-400">
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">Symbol</th>
              <th className="pb-2 font-medium">TF</th>
              <th className="pb-2 font-medium">Direction</th>
              <th className="pb-2 font-medium">Entry</th>
              <th className="pb-2 font-medium">SL</th>
              <th className="pb-2 font-medium">TP1</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={signal.id} className="border-b border-slate-800/50">
                <td className="py-3 text-slate-400 text-xs">
                  {new Date(signal.createdAt).toLocaleString()}
                </td>
                <td className="py-3 text-slate-200">{signal.symbolCode}</td>
                <td className="py-3 text-slate-300">{signal.timeframe}</td>
                <td className="py-3">
                  <DirectionBadge direction={signal.direction} />
                </td>
                <td className="py-3 text-slate-200">{formatNum(signal.entryPrice)}</td>
                <td className="py-3 text-slate-200">{formatNum(signal.stopLoss)}</td>
                <td className="py-3 text-emerald-400">{formatNum(signal.takeProfit1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
