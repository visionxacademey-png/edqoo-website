import api from './api';
import type { Category } from '../types';

export const categoryService = {
  getCategories: async (signal?: AbortSignal): Promise<Category[]> => {
    const url = `/categories?_t=${Date.now()}`;
    let lastError: any = null;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        const response = await api.get(url, {
          signal,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const data: Category[] = Array.isArray(response.data) ? response.data : [];
        return data.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
      } catch (error: any) {
        if (error.name === 'CanceledError' || error.name === 'AbortError') {
          throw error;
        }
        lastError = error;
        console.warn(`[CATEGORIES] Fetch attempt ${attempt} failed:`, error.message);
        if (attempt <= maxRetries) {
          await new Promise((r) => setTimeout(r, 500 * attempt));
        }
      }
    }

    console.error('🔥 [CATEGORIES] All fetch attempts failed:', lastError);
    throw lastError || new Error('Failed to retrieve categories from database.');
  },

  getAllCategories: async (signal?: AbortSignal): Promise<Category[]> => {
    try {
      const response = await api.get(`/categories/all?_t=${Date.now()}`, { signal });
      const data: Category[] = Array.isArray(response.data) ? response.data : [];
      return data.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') throw error;
      console.error('[ADMIN CATEGORIES ERROR]', error);
      throw error;
    }
  },

  getCategoryBySlug: async (slugOrId: string, signal?: AbortSignal): Promise<Category | null> => {
    try {
      const response = await api.get(`/categories/${encodeURIComponent(slugOrId)}?_t=${Date.now()}`, {
        signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      return response.data || null;
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') throw error;
      if (error.response?.status === 404) return null;
      console.error(`🔥 [CATEGORY DETAILS] Failed to fetch category "${slugOrId}":`, error);
      throw error;
    }
  },

  createCategory: async (data: Partial<Category>): Promise<{ success: boolean; category: Category }> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<{ success: boolean; category: Category }> => {
    const response = await api.put(`/categories/${encodeURIComponent(id)}`, data);
    return response.data;
  },

  reorderCategories: async (orders: Array<{ id: string; displayOrder: number }>): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/categories/reorder', { orders });
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/categories/${encodeURIComponent(id)}`);
    return response.data;
  }
};
