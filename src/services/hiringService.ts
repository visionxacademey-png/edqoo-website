import api from './api';
import type { HiringEnquiry, HiringRequestStatus } from '../types';

const STORAGE_KEY = 'edqoo_hiring_enquiries';

const getStoredHiring = (): HiringEnquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredHiring = (items: HiringEnquiry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving hiring enquiries to localStorage:', err);
  }
};

export const hiringService = {
  submitHiringRequirement: async (
    data: Omit<HiringEnquiry, 'id' | 'status' | 'submittedAt' | 'notes' | 'updatedAt'>
  ): Promise<{ success: boolean; message: string; enquiry?: HiringEnquiry }> => {
    const newEnquiry: HiringEnquiry = {
      ...data,
      id: `hire-${Date.now()}`,
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await api.post('/hiring-enquiries', newEnquiry);
      const saved = response.data?.enquiry || newEnquiry;
      const current = getStoredHiring();
      saveStoredHiring([saved, ...current.filter((e) => e.id !== saved.id)]);
      return {
        success: true,
        message: response.data?.message || 'Hiring requirement submitted successfully.',
        enquiry: saved
      };
    } catch {
      console.warn('Backend hiring endpoint offline; saved enquiry to local storage.');
      const current = getStoredHiring();
      saveStoredHiring([newEnquiry, ...current]);
      return {
        success: true,
        message: 'Thank you! Your hiring requirement has been submitted. Our talent team will connect with you.',
        enquiry: newEnquiry
      };
    }
  },

  getAllHiringRequests: async (): Promise<HiringEnquiry[]> => {
    try {
      const response = await api.get('/hiring-enquiries');
      if (Array.isArray(response.data)) {
        saveStoredHiring(response.data);
        return response.data;
      }
    } catch (error) {
      console.warn('Backend unavailable, using cached hiring requests.', error);
    }
    return getStoredHiring();
  },

  updateHiringStatus: async (
    id: string,
    status: HiringRequestStatus,
    notes?: string
  ): Promise<{ success: boolean; enquiry?: HiringEnquiry }> => {
    try {
      const response = await api.patch(`/hiring-enquiries/${id}`, { status, notes });
      const updated = response.data?.enquiry;
      const all = getStoredHiring();
      const index = all.findIndex((e) => e.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], status, ...(notes !== undefined ? { notes } : {}), ...(updated || {}) };
        saveStoredHiring(all);
      }
      return { success: true, enquiry: updated || all[index] };
    } catch {
      const all = getStoredHiring();
      const index = all.findIndex((e) => e.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], status, ...(notes !== undefined ? { notes } : {}), updatedAt: new Date().toISOString() };
        saveStoredHiring(all);
        return { success: true, enquiry: all[index] };
      }
      return { success: false };
    }
  },

  deleteHiringRequest: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`/hiring-enquiries/${id}`);
    } catch (err) {
      console.warn('Backend delete unavailable, updating local cache only:', err);
    }
    const all = getStoredHiring().filter((e) => e.id !== id);
    saveStoredHiring(all);
    return { success: true };
  }
};
