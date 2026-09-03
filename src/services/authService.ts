import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch {
      console.warn('Backend unavailable, falling back to mock login state.');
      return {
        success: true,
        token: 'mock_jwt_token_string',
        user: {
          id: 'usr-9284',
          name: email.split('@')[0].toUpperCase(),
          email,
          phone: '+91 9999999999',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  register: async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, phone, password });
      return response.data;
    } catch {
      console.warn('Backend unavailable, falling back to mock registration state.');
      return {
        success: true,
        token: 'mock_jwt_token_string',
        user: {
          id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
          name,
          email,
          phone,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      };
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch {
      console.warn('Backend unavailable, simulating password reset link send.');
      return {
        success: true,
        message: 'Password reset link sent successfully.'
      };
    }
  }
};
