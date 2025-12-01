import type { ApiResponse } from '../types/trading';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Enhanced API client with ApiResponse wrapper support
 * Automatically unwraps successful responses and handles errors consistently
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  try {
    const response = await fetch(url, options);
    
    // Parse response body
    const apiResponse: ApiResponse<T> = await response.json();
    
    if (!response.ok || !apiResponse.success) {
      // Extract error details from ApiResponse wrapper
      const error = apiResponse.error;
      throw new ApiError(
        error?.message || `Request failed with status ${response.status}`,
        response.status,
        error?.code,
        error?.details
      );
    }
    
    // Unwrap successful response
    if (apiResponse.data === null) {
      throw new ApiError('No data returned from server', response.status);
    }
    
    return apiResponse.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(error.message, 0);
    }
    throw new ApiError('An unknown error occurred', 0);
  }
}

/**
 * Custom error class for API errors with enhanced metadata
 */
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    // Handle specific error codes
    switch (this.code) {
      case 'SYMBOL_NOT_FOUND':
        return 'The requested symbol was not found. Please check the symbol code.';
      case 'INVALID_SIGNAL':
        return 'Invalid trading signal detected. Please try again with different parameters.';
      case 'MARKET_DATA_ERROR':
        return 'Unable to fetch market data. Please try again later.';
      case 'AI_SERVICE_ERROR':
        return 'AI service is temporarily unavailable. Please try again later.';
      case 'VALIDATION_ERROR':
        return `Validation failed: ${this.message}`;
      default:
        return this.message;
    }
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return this.status >= 500 || this.code === 'MARKET_DATA_ERROR' || this.code === 'AI_SERVICE_ERROR';
  }
}

export function getApiBase(): string {
  return API_BASE;
}
