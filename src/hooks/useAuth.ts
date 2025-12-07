import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, LoginRequest, RegisterRequest, LoginResponse } from '../types';
import * as authService from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

/**
 * Custom hook for authentication management
 * Provides auth state and methods throughout the app
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await authService.login(credentials);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await authService.register(data);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(role);
  }, []);

  const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false;

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
  };
}
