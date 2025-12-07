import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr = 'MMM dd, yyyy HH:mm'
): string {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '-';
    return format(dateObj, formatStr);
  } catch {
    return '-';
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '-';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return '-';
  }
}

/**
 * Format duration in milliseconds to readable string
 */
export function formatDuration(durationMs: number | null | undefined): string {
  if (!durationMs) return '-';

  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Get ISO string from date
 */
export function toISOString(date: Date | string | null | undefined): string | null {
  if (!date) return null;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    return dateObj.toISOString();
  } catch {
    return null;
  }
}
