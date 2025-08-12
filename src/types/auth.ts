export interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'ADMIN' | 'STAFF';
  schoolId: string;
  school?: {
    id: string;
    name: string;
    code: string;
  };
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'TEACHER' | 'ADMIN';
  schoolId: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  sessionId?: string;
}

export interface AuthError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}