import type { ApiResponse } from '../types';
import { ENV, LOCAL_STORAGE_KEYS } from '../config';

/**
 * Get JWT token from localStorage
 */
function getToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
}

/**
 * Clear auth data and redirect to login
 */
function handleUnauthorized(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_INFO);
  window.location.href = '/login';
}

/**
 * Custom error class for API errors
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

  getUserMessage(): string {
    if (this.code === 'VALIDATION_ERROR') {
      return 'Please check your input and try again.';
    }
    if (this.code === 'UNAUTHORIZED') {
      return 'Session expired. Please login again.';
    }
    if (this.code === 'FORBIDDEN' || this.code === 'ACCESS_DENIED') {
      return 'You don\'t have permission to perform this action.';
    }
    if (this.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return this.message || 'An error occurred. Please try again.';
  }
}

/**
 * Enhanced API client with ApiResponse wrapper support
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${ENV.API_BASE_URL}${path}`;
  
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const apiResponse: ApiResponse<T> = await response.json();
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      handleUnauthorized();
      throw new ApiError('Session expired. Please login again.', 401, 'UNAUTHORIZED');
    }
    
    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new ApiError(
        apiResponse.error?.message || 'Access denied.',
        403,
        apiResponse.error?.code || 'ACCESS_DENIED',
        apiResponse.error?.details
      );
    }
    
    if (!response.ok || !apiResponse.success) {
      const error = apiResponse.error;
      throw new ApiError(
        error?.message || `Request failed with status ${response.status}`,
        response.status,
        error?.code,
        error?.details
      );
    }
    
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
 * Helper methods for common HTTP methods
 */
export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(path: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),

  patch: <T>(path: string, data?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
};
