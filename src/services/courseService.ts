import api from './api';
import { courses } from '../data/courses';
import type { Course } from '../types';

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, returning client mock courses.', error);
      return courses;
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      const response = await api.get(`/courses/${slug}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, searching client mock courses for: ${slug}`, error);
      const course = courses.find((c) => c.slug === slug);
      return course || null;
    }
  }
};
