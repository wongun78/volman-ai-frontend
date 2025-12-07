import type { Direction, PositionStatus, ExitReason } from '../types';

/**
 * Calculate risk/reward ratio
 */
export function calculateRiskReward(
  entry: number,
  stopLoss: number,
  takeProfit: number
): number {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  return reward / risk;
}

/**
 * Calculate position size based on risk percentage
 */
export function calculatePositionSize(
  accountBalance: number,
  riskPercent: number,
  entry: number,
  stopLoss: number
): number {
  const riskAmount = accountBalance * (riskPercent / 100);
  const riskPerUnit = Math.abs(entry - stopLoss);
  return riskAmount / riskPerUnit;
}

/**
 * Calculate P&L percentage
 */
export function calculatePnLPercent(entry: number, exit: number, direction: Direction): number {
  if (direction === 'LONG') {
    return ((exit - entry) / entry) * 100;
  } else if (direction === 'SHORT') {
    return ((entry - exit) / entry) * 100;
  }
  return 0;
}

/**
 * Calculate P&L amount
 */
export function calculatePnL(
  entry: number,
  exit: number,
  quantity: number,
  direction: Direction
): number {
  if (direction === 'LONG') {
    return (exit - entry) * quantity;
  } else if (direction === 'SHORT') {
    return (entry - exit) * quantity;
  }
  return 0;
}

/**
 * Get position status badge color
 */
export function getStatusColor(status: PositionStatus): string {
  switch (status) {
    case 'OPEN':
      return '#3b82f6'; // blue
    case 'CLOSED':
      return '#64748b'; // gray
    case 'PENDING':
      return '#f59e0b'; // orange
    case 'CANCELLED':
      return '#ef4444'; // red
    default:
      return '#64748b';
  }
}

/**
 * Get exit reason label
 */
export function getExitReasonLabel(reason: ExitReason | null): string {
  if (!reason) return '-';
  
  const labels: Record<ExitReason, string> = {
    TP1_HIT: 'TP1 Hit',
    TP2_HIT: 'TP2 Hit',
    TP3_HIT: 'TP3 Hit',
    SL_HIT: 'Stop Loss',
    MANUAL_EXIT: 'Manual Exit',
    TIME_EXIT: 'Time Exit',
    TRAILING_STOP: 'Trailing Stop',
    RISK_MANAGEMENT: 'Risk Management',
  };
  
  return labels[reason] || reason;
}

/**
 * Check if position is profitable
 */
export function isProfitable(pnl: number | null): boolean {
  return pnl !== null && pnl > 0;
}

/**
 * Get win rate color
 */
export function getWinRateColor(winRate: number): string {
  if (winRate >= 60) return '#22c55e'; // green
  if (winRate >= 50) return '#f59e0b'; // orange
  return '#ef4444'; // red
}
