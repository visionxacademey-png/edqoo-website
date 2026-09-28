import { GoogleGenAI } from '@google/genai';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { DATA_SCIENCE_AI_PROJECTS } from '../../src/data/courses.js';
import { evaluateFuzzyMatch } from './fuzzyMatch.js';

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  price?: number;
  duration?: string;
  url: string;
  description?: string;
  level?: string;
  type: 'course' | 'program' | 'project' | 'instructor' | 'page' | 'faq';
  similarity?: number;
  matchType?: 'exact' | 'prefix' | 'contains' | 'fuzzy' | 'content' | 'none';
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  source: 'database' | 'website' | 'gemini' | 'fallback';
  confidence: 'supported' | 'unsupported';
  needsContact: boolean;
  results?: SearchResultItem[];
  resultType?: 'courses' | 'programs' | 'projects' | 'instructors' | 'faq' | 'general' | 'mixed';
  errorCode?: 'NOT_FOUND' | 'AI_SERVICE_UNAVAILABLE' | 'DB_UNAVAILABLE' | null;
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
  };
}

// Environment contact helpers
export function getContactInfo() {
  const rawPhone = process.env.CHATBOT_CONTACT_NUMBER || '+91 90744 50935';
  const rawWa = process.env.CHATBOT_CONTACT_WHATSAPP || '9074450935';
  const cleanWa = rawWa.replace(/[^0-9]/g, '');
  return {
    phone: rawPhone,
    whatsapp: cleanWa,
    email: 'support@edqoo.com'
  };
}

// =============================================================================
// VERIFIED PUBLIC WEBSITE PAGES REGISTRY (REAL ROUTES)
// =============================================================================

export interface WebsitePageRecord {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  aliases: string[];
  contentSummary: string;
}

