/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username (alphanumeric, 3-50 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 * At least 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * Get password strength score (0-100)
 */
export function getPasswordStrength(password: string): number {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Validate price value
 */
export function isValidPrice(price: number | string): boolean {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validate quantity value
 */
export function isValidQuantity(quantity: number | string): boolean {
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validate stop loss vs entry price
 */
export function isValidStopLoss(
  entry: number,
  stopLoss: number,
  direction: 'LONG' | 'SHORT'
): boolean {
  if (!isValidPrice(entry) || !isValidPrice(stopLoss)) return false;
  
  if (direction === 'LONG') {
    return stopLoss < entry;
  } else {
    return stopLoss > entry;
  }
}

/**
 * Validate take profit vs entry price
 */
export function isValidTakeProfit(
  entry: number,
  takeProfit: number,
  direction: 'LONG' | 'SHORT'
): boolean {
  if (!isValidPrice(entry) || !isValidPrice(takeProfit)) return false;
  
  if (direction === 'LONG') {
    return takeProfit > entry;
  } else {
    return takeProfit < entry;
  }
}
