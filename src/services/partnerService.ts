import api from './api';
import type { PartnerEnquiry, PartnerRequestStatus } from '../types';

const STORAGE_KEY = 'edqoo_partner_enquiries';

const getStoredPartners = (): PartnerEnquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredPartners = (items: PartnerEnquiry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving partner enquiries to localStorage:', err);
  }
};

export const partnerService = {
  submitPartnerRequest: async (
    data: Omit<PartnerEnquiry, 'id' | 'status' | 'submittedAt' | 'notes' | 'updatedAt'>
  ): Promise<{ success: boolean; message: string; enquiry?: PartnerEnquiry }> => {
    const newEnquiry: PartnerEnquiry = {
      ...data,
      id: `ptnr-${Date.now()}`,
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await api.post('/partner-enquiries', newEnquiry);
      const saved = response.data?.enquiry || newEnquiry;
      const current = getStoredPartners();
      saveStoredPartners([saved, ...current.filter((p) => p.id !== saved.id)]);
      return {
        success: true,
        message: response.data?.message || 'Partnership request submitted successfully.',
        enquiry: saved
      };
    } catch {
      console.warn('Backend partner endpoint offline; saved enquiry to local storage.');
      const current = getStoredPartners();
      saveStoredPartners([newEnquiry, ...current]);
      return {
        success: true,
        message: 'Thank you! Your partnership request has been submitted. Our team will connect with you.',
        enquiry: newEnquiry
      };
    }
  },

  getAllPartnerRequests: async (): Promise<PartnerEnquiry[]> => {
    try {
      const response = await api.get('/partner-enquiries');
      if (Array.isArray(response.data)) {
        saveStoredPartners(response.data);
        return response.data;
      }
    } catch (error) {
      console.warn('Backend unavailable, using cached partner enquiries.', error);
    }
    return getStoredPartners();
  },

  updatePartnerStatus: async (
    id: string,
    status: PartnerRequestStatus,
    notes?: string
  ): Promise<{ success: boolean; enquiry?: PartnerEnquiry }> => {
    try {
      const response = await api.patch(`/partner-enquiries/${id}`, { status, notes });
      const updated = response.data?.enquiry;
      const all = getStoredPartners();
      const index = all.findIndex((p) => p.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], status, ...(notes !== undefined ? { notes } : {}), ...(updated || {}) };
        saveStoredPartners(all);
      }
      return { success: true, enquiry: updated || all[index] };
    } catch {
      const all = getStoredPartners();
      const index = all.findIndex((p) => p.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], status, ...(notes !== undefined ? { notes } : {}), updatedAt: new Date().toISOString() };
        saveStoredPartners(all);
        return { success: true, enquiry: all[index] };
      }
      return { success: false };
    }
  },

  deletePartnerRequest: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`/partner-enquiries/${id}`);
    } catch (err) {
      console.warn('Backend delete unavailable, updating local cache only:', err);
    }
    const all = getStoredPartners().filter((p) => p.id !== id);
    saveStoredPartners(all);
    return { success: true };
  }
};
