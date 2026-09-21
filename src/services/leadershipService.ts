import api from './api';
import type { LeadershipCouncilMember } from '../types';

const STORAGE_KEY = 'edqoo_leadership_members';

const getStoredMembers = (): LeadershipCouncilMember[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredMembers = (items: LeadershipCouncilMember[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving leadership members to localStorage:', err);
  }
};

export const leadershipService = {
  getMembers: async (): Promise<LeadershipCouncilMember[]> => {
    try {
      const response = await api.get('/leadership');
      if (Array.isArray(response.data)) {
        saveStoredMembers(response.data);
        return response.data;
      }
    } catch (error) {
      console.warn('Backend unavailable, returning client fallback leadership members.', error);
    }
    return getStoredMembers();
  },

  getMemberById: async (id: string): Promise<LeadershipCouncilMember | null> => {
    try {
      const response = await api.get(`/leadership/${id}`);
      if (response.data) return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, searching client storage for member: ${id}`, error);
    }
    return getStoredMembers().find((m) => m.id === id) || null;
  },

  createMember: async (
    data: Partial<LeadershipCouncilMember>
  ): Promise<{ success: boolean; member: LeadershipCouncilMember }> => {
    const newMember: LeadershipCouncilMember = {
      id: data.id || `lead-${Date.now()}`,
      name: data.name || '',
      profileImage: data.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      designation: data.designation || '',
      organization: data.organization || '',
      qualification: data.qualification,
      experience: data.experience,
      expertise: data.expertise || [],
      shortBio: data.shortBio || '',
      detailedBio: data.detailedBio,
      leadershipExperience: data.leadershipExperience,
      achievements: data.achievements || [],
      publications: data.publications || [],
      linkedin: data.linkedin,
      website: data.website,
      email: data.email,
      displayOrder: data.displayOrder || 0,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await api.post('/leadership', data);
      const saved = response.data?.member || newMember;
      const all = getStoredMembers();
      saveStoredMembers([...all.filter((m) => m.id !== saved.id), saved]);
      return { success: true, member: saved };
    } catch {
      const all = getStoredMembers();
      saveStoredMembers([...all.filter((m) => m.id !== newMember.id), newMember]);
      return { success: true, member: newMember };
    }
  },

  updateMember: async (
    id: string,
    data: Partial<LeadershipCouncilMember>
  ): Promise<{ success: boolean; member: LeadershipCouncilMember }> => {
    try {
      const response = await api.put(`/leadership/${id}`, data);
      const updated = response.data?.member;
      const all = getStoredMembers();
      const index = all.findIndex((m) => m.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], ...data, ...(updated || {}), updatedAt: new Date().toISOString() };
        saveStoredMembers(all);
      }
      return { success: true, member: updated || all[index] };
    } catch {
      const all = getStoredMembers();
      const index = all.findIndex((m) => m.id === id);
      if (index !== -1) {
        all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() };
        saveStoredMembers(all);
        return { success: true, member: all[index] };
      }
      return { success: false, member: data as LeadershipCouncilMember };
    }
  },

  deleteMember: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await api.delete(`/leadership/${id}`);
    } catch (err) {
      console.warn('Backend delete unavailable, removing from local cache:', err);
    }
    const all = getStoredMembers().filter((m) => m.id !== id);
    saveStoredMembers(all);
    return { success: true, message: 'Council member removed.' };
  }
};
