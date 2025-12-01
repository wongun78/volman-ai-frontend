import type { AppSettings, TradingMode } from '../types/trading';
import { getApiBase } from './apiClient';

const STORAGE_KEY = 'volman-ai-settings';

export const defaultSettings: AppSettings = {
  defaultSymbolCode: 'BTCUSDT',
  defaultTimeframe: 'M5',
  defaultMode: 'SCALPING' as TradingMode,
  backendBaseUrl: getApiBase(),
};

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
