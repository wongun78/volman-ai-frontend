import type { AiSignalResponseDto } from '../../types/trading';
import { DirectionBadge } from '../common/DirectionBadge';

interface LatestSignalCardProps {
  signal: AiSignalResponseDto | null;
}

const formatNum = (val: number | null) => (val !== null ? val.toFixed(2) : '—');

export function LatestSignalCard({ signal }: LatestSignalCardProps) {
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
          <div className="text-[10px] text-slate-700 tracking-widest uppercase mb-1">Time</div>
          <div className="text-slate-500 text-xs">
            {new Date(signal.createdAt).toLocaleString('en-US', { 
              month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
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

          {/* Take Profits */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/1 p-3 border border-[#6b9080]/10">
              <div className="text-[10px] text-[#6b9080]/70 tracking-widest uppercase mb-1">TP1</div>
              <div className="text-base font-medium text-[#6b9080]">
                {formatNum(signal.takeProfit1)}
              </div>
            </div>
            <div className="bg-white/1 p-3 border border-[#6b9080]/10">
              <div className="text-[10px] text-[#6b9080]/70 tracking-widest uppercase mb-1">TP2</div>
              <div className="text-base font-medium text-[#6b9080]">
                {formatNum(signal.takeProfit2)}
              </div>
            </div>
            <div className="bg-white/1 p-3 border border-[#6b9080]/10">
              <div className="text-[10px] text-[#6b9080]/70 tracking-widest uppercase mb-1">TP3</div>
              <div className="text-base font-medium text-[#6b9080]">
                {formatNum(signal.takeProfit3)}
              </div>
            </div>
          </div>

          {/* Risk Reward */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">R:R Ratio 1</div>
              <div className="text-base font-medium text-slate-400">
                {formatNum(signal.riskReward1)}x
              </div>
            </div>
            <div className="flex-1 bg-white/1 p-3 border border-white/5">
              <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">R:R Ratio 2</div>
              <div className="text-base font-medium text-slate-400">
                {formatNum(signal.riskReward2)}x
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
    </div>
  );
}
