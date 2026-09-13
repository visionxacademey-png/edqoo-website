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
    phone: '+91 90744 50935',
    program: 'Master Program in Data Science and AI',
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
    phone: '+91 90744 50935',
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
        return { ...item, phone: '+91 90744 50935' };
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

function recordLocalCandidateActivity(name: string, email: string, phone: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const storedUsers = localStorage.getItem('edqoo_registered_users');
    let usersList: any[] = storedUsers ? JSON.parse(storedUsers) : [];
    const existingIndex = usersList.findIndex((u: any) => u.email.toLowerCase() === normalizedEmail);
    const userRecord = {
      id: `usr-enq-${Date.now().toString(36)}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      activeSessionsCount: 1
    };
    if (existingIndex >= 0) {
      usersList[existingIndex] = { ...usersList[existingIndex], ...userRecord };
    } else {
      usersList.unshift(userRecord);
    }
    localStorage.setItem('edqoo_registered_users', JSON.stringify(usersList));

    const storedSessions = localStorage.getItem('edqoo_active_sessions');
    let sessionsList: any[] = storedSessions ? JSON.parse(storedSessions) : [];
    const newSession = {
      id: `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userId: userRecord.id,
      userName: userRecord.name,
      email: normalizedEmail,
      userRole: 'user',
      avatar: userRecord.avatar,
      ipAddress: '127.0.0.1 (Enquiry Form)',
      userAgent: navigator.userAgent || 'Modern Web Browser',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString()
    };
    sessionsList = [newSession, ...sessionsList.filter((s: any) => s.email !== normalizedEmail)].slice(0, 50);
    localStorage.setItem('edqoo_active_sessions', JSON.stringify(sessionsList));
  } catch (err) {
    console.warn('Failed to record candidate activity:', err);
  }
}

export const enquiryService = {
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string; enquiry?: Enquiry }> => {
    const newEnquiry: Enquiry = {
      ...payload,
      id: `enq-${Date.now()}`,
      status: 'Submitted',
      leadStatus: 'Completed',
      submittedAt: new Date().toISOString()
    };

    recordLocalCandidateActivity(payload.name, payload.email, payload.phone);

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

  // Step 1: Save lead immediately when user clicks Next in Tools & Upskills form
  submitStep1Lead: async (payload: {
    name: string;
    email: string;
    phone: string;
    program: string;
    courseId?: string;
    category?: string;
    source?: string;
    userId?: string;
  }): Promise<{ success: boolean; message: string; enquiry: Enquiry }> => {
    const leadId = `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newLead: Enquiry = {
      id: leadId,
      userId: payload.userId,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      program: payload.program || 'Tools and Upskills Track',
      courseId: payload.courseId || '',
      category: payload.category || 'Tools & Upskills',
      source: payload.source || 'Tools & Upskills Enquire Now',
      status: 'Incomplete',
      leadStatus: 'Incomplete',
      submittedAt: new Date().toISOString()
    };

    recordLocalCandidateActivity(payload.name, payload.email, payload.phone);

    try {
      const response = await api.post('/enquiries', newLead);
      const saved = response.data?.enquiry || newLead;
      const current = getStoredEnquiries();
      // Replace if existing or add to front
      const filtered = current.filter(e => e.id !== saved.id);
      saveStoredEnquiries([saved, ...filtered]);

      return {
        success: true,
        message: 'Lead saved successfully',
        enquiry: saved
      };
    } catch {
      console.warn('Backend enquiry endpoint offline; saved Step 1 lead to local storage.');
      const current = getStoredEnquiries();
      const filtered = current.filter(e => e.id !== newLead.id);
      saveStoredEnquiries([newLead, ...filtered]);

      return {
        success: true,
        message: 'Lead saved to local storage',
        enquiry: newLead
      };
    }
  },

  // Step 2: Complete the detailed enquiry and update the SAME lead record
  completeStep2Lead: async (
    leadId: string,
    detailedData: Partial<Enquiry>
  ): Promise<{ success: boolean; message: string; enquiry?: Enquiry }> => {
    const updatePayload = {
      ...detailedData,
      status: 'Submitted' as EnquiryStatus,
      leadStatus: 'Completed' as const,
      updatedAt: new Date().toISOString()
    };

    try {
      const response = await api.patch(`/enquiries/${leadId}`, updatePayload);
      const updated = response.data?.enquiry;

      // Update in local storage
      const all = getStoredEnquiries();
      const index = all.findIndex((e) => e.id === leadId);
      if (index !== -1) {
        all[index] = { ...all[index], ...updatePayload, ...(updated || {}) };
        saveStoredEnquiries(all);
      } else if (updated) {
        saveStoredEnquiries([updated, ...all]);
      }

      return {
        success: true,
        message: 'Thank you for submitting your detailed enquiry! An advisor will connect with you shortly.',
        enquiry: updated || (index !== -1 ? all[index] : undefined)
      };
    } catch {
      console.warn('Backend update failed, updating local storage for lead:', leadId);
      const all = getStoredEnquiries();
      const index = all.findIndex((e) => e.id === leadId);
      if (index !== -1) {
        all[index] = { ...all[index], ...updatePayload };
        saveStoredEnquiries(all);
        return {
          success: true,
          message: 'Thank you for submitting your detailed enquiry! An advisor will connect with you shortly.',
          enquiry: all[index]
        };
      } else {
        const fallback: Enquiry = {
          id: leadId,
          name: detailedData.name || '',
          email: detailedData.email || '',
          phone: detailedData.phone || '',
          program: detailedData.program || 'Tools and Upskills Track',
          ...updatePayload,
          submittedAt: new Date().toISOString()
        } as Enquiry;
        saveStoredEnquiries([fallback, ...all]);
        return {
          success: true,
          message: 'Thank you for submitting your detailed enquiry! An advisor will connect with you shortly.',
          enquiry: fallback
        };
      }
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
