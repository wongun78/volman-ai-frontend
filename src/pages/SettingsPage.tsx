import { useState } from 'react';
import type { AppSettings } from '../types/trading';
import { loadSettings, saveSettings, defaultSettings } from '../services/settingsService';
import { Card } from '../components/common/Card';

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
      <Card title="⚙️ Application Settings">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Default Symbol Code
            </label>
            <select
              value={settings.defaultSymbolCode}
              onChange={(e) =>
                setSettings({ ...settings, defaultSymbolCode: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="🪙 Cryptocurrencies">
                <option value="BTCUSDT">BTC/USDT - Bitcoin</option>
                <option value="ETHUSDT">ETH/USDT - Ethereum</option>
                <option value="BNBUSDT">BNB/USDT - Binance Coin</option>
                <option value="SOLUSDT">SOL/USDT - Solana</option>
                <option value="XRPUSDT">XRP/USDT - Ripple</option>
              </optgroup>
              <optgroup label="💰 Forex / Commodities">
                <option value="XAUUSD">XAU/USD - Gold</option>
                <option value="EURUSD">EUR/USD - Euro</option>
                <option value="GBPUSD">GBP/USD - Pound</option>
              </optgroup>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Default symbol used when loading signals
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Default Timeframe
            </label>
            <select
              value={settings.defaultTimeframe}
              onChange={(e) =>
                setSettings({ ...settings, defaultTimeframe: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="M5">M5 (5 minutes)</option>
              <option value="M15">M15 (15 minutes)</option>
              <option value="M30">M30 (30 minutes)</option>
              <option value="H1">H1 (1 hour)</option>
              <option value="H4">H4 (4 hours)</option>
              <option value="D1">D1 (1 day)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Default Trading Mode
            </label>
            <select
              value={settings.defaultMode}
              onChange={(e) =>
                setSettings({ ...settings, defaultMode: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SCALPING">SCALPING</option>
              <option value="INTRADAY">INTRADAY</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Backend Base URL
            </label>
            <input
              type="text"
              value={settings.backendBaseUrl}
              onChange={(e) =>
                setSettings({ ...settings, backendBaseUrl: e.target.value })
              }
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="http://localhost:8080"
            />
            <p className="text-xs text-slate-500 mt-1">
              URL of the Spring Boot backend (requires page refresh to take effect)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          {saved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-md text-emerald-300 text-sm">
              ✓ Settings saved successfully
            </div>
          )}
        </form>
      </Card>

      <Card title="ℹ️ About Settings">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            These settings are stored in your browser's localStorage and persist across sessions.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Default symbol/timeframe are used when loading the Signals and Dashboard pages</li>
            <li>Backend URL changes require a page refresh to take effect</li>
            <li>Settings are local to this browser only (no server storage)</li>
            <li>Click "Reset to Defaults" to restore original settings</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
