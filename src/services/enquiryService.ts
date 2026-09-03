import api from './api';
import type { Enquiry, EnquiryStatus } from '../types';

export interface EnquiryPayload {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  location?: string;
  experienceLevel?: string;
  learningMode?: string;
  preferredContactMethod?: string;
  preferredCallbackTime?: string;
  message?: string;
}

const STORAGE_KEY = 'Edqoo_enquiries';

// Initial sample enquiries for demonstration if storage is empty
const defaultSeedEnquiries: Enquiry[] = [
  {
    id: 'enq-101',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+91 9999999999',
    program: 'Cybersecurity Master Certification',
    experienceLevel: '0-2 Years',
    learningMode: 'Online Live / Interactive',
    location: 'Austin, TX',
    preferredContactMethod: 'Phone Call',
    preferredCallbackTime: 'Afternoon (1 PM - 5 PM)',
    message: 'Interested in SOC analyst curriculum and upcoming weekend batch availability.',
    status: 'Contacted',
    notes: 'Called on 02/09. Discussed syllabus and weekend schedule. Candidate requested brochure.',
    lastContactedDate: '2026-09-02T14:30:00.000Z',
    submittedAt: '2026-09-01T10:15:00.000Z'
  },
  {
    id: 'enq-102',
    name: 'David Kumar',
    email: 'david.k@example.com',
    phone: '+91 9999999999',
    program: 'Data Science & Machine Learning Specialist',
    experienceLevel: '3-5 Years',
    learningMode: 'Online Live / Interactive',
    location: 'San Jose, CA',
    preferredContactMethod: 'WhatsApp',
    preferredCallbackTime: 'Evening (5 PM - 8 PM)',
    message: 'Looking for detailed curriculum on PyTorch, MLOps, and capstone project review process.',
    status: 'Under Review',
    notes: 'Assigned to Senior Advisor Alex for technical assessment review.',
    submittedAt: '2026-09-03T16:45:00.000Z'
  }
];

const getStoredEnquiries = (): Enquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedEnquiries));
      return defaultSeedEnquiries;
    }
    const parsed: Enquiry[] = JSON.parse(raw);
    let modified = false;
    const sanitized = parsed.map((item) => {
      if (item.phone && (item.phone.includes('+1') || item.phone.includes('555'))) {
        modified = true;
        return { ...item, phone: '+91 9999999999' };
      }
      return item;
    });
    if (modified) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch {
    return defaultSeedEnquiries;
  }
};

const saveStoredEnquiries = (enquiries: Enquiry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
  } catch (err) {
    console.error('Error saving enquiries to localStorage:', err);
  }
};

export const enquiryService = {
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string; enquiry?: Enquiry }> => {
    const newEnquiry: Enquiry = {
      ...payload,
      id: `enq-${Date.now()}`,
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await api.post('/enquiries', newEnquiry);
      // Also cache locally
      const current = getStoredEnquiries();
      saveStoredEnquiries([response.data?.enquiry || newEnquiry, ...current]);
      
      return {
        success: true,
        message: 'Thank you for your enquiry. Our team will review your request and get in touch with you shortly.',
        enquiry: response.data?.enquiry || newEnquiry
      };
    } catch {
      console.warn('Backend enquiry endpoint offline; saved lead to local storage.');
      const current = getStoredEnquiries();
      saveStoredEnquiries([newEnquiry, ...current]);

      return {
        success: true,
        message: 'Thank you for your enquiry. Our team will review your request and get in touch with you shortly.',
        enquiry: newEnquiry
      };
    }
  },

  getUserEnquiries: async (userEmail: string): Promise<Enquiry[]> => {
    try {
      const response = await api.get('/enquiries/my', { params: { email: userEmail } });
      return response.data;
    } catch {
      const all = getStoredEnquiries();
      if (!userEmail) return all;
      return all.filter((e) => e.email.toLowerCase() === userEmail.toLowerCase());
    }
  },

  getAllEnquiries: async (): Promise<Enquiry[]> => {
    try {
      const response = await api.get('/enquiries');
      return response.data;
    } catch {
      return getStoredEnquiries();
    }
  },

  updateEnquiryStatus: async (
    enquiryId: string,
    status: EnquiryStatus,
    notes?: string
  ): Promise<{ success: boolean; enquiry?: Enquiry }> => {
    try {
      const response = await api.patch(`/enquiries/${enquiryId}`, { status, notes });
      return { success: true, enquiry: response.data };
    } catch {
      const all = getStoredEnquiries();
      const index = all.findIndex((e) => e.id === enquiryId);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          status,
          notes: notes !== undefined ? notes : all[index].notes,
          lastContactedDate: ['Contacted', 'Follow-up Required', 'Interested', 'Converted'].includes(status)
            ? new Date().toISOString()
            : all[index].lastContactedDate,
          updatedAt: new Date().toISOString()
        };
        saveStoredEnquiries(all);
        return { success: true, enquiry: all[index] };
      }
      return { success: false };
    }
  }
};
