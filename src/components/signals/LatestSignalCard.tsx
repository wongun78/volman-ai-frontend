import type { AiSignalResponseDto } from '../../types/trading';
import { DirectionBadge } from '../common/DirectionBadge';

interface LatestSignalCardProps {
  signal: AiSignalResponseDto | null;
}

const formatNum = (val: number | null) => (val !== null ? val.toFixed(2) : '—');

export function LatestSignalCard({ signal }: LatestSignalCardProps) {
  if (!signal) {
    return (
      <div className="text-center py-12 text-slate-500">
        No AI signal yet. Request one from the form.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DirectionBadge direction={signal.direction} />
        <span className="text-sm text-slate-400">
          {signal.symbolCode} · {signal.timeframe}
        </span>
      </div>

      <div className="text-xs text-slate-500">
        {new Date(signal.createdAt).toLocaleString()}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-xs text-slate-400">Entry</div>
          <div className="text-sm font-semibold text-slate-100">
            {formatNum(signal.entryPrice)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-xs text-slate-400">Stop Loss</div>
          <div className="text-sm font-semibold text-slate-100">
            {formatNum(signal.stopLoss)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-xs text-slate-400">TP1</div>
          <div className="text-sm font-semibold text-emerald-400">
            {formatNum(signal.takeProfit1)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-xs text-slate-400">TP2</div>
          <div className="text-sm font-semibold text-emerald-400">
            {formatNum(signal.takeProfit2)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-xs text-slate-400">TP3</div>
          <div className="text-sm font-semibold text-emerald-400">
            {formatNum(signal.takeProfit3)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-xs text-slate-400">RR1 / RR2</div>
          <div className="text-sm font-semibold text-slate-100">
            {formatNum(signal.riskReward1)} / {formatNum(signal.riskReward2)}
          </div>
        </div>
      </div>

      {signal.reasoning && (
        <div className="bg-slate-800/30 rounded p-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">AI Reasoning</div>
          <div className="text-sm text-slate-300">{signal.reasoning}</div>
        </div>
      )}
    </div>
  );
}
