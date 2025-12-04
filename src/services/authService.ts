import { apiFetch } from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  roles: string[];
  status: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;  // milliseconds
  user: UserInfo;
}

const AUTH_BASE = '/api/auth';

/**
 * Login user and store JWT token
 */
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiFetch<LoginResponse>(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  // Store token in localStorage
  localStorage.setItem('jwt_token', response.token);
  localStorage.setItem('user_info', JSON.stringify(response.user));
  
  return response;
};

/**
 * Register new user
 */
export const register = async (request: RegisterRequest): Promise<LoginResponse> => {
  const response = await apiFetch<LoginResponse>(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  // Auto-login after registration
  localStorage.setItem('jwt_token', response.token);
  localStorage.setItem('user_info', JSON.stringify(response.user));
  
  return response;
};

/**
 * Logout user (clear token)
 */
export const logout = (): void => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
};

/**
 * Get stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

/**
 * Get current user info
 */
export const getCurrentUser = (): UserInfo | null => {
  const userStr = localStorage.getItem('user_info');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.roles.includes(role) ?? false;
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return hasRole('ROLE_ADMIN');
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  // JWT tokens have expiration in payload
  const token = getToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};
