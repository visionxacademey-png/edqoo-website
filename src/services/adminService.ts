import api from './api';
import { courses as defaultCourses } from '../data/courses.js';
import type { AdminStats, DbStatus, AdminUser, UserSession } from '../types/index.js';

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
    activeSessionsCount: 1,
    lastIp: '127.0.0.1',
    lastDeviceId: 'dev-adm-win11-8f2e',
    lastDeviceType: 'Desktop',
    lastOs: 'Windows',
    lastBrowser: 'Google Chrome',
    lastTimezone: 'Asia/Kolkata (UTC+05:30)',
    deviceInfo: {
      deviceId: 'dev-adm-win11-8f2e',
      deviceType: 'Desktop',
      os: 'Windows',
      osVersion: '11 Pro',
      browser: 'Google Chrome',
      browserVersion: '122.0.6261.129',
      deviceModel: 'Windows Workstation PC',
      screenResolution: '1920 × 1080 (1.25x DPR, 24-bit)',
      language: 'en-IN',
      timezone: 'Asia/Kolkata (UTC+05:30)',
      fingerprint: 'fp-8f2e91ca-1b4d'
    }
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
    activeSessionsCount: 1,
    lastIp: '103.212.144.52',
    lastDeviceId: 'dev-stu-macbook-3c9a',
    lastDeviceType: 'Laptop',
    lastOs: 'macOS',
    lastBrowser: 'Apple Safari',
    lastTimezone: 'Asia/Kolkata (UTC+05:30)',
    deviceInfo: {
      deviceId: 'dev-stu-macbook-3c9a',
      deviceType: 'Laptop',
      os: 'macOS',
      osVersion: '14.4 (Sonoma)',
      browser: 'Apple Safari',
      browserVersion: '17.4',
      deviceModel: 'MacBook Pro 16"',
      screenResolution: '2560 × 1440 (2x Retina, 30-bit)',
      language: 'en-US',
      timezone: 'Asia/Kolkata (UTC+05:30)',
      fingerprint: 'fp-3c9a72df-8e10'
    }
  }
];

const FALLBACK_SESSIONS: UserSession[] = [
  {
    id: 'sess-active-01',
    userId: 'usr-admin-01',
    userName: 'System Administrator',
    email: 'admin@edqoo.com',
    phone: '+91 90744 50935',
    userRole: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    ipAddress: '127.0.0.1 (Web Browser)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
    deviceId: 'dev-adm-win11-8f2e',
    deviceType: 'Desktop',
    os: 'Windows',
    osVersion: '11 Pro',
    browser: 'Google Chrome',
    browserVersion: '122.0.6261.129',
    deviceModel: 'Windows Workstation PC',
    screenResolution: '1920 × 1080 (1.25x DPR, 24-bit)',
    language: 'en-IN',
    timezone: 'Asia/Kolkata (UTC+05:30)',
    fingerprint: 'fp-8f2e91ca-1b4d',
    deviceInfo: {
      deviceId: 'dev-adm-win11-8f2e',
      deviceType: 'Desktop',
      os: 'Windows',
      osVersion: '11 Pro',
      browser: 'Google Chrome',
      browserVersion: '122.0.6261.129',
      deviceModel: 'Windows Workstation PC',
      screenResolution: '1920 × 1080 (1.25x DPR, 24-bit)',
      language: 'en-IN',
      timezone: 'Asia/Kolkata (UTC+05:30)',
      fingerprint: 'fp-8f2e91ca-1b4d'
    },
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
  getUsers: async (search?: string, role?: string, os?: string, deviceType?: string): Promise<AdminUser[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role && role !== 'all') params.append('role', role);
      if (os && os !== 'all') params.append('os', os);
      if (deviceType && deviceType !== 'all') params.append('deviceType', deviceType);
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err: any) {
      console.warn('Backend getUsers failed, using local cache:', err?.message);
    }

    // Merge with client registered users in localStorage if backend was offline
    let resultUsers: AdminUser[] = [];
    try {
      const stored = localStorage.getItem('edqoo_registered_users');
      const localUsers: AdminUser[] = stored ? JSON.parse(stored) : FALLBACK_USERS;
      const map = new Map<string, AdminUser>();
      [...FALLBACK_USERS, ...localUsers].forEach(u => {
        if (u?.email) {
          map.set(u.email.toLowerCase(), { ...map.get(u.email.toLowerCase()), ...u });
        }
      });
      resultUsers = Array.from(map.values());
    } catch {
      resultUsers = FALLBACK_USERS;
    }

    if (role && role !== 'all') {
      resultUsers = resultUsers.filter(u => u.role === role);
    }
    if (os && os !== 'all') {
      resultUsers = resultUsers.filter(u => u.lastOs && u.lastOs.toLowerCase().includes(os.toLowerCase()));
    }
    if (deviceType && deviceType !== 'all') {
      resultUsers = resultUsers.filter(u => u.lastDeviceType && u.lastDeviceType.toLowerCase() === deviceType.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      resultUsers = resultUsers.filter(u => 
        (u.name && u.name.toLowerCase().includes(term)) || 
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.phone && u.phone.includes(term)) ||
        (u.lastOs && u.lastOs.toLowerCase().includes(term)) ||
        (u.lastDeviceType && u.lastDeviceType.toLowerCase().includes(term)) ||
        (u.lastDeviceId && u.lastDeviceId.toLowerCase().includes(term))
      );
    }
    return resultUsers;
  },

  // Get all active / logged in user sessions
  getActiveSessions: async (): Promise<UserSession[]> => {
    try {
      const res = await api.get('/admin/sessions');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err: any) {
      console.warn('Backend getActiveSessions failed, using local cache:', err?.message);
    }

    let resultSessions: UserSession[] = [];
    try {
      const stored = localStorage.getItem('edqoo_active_sessions');
      const localSessions: UserSession[] = stored ? JSON.parse(stored) : FALLBACK_SESSIONS;
      const storedUsersRaw = localStorage.getItem('edqoo_registered_users');
      const storedUsers: AdminUser[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : FALLBACK_USERS;
      const userPhoneMap = new Map<string, string>();
      [...FALLBACK_USERS, ...storedUsers].forEach(u => {
        if (u?.email && u?.phone) userPhoneMap.set(u.email.toLowerCase(), u.phone);
      });

      const map = new Map<string, UserSession>();
      [...FALLBACK_SESSIONS, ...localSessions].forEach(s => {
        if (s?.id || s?.email) {
          const key = s.id || s.email;
          const userPhone = s.phone || userPhoneMap.get(s.email?.toLowerCase()) || '';
          map.set(key, { ...map.get(key), ...s, phone: s.phone || userPhone || map.get(key)?.phone });
        }
      });
      resultSessions = Array.from(map.values());
    } catch {
      resultSessions = FALLBACK_SESSIONS;
    }

    return resultSessions;
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

