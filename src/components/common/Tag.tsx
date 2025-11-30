import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  variant?: 'blue' | 'purple' | 'emerald' | 'rose' | 'slate';
}

export function Tag({ children, variant = 'blue' }: TagProps) {
  const styles = {
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    slate: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}