export const WEBSITE_PAGES_REGISTRY: WebsitePageRecord[] = [
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    url: '/privacy-policy',
    category: 'Policy',
    description: 'Read how your personal data, contact information, and learning telemetry are protected.',
    aliases: [
      'privacy',
      'privacy policy',
      'privcy',
      'prvacy policy',
      'data privacy',
      'personal data',
      'cookies',
      'data protection',
      'security policy',
      'user data',
      'gdpr'
    ],
    contentSummary: `
EDQOO PRIVACY POLICY (/privacy-policy):
- Personal Data: We collect contact details (name, email, phone) provided during inquiries and course enrollment.
- Usage: Information is used solely to deliver educational programs, respond to inquiries, issue course certificates, and improve curriculum.
- Protection: Industry-standard encryption, secure session tokens, and strict access controls are used.
- Third Parties: We NEVER sell, rent, or trade user data to third parties.
- User Rights: Users can request data access, correction, or deletion anytime by emailing support@edqoo.com.
`
  },
  {
    id: 'page-terms',
    title: 'Terms & Conditions',
    url: '/terms-and-conditions',
    category: 'Policy',
    description: 'Understand platform terms, course curriculum updates, and intellectual property terms.',
    aliases: [
      'terms',
      'terms and conditions',
      'term',
      'terms conditons',
      'term conditons',
      'terms & conditions',
      'policy',
      'terms of service',
      'tos',
      'legal',
      'licensing',
      'curriculum policy'
    ],
    contentSummary: `
EDQOO TERMS & CONDITIONS (/terms-and-conditions):
- Curriculum Policy: Courses, curriculums, projects, technologies, and learning materials may be updated periodically based on technological advancement and industry requirements.
- Intellectual Property: All course materials, code lectures, assignments, and platforms are proprietary. Enrollment grants a personal, non-exclusive license.
- User Conduct: Users must provide accurate profile details and adhere to professional learning standards.
- Inquiries & Support: For full legal terms, visit /terms-and-conditions or contact support@edqoo.com.
`
  },
  {
    id: 'page-contact',
    title: 'Contact & Support',
    url: '/contact',
    category: 'Support',
    description: 'Get in touch with academic counselors and technical support via Phone, WhatsApp, or Email.',
    aliases: [
      'contact',
      'contact us',
      'contct',
      'how can i contact you',
      'how to contact you',
      'how to contact',
      'phone',
      'whatsapp',
      'call',
      'call us',
      'support',
      'helpdesk',
      'customer support',
      'academic counselor',
      'reach out',
      'contact details',
      'phone number'
    ],
    contentSummary: `
EDQOO CONTACT & ADMISSIONS (/contact):
- Direct Phone: +91 90744 50935
- WhatsApp: +91 90744 50935
- Support Email: support@edqoo.com
- Academic Advisors: Available for syllabus walkthroughs, admission guidance, and technical counseling.
`
  },
  {
    id: 'page-become-instructor',
    title: 'Become an Instructor',
    url: '/become-an-instructor',
    category: 'Teaching Opportunities',
    description: 'Apply to join our faculty of industry practitioners and teach cutting-edge technology tracks.',
    aliases: [
      'become an instructor',
      'become instructor',
      'how can i become an instructor',
      'teach',
      'apply to teach',
      'teacher',
      'mentor',
      'instructor application',
      'teach at edqoo',
      'faculty application',
      'how can i teach',
      'want to teach'
    ],
    contentSummary: `
BECOME AN INSTRUCTOR (/become-an-instructor):
- Who Can Apply: Senior Data Scientists, AI Researchers, BI Consultants, Software Engineers with 3+ years of experience.
- Benefits: Competitive compensation, flexible teaching cohorts (weekends/evenings), and pedagogical support.
- Application: Submit profile details, qualifications, teaching experience, and resume on the /become-an-instructor page.
`
  },
  {
    id: 'page-become-partner',
    title: 'Become a Partner',
    url: '/become-a-partner',
    category: 'Academic & Corporate Partnerships',
    description: 'Collaborate with Edqoo for university curriculum integration, bootcamps, or corporate team training.',
    aliases: [
      'become a partner',
      'become partner',
      'how can i become a partner',
      'partner',
      'parter',
      'partnership',
      'collaboration',
      'college partnership',
      'university partner',
      'corporate partnership',
      'partner with us'
    ],
    contentSummary: `
BECOME A PARTNER (/become-a-partner):
- Academic Institutions: Curriculum integration, student upskilling bootcamps, and faculty development programs (FDP).
- Corporate Enterprises: Tailored workforce upskilling in Data Science, AI, Machine Learning, and Power BI.
- How to Apply: Submit organization details and proposal on the /become-a-partner page.
`
  },
  {
    id: 'page-hire',
    title: 'Hire From Us',
    url: '/hire-from-us',
    category: 'Corporate Hiring',
    description: 'Recruit pre-vetted, job-ready talent in Data Science, AI, and Analytics with ZERO hiring fees.',
    aliases: [
      'hire from us',
      'hire',
      'recruiter',
      'placement',
      'hire talent',
      'hiring partners',
      'recruit graduates',
      'zero fee hiring',
      'hire developers'
    ],
    contentSummary: `
HIRE FROM US PROGRAM (/hire-from-us):
- Zero Hiring/Placement Fees for corporate partners.
- Pre-vetted candidates with 5+ verified industry capstones in Python, Data Science, AI/ML, and Power BI.
- Fast Turnaround: Shortlisted candidate profiles within 24-48 hours.
- Process: Submit job requirements on /hire-from-us for direct technical interviews.
`
  },
  {
    id: 'page-leadership',
    title: 'Leadership Council',
    url: '/leadership-council',
    category: 'Advisory Board',
    description: 'Meet our distinguished academic council and executive leadership steering Edqoo learning pathways.',
    aliases: [
      'leadership council',
      'leadership',
      'leadershp',
      'advisory board',
      'council',
      'advisors',
      'directors',
      'executive leadership'
    ],
    contentSummary: `
LEADERSHIP COUNCIL (/leadership-council):
- Steered by senior researchers, and enterprise technology directors.
- Guides curriculum modernization, industry relevance, and academic excellence.
`
  },
  {
    id: 'page-about',
    title: 'About Edqoo',
    url: '/about',
    category: 'Overview',
    description: 'Learn about Edqoo’s mission, core values, and hands-on, project-driven learning philosophy.',
    aliases: [
      'about',
      'about us',
      'mission',
      'vision',
      'philosophy',
      'who is edqoo',
      'company overview'
    ],
    contentSummary: `
ABOUT EDQOO (/about):
- Value: "Practical Skills. Real Projects. Better Careers."
- Philosophy: Focus on live coding, standalone github capstone demos, and defensive security hardening rather than passive slide lectures.
`
  },
  {
    id: 'page-courses-catalog',
    title: 'Courses & Programs Catalog',
    url: '/courses',
    category: 'Catalog',
    description: 'Explore all live masterclasses, executive certificates, and self-paced technology programs.',
    aliases: [
      'courses',
      'all courses',
      'programs',
      'course list',
      'catalog',
      'curriculum list',
      'training tracks'
    ],
    contentSummary: `
COURSES CATALOG (/courses):
- Programs across Data Science & AI, Data Analytics, AI & Machine Learning, Tools & Upskills, and Free Learning.
`
  },
  {
    id: 'page-free-learning',
    title: 'Free Learning Catalog',
    url: '/courses',
    category: 'Free Learning',
    description: '100% free foundational courses in Python, Java, HR, Finance, and Accounting & GST.',
    aliases: [
      'free learning',
      'free courses',
      'fre lernng',
      'free',
      'free programs',
      'free learning catalog'
    ],
    contentSummary: `
FREE LEARNING (/courses):
- Self-paced foundational courses with practical exercises: Python, Java, HR, Finance, Accounting & GST.
`
  },
  {
    id: 'page-tools-upskills',
    title: 'Tools & Upskills Catalog',
    url: '/courses',
    category: 'Tools and Upskills',
    description: '15 practical 24-hour training tracks: HTML, SQL, Generative AI, Prompt Engineering, Python, Data Analytics, Data Science, Ethical Hacking, Web Dev, UI/UX, Digital Marketing, AWS, HR, Accounting & Finance, and Content Writing.',
    aliases: [
      'tools and upskills',
      'tools',
      'upskills',
      'tools courses',
      'executive tools',
      'html',
      'html course',
      'html5',
      'sql',
      'sql course',
      'database',
      'sql database',
      'gen ai',
      'chatgpt',
      'prompt engineering',
      'ethical hacking',
      'web development',
      'ui ux',
      'aws',
      'digital marketing',
      'hr management',
      'content writing',
      'accounting and finance'
    ],
    contentSummary: `
TOOLS & UPSKILLS (/courses):
- 15 practical 24-hour training tracks with hands-on curriculums: HTML, SQL, Generative AI & ChatGPT, Prompt Engineering, Python Programming, Data Analytics with Excel & Power BI, Data Science Foundations, Ethical Hacking, Web Development, UI/UX Design, Digital Marketing, Cloud Computing & AWS, HR Management, Accounting & Finance, and Content Writing.
`
  },
  {
    id: 'page-instructors',
    title: 'Our Faculty & Instructors',
    url: '/instructors',
    category: 'Faculty',
    description: 'Meet our senior industry educators, machine learning practitioners, and BI specialists.',
    aliases: [
      'instructors',
      'faculty',
      'instrutor',
      'who teaches',
      'teachers',
      'faculty members',
      'mentor list',
      'who are your instructors'
    ],
    contentSummary: `
OUR FACULTY (/instructors):
- Dr. Evelyn Vance (Lead AI & Machine Learning Faculty, 12+ yrs exp)
- Michael Kovac (Principal Data Scientist & Analytics Lead, 10+ yrs exp)
- Dr. Priya Sundaram (Senior Faculty & BI Specialist, 9+ yrs exp)
- Arun Kumar (Generative AI & Prompt Engineering Specialist)
`
  },
  {
    id: 'page-projects',
    title: 'Data Science & AI Capstone Projects',
    url: '/courses/advanced-executive-program-data-science-ai',
    category: 'Projects',
    description: '7 approved real-world capstone projects including Diwali Sales, Netflix Analytics, EV adoption, and Medical AI.',
    aliases: [
      'projects',
      'capstone',
      'prjects',
      'capstones',
      'portfolio projects',
      'real world projects',
      'live projects',
      'what projects do you have'
    ],
    contentSummary: `
CAPSTONE PROJECTS:
- 7 enterprise portfolio capstones: Diwali Sales Analysis (Amazon), Netflix Analytics, EV Analytics, AI Interview Prep, Pneumonia Severity Detection, Kanoon Darpan Legal AI, Suicide Ideation Detection.
`
  }
];

