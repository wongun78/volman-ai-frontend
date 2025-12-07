/**
 * Format number to currency with proper decimal places
 */
export function formatCurrency(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number to percentage
 */
export function formatPercent(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '-';
  const formatted = formatCurrency(value, decimals);
  return `${value >= 0 ? '+' : ''}${formatted}%`;
}

/**
 * Format P&L with color coding
 */
export function formatPnL(value: number | null | undefined): {
  text: string;
  color: string;
  sign: '+' | '-' | '';
} {
  if (value === null || value === undefined) {
    return { text: '-', color: '#64748b', sign: '' };
  }

  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const color = value > 0 ? '#22c55e' : value < 0 ? '#ef4444' : '#64748b';
  const text = `${sign}${formatCurrency(Math.abs(value))}`;

  return { text, color, sign };
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(2)}K`;

  return formatCurrency(value, 2);
}

/**
 * Format price based on symbol type
 */
export function formatPrice(
  value: number | null | undefined,
  symbol: string = ''
): string {
  if (value === null || value === undefined) return '-';

  // Crypto pairs - more decimals
  if (symbol.includes('USDT') || symbol.includes('BTC')) {
    return formatCurrency(value, value < 1 ? 6 : 2);
  }

  // Forex pairs - 5 decimals
  if (symbol.length === 6) {
    return formatCurrency(value, 5);
  }

  return formatCurrency(value, 2);
}

/**
 * Truncate number to specified decimal places (no rounding)
 */
export function truncateDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.trunc(value * multiplier) / multiplier;
}
