import api from './api';
import { instructors as defaultInstructors } from '../data/instructors';
import type { Instructor } from '../types';

export const instructorService = {
  getInstructors: async (): Promise<Instructor[]> => {
    try {
      const response = await api.get('/instructors');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return defaultInstructors;
    } catch (error) {
      console.warn('Backend unavailable, returning client fallback instructors.', error);
      return defaultInstructors;
    }
  },

  getInstructorById: async (id: string): Promise<Instructor | null> => {
    try {
      const response = await api.get(`/instructors/${id}`);
      if (response.data) return response.data;
      return defaultInstructors.find((i) => i.id === id) || null;
    } catch (error) {
      console.warn(`Backend unavailable, searching client fallback instructors for: ${id}`, error);
      return defaultInstructors.find((i) => i.id === id) || null;
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
