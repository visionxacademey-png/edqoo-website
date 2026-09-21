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

export interface ProjectItem {
  id?: string;
  title: string;
  category?: string;
  description: string;
  technologies: string[];
  projectType?: string;
  duration?: string;
  image?: string;
  imageUrl?: string;
  imageAlt?: string;
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
  projects?: Array<string | ProjectItem>;
  careerReadiness?: string[];
  outcome?: string;
  features: string[];
  requirements?: string[];
  whoIsItFor?: string[];
}

export interface Instructor {
  id: string;
  name: string;
  role?: string;
  designation: string;
  organization: string;
  image: string;
  profileImage?: string;
  shortBio: string;
  detailedBio: string;
  qualifications: string;
  experience: string;
  expertise: string[];
  certifications?: string[];
  courses: string[];
  projects?: string[];
  linkedin?: string;
  email?: string;
  teachingExperience?: string;
  industryExperience?: string;
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
  enquiryType?: 'STUDENT_OFFER' | 'COURSE_ENQUIRY' | 'TOOLS_UPSKILLS' | 'GENERAL' | string;
  collegeOrSchool?: string;
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
  totalHiringRequests?: number;
  totalInstructorApps?: number;
  totalPartnerRequests?: number;
  totalLeadershipMembers?: number;
  adminCount: number;
  dbType: 'neondb_postgresql' | 'in_memory_fallback';
}

export interface DbStatus {
  connected: boolean;
  type: 'neondatabase_postgresql' | 'in_memory_fallback';
  databaseUrlConfigured: boolean;
  error?: string | null;
}

// -----------------------------------------------------------------------------
// 1. Hiring From Us Data Types
// -----------------------------------------------------------------------------
export type HiringRequestStatus =
  | 'New'
  | 'Under Review'
  | 'Contacted'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Closed';

export interface HiringEnquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  jobRole: string;
  openings: string;
  requiredSkills: string;
  experience: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  additionalRequirements?: string;
  status: HiringRequestStatus;
  notes?: string;
  submittedAt: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// 2. Instructor Application Data Types
// -----------------------------------------------------------------------------
export type InstructorApplicationStatus =
  | 'New'
  | 'Under Review'
  | 'Contacted'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected';

export interface InstructorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  organization: string;
  qualification: string;
  expertise: string;
  experience: string;
  linkedin?: string;
  portfolio?: string;
  courses: string;
  teachingExperience: string;
  bio: string;
  resume?: string; // Data URL, uploaded file name, or resume link
  additionalInformation?: string;
  status: InstructorApplicationStatus;
  notes?: string;
  submittedAt: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// 3. Partner Enquiry Data Types
// -----------------------------------------------------------------------------
export type PartnerRequestStatus =
  | 'New'
  | 'Under Review'
  | 'Contacted'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected';

export type OrganizationType =
  | 'Company'
  | 'Educational Institution'
  | 'Training Organization'
  | 'Technology Company'
  | 'Other';

export interface PartnerEnquiry {
  id: string;
  organizationName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  organizationType: OrganizationType;
  partnershipArea: string;
  website?: string;
  location: string;
  proposal: string;
  additionalInformation?: string;
  status: PartnerRequestStatus;
  notes?: string;
  submittedAt: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// 4. Leadership Council Member Data Types
// -----------------------------------------------------------------------------
export interface LeadershipCouncilMember {
  id: string;
  name: string;
  profileImage: string;
  designation: string;
  organization: string;
  qualification?: string;
  experience?: string;
  expertise: string[];
  shortBio: string;
  detailedBio?: string;
  leadershipExperience?: string;
  achievements?: string[];
  publications?: string[];
  linkedin?: string;
  website?: string;
  email?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