// =============================================================================
// DATABASE RETRIEVAL HELPERS (SOURCE OF TRUTH)
// =============================================================================

export async function getAllCourses(): Promise<any[]> {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const res = await query(`
        SELECT id, slug, title, category, categories, short_description, description, price, original_price,
               duration, live_hours, lessons, level, rating, students, status, featured, skills, curriculum, modules,
               technology_stack, projects, career_readiness, outcome, features, requirements, who_is_it_for
        FROM courses
        ORDER BY featured DESC, rating DESC
      `);
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    }
  } catch (err) {
    console.warn('DB course fetch error, using fallback:', err);
  }
  return mockStore.courses || [];
}

export async function getAllInstructors(): Promise<any[]> {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const res = await query('SELECT * FROM instructors ORDER BY name ASC');
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    }
  } catch (err) {
    console.warn('DB instructor fetch error, using fallback:', err);
  }
  return mockStore.instructors || [];
}

// =============================================================================
// NORMALIZATION & HELPERS
// =============================================================================

export function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeArrayParse(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [val];
    }
  }
  return [];
}

function getCourseRoute(course: any): string {
  const isFree = Number(course.price) === 0 || (course.category && course.category.toLowerCase().includes('free'));
  return isFree ? `/free-learning/${course.slug}` : `/courses/${course.slug}`;
}

export function courseToSearchResult(course: any, similarity = 1.0, matchType: SearchResultItem['matchType'] = 'exact'): SearchResultItem {
  return {
    id: course.id,
    title: course.title,
    category: course.category,
    price: Number(course.price) || 0,
    duration: course.duration,
    url: getCourseRoute(course),
    description: course.short_description || course.shortDescription || course.description || '',
    level: course.level,
    type: 'course',
    similarity,
    matchType
  };
}

// =============================================================================
// UNIFIED SEARCH ENGINE (PAGES + COURSES + PROJECTS + INSTRUCTORS + FUZZY)
// =============================================================================

export interface WebsiteSearchResults {
  matchedPages: SearchResultItem[];
  matchedCourses: SearchResultItem[];
  matchedProjects: SearchResultItem[];
  matchedInstructors: SearchResultItem[];
  allCategoryGroupedCourses?: Record<string, SearchResultItem[]>;
  isAmbiguous: boolean;
  isFuzzyCorrection: boolean;
  correctedTerm?: string;
  queryIntent:
    | 'broad_courses'
    | 'page_search'
    | 'course_search'
    | 'project_search'
    | 'instructor_search'
    | 'content_question'
    | 'follow_up'
    | 'general';
  contentAnswerSnippet?: string;
  followUpContext?: { referencedCourse?: any; attributeRequested?: string };
}

/**
 * Extracts dynamic keyword aliases from course titles and descriptions.
 * Allows any newly added course in DB / admin to automatically support fuzzy and partial search.
 */
function extractCourseAliases(course: any): string[] {
  const aliases: string[] = [];
  const title = (course.title || '').toLowerCase();
  const slug = (course.slug || '').toLowerCase();

  aliases.push(slug);
  aliases.push(slug.replace(/-/g, ' '));

  // Common technology and track aliases
  if (slug.includes('generative-ai') || slug.includes('chatgpt') || title.includes('generative ai') || title.includes('chatgpt')) {
    aliases.push('generative ai', 'gen ai', 'genai', 'chatgpt', 'chat gpt', 'ai tools', 'generative ai and chatgpt', 'generative ai & chatgpt', 'chatgpt training');
  }
  if (slug.includes('prompt') || title.includes('prompt')) {
    aliases.push('prompt engineering', 'prompting', 'prompt', 'prompts', 'prompt training', 'prompt course');
  }
  if (slug.includes('python') || title.includes('python')) {
    aliases.push('python', 'python course', 'python training', 'python programming', 'python development', 'python masterclass', 'coding');
  }
  if (slug.includes('data-analytics') || slug.includes('excel') || slug.includes('power-bi') || title.includes('power bi') || title.includes('excel')) {
    aliases.push('data analytics', 'data analytics and ai', 'power bi', 'powerbi', 'power-bi', 'excel', 'advanced excel', 'power bi dashboard', 'excel and power bi', 'data analytics with excel & power bi');
  }
  if (slug.includes('data-science') || title.includes('data science')) {
    aliases.push('data science', 'datascience', 'data science foundations', 'data science program', 'data science course', 'data science and ai');
  }
  if (slug.includes('ethical-hacking') || title.includes('ethical hacking') || title.includes('cybersecurity')) {
    aliases.push('ethical hacking', 'ethical hacker', 'cybersecurity', 'cyber security', 'hacking', 'network security', 'penetration testing', 'security assessment');
  }
  if (slug.includes('web-development') || title.includes('web development') || slug.includes('web-dev')) {
    aliases.push('web development', 'web dev', 'website development', 'frontend', 'html css js', 'web design', 'web developer');
  }
  if (slug.includes('ui-ux') || slug.includes('ui/ux') || title.includes('ui/ux') || title.includes('ui/ux design') || title.includes('figma')) {
    aliases.push('ui ux', 'ui/ux', 'uiux', 'ui design', 'ux design', 'figma', 'prototyping', 'wireframing', 'product design');
  }
  if (slug.includes('digital-marketing') || title.includes('digital marketing') || title.includes('marketing')) {
    aliases.push('digital marketing', 'marketing', 'seo', 'social media marketing', 'google ads', 'content marketing', 'campaign marketing');
  }
  if (slug.includes('cloud-computing') || slug.includes('aws') || title.includes('cloud computing') || title.includes('aws')) {
    aliases.push('aws', 'cloud', 'cloud computing', 'amazon web services', 'ec2', 's3', 'cloud training', 'aws cloud');
  }
  if (slug.includes('hr-management') || slug === 'hr' || title.includes('hr management') || title.includes('human resource')) {
    aliases.push('hr', 'hr management', 'human resources', 'human resource management', 'talent acquisition', 'payroll', 'hr practices');
  }
  if (slug.includes('accounting-finance') || slug.includes('accounting') || slug.includes('finance') || title.includes('accounting') || title.includes('finance')) {
    aliases.push('accounting', 'finance', 'accounting and finance', 'accounting & finance', 'gst', 'financial statements', 'tally', 'bookkeeping');
  }
  if (slug.includes('content-writing') || title.includes('content writing') || title.includes('copywriting')) {
    aliases.push('content writing', 'content writer', 'copywriting', 'blog writing', 'seo writing', 'article writing', 'creative writing');
  }
  if (slug.includes('machine-learning') || title.includes('machine learning')) {
    aliases.push('machine learning', 'ai and machine learning', 'ai and ml', 'ml');
  }
  if (slug === 'java' || title.includes('java')) {
    aliases.push('java', 'java programming', 'core java', 'java course');
  }
  if (slug === 'html' || title.includes('html')) {
    aliases.push('html', 'html course', 'html5', 'web development', 'html basics', 'html training', 'frontend development', 'semantic html');
  }
  if (slug === 'css' || title.includes('css')) {
    aliases.push('css', 'css course', 'css3', 'web styling', 'styling', 'flexbox', 'css grid', 'responsive design', 'frontend styling', 'modern css');
  }
  if (slug === 'sql' || title.includes('sql')) {
    aliases.push('sql', 'sql course', 'database', 'sql database', 'relational database', 'sql queries', 'mysql', 'postgresql', 'data analysis with sql');
  }

  // Tokenize words in title (length >= 3)
  const titleWords = title.replace(/[^\w\s]/g, ' ').split(/\s+/).filter((w: string) => w.length >= 3);
  aliases.push(...titleWords);

  return Array.from(new Set(aliases));
}

