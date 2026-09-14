import api from './api';
import {
  courses as defaultCourses,
  filterCoursesByCategory,
  searchCourses,
  normalizeCourseCategories
} from '../data/courses';
import type { Course } from '../types';

// Slug alias map for backwards compatibility
const SLUG_ALIASES: Record<string, string> = {
  'master-program-data-science-ai': 'advanced-executive-program-data-science-ai',
  'master-program-python': 'advance-executive-python',
  'master-program-ai-machine-learning': 'advanced-executive-program-data-science-ai',
  'master-program-data-analytics-ai': 'executive-professional-certificate-data-science-ai'
};

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
      const rawData: Course[] = Array.isArray(response.data) ? response.data : [];
      return rawData.map(normalizeCourseCategories);
    } catch (error) {
      console.warn('Backend unavailable, returning client fallback courses.', error);
      let result = defaultCourses.map(normalizeCourseCategories);

      if (params?.category && params.category !== 'all' && params.category !== 'All Categories') {
        result = filterCoursesByCategory(result, params.category);
      }
      if (params?.level && params.level !== 'all') {
        result = result.filter((c) => c.level.toLowerCase().includes((params.level as string).toLowerCase()));
      }
      if (params?.status && params.status !== 'all') {
        result = result.filter((c) => c.status === params.status);
      }
      if (params?.search) {
        result = searchCourses(result, params.search);
      }

      return result;
    }
  },

  getCourseBySlug: async (slug: string): Promise<Course | null> => {
    try {
      const response = await api.get(`/courses/${slug}`);
      if (!response.data) return null;
      return normalizeCourseCategories(response.data);
    } catch (error) {
      console.warn(`Backend unavailable, searching client fallback courses for: ${slug}`, error);
      const normalizedSlug = SLUG_ALIASES[slug] || slug;
      const course = defaultCourses.find(
        (c) => c.slug === normalizedSlug || c.id === normalizedSlug || c.slug === slug || c.id === slug
      );
      return course ? normalizeCourseCategories(course) : null;
    }
  },

  createCourse: async (courseData: Partial<Course>): Promise<{ success: boolean; course: Course }> => {
    const response = await api.post('/courses', courseData);
    return {
      ...response.data,
      course: response.data.course ? normalizeCourseCategories(response.data.course) : response.data.course
    };
  },

  updateCourse: async (id: string, courseData: Partial<Course>): Promise<{ success: boolean; course: Course }> => {
    const response = await api.put(`/courses/${id}`, courseData);
    return {
      ...response.data,
      course: response.data.course ? normalizeCourseCategories(response.data.course) : response.data.course
    };
  },

  deleteCourse: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  }
};
