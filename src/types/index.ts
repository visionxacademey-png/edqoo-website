export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string; // Eventually protected token-based URL
  isPreview?: boolean;
  content?: string;
  resources?: Array<{ name: string; url: string; size: string }>;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface CurriculumSection {
  id?: string;
  title: string;
  topics: string[];
  description?: string;
}

export interface TechStackGroup {
  category: string;
  skills: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  categories: string[];
  shortDescription?: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  liveHours?: string;
  lessons: number;
  level: string;
  rating: number;
  students: number;
  status: 'available' | 'coming-soon';
  featured: boolean;
  skills: string[];
  curriculum?: CurriculumSection[];
  modules?: Module[];
  technologyStack?: TechStackGroup[] | Record<string, string[]> | string[];
  projects?: string[];
  careerReadiness?: string[];
  outcome?: string;
  features: string[];
  requirements?: string[];
  whoIsItFor?: string[];
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin: string;
  expertise: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  courseName: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export type EnquiryStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Contacted' 
  | 'Follow-up Required' 
  | 'Resolved' 
  | 'Converted' 
  | 'Closed'
  | 'Incomplete'
  | 'Completed'
  | 'New';

export type LeadStatus = 'New' | 'Incomplete' | 'Completed';

export interface Enquiry {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  courseId?: string;
  category?: string;
  source?: string;
  experienceLevel?: string;
  learningMode?: string;
  location?: string;
  preferredContactMethod?: string;
  preferredCallbackTime?: string;
  message?: string;
  status: EnquiryStatus;
  leadStatus?: LeadStatus;
  notes?: string;
  lastContactedDate?: string;
  submittedAt: string;
  updatedAt?: string;

  // Step 2 Detailed Fields (Personal)
  gender?: string;
  dateOfBirth?: string;
  country?: string;
  pincode?: string;
  state?: string;
  city?: string;

  // Step 2 Detailed Fields (Education / Professional)
  profession?: 'Student' | 'Faculty' | 'Working Professional' | 'Other' | string;
  highestQualification?: string;
  yearOfGraduation?: string;
  apaarAbcStatus?: string;
  apaarId?: string;
  ktuId?: string;
  swayamChapter?: string;
  collegeState?: string;
  collegeName?: string;
  universityName?: string;
  rollNumber?: string;
  highestAcademicLevel?: string;
  academicArea?: string;
  studyYear?: string;

  // Working professional / faculty specific fields
  organization?: string;
  designation?: string;
  yearsOfExperience?: string;
  department?: string;
  otherProfessionDetails?: string;
  details?: Record<string, any>;
}

export interface DeviceInfo {
  deviceId?: string;
  deviceType?: 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile';
  os?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  deviceModel?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
  fingerprint?: string;
  platform?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
  deviceInfo?: DeviceInfo;
  lastIp?: string;
  lastDeviceId?: string;
  lastDeviceType?: string;
  lastOs?: string;
  lastBrowser?: string;
  lastTimezone?: string;
}

export interface AdminUser extends User {
  activeSessionsCount?: number;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone?: string;
  userRole: 'user' | 'admin';
  avatar?: string;
  ipAddress: string;
  userAgent: string;
  deviceId?: string;
  deviceType?: 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile';
  os?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  deviceModel?: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
  fingerprint?: string;
  deviceInfo?: DeviceInfo;
  isActive: boolean;
  createdAt: string;
  lastActiveAt: string;
  expiresAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  totalCourses: number;
  totalEnquiries: number;
  adminCount: number;
  dbType: 'neondb_postgresql' | 'in_memory_fallback';
}

export interface DbStatus {
  connected: boolean;
  type: 'neondatabase_postgresql' | 'in_memory_fallback';
  databaseUrlConfigured: boolean;
  error?: string | null;
}

