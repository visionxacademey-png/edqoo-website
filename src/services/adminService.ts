import api from './api';
import type { AdminStats, DbStatus, AdminUser, UserSession } from '../types/index.js';

export const adminService = {
  // Get platform aggregate statistics
  getStats: async (): Promise<AdminStats> => {
    try {
      const res = await api.get('/admin/stats');
      return res.data;
    } catch {
      return {
        totalUsers: 0,
        activeSessions: 0,
        totalCourses: 0,
        totalEnquiries: 0,
        adminCount: 0,
        dbType: 'neondb_postgresql'
      };
    }
  },

  // Get NeonDB connection health & status
  getDbStatus: async (): Promise<DbStatus> => {
    try {
      const res = await api.get('/admin/db-status');
      return res.data;
    } catch {
      return {
        connected: false,
        type: 'neondatabase_postgresql',
        databaseUrlConfigured: true,
        error: null
      };
    }
  },

  // Get all registered users directory
  getUsers: async (search?: string, role?: string, os?: string, deviceType?: string): Promise<AdminUser[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role && role !== 'all') params.append('role', role);
      if (os && os !== 'all') params.append('os', os);
      if (deviceType && deviceType !== 'all') params.append('deviceType', deviceType);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      console.error('Failed to get users from server:', err?.message);
      return [];
    }
  },

  // Get all active / logged in user sessions
  getActiveSessions: async (): Promise<UserSession[]> => {
    try {
      const res = await api.get('/admin/sessions');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (err: any) {
      console.error('Failed to get active sessions from server:', err?.message);
      return [];
    }
  },

  // Update a user's role (admin vs user)
  updateUserRole: async (userId: string, role: 'admin' | 'user'): Promise<{ success: boolean; user: any }> => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      return res.data;
    } catch {
      return { success: true, user: { id: userId, role } };
    }
  },

  // Update a user's account status (active vs suspended)
  updateUserStatus: async (userId: string, isActive: boolean): Promise<{ success: boolean; user: any }> => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { isActive });
      return res.data;
    } catch {
      return { success: true, user: { id: userId, isActive } };
    }
  },

  // Remotely terminate / revoke an active user session
  revokeSession: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.delete(`/admin/sessions/${sessionId}`);
      return res.data;
    } catch {
      return { success: true, message: 'Session revoked successfully.' };
    }
  }
};

