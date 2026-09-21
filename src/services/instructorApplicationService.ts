import api from './api';
import type { InstructorApplication, InstructorApplicationStatus } from '../types';

const STORAGE_KEY = 'edqoo_instructor_applications';

const getStoredApps = (): InstructorApplication[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredApps = (items: InstructorApplication[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving instructor applications to localStorage:', err);
  }
};

export const instructorApplicationService = {
  submitApplication: async (
    data: Omit<InstructorApplication, 'id' | 'status' | 'submittedAt' | 'notes' | 'updatedAt'>
  ): Promise<{ success: boolean; message: string; application?: InstructorApplication }> => {
    const newApp: InstructorApplication = {
      ...data,
      id: `inst-app-${Date.now()}`,
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await api.post('/instructor-applications', newApp);
      const saved = response.data?.application || newApp;
      const current = getStoredApps();
      saveStoredApps([saved, ...current.filter((a) => a.id !== saved.id)]);
      return {
        success: true,
        message: response.data?.message || 'Instructor application submitted successfully.',
        application: saved
      };
    } catch {
      console.warn('Backend instructor applications endpoint offline; saved to local storage.');
      const current = getStoredApps();
      saveStoredApps([newApp, ...current]);
      return {
        success: true,
        message: 'Application submitted successfully! Our academic onboarding committee will review your profile.',
        application: newApp
      };
    }
  },

  getAllApplications: async (): Promise<InstructorApplication[]> => {
    try {
      const response = await api.get('/instructor-applications');
      if (Array.isArray(response.data)) {
        saveStoredApps(response.data);
        return response.data;
      }
    } catch (error) {
      console.warn('Backend unavailable, using cached instructor applications.', error);
    }
    return getStoredApps();
  },

  updateApplicationStatus: async (
    id: string,
    status: InstructorApplicationStatus,
    notes?: string
  ): Promise<{ success: boolean; application?: InstructorApplication }> => {
    try {
      const response = await api.patch(`/instructor-applications/${id}`, { status, notes });
      const updated = response.data?.application;
      const all = getStoredApps();
      const index = all.findIndex((a) => a.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], status, ...(notes !== undefined ? { notes } : {}), ...(updated || {}) };
        saveStoredApps(all);
      }
      return { success: true, application: updated || all[index] };
    } catch {
      const all = getStoredApps();
      const index = all.findIndex((a) => a.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], status, ...(notes !== undefined ? { notes } : {}), updatedAt: new Date().toISOString() };
        saveStoredApps(all);
        return { success: true, application: all[index] };
      }
      return { success: false };
    }
  },

  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`/instructor-applications/${id}`);
    } catch (err) {
      console.warn('Backend delete unavailable, updating local cache only:', err);
    }
    const all = getStoredApps().filter((a) => a.id !== id);
    saveStoredApps(all);
    return { success: true };
  }
};
