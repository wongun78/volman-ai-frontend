import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Useful for search inputs, API calls, etc.
 * @param value - value to debounce
 * @param delay - delay in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
