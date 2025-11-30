import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function Card({ children, title, actions }: CardProps) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-lg p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
