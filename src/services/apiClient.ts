import type { ApiResponse } from '../types/trading';
import { getToken, logout } from './authService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Enhanced API client with ApiResponse wrapper support
 * Automatically unwraps successful responses and handles errors consistently
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  // Get JWT token from localStorage
  const token = getToken();
  
  // Inject Authorization header if token exists
  const headers = {
    ...options?.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Parse response body
    const apiResponse: ApiResponse<T> = await response.json();
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      logout();
      window.location.href = '/login';
      throw new ApiError('Session expired. Please login again.', 401);
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (response.status === 403) {
      throw new ApiError(
        apiResponse.error?.message || 'Access denied. You don\'t have permission.',
        403,
        'ACCESS_DENIED'
      );
    }
    
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
