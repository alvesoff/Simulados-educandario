import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Registro
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Verificar token
  async verifyToken(): Promise<{ user: User }> {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ success: boolean; data: { tokens: { accessToken: string; refreshToken: string } } }> {
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
  },

  // Logout de todos os dispositivos
  async logoutAll(): Promise<void> {
    await api.post('/api/auth/logout-all');
  },

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  // Esqueci a senha
  async forgotPassword(email: string): Promise<void> {
    await api.post('/api/auth/forgot-password', { email });
  },

  // Resetar senha
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/reset-password', { token, newPassword });
  }
};