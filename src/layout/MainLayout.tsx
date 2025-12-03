import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/signals', label: 'Signals' },
    { path: '/positions', label: 'Positions' },
    { path: '/history', label: 'History' },
    { path: '/admin/binance', label: 'Binance' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100">
      {/* Subtle background texture */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>
      <div className="fixed inset-0 texture-overlay pointer-events-none"></div>
      
      {/* Header */}
      <header className="border-b border-white/[0.03] bg-[#12141a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[#9ca8c8] tracking-tight">
                Volman AI
              </h1>
              <p className="text-[10px] text-slate-600 mt-0.5 tracking-wider uppercase">
                Price Action Terminal
              </p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#6b9080]/5 border border-[#6b9080]/10">
                <div className="w-1 h-1 rounded-full bg-[#6b9080]"></div>
                <span className="text-[10px] tracking-wider text-[#6b9080] uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 text-xs tracking-wide font-medium transition-all whitespace-nowrap
                    ${
                      isActive(link.path)
                        ? 'text-[#9ca8c8] bg-white/[0.03]'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.015]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.02] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-[10px] text-slate-700 tracking-wider">
            Volman AI · Powered by Groq AI · 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
