import api from './api';

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  price?: number;
  duration?: string;
  url: string;
  description?: string;
  level?: string;
  type: 'course' | 'project' | 'instructor' | 'page';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: 'supported' | 'unsupported';
  needsContact?: boolean;
  results?: SearchResultItem[];
  errorCode?: string;
}

export interface ChatResponse {
  success?: boolean;
  answer: string;
  source: 'database' | 'website' | 'gemini' | 'fallback';
  confidence: 'supported' | 'unsupported';
  needsContact: boolean;
  results?: SearchResultItem[];
  errorCode?: 'NOT_FOUND' | 'AI_SERVICE_UNAVAILABLE' | 'DB_UNAVAILABLE';
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
  };
}

export interface ChatConfig {
  enabled: boolean;
  welcomeMessage: string;
  suggestedQuestions: string[];
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
  };
}

export const chatService = {
  /**
   * Send a question to the AI Assistant API
   */
  async sendMessage(
    message: string,
    conversationHistory: Array<{ role: 'user' | 'model' | 'assistant'; content: string }> = []
  ): Promise<ChatResponse> {
    try {
      const response = await api.post<ChatResponse>('/chat', {
        message,
        conversationHistory
      });
      return response.data;
    } catch (error: any) {
      console.error('Chat API request error:', error);
      // Determine if it was network / server failure
      return {
        success: false,
        answer: "I'm unable to process your question right now. Please contact our support team directly.",
        source: 'fallback',
        confidence: 'unsupported',
        needsContact: true,
        errorCode: 'AI_SERVICE_UNAVAILABLE',
        contactInfo: {
          phone: '+91 90744 50935',
          whatsapp: '9074450935',
          email: 'support@edqoo.com'
        }
      };
    }
  },

  /**
   * Fetch public chatbot configuration
   */
  async getConfig(): Promise<ChatConfig> {
    try {
      const response = await api.get<ChatConfig>('/chat/config');
      return response.data;
    } catch (error) {
      console.warn('Failed to load chat config, using defaults:', error);
      return {
        enabled: true,
        welcomeMessage: "Hi! 👋 I'm the AI Assistant. I can help you find courses, programs, projects, instructors, and information about our services. What would you like to know?",
        suggestedQuestions: [
          "What courses are available?",
          "Do you have a Python course?",
          "What free courses are available?",
          "What Data Science programs do you offer?",
          "What projects are included?",
          "How can I become an instructor?",
          "How can I become a partner?",
          "How can I contact support?"
        ],
        contactInfo: {
          phone: '+91 90744 50935',
          whatsapp: '9074450935',
          email: 'support@edqoo.com'
        }
      };
    }
  }
};
