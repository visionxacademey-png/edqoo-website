import api from './api';
import { courses as defaultCourses } from '../data/courses';
import type { Course } from '../types';

export const courseService = {
  getCourses: async (params?: { category?: string; level?: string; status?: string; search?: string }): Promise<Course[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
      if (params?.level && params.level !== 'all') searchParams.append('level', params.level);
      if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);

      const queryString = searchParams.toString();
      const url = queryString ? `/courses?${queryString}` : '/courses';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, returning client fallback courses.', error);
      return defaultCourses;
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      const response = await api.get(`/courses/${slug}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, searching client fallback courses for: ${slug}`, error);
      const course = defaultCourses.find((c) => c.slug === slug || c.id === slug);
      return course || null;
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<{ success: boolean; course: Course }> => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<{ success: boolean; course: Course }> => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};
