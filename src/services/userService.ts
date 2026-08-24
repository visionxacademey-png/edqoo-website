import api from './api';
import type { User } from '../types';

export const userService = {
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, returning client mock profile.');
      const savedUser = localStorage.getItem('Edqoo_user');
      if (savedUser) return JSON.parse(savedUser);
      throw new Error('User not authenticated.');
    }
  },

  updateProfile: async (name: string, phone: string): Promise<User> => {
    try {
      const response = await api.put('/users/profile', { name, phone });
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, updating client profile locally.');
      const savedUser = localStorage.getItem('Edqoo_user');
      if (savedUser) {
        const user: User = JSON.parse(savedUser);
        const updated = { ...user, name, phone };
        localStorage.setItem('Edqoo_user', JSON.stringify(updated));
        return updated;
      }
      throw new Error('User not authenticated.');
    }
  }
};
