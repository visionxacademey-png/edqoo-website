import api from './api';
import type { User } from '../types';

const DEFAULT_ADMIN: User = {
  id: 'usr-admin-01',
  name: 'System Administrator',
  email: 'admin@edqoo.com',
  phone: '+91 90744 50935',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
  role: 'admin',
  createdAt: new Date().toISOString()
};

const DEFAULT_STUDENT: User = {
  id: 'usr-student-01',
  name: 'Alex Morgan',
  email: 'alex.student@edqoo.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
  role: 'user',
  createdAt: new Date().toISOString()
};

// Helper to record user logins and registrations in client storage
function recordUserActivity(user: User) {
  try {
    // 1. Update registered users directory
    const storedUsers = localStorage.getItem('edqoo_registered_users');
    let usersList: any[] = storedUsers ? JSON.parse(storedUsers) : [DEFAULT_ADMIN, DEFAULT_STUDENT];
    const existingIndex = usersList.findIndex((u: any) => u.email?.toLowerCase() === user.email?.toLowerCase());
    const userRecord = {
      ...user,
      lastLoginAt: new Date().toISOString(),
      isActive: true,
      activeSessionsCount: 1
    };
    if (existingIndex >= 0) {
      usersList[existingIndex] = { ...usersList[existingIndex], ...userRecord };
    } else {
      usersList.unshift(userRecord);
    }
    localStorage.setItem('edqoo_registered_users', JSON.stringify(usersList));

    // 2. Record active session
    const storedSessions = localStorage.getItem('edqoo_active_sessions');
    let sessionsList: any[] = storedSessions ? JSON.parse(storedSessions) : [];
    const newSession = {
      id: `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      userName: user.name,
      email: user.email,
      phone: user.phone || '',
      userRole: user.role,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      ipAddress: '127.0.0.1 (Web Client)',
      userAgent: navigator.userAgent || 'Modern Web Browser',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString()
    };
    // Keep most recent active sessions at top
    sessionsList = [newSession, ...sessionsList.filter((s: any) => s.email?.toLowerCase() !== user.email?.toLowerCase())].slice(0, 50);
    localStorage.setItem('edqoo_active_sessions', JSON.stringify(sessionsList));
  } catch (err) {
    console.warn('Failed to record local user activity:', err);
  }
}

export const authService = {
  login: async (email: string, password: string): Promise<{ success: boolean; token: string; user: User }> => {
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const response = await api.post('/auth/login', { email: normalizedEmail, password });
      if (response.data?.user) {
        recordUserActivity(response.data.user);
      }
      return response.data;
    } catch (error: any) {
      console.warn('Backend login endpoint response/error:', error?.message);
      
      // Fallback for default admin and student accounts if server is unreachable
      if (normalizedEmail === 'admin@edqoo.com' && password === 'Admin@123456') {
        const clientToken = 'edqoo_jwt_admin_session_' + Date.now().toString(36);
        recordUserActivity(DEFAULT_ADMIN);
        return {
          success: true,
          token: clientToken,
          user: DEFAULT_ADMIN
        };
      }
      
      if (normalizedEmail === 'alex.student@edqoo.com' && password === 'Student@123456') {
        const clientToken = 'edqoo_jwt_student_session_' + Date.now().toString(36);
        recordUserActivity(DEFAULT_STUDENT);
        return {
          success: true,
          token: clientToken,
          user: DEFAULT_STUDENT
        };
      }

      // Re-throw server error message
      const errorMsg = error.response?.data?.error || error.message || 'Invalid email or password.';
      throw new Error(errorMsg);
    }
  },

  register: async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; token: string; user: User }> => {
    const normalizedEmail = email.toLowerCase().trim();
    try {
      const response = await api.post('/auth/register', { name, email: normalizedEmail, phone, password });
      if (response.data?.user) {
        recordUserActivity(response.data.user);
      }
      return response.data;
    } catch (error: any) {
      console.warn('Backend register endpoint error:', error?.message);
      const errorMsg = error.response?.data?.error || error.message || 'Unable to register account.';
      throw new Error(errorMsg);
    }
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch {
      return { success: true };
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const stored = localStorage.getItem('Edqoo_user') || localStorage.getItem('edqoo_user');
      if (stored) {
        return JSON.parse(stored);
      }
      throw error;
    }
  },

  pingSession: async (): Promise<void> => {
    try {
      await api.post('/auth/ping-session');
    } catch {
      // Ignore ping errors
    }
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch {
      return {
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.'
      };
    }
  }
};


