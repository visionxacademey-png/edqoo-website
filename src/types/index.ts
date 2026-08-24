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

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  lessons: number;
  level: string;
  rating: number;
  students: number;
  status: 'available' | 'coming-soon';
  featured: boolean;
  skills: string[];
  modules?: Module[];
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

export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  enrolledCourses: string[]; // Course IDs
  progress: Record<string, string[]>; // courseId -> array of completed lessonIds
}
