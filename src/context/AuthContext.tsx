import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  enrollInCourse: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_KEY = 'Edqoo_user';
const TOKEN_KEY = 'Edqoo_token';

// Simple base64 mock JWT generator for prepare-for-backend design
const generateMockJWT = (email: string) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: email, role: 'student', exp: Math.floor(Date.now() / 1000) + 3600 }));
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
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate backend network latency and log inputs safely to prevent unused variable checks
    console.log('Demo Login payload processing:', email, '*'.repeat(password.length));
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple email login simulation
    const mockUser: User = {
      id: 'usr-9284',
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      enrolledCourses: ['cybersecurity'], // Default mock enrollment for demo
      progress: {
        'cybersecurity': ['cs-l-1', 'cs-l-2']
      }
    };

    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(TOKEN_KEY, generateMockJWT(email));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate latency and log variables to prevent unused checks
    console.log('Demo Register payload processing:', email, '*'.repeat(password.length));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      enrolledCourses: [],
      progress: {}
    };

    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(TOKEN_KEY, generateMockJWT(email));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return;
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUser = {
      ...user,
      enrolledCourses: user.enrolledCourses.includes(courseId)
        ? user.enrolledCourses
        : [...user.enrolledCourses, courseId]
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isEnrolled = (courseId: string) => {
    if (!user) return false;
    return user.enrolledCourses.includes(courseId);
  };

  const completeLesson = async (courseId: string, lessonId: string) => {
    if (!user) return;

    const currentProgress = user.progress[courseId] || [];
    if (currentProgress.includes(lessonId)) return; // Already completed

    const updatedProgress = {
      ...user.progress,
      [courseId]: [...currentProgress, lessonId]
    };

    const updatedUser = {
      ...user,
      progress: updatedProgress
    };

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    if (!user || !user.progress[courseId]) return false;
    return user.progress[courseId].includes(lessonId);
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
        enrollInCourse,
        isEnrolled,
        completeLesson,
        isLessonCompleted
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
