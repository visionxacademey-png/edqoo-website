import api from './api';
import type { AdminStats, DbStatus, AdminUser, UserSession } from '../types';

export const adminService = {
  // Get platform aggregate statistics
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  // Get NeonDB connection health & status
  getDbStatus: async (): Promise<DbStatus> => {
    const res = await api.get('/admin/db-status');
    return res.data;
  },

  // Get all registered users directory
  getUsers: async (search?: string, role?: string): Promise<AdminUser[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role && role !== 'all') params.append('role', role);
    
    const res = await api.get(`/admin/users?${params.toString()}`);
    return res.data;
  },

  // Get all active / logged in user sessions
  getActiveSessions: async (): Promise<UserSession[]> => {
    const res = await api.get('/admin/sessions');
    return res.data;
  },

  // Update a user's role (admin vs user)
  updateUserRole: async (userId: string, role: 'admin' | 'user'): Promise<{ success: boolean; user: any }> => {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  // Update a user's account status (active vs suspended)
  updateUserStatus: async (userId: string, isActive: boolean): Promise<{ success: boolean; user: any }> => {
    const res = await api.put(`/admin/users/${userId}/status`, { isActive });
    return res.data;
  },

  // Remotely terminate / revoke an active user session
  revokeSession: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/admin/sessions/${sessionId}`);
    return res.data;
  }
};
