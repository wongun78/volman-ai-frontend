import { useState } from 'react';
import type { AppSettings, TradingMode } from '../types/trading';
import { loadSettings, saveSettings, defaultSettings } from '../services/settingsService';
import { TRADING_MODE_CONFIG } from '../types/trading';

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Configuration</div>
          <h2 className="text-base font-medium text-slate-300">Application Settings</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Default Symbol
            </label>
            <select
              value={settings.defaultSymbolCode}
              onChange={(e) =>
                setSettings({ ...settings, defaultSymbolCode: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
            >
              <optgroup label="Crypto">
                <option value="BTCUSDT">BTC/USDT</option>
                <option value="ETHUSDT">ETH/USDT</option>
                <option value="BNBUSDT">BNB/USDT</option>
                <option value="SOLUSDT">SOL/USDT</option>
                <option value="XRPUSDT">XRP/USDT</option>
              </optgroup>
              <optgroup label="Forex">
                <option value="XAUUSD">XAU/USD</option>
                <option value="EURUSD">EUR/USD</option>
                <option value="GBPUSD">GBP/USD</option>
              </optgroup>
            </select>
            <p className="text-[10px] text-slate-600 mt-1.5">
              Default symbol used when loading signals
            </p>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Default Timeframe
            </label>
            <select
              value={settings.defaultTimeframe}
              onChange={(e) =>
                setSettings({ ...settings, defaultTimeframe: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
            >
              <option value="M5">5M</option>
              <option value="M15">15M</option>
              <option value="M30">30M</option>
              <option value="H1">1H</option>
              <option value="H4">4H</option>
              <option value="D1">1D</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Default Mode
            </label>
            <select
              value={settings.defaultMode}
              onChange={(e) =>
                setSettings({ ...settings, defaultMode: e.target.value as TradingMode })
              }
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
            >
              <option value="SCALPING">{TRADING_MODE_CONFIG.SCALPING.label}</option>
              <option value="INTRADAY">{TRADING_MODE_CONFIG.INTRADAY.label}</option>
              <option value="SWING">{TRADING_MODE_CONFIG.SWING.label}</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
              Backend URL
            </label>
            <input
              type="text"
              value={settings.backendBaseUrl}
              onChange={(e) =>
                setSettings({ ...settings, backendBaseUrl: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              placeholder="http://localhost:8080"
            />
            <p className="text-[10px] text-slate-600 mt-1.5">
              Backend URL (requires page refresh)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 text-[#9ca8c8] text-sm font-medium tracking-wide transition-all border border-[#7c8db5]/20"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-white/1 hover:bg-white/2 text-slate-400 text-sm font-medium tracking-wide transition-all border border-white/5"
            >
              Reset
            </button>
          </div>

          {saved && (
            <div className="p-4 bg-[#6b9080]/5 border border-[#6b9080]/10">
              <span className="text-[#6b9080] text-sm">Settings saved successfully</span>
            </div>
          )}
        </form>
      </div>

      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        <div className="mb-4">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Information</div>
          <h2 className="text-base font-medium text-slate-300">About Settings</h2>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <p>
            Settings are stored in browser localStorage and persist across sessions.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-500 text-xs">
            <li>Default values used when loading pages</li>
            <li>Backend URL changes require page refresh</li>
            <li>Settings are local to this browser only</li>
            <li>Reset button restores original settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
