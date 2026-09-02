import api from './api';

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  program: string;
  location?: string;
  experienceLevel?: string;
  learningMode?: string;
  message?: string;
}

export const enquiryService = {
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/enquiries', payload);
      return response.data;
    } catch {
      console.warn('Backend enquiry endpoint offline, caching lead locally.');
      const existingLeads = JSON.parse(localStorage.getItem('Edqoo_leads') || '[]');
      existingLeads.push({
        ...payload,
        id: `lead-${Date.now()}`,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('Edqoo_leads', JSON.stringify(existingLeads));
      
      return {
        success: true,
        message: 'Thank you for your enquiry. Our team will contact you shortly.'
      };
    }
  }
};
