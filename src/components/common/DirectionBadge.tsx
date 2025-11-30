import type { Direction } from '../../types/trading';

interface DirectionBadgeProps {
  direction: Direction;
}

export function DirectionBadge({ direction }: DirectionBadgeProps) {
  const styles = {
    LONG: 'bg-[#6b9080]/10 text-[#6b9080] border border-[#6b9080]/20',
    SHORT: 'bg-[#a16e7c]/10 text-[#a16e7c] border border-[#a16e7c]/20',
    NEUTRAL: 'bg-white/2 text-slate-500 border border-white/5',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium tracking-wide ${styles[direction]}`}>
      {direction}
    </span>
  );
}
