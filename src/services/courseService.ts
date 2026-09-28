import api from './api';
import { normalizeCourseCategories } from '../data/courses';
import type { Course } from '../types';

// Slug alias map for backwards compatibility of legacy links
const SLUG_ALIASES: Record<string, string> = {
  'master-program-data-science-ai': 'advanced-executive-program-data-science-ai',
  'master-program-python': 'python-programming',
  'master-program-ai-machine-learning': 'advanced-executive-program-data-science-ai',
  'master-program-data-analytics-ai': 'executive-professional-certificate-data-science-ai',
  'python-training-program': 'python-programming',
  'power-bi': 'advance-executive-power-bi',
  'excel': 'advance-executive-excel'
};

export const courseService = {
  getCourses: async (params?: { category?: string; level?: string; status?: string; search?: string; signal?: AbortSignal }): Promise<Course[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.level && params.level !== 'all') searchParams.append('level', params.level);
    if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    searchParams.append('_t', Date.now().toString());

    const queryString = searchParams.toString();
    const url = queryString ? `/courses?${queryString}` : `/courses?_t=${Date.now()}`;

    console.log('[COURSE API URL]', url);

    let lastError: any = null;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const response = await api.get(url, {
          signal: params?.signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const rawData: Course[] = Array.isArray(response.data) ? response.data : [];
        console.log('[COURSE API RESPONSE]', response.data);
        console.log('========== COURSE PIPELINE ==========');
        console.log('1. API URL:', url);
        console.log('2. HTTP status:', response.status);
        console.log('3. Raw response:', response.data);
        console.log('4. Extracted courses:', rawData);
        console.log('5. Course count:', rawData.length);
        console.log('====================================');
        return rawData.map(normalizeCourseCategories);
      } catch (error: any) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          console.log('[COURSES] Request was canceled/aborted.');
          throw error;
        }
        lastError = error;
        console.error('[COURSES API ERROR]', error);
        console.warn(`[COURSES] Fetch attempt ${attempt} failed:`, error.message);
        if (attempt <= maxRetries) {
          await new Promise((r) => setTimeout(r, 600 * attempt));
        }
      }
    }

    console.error('🔥 [COURSES] All fetch attempts failed:', lastError);
    throw lastError || new Error('Failed to retrieve courses from database.');
  },

  getCourseBySlug: async (slug: string, signal?: AbortSignal): Promise<Course | null> => {
    const normalizedSlug = SLUG_ALIASES[slug] || slug;
    let lastError: any = null;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const response = await api.get(`/courses/${normalizedSlug}?_t=${Date.now()}`, {
          signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (!response.data) return null;
        return normalizeCourseCategories(response.data);
      } catch (error: any) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          throw error;
        }
        if (error.response?.status === 404) {
          return null;
        }
        lastError = error;
        if (attempt <= maxRetries) {
          await new Promise((r) => setTimeout(r, 600 * attempt));
        }
      }
    }

    console.error(`🔥 [COURSES] Failed to fetch course details for "${slug}":`, lastError);
    throw lastError || new Error(`Failed to load details for ${slug}`);
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

  patchCourse: async (id: string, partialData: Partial<Course> & { source?: string }): Promise<{ success: boolean; course: Course }> => {
    const response = await api.patch(`/courses/${id}`, partialData);
    return {
      ...response.data,
      course: response.data.course ? normalizeCourseCategories(response.data.course) : response.data.course
    };
  },

  deleteCourse: async (id: string): Promise<{ success: boolean; message: string; courseId?: string; rowsDeleted?: number }> => {
    const deleteUrl = `/courses/${id}`;
    console.log('[ADMIN DELETE] URL:', deleteUrl);
    console.log('[ADMIN DELETE] Course ID:', id);

    try {
      const response = await api.delete(deleteUrl);
      console.log('[ADMIN DELETE RESPONSE]', response.status, response.data);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to delete course');
      }
      return response.data;
    } catch (error: any) {
      console.error('[ADMIN DELETE ERROR]', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete course from database';
      throw new Error(errorMessage);
    }
  }
};