/**
 * Searches across pages, courses, projects, and instructors with multi-layer fuzzy matching
 */
export async function searchWebsiteKnowledge(
  rawQuery: string,
  _history: ChatMessage[] = []
): Promise<WebsiteSearchResults> {
  const normQuery = normalizeText(rawQuery);
  const allCourses = await getAllCourses();
  const allInstructors = await getAllInstructors();

  // ---------------------------------------------------------------------------
  // 1. BROAD COURSE DISCOVERY INTENT
  // ---------------------------------------------------------------------------
  const isBroad = [
    'courses',
    'all courses',
    'give me courses',
    'give courses',
    'give me the courses',
    'what courses do you have',
    'what courses do you offer',
    'what courses are available',
    'show me courses',
    'show courses',
    'show all courses',
    'show me all courses',
    'list all courses',
    'list of courses',
    'available courses',
    'what programs do you offer',
    'what programs are available',
    'what can i learn',
    'what do you offer',
    'what do you teach',
    'tell me about your courses'
  ].some((p) => normQuery === p || normQuery.startsWith(p));

  if (isBroad) {
    const grouped: Record<string, SearchResultItem[]> = {};
    const courseItems: SearchResultItem[] = [];

    for (const c of allCourses) {
      if (c.status === 'coming-soon') continue;
      const item = courseToSearchResult(c, 1.0, 'exact');
      courseItems.push(item);
      const cat = c.category || 'Tools and Upskills';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    }

    return {
      matchedPages: [{ id: 'page-courses', title: 'All Courses & Programs', category: 'Catalog', url: '/courses', type: 'page' }],
      matchedCourses: courseItems,
      matchedProjects: [],
      matchedInstructors: [],
      allCategoryGroupedCourses: grouped,
      isAmbiguous: false,
      isFuzzyCorrection: false,
      queryIntent: 'broad_courses'
    };
  }

  // ---------------------------------------------------------------------------
  // 2. CHECK FOR DIRECT CONTENT QUESTIONS
  // ---------------------------------------------------------------------------
  if (
    normQuery.includes('how do you use my data') ||
    normQuery.includes('what is your privacy policy') ||
    normQuery.includes('how is my data protected') ||
    normQuery.includes('what data do you collect')
  ) {
    const pRecord = WEBSITE_PAGES_REGISTRY.find((p) => p.id === 'page-privacy')!;
    return {
      matchedPages: [{ id: pRecord.id, title: pRecord.title, category: pRecord.category, url: pRecord.url, description: pRecord.description, type: 'page' }],
      matchedCourses: [],
      matchedProjects: [],
      matchedInstructors: [],
      isAmbiguous: false,
      isFuzzyCorrection: false,
      queryIntent: 'content_question',
      contentAnswerSnippet: `Based on Edqoo's **Privacy Policy** (/privacy-policy):\n\n• **Data Collection**: We collect only essential contact details (name, email, phone) provided during inquiries and course enrollment.\n• **Strict Protection**: Personal data is protected with industry-standard encryption and secure session tokens.\n• **Zero Sharing**: We **never** sell, rent, or share personal data with third-party advertisers.\n• **User Control**: You can request full data access, correction, or deletion anytime by contacting support@edqoo.com.`
    };
  }

  if (
    normQuery.includes('what are your terms') ||
    normQuery.includes('what is your policy') ||
    normQuery.includes('refund policy') ||
    normQuery.includes('curriculum policy')
  ) {
    const tRecord = WEBSITE_PAGES_REGISTRY.find((p) => p.id === 'page-terms')!;
    return {
      matchedPages: [{ id: tRecord.id, title: tRecord.title, category: tRecord.category, url: tRecord.url, description: tRecord.description, type: 'page' }],
      matchedCourses: [],
      matchedProjects: [],
      matchedInstructors: [],
      isAmbiguous: false,
      isFuzzyCorrection: false,
      queryIntent: 'content_question',
      contentAnswerSnippet: `Based on Edqoo's **Terms & Conditions** (/terms-and-conditions):\n\n• **Curriculum & Updates**: Learning curriculums, projects, and technologies may be enhanced periodically based on technological advances and industry standards.\n• **Proprietary Materials**: All course materials and source code are protected proprietary intellectual property.\n• **Admissions & License**: Enrollment grants a personal, non-exclusive learning license.`
    };
  }

  if (
    normQuery.includes('how can i become an instructor') ||
    normQuery.includes('how to teach') ||
    normQuery.includes('how can i teach') ||
    normQuery.includes('how do i apply to teach')
  ) {
    const bRecord = WEBSITE_PAGES_REGISTRY.find((p) => p.id === 'page-become-instructor')!;
    return {
      matchedPages: [{ id: bRecord.id, title: bRecord.title, category: bRecord.category, url: bRecord.url, description: bRecord.description, type: 'page' }],
      matchedCourses: [],
      matchedProjects: [],
      matchedInstructors: [],
      isAmbiguous: false,
      isFuzzyCorrection: false,
      queryIntent: 'content_question',
      contentAnswerSnippet: `To become an instructor at Edqoo:\n\n• **Eligibility**: Senior practitioners, AI researchers, and software engineers with 3+ years of industry experience.\n• **Benefits**: Competitive remuneration, flexible teaching cohorts, and dedicated pedagogical support.\n• **Apply**: Submit your background, resume, and preferred technology tracks on our **/become-an-instructor** page.`
    };
  }

  if (
    normQuery.includes('how can i become a partner') ||
    normQuery.includes('how to partner') ||
    normQuery.includes('partnership process')
  ) {
    const pRecord = WEBSITE_PAGES_REGISTRY.find((p) => p.id === 'page-become-partner')!;
    return {
      matchedPages: [{ id: pRecord.id, title: pRecord.title, category: pRecord.category, url: pRecord.url, description: pRecord.description, type: 'page' }],
      matchedCourses: [],
      matchedProjects: [],
      matchedInstructors: [],
      isAmbiguous: false,
      isFuzzyCorrection: false,
      queryIntent: 'content_question',
      contentAnswerSnippet: `Edqoo partners with academic institutions and corporate enterprises:\n\n• **Colleges & Universities**: Curriculum co-delivery, student bootcamps, and faculty development programs (FDP).\n• **Corporate Enterprises**: Custom workforce upskilling in Data Science, AI, and Power BI.\n• **Get Started**: Submit your proposal on our **/become-a-partner** page.`
    };
  }

  if (
    normQuery.includes('how can i contact you') ||
    normQuery.includes('how to contact') ||
    normQuery.includes('contact number') ||
    normQuery.includes('customer care')
  ) {
    const cRecord = WEBSITE_PAGES_REGISTRY.find((p) => p.id === 'page-contact')!;
    const contactInfo = getContactInfo();
    return {
      matchedPages: [{ id: cRecord.id, title: cRecord.title, category: cRecord.category, url: cRecord.url, description: cRecord.description, type: 'page' }],
      matchedCourses: [],
      matchedProjects: [],
      matchedInstructors: [],
      isAmbiguous: false,
      isFuzzyCorrection: false,
      queryIntent: 'content_question',
      contentAnswerSnippet: `You can reach Edqoo directly through any of these channels:\n\n• **Direct Phone**: ${contactInfo.phone}\n• **WhatsApp Support**: ${contactInfo.phone}\n• **Email**: ${contactInfo.email}\n• **Admissions Helpdesk**: Available for 1-on-1 counseling and curriculum walkthroughs on our **/contact** page.`
    };
  }

  // ---------------------------------------------------------------------------
  // 3. SEARCH COURSES (EXACT + PARTIAL + PREFIX + FUZZY WORD-LEVEL)
  // ---------------------------------------------------------------------------
  const scoredCourses: Array<{ course: any; score: number; similarity: number; matchType: SearchResultItem['matchType'] }> = [];

  for (const c of allCourses) {
    if (c.status === 'coming-soon') continue;
    const titleNorm = normalizeText(c.title || '');
    const catNorm = normalizeText(c.category || '');
    const rawCategories = safeArrayParse(c.categories).map((cat) => normalizeText(String(cat)));
    const skillsNorm = normalizeText(safeArrayParse(c.skills).join(' '));
    const dynamicAliases = extractCourseAliases(c);

    const match = evaluateFuzzyMatch(normQuery, titleNorm, dynamicAliases);

    let score = 0;
    let matchType: SearchResultItem['matchType'] = 'none';
    let similarity = match.similarity;

    if (match.isMatch) {
      score = match.rankScore;
      matchType = match.matchType;
    } else {
      const catMatch = evaluateFuzzyMatch(normQuery, catNorm, rawCategories);
      if (catMatch.isMatch) {
        score = Math.round(catMatch.rankScore * 0.75);
        matchType = catMatch.matchType;
        similarity = catMatch.similarity;
      } else if (skillsNorm.includes(normQuery) && normQuery.length >= 3) {
        score = 650;
        matchType = 'contains';
        similarity = 0.85;
      }
    }

    if (score >= 450) {
      scoredCourses.push({ course: c, score, similarity, matchType });
    }
  }

  scoredCourses.sort((a, b) => b.score - a.score);

  // ---------------------------------------------------------------------------
  // 4. SEARCH WEBSITE PAGES (EXACT + FUZZY)
  // ---------------------------------------------------------------------------
  const scoredPages: Array<{ page: WebsitePageRecord; score: number; similarity: number; matchType: SearchResultItem['matchType'] }> = [];

  for (const page of WEBSITE_PAGES_REGISTRY) {
    const match = evaluateFuzzyMatch(normQuery, page.title, page.aliases);
    if (match.isMatch) {
      scoredPages.push({
        page,
        score: match.rankScore,
        similarity: match.similarity,
        matchType: match.matchType
      });
    }
  }

  scoredPages.sort((a, b) => b.score - a.score);

  // ---------------------------------------------------------------------------
  // 5. SEARCH PROJECTS
  // ---------------------------------------------------------------------------
  const matchedProjects: SearchResultItem[] = [];
  for (const p of DATA_SCIENCE_AI_PROJECTS) {
    const pTitle = normalizeText(p.title);
    const pTech = (p.technologies || []).map(normalizeText);
    const match = evaluateFuzzyMatch(normQuery, pTitle, pTech);
    if (match.isMatch || (normQuery.includes('project') && match.similarity >= 0.5)) {
      matchedProjects.push({
        id: p.id || `proj-${p.title}`,
        title: p.title,
        category: `Capstone Project (${p.category || 'Portfolio'})`,
        url: '/courses/advanced-executive-program-data-science-ai',
        description: p.description,
        type: 'project',
        similarity: match.similarity,
        matchType: match.matchType
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 6. SEARCH INSTRUCTORS
  // ---------------------------------------------------------------------------
  const matchedInstructors: SearchResultItem[] = [];
  for (const inst of allInstructors) {
    const iName = normalizeText(inst.name || '');
    const iDesig = normalizeText(inst.designation || '');
    const match = evaluateFuzzyMatch(normQuery, iName, [iDesig]);
    if (match.isMatch) {
      matchedInstructors.push({
        id: inst.id,
        title: inst.name,
        category: inst.designation || 'Faculty Member',
        url: `/instructors/${inst.id}`,
        description: inst.short_bio || inst.shortBio || inst.qualifications || '',
        type: 'instructor',
        similarity: match.similarity,
        matchType: match.matchType
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. RESULT COMPILATION & INTENT RESOLUTION
  // ---------------------------------------------------------------------------
  const courseResults: SearchResultItem[] = scoredCourses.slice(0, 6).map(({ course, similarity, matchType }) =>
    courseToSearchResult(course, similarity, matchType)
  );

  const pageResults: SearchResultItem[] = scoredPages.slice(0, 4).map(({ page, similarity, matchType }) => ({
    id: page.id,
    title: page.title,
    category: page.category,
    url: page.url,
    description: page.description,
    type: 'page',
    similarity,
    matchType
  }));

  // Disambiguation check (e.g. query "instructor" or "instrutor")
  const hasMultiplePageIntents =
    (normQuery === 'instructor' || normQuery === 'instrutor' || normQuery === 'teacher' || normQuery === 'faculty') &&
    !normQuery.includes('become') &&
    !normQuery.includes('apply');

  const topPage = scoredPages[0];
  const topCourse = scoredCourses[0];

  let queryIntent: WebsiteSearchResults['queryIntent'] = 'general';
  let isFuzzyCorrection = false;
  let correctedTerm: string | undefined;

  // Dedicated page query detection (exact or strong page alias)
  const isExplicitPageSearch = topPage && (
    topPage.matchType === 'exact' ||
    topPage.matchType === 'prefix' ||
    (topPage.score >= 700 && (!topCourse || topPage.score > topCourse.score))
  );

  if (hasMultiplePageIntents) {
    queryIntent = 'general';
  } else if (topCourse && topCourse.score >= 700 && (!topPage || topCourse.score >= topPage.score)) {
    queryIntent = 'course_search';
    if (topCourse.matchType === 'fuzzy') {
      isFuzzyCorrection = true;
      correctedTerm = topCourse.course.title;
    }
  } else if (isExplicitPageSearch) {
    queryIntent = 'page_search';
    if (topPage.matchType === 'fuzzy') {
      isFuzzyCorrection = true;
      correctedTerm = topPage.page.title;
    }
  } else if (courseResults.length > 0) {
    queryIntent = 'course_search';
    if (topCourse && topCourse.matchType === 'fuzzy') {
      isFuzzyCorrection = true;
      correctedTerm = topCourse.course.title;
    }
  } else if (matchedProjects.length > 0) {
    queryIntent = 'project_search';
  } else if (matchedInstructors.length > 0) {
    queryIntent = 'instructor_search';
  } else if (pageResults.length > 0) {
    queryIntent = 'page_search';
  }

  // Handle Free Learning & Tools & Upskills catalog queries
  if (topPage && (topPage.page.id === 'page-free-learning' || topPage.page.id === 'page-tools-upskills')) {
    queryIntent = 'page_search';
  }

  const shouldAttachCourses = queryIntent === 'course_search' ||
    (topPage && (topPage.page.id === 'page-free-learning' || topPage.page.id === 'page-tools-upskills' || topPage.page.id === 'page-courses-catalog'));

  return {
    matchedPages: pageResults,
    matchedCourses: shouldAttachCourses ? courseResults : (queryIntent === 'page_search' ? [] : courseResults),
    matchedProjects,
    matchedInstructors,
    isAmbiguous: hasMultiplePageIntents,
    isFuzzyCorrection,
    correctedTerm,
    queryIntent
  };
}

// =============================================================================
// DETERMINISTIC NATURAL LANGUAGE FALLBACK GENERATOR (ZERO GEMINI DEPENDENCY)
// =============================================================================

export function generateDeterministicAnswer(
  rawQuery: string,
  searchData: WebsiteSearchResults,
  _history: ChatMessage[] = [],
  contactInfo = getContactInfo()
): ChatResponse {
  const normQuery = normalizeText(rawQuery);
  const {
    matchedPages,
    matchedCourses,
    matchedProjects,
    matchedInstructors,
    allCategoryGroupedCourses,
    isAmbiguous,
    isFuzzyCorrection,
    correctedTerm,
    queryIntent,
    contentAnswerSnippet
  } = searchData;

  // 1. CONTENT QUESTION ANSWER
  if (contentAnswerSnippet) {
    return {
      success: true,
      answer: contentAnswerSnippet,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: matchedPages,
      resultType: 'general',
      contactInfo
    };
  }

  // 2. AMBIGUOUS QUERY DISAMBIGUATION
  if (isAmbiguous) {
    const combined: SearchResultItem[] = [
      {
        id: 'page-instructors',
        title: 'Our Faculty & Mentors',
        category: 'Directory',
        url: '/instructors',
        description: 'Meet our senior industry educators, machine learning practitioners, and BI specialists.',
        type: 'page'
      },
      {
        id: 'page-become-instructor',
        title: 'Become an Instructor',
        category: 'Teaching Opportunities',
        url: '/become-an-instructor',
        description: 'Join our faculty of industry experts and teach cutting-edge technology tracks.',
        type: 'page'
      }
    ];

    return {
      success: true,
      answer: `I found two relevant sections on our website. Which one would you like to explore?`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: combined,
      resultType: 'general',
      contactInfo
    };
  }

  // 3. PAGE SEARCH INTENT
  if (queryIntent === 'page_search' && matchedPages.length > 0) {
    const page = matchedPages[0];
    let answerText = `Here is our **${page.title}** page:`;
    if (page.url === '/privacy-policy') {
      answerText = `Here is our **Privacy Policy**, which explains how website information and personal data are protected.`;
    } else if (page.url === '/terms-and-conditions') {
      answerText = `Here are our **Terms & Conditions**, outlining program terms, curriculum updates, and licensing policies.`;
    } else if (page.url === '/contact') {
      answerText = `You can reach our academic and technical support team directly on Phone (${contactInfo.phone}), WhatsApp, or Email (${contactInfo.email}).`;
    } else if (page.url === '/become-an-instructor') {
      answerText = `To apply as an instructor at Edqoo, submit your profile and teaching tracks on our **/become-an-instructor** page.`;
    } else if (page.url === '/become-a-partner') {
      answerText = `Edqoo collaborates with universities and corporate enterprises for workforce upskilling. Learn more on our **/become-a-partner** page.`;
    } else if (page.url === '/hire-from-us') {
      answerText = `Through our **Hire From Us** program, companies can recruit pre-vetted tech talent with zero placement fees.`;
    } else if (page.url === '/leadership-council') {
      answerText = `Meet our **Leadership Council**, steering academic pathways, curriculum modernization, and research initiatives.`;
    } else if (page.id === 'page-free-learning') {
      answerText = `We offer **Free Learning courses** designed for practical foundational skill-building in Python, Java, HR, Finance, and Accounting & GST on our /courses catalog.`;
    } else if (page.id === 'page-tools-upskills') {
      answerText = `Explore our specialized executive **Tools & Upskills** masterclasses in Generative AI, Prompt Engineering, Python, Advanced Excel, Power BI, Cloud Computing, and more on our /courses catalog.`;
    }

    if (isFuzzyCorrection && correctedTerm) {
      answerText = `Did you mean **${correctedTerm}**?\n\n${answerText}`;
    }

    const attachResults = page.id === 'page-free-learning' || page.id === 'page-tools-upskills'
      ? [page, ...matchedCourses]
      : matchedPages;


    return {
      success: true,
      answer: answerText,
      source: 'website',
      confidence: 'supported',
      needsContact: page.url === '/contact',
      results: attachResults,
      resultType: 'general',
      contactInfo
    };
  }

  // 4. BROAD COURSES LISTING
  if (queryIntent === 'broad_courses' || allCategoryGroupedCourses) {
    let answerText = `Sure! Here are the courses currently available at **Edqoo**:\n\n`;

    if (allCategoryGroupedCourses) {
      for (const [category, items] of Object.entries(allCategoryGroupedCourses)) {
        answerText += `**${category}**\n`;
        for (const item of items) {
          answerText += `• ${item.title}\n`;
        }
        answerText += `\n`;
      }
    } else if (matchedCourses.length > 0) {
      for (const item of matchedCourses) {
        answerText += `• **${item.title}** (${item.category})\n`;
      }
      answerText += `\n`;
    }

    answerText += `You can explore complete syllabus details, projects, and admissions on our website.`;

    return {
      success: true,
      answer: answerText.trim(),
      source: 'database',
      confidence: 'supported',
      needsContact: false,
      results: matchedCourses.slice(0, 6),
      resultType: 'courses',
      contactInfo
    };
  }

  // 5. MATCHED COURSES (EXACT / FUZZY TYPOS)
  if (matchedCourses.length > 0) {
    let intro = `Yes! We offer the following courses:`;

    if (isFuzzyCorrection && correctedTerm) {
      intro = `Yes! Did you mean **${correctedTerm}**? I found these matching courses:`;
    } else if (normQuery.includes('python') || normQuery === 'py' || normQuery === 'p') {
      intro = `Yes! We offer Python-related learning programs:`;
    } else if (normQuery.includes('java') || normQuery === 'j') {
      intro = `Yes! We offer Java foundational training:`;
    } else if (normQuery.includes('data science') || normQuery.includes('ai') || normQuery === 'd') {
      intro = `Yes! We offer industry-aligned Data Science & AI programs:`;
    } else if (normQuery.includes('digital marketing')) {
      intro = `Yes! We offer Digital Marketing learning:`;
    } else if (normQuery.includes('power bi') || normQuery.includes('powerbi')) {
      intro = `Yes! We offer Power BI business intelligence training:`;
    }

    return {
      success: true,
      answer: intro,
      source: 'database',
      confidence: 'supported',
      needsContact: false,
      results: matchedCourses,
      resultType: 'courses',
      contactInfo
    };
  }

  // 6. MATCHED PROJECTS
  if (matchedProjects.length > 0) {
    const listText = DATA_SCIENCE_AI_PROJECTS.map(
      (p, idx) => `${idx + 1}. **${p.title}** (${p.technologies.join(', ')}) — ${p.description}`
    ).join('\n\n');

    return {
      success: true,
      answer: `Our Data Science and AI programs feature **${DATA_SCIENCE_AI_PROJECTS.length} verified real-world capstone projects**:\n\n${listText}\n\nEach project includes standalone code repositories and shareable dashboards.`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: matchedProjects.slice(0, 4),
      resultType: 'projects',
      contactInfo
    };
  }

  // 7. MATCHED INSTRUCTORS
  if (matchedInstructors.length > 0) {
    return {
      success: true,
      answer: `Our programs are taught by experienced industry practitioners and researchers:\n\n` +
        `• **Dr. Evelyn Vance** — Lead AI & Machine Learning Faculty (12+ yrs exp, Ph.D. in CS & AI)\n` +
        `• **Michael Kovac** — Principal Data Scientist & Analytics Lead (10+ yrs exp in SQL & quantitative modeling)\n` +
        `• **Dr. Priya Sundaram** — Senior Faculty & Business Intelligence Specialist (9+ yrs exp in Power BI & DAX)\n` +
        `• **Arun Kumar** — Generative AI & Prompt Engineering Specialist\n\n` +
        `All faculty focus on hands-on code and real-world architectures.`,
      source: 'database',
      confidence: 'supported',
      needsContact: false,
      results: matchedInstructors,
      resultType: 'instructors',
      contactInfo
    };
  }

  // 8. UNRELATED QUERY REJECTION (e.g. "xyzabc")
  return {
    success: true,
    answer: `I couldn't find a matching course, program, or page on our website for "${rawQuery}". Try searching for Python, Data Science, Power BI, Free Learning, Instructors, Privacy Policy, Terms, or Contact.`,
    source: 'website',
    confidence: 'unsupported',
    needsContact: true,
    results: [],
    resultType: 'general',
    errorCode: 'NOT_FOUND',
    contactInfo
  };
}

// =============================================================================
// GEMINI SYSTEM INSTRUCTION & SERVER INTEGRATION
// =============================================================================

export const GEMINI_SYSTEM_INSTRUCTION = `
You are the official website assistant for Edqoo.

Answer questions using ONLY the verified website information supplied to you in the context.

The supplied context is the source of truth.

Never invent:
- courses
- pages or routes
- prices
- instructors
- durations
- certifications
- placement claims
- eligibility requirements
- discounts
- contact details
- policies
- program features

If the requested information exists in the supplied website data, answer using that information.

If the information is not present, clearly say that the website does not currently provide that information.

Do not claim that the system is unavailable merely because a search returned no exact match.

Be concise, helpful and conversational.

When listing courses, use the actual course names from the supplied data.

When a relevant course or page exists, provide its name and a link to its actual page when available.
`.trim();

// =============================================================================
// MAIN CHAT CONTROLLER: askGemini
// =============================================================================

export async function askGemini(message: string, history: ChatMessage[] = []): Promise<ChatResponse> {
  const contactInfo = getContactInfo();
  const rawQuery = (message || '').trim();
  const normQuery = normalizeText(rawQuery);

  if (!rawQuery) {
    return {
      success: true,
      answer: "Hi! How can I help you today? You can ask me about our courses, programs, projects, instructors, pages, or admissions.",
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      resultType: 'general',
      contactInfo
    };
  }

  // ---------------------------------------------------------------------------
  // STEP 1: SEARCH WEBSITE KNOWLEDGE (PAGES + COURSES + PROJECTS + INSTRUCTORS)
  // ---------------------------------------------------------------------------
  let searchData: WebsiteSearchResults;
  try {
    searchData = await searchWebsiteKnowledge(rawQuery, history);
  } catch (dbErr: any) {
    console.error('[CHATBOT ERROR] Search failed:', dbErr.message);
    return {
      success: false,
      answer: "I'm temporarily experiencing difficulty accessing website data. Please contact our support team directly.",
      source: 'fallback',
      confidence: 'unsupported',
      needsContact: true,
      errorCode: 'DB_UNAVAILABLE',
      resultType: 'general',
      contactInfo
    };
  }

  const {
    matchedPages,
    matchedCourses,
    matchedProjects,
    matchedInstructors
  } = searchData;

  // ---------------------------------------------------------------------------
  // STEP 2: GEMINI RAG SYNTHESIS (NATURAL LANGUAGE REFINEMENT)
  // ---------------------------------------------------------------------------
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  // If no Gemini key or skipped, return verified deterministic response immediately
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return generateDeterministicAnswer(rawQuery, searchData, history, contactInfo);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Assemble verified context
    const allCoursesList = await getAllCourses();

    const courseCatalogSnippet = allCoursesList.map((c: any) => {
      const skillsStr = safeArrayParse(c.skills).join(', ');
      return `- Course: "${c.title}" | Slug: "${c.slug}" | Category: "${c.category}" | Duration: "${c.duration || 'Flexible'}" | Price: ${c.price ? '₹' + c.price : 'Free'} | Skills: ${skillsStr}`;
    }).join('\n');

    const pagesSnippet = WEBSITE_PAGES_REGISTRY.map((p) => `- Page: "${p.title}" | URL: "${p.url}" | Description: "${p.description}"`).join('\n');

    const retrievedContext = `
[VERIFIED WEBSITE PAGES]
${pagesSnippet}

[VERIFIED COURSES IN DATABASE]
${courseCatalogSnippet}

[VERIFIED CAPSTONE PROJECTS]
${WEBSITE_PAGES_REGISTRY.find(p => p.id === 'page-projects')?.contentSummary || ''}

[PRIVACY POLICY & TERMS]
${WEBSITE_PAGES_REGISTRY.find(p => p.id === 'page-privacy')?.contentSummary || ''}
${WEBSITE_PAGES_REGISTRY.find(p => p.id === 'page-terms')?.contentSummary || ''}

[CONTACT SUPPORT INFO]
- Phone: ${contactInfo.phone}
- WhatsApp: ${contactInfo.phone}
- Email: ${contactInfo.email}
`.trim();

    const recentHistory = (history || []).slice(-6);
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const turn of recentHistory) {
      const role = turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user';
      if (turn.content && turn.content.trim()) {
        contents.push({
          role,
          parts: [{ text: turn.content }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{
        text: `
[SUPPLIED VERIFIED WEBSITE CONTEXT]
${retrievedContext}

[USER QUESTION]
${rawQuery}
`.trim()
      }]
    });

    let geminiText = '';

    const candidateModels = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
            temperature: 0.2,
            maxOutputTokens: 600
          }
        });
        geminiText = response.text?.trim() || '';
        if (geminiText) break;
      } catch {
        // Try next candidate model
      }
    }

    if (!geminiText) {
      return generateDeterministicAnswer(rawQuery, searchData, history, contactInfo);
    }

    const lowerAns = geminiText.toLowerCase();
    const isUnknown = lowerAns.includes("couldn't find information") ||
                      lowerAns.includes("don't have that information") ||
                      lowerAns.includes("not available on our website");

    // Determine results to attach for UI cards
    let resultsToAttach: SearchResultItem[] | undefined;
    let resultType: ChatResponse['resultType'] = 'general';

    if (matchedCourses.length > 0) {
      resultsToAttach = matchedCourses;
      resultType = 'courses';
    } else if (matchedPages.length > 0) {
      resultsToAttach = matchedPages;
      resultType = 'general';
    } else if (matchedProjects.length > 0) {
      resultsToAttach = matchedProjects.slice(0, 4);
      resultType = 'projects';
    } else if (matchedInstructors.length > 0) {
      resultsToAttach = matchedInstructors;
      resultType = 'instructors';
    }

    return {
      success: true,
      answer: geminiText,
      source: 'gemini',
      confidence: isUnknown ? 'unsupported' : 'supported',
      needsContact: isUnknown || normQuery.includes('contact') || normQuery.includes('fee'),
      results: resultsToAttach,
      resultType,
      errorCode: isUnknown ? 'NOT_FOUND' : undefined,
      contactInfo
    };

  } catch (geminiError: any) {
    console.error('[CHATBOT ERROR] Gemini processing error:', geminiError.message);
    return generateDeterministicAnswer(rawQuery, searchData, history, contactInfo);
  }
}

