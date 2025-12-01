import type { Direction } from '../../types/trading';
import { DIRECTION_METADATA } from '../../types/trading';

interface DirectionBadgeProps {
  direction: Direction;
  showArrow?: boolean;
}

export function DirectionBadge({ direction, showArrow = true }: DirectionBadgeProps) {
  const metadata = DIRECTION_METADATA[direction];
  
  const styles = {
    LONG: 'bg-[#6b9080]/10 text-[#6b9080] border border-[#6b9080]/20',
    SHORT: 'bg-[#a16e7c]/10 text-[#a16e7c] border border-[#a16e7c]/20',
    NEUTRAL: 'bg-white/2 text-slate-500 border border-white/5',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium tracking-wide ${styles[direction]}`}>
      {showArrow && metadata.arrow} {metadata.label}
    </span>
  );
}
