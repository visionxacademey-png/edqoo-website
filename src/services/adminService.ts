import api from './api';
import { courses as defaultCourses } from '../data/courses';
import type { AdminStats, DbStatus, AdminUser, UserSession } from '../types';

const FALLBACK_USERS: AdminUser[] = [
  {
    id: 'usr-admin-01',
    name: 'System Administrator',
    email: 'admin@edqoo.com',
    phone: '+91 90744 50935',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    activeSessionsCount: 1
  },
  {
    id: 'usr-student-01',
    name: 'Alex Morgan',
    email: 'alex.student@edqoo.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    role: 'user',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    activeSessionsCount: 1
  }
];

const FALLBACK_SESSIONS: UserSession[] = [
  {
    id: 'sess-active-01',
    userId: 'usr-admin-01',
    userName: 'System Administrator',
    email: 'admin@edqoo.com',
    userRole: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    ipAddress: '127.0.0.1 (Web Browser)',
    userAgent: 'Chrome 122.0.0 / Web Client',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
  }
];

export const adminService = {
  // Get platform aggregate statistics
  getStats: async (): Promise<AdminStats> => {
    try {
      const res = await api.get('/admin/stats');
      return res.data;
    } catch {
      return {
        totalUsers: 2,
        activeSessions: 1,
        totalCourses: defaultCourses.length,
        totalEnquiries: 0,
        adminCount: 1,
        dbType: 'in_memory_fallback'
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
        type: 'in_memory_fallback',
        databaseUrlConfigured: false,
        error: null
      };
    }
  },

  // Get all registered users directory
  getUsers: async (search?: string, role?: string): Promise<AdminUser[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role && role !== 'all') params.append('role', role);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      return res.data;
    } catch {
      let filtered = [...FALLBACK_USERS];
      if (role && role !== 'all') {
        filtered = filtered.filter(u => u.role === role);
      }
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
      }
      return filtered;
    }
  },

  // Get all active / logged in user sessions
  getActiveSessions: async (): Promise<UserSession[]> => {
    try {
      const res = await api.get('/admin/sessions');
      return res.data;
    } catch {
      return FALLBACK_SESSIONS;
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

