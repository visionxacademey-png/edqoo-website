import api from './api';
import type { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: User }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; token: string; user: User }> => {
    const response = await api.post('/auth/register', { name, email, phone, password });
    return response.data;
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch {
      return { success: true };
    }
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch {
      return {
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.'
      };
    }
  }
};
