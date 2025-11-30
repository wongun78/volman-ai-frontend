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
      <div className="text-center py-16 text-slate-600 text-xs">
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
            className="px-4 py-2 bg-white/1 hover:bg-white/2 border border-white/5 text-sm text-slate-400 transition-all"
          >
            Refresh
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5">
            <tr className="text-left text-slate-600">
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">Time</th>
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">Symbol</th>
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">TF</th>
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">Direction</th>
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">Entry</th>
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">SL</th>
              <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">TP1</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={signal.id} className="border-b border-white/3">
                <td className="py-3 text-slate-500 text-xs">
                  {new Date(signal.createdAt).toLocaleString()}
                </td>
                <td className="py-3 text-slate-300">{signal.symbolCode}</td>
                <td className="py-3 text-slate-400">{signal.timeframe}</td>
                <td className="py-3">
                  <DirectionBadge direction={signal.direction} />
                </td>
                <td className="py-3 text-slate-300">{formatNum(signal.entryPrice)}</td>
                <td className="py-3 text-slate-300">{formatNum(signal.stopLoss)}</td>
                <td className="py-3 text-[#6b9080]">{formatNum(signal.takeProfit1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
