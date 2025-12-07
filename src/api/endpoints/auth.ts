import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
} from '../../types';
import { api } from '../client';
import { API_ROUTES, LOCAL_STORAGE_KEYS } from '../../config';

/**
 * Login user and store JWT token
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, request);
  
  // Store token and user info
  localStorage.setItem(LOCAL_STORAGE_KEYS.JWT_TOKEN, response.token);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));
  
  return response;
}

/**
 * Register new user
 */
export async function register(request: RegisterRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(API_ROUTES.AUTH.REGISTER, request);
  
  // Auto-login after registration
  localStorage.setItem(LOCAL_STORAGE_KEYS.JWT_TOKEN, response.token);
  localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));
  
  return response;
}

/**
 * Logout user (clear token)
 */
export function logout(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_INFO);
}

/**
 * Get stored JWT token
 */
export function getToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.JWT_TOKEN);
}

/**
 * Get current user info
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Check if user has specific role
 */
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.roles.includes(role) ?? false;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  return hasRole('ROLE_ADMIN');
}
