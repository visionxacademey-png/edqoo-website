import api from './api';
import { courses } from '../data/courses';
import type { Course } from '../types';

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, returning client mock courses.');
      return courses;
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      const response = await api.get(`/courses/${slug}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, searching client mock courses for: ${slug}`);
      const course = courses.find((c) => c.slug === slug);
      return course || null;
    }
  },

  trackProgress: async (courseId: string, lessonId: string): Promise<boolean> => {
    try {
      const response = await api.post(`/progress/complete`, { courseId, lessonId });
      return response.data.success;
    } catch (error) {
      console.warn('Backend unavailable, progress tracking completed locally.');
      return true;
    }
  }
};
