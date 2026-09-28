import api from './api';
import type { Instructor } from '../types';

export const instructorService = {
  getInstructors: async (): Promise<Instructor[]> => {
    try {
      const response = await api.get(`/instructors?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to get instructors from server:', error);
      return [];
    }
  },

  getInstructorById: async (id: string): Promise<Instructor | null> => {
    try {
      const response = await api.get(`/instructors/${id}?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (response.data) return response.data;
      return null;
    } catch (error) {
      console.error(`Failed to get instructor from server for: ${id}`, error);
      return null;
    }
  },

  createInstructor: async (data: Partial<Instructor>): Promise<{ success: boolean; instructor: Instructor }> => {
    const response = await api.post('/instructors', data);
    return response.data;
  },

  updateInstructor: async (id: string, data: Partial<Instructor>): Promise<{ success: boolean; instructor: Instructor }> => {
    const response = await api.put(`/instructors/${id}`, data);
    return response.data;
  },

  deleteInstructor: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/instructors/${id}`);
    return response.data;
  }
};
