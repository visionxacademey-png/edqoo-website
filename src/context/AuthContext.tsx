import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface UpdateProfileData {
  name: string;
  phone?: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (dataOrName: string | UpdateProfileData, phone?: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_KEY = 'Edqoo_user';
const TOKEN_KEY = 'Edqoo_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    const savedUser = localStorage.getItem(USER_KEY) || localStorage.getItem('edqoo_user');
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('edqoo_token');

    if (token) {
      try {
        // Fetch fresh user profile from backend
        const freshUser = await authService.getMe();
        setUser(freshUser);
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        localStorage.setItem('edqoo_user', JSON.stringify(freshUser));
      } catch {
        // If backend token check failed, fall back to stored user or remove if expired
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem('edqoo_user');
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('edqoo_token');
            setUser(null);
          }
        }
      }
    } else if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('edqoo_user');
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem('edqoo_token', res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        localStorage.setItem('edqoo_user', JSON.stringify(res.user));
        setUser(res.user);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please check your credentials.' };
    } catch (err: any) {
      setIsLoading(false);
      const errorMsg = err.response?.data?.error || err.message || 'Unable to connect to server.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, phone, password);
      if (res.success && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem('edqoo_token', res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        localStorage.setItem('edqoo_user', JSON.stringify(res.user));
        setUser(res.user);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Registration failed.' };
    } catch (err: any) {
      setIsLoading(false);
      const errorMsg = err.response?.data?.error || err.message || 'Unable to complete registration.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('edqoo_user');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('edqoo_token');
    setUser(null);
  };

  const updateUserProfile = async (
    dataOrName: string | UpdateProfileData,
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in.' };

    let payload: UpdateProfileData;
    if (typeof dataOrName === 'string') {
      payload = { name: dataOrName, phone: phone || '' };
    } else {
      payload = dataOrName;
    }

    try {
      const res = await authService.updateProfile(payload);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        localStorage.setItem('edqoo_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, error: 'Failed to update profile.' };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Error updating profile.';
      return { success: false, error: errorMsg };
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin') === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
