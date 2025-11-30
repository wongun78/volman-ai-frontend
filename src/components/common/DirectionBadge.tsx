import { Direction } from '../../types/trading';

interface DirectionBadgeProps {
  direction: Direction;
}

export function DirectionBadge({ direction }: DirectionBadgeProps) {
  const styles = {
    LONG: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
    SHORT: 'bg-rose-500/15 text-rose-300 border border-rose-500/40',
    NEUTRAL: 'bg-slate-500/15 text-slate-300 border border-slate-500/40',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[direction]}`}>
      {direction}
    </span>
  );
}
