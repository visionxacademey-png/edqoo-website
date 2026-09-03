import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (name: string, phone: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_KEY = 'Edqoo_user';
const TOKEN_KEY = 'Edqoo_token';

// Simple base64 mock JWT generator
const generateMockJWT = (email: string, role: string = 'user') => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: email, role, exp: Math.floor(Date.now() / 1000) + 86400 }));
  const signature = 'mock_signature_part';
  return `${header}.${payload}.${signature}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user session already exists in localStorage
    const savedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (savedUser && token) {
      try {
        const parsed: User = JSON.parse(savedUser);
        if (parsed.phone && (parsed.phone.includes('+1') || parsed.phone.includes('555'))) {
          parsed.phone = '+91 9999999999';
          localStorage.setItem(USER_KEY, JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    if (password.length < 6) return false;
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simple profile generation for authentication
    const mockUser: User = {
      id: 'usr-9284',
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+91 9999999999',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      createdAt: '2026-08-15T09:00:00.000Z'
    };

    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(TOKEN_KEY, generateMockJWT(email, mockUser.role));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    if (password.length < 6) return false;
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(TOKEN_KEY, generateMockJWT(email, mockUser.role));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateUserProfile = (name: string, phone: string) => {
    if (!user) return;
    const updated: User = { ...user, name, phone };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile
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
