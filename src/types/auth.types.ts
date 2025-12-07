// ==================== Authentication Types ====================
export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  roles: string[];
  status: string;
}

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

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  roles: string[];
  status: string;
}
