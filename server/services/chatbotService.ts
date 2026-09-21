import { GoogleGenAI } from '@google/genai';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { DATA_SCIENCE_AI_PROJECTS } from '../../src/data/courses.js';

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
  type: 'course' | 'project' | 'instructor' | 'page';
}

export interface ChatResponse {
  success: boolean;
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
// APPROVED STATIC WEBSITE KNOWLEDGE
// =============================================================================

export const STATIC_WEBSITE_KNOWLEDGE = {
  company: `
EDQOO OVERVIEW:
- Edqoo is a premium technology education and corporate upskilling platform.
- Core Value: "Practical Skills. Real Projects. Better Careers."
- Mission: Closing the gap between academic theory and real-world enterprise technology requirements with project-driven, hands-on learning.
- Learning Philosophy:
  1. Focus on Code, Not Slides (learning through live terminals, Python notebooks, and system architectures).
  2. Defensive Hardening & Industry Standards (security, scalable configurations, clean code).
  3. Shareable Demos (building standalone portfolio capstones for hiring evaluations).
- Learning Modes: Live cohort masterclasses, 1-on-1 mentorship, self-paced modules, practical capstone projects, career support.
- Contact: Support Email (support@edqoo.com), Phone & WhatsApp available for academic counseling.
`,

  projects: `
APPROVED DATA SCIENCE & AI PROJECTS PORTFOLIO (7 Core Capstones):
1. Title: Diwali Sales Analysis & Reporting
   Category: AMAZON / E-Commerce
   Description: Analyzed customer purchasing behavior and sales performance during Diwali. Identified top-selling products, revenue trends, and customer segments using Python, machine learning, and data visualization.
   Technologies: Python, Machine Learning, Pandas, Data Visualization.

2. Title: Netflix Data Analysis
   Category: NETFLIX / Entertainment Analytics
   Description: Analyzed Netflix content data including genres, ratings, countries, and content types. Developed an interactive Power BI dashboard to uncover content trends and generate data-driven insights.
   Technologies: Power BI, DAX, Data Analysis, Data Visualization.

3. Title: Electric Vehicle Data Analysis
   Category: EV / Clean Transportation Analytics
   Description: Examined electric vehicle adoption trends, vehicle categories, and regional distribution. Created interactive Tableau dashboards to visualize growth patterns and support EV market analysis.
   Technologies: Tableau, Data Analysis, Data Visualization, EV Analytics.

4. Title: AI Interview Preparation Assistant
   Category: AI / Career Tech
   Description: Built an AI-powered application that generates role-specific technical and HR interview questions using Generative AI. Developed interactive UI with Streamlit and secure LLM API integration.
   Technologies: Python, Streamlit, Generative AI, LLM, API Integration.

5. Title: Pneumonia Severity Detection Using Deep Learning
   Category: MEDICAL AI / Healthcare Diagnostics
   Description: Automated deep learning system to classify chest X-ray images into Pneumonia and Normal categories using transfer learning. Analyzes infection severity for medical diagnosis.
   Technologies: Deep Learning, Transfer Learning, CNN, Medical AI.

6. Title: Kanoon Darpan AI – IPC Section Identification
   Category: LEGAL AI / Natural Language Processing
   Description: NLP-driven legal assistant to identify relevant Indian Penal Code (IPC) sections and legal provisions from natural language case descriptions.
   Technologies: NLP, Python, Transformers, Semantic Search, FastAPI.

7. Title: Suicide Ideation Detection from Text
   Category: HEALTHCARE NLP / Mental Health Analytics
   Description: Sensitive text classification and sentiment severity pipeline using deep learning and transformer models to identify warning signs in anonymized social posts.
   Technologies: PyTorch, RoBERTa/BERT, NLP, Python.
`,

  hireFromUs: `
HIRE FROM US PROGRAM (/hire-from-us):
- Overview: Connects forward-thinking companies, startups, and enterprises with pre-vetted, job-ready talent in Data Science, AI/ML, Data Analytics, Python, and Business Intelligence with ZERO placement or hiring fees.
- Why Hire From Edqoo:
  1. Industry-Oriented Skills: Candidates have worked on real datasets and production-grade workflows.
  2. Verified Capstone Portfolios: Every candidate has built 5+ verified industry projects with GitHub code repositories and live dashboards.
  3. Zero Placement/Hiring Fees for Partner Employers.
  4. Immediate Joining: Candidates ready for full-time, contract, or internship roles.
- Talent Domains: Data Scientists, Machine Learning Engineers, Data Analysts, Python Developers, Business Intelligence / Power BI Specialists.
- Hiring Process for Companies:
  1. Submit Hiring Requirement on website (/hire-from-us) (Company Name, Contact Person, Email, Phone, Job Role, Openings, Required Skills, Experience Level, Location, Work Mode: Remote/Hybrid/On-site).
  2. Candidate Shortlisting within 24-48 hours.
  3. Direct Interviews & Smooth Onboarding.
`,

  becomeInstructor: `
BECOME AN INSTRUCTOR (/become-an-instructor):
- Overview: Edqoo invites experienced industry practitioners, senior researchers, and subject-matter experts to teach and mentor aspiring tech professionals.
- Who Can Apply: Senior Data Scientists, AI Researchers, BI Consultants, Software Engineers, and Corporate Trainers with 3+ years of industry or academic experience.
- Benefits for Instructors: Competitive compensation, global reach, flexible teaching schedules (weekend/evening cohorts), and pedagogical support.
- Application Process: Submit details on /become-an-instructor page including Name, Email, Phone, Designation, Organization, Qualification, Expertise, Experience, Courses you can teach, Teaching Experience, Short Bio, and Resume/Portfolio link.
`,

  becomePartner: `
BECOME A PARTNER (/become-a-partner):
- Overview: Edqoo collaborates with universities, engineering colleges, training centers, and corporate enterprises.
- Partnership Areas:
  1. Academic Institutions: Industry-aligned curriculum integration, credit-bearing electives, faculty development programs (FDP), student upskilling bootcamps.
  2. Corporate Enterprises: Customized workforce upskilling in Data & AI, corporate training workshops, executive coaching.
- How to Partner: Submit partnership enquiry on the /become-a-partner page with organization name, type, contact person, partnership area, and proposal summary.
`,

  termsAndConditions: `
TERMS & CONDITIONS SUMMARY (/terms-and-conditions):
- Key Policy on Curriculum & Content: Courses, curriculums, projects, technologies, learning materials, instructor allocations, and other program components may be modified, updated, or enhanced periodically based on technological advancement, industry requirements, or educational and operational considerations.
- Access & Intellectual Property: All course materials, code, lectures, and platforms are proprietary. Enrollment provides a limited, non-exclusive, non-transferable personal license.
- User Responsibilities: Users must provide accurate information, maintain account security, and adhere to ethical use policies.
- For complete terms, visit /terms-and-conditions or contact support@edqoo.com.
`,

  privacyPolicy: `
PRIVACY POLICY SUMMARY (/privacy-policy):
- Data Collection: We collect contact information (name, email, phone), academic/professional background provided during enquiries, and course progress telemetry.
- Usage: Information is used solely to deliver educational programs, respond to enquiries, issue certifications, and improve curriculum.
- Data Protection: We employ industry-standard encryption, secure session tokens, and strict access controls.
- Third Parties: We do NOT sell, rent, or trade personal data to third parties.
- User Rights: Users can request data access, correction, or deletion by emailing support@edqoo.com.
`
};

// =============================================================================
// DATABASE RETRIEVAL HELPERS
// =============================================================================

export async function getAllCourses(): Promise<any[]> {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const res = await query(`
        SELECT id, slug, title, category, categories, short_description, description, price, original_price,
               duration, live_hours, lessons, level, rating, students, skills, projects, outcome, who_is_it_for
        FROM courses
        ORDER BY featured DESC, rating DESC
      `);
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    }
  } catch (err) {
    console.warn('DB course fetch error, using mockStore:', err);
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
    console.warn('DB instructor fetch error, using mockStore:', err);
  }
  return mockStore.instructors || [];
}

export async function getAllLeadership(): Promise<any[]> {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const res = await query('SELECT * FROM leadership_members ORDER BY display_order ASC');
      if (res.rows && res.rows.length > 0) {
        return res.rows;
      }
    }
  } catch (err) {
    console.warn('DB leadership fetch error, using mockStore:', err);
  }
  return mockStore.leadershipMembers || [];
}

// =============================================================================
// MULTI-SOURCE SEARCH ENGINE (DATABASE FIRST)
// =============================================================================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Searches courses, projects, instructors, and website content
 */
export async function directWebsiteSearch(userQuery: string): Promise<{
  courses: SearchResultItem[];
  projects: SearchResultItem[];
  instructors: SearchResultItem[];
  pages: SearchResultItem[];
}> {
  const normQuery = normalizeText(userQuery);
  const words = normQuery.split(' ').filter((w) => w.length > 1);

  const allCourses = await getAllCourses();
  const allInstructors = await getAllInstructors();

  // 1. MATCH COURSES
  const scoredCourses: Array<{ course: any; score: number }> = [];

  for (const c of allCourses) {
    let score = 0;
    const titleNorm = normalizeText(c.title || '');
    const slugNorm = normalizeText(c.slug || '');
    const catNorm = normalizeText(c.category || '');
    const descNorm = normalizeText(c.short_description || c.description || '');
    const skillsArr = Array.isArray(c.skills) ? c.skills : (typeof c.skills === 'string' ? JSON.parse(c.skills || '[]') : []);
    const skillsNorm = normalizeText(skillsArr.join(' '));

    // Exact name match
    if (titleNorm === normQuery || slugNorm === normQuery) {
      score += 100;
    }
    // Title starts with or contains query
    else if (titleNorm.includes(normQuery)) {
      score += 70;
    }
    // Slug contains query
    else if (slugNorm.includes(normQuery)) {
      score += 60;
    }

    // Category match (e.g. "free learning", "tools", "data science")
    if (catNorm === normQuery) {
      score += 80;
    } else if (catNorm.includes(normQuery)) {
      score += 50;
    }

    // Keyword tokens match
    for (const w of words) {
      // Ignore common filler words
      if (['what', 'have', 'your', 'course', 'courses', 'program', 'programs', 'tell', 'show', 'give', 'about', 'with', 'does', 'find', 'learn', 'online'].includes(w)) {
        continue;
      }

      if (titleNorm.includes(w)) score += 30;
      if (slugNorm.includes(w)) score += 25;
      if (skillsNorm.includes(w)) score += 20;
      if (catNorm.includes(w)) score += 15;
      if (descNorm.includes(w)) score += 10;
    }

    // Special exact keyword shortcuts
    if (normQuery.includes('python') && (titleNorm.includes('python') || slugNorm.includes('python') || skillsNorm.includes('python'))) {
      score += 40;
    }
    if (normQuery.includes('java') && !normQuery.includes('javascript') && (titleNorm.includes('java') || slugNorm.includes('java') || skillsNorm.includes('java'))) {
      score += 40;
    }
    if (normQuery.includes('free') && (catNorm.includes('free') || Number(c.price) === 0)) {
      score += 40;
    }
    if (normQuery.includes('data science') && (catNorm.includes('data science') || titleNorm.includes('data science'))) {
      score += 40;
    }
    if (normQuery.includes('analytics') && (catNorm.includes('analytics') || titleNorm.includes('analytics'))) {
      score += 40;
    }
    if (normQuery.includes('excel') && (titleNorm.includes('excel') || skillsNorm.includes('excel'))) {
      score += 40;
    }
    if (normQuery.includes('power bi') && (titleNorm.includes('power bi') || skillsNorm.includes('power bi'))) {
      score += 40;
    }
    if (normQuery.includes('sql') && (titleNorm.includes('sql') || skillsNorm.includes('sql'))) {
      score += 40;
    }
    if (normQuery.includes('digital marketing') && (titleNorm.includes('digital marketing') || catNorm.includes('free'))) {
      score += 40;
    }
    if (normQuery.includes('gst') && (titleNorm.includes('gst') || titleNorm.includes('accounting'))) {
      score += 40;
    }
    if (normQuery.includes('hr') && (titleNorm === 'hr' || titleNorm.includes('human resources'))) {
      score += 40;
    }

    if (score > 0) {
      scoredCourses.push({ course: c, score });
    }
  }

  scoredCourses.sort((a, b) => b.score - a.score);

  const matchedCourses: SearchResultItem[] = scoredCourses.slice(0, 5).map(({ course }) => {
    const isFree = Number(course.price) === 0 || (course.category && course.category.toLowerCase().includes('free'));
    const routeUrl = isFree ? `/free-learning/${course.slug}` : `/courses/${course.slug}`;

    return {
      id: course.id,
      title: course.title,
      category: course.category,
      price: course.price,
      duration: course.duration,
      url: routeUrl,
      description: course.short_description || course.description,
      level: course.level,
      type: 'course'
    };
  });

  // 2. MATCH PROJECTS
  const matchedProjects: SearchResultItem[] = [];
  if (normQuery.includes('project') || normQuery.includes('capstone') || normQuery.includes('diwali') || normQuery.includes('netflix') || normQuery.includes('ev') || normQuery.includes('interview') || normQuery.includes('pneumonia') || normQuery.includes('kanoon') || normQuery.includes('suicide')) {
    for (const p of DATA_SCIENCE_AI_PROJECTS) {
      const pTitle = normalizeText(p.title);
      const pDesc = normalizeText(p.description);
      const pTech = normalizeText((p.technologies || []).join(' '));

      let matched = false;
      if (normQuery.includes('project') || normQuery.includes('capstone')) {
        matched = true;
      } else {
        for (const w of words) {
          if (w.length > 2 && (pTitle.includes(w) || pDesc.includes(w) || pTech.includes(w))) {
            matched = true;
            break;
          }
        }
      }

      if (matched) {
        matchedProjects.push({
          id: p.id || `proj-${Date.now()}`,
          title: p.title || 'Capstone Project',
          category: `Project (${p.category || 'Portfolio'})`,
          url: '/courses/advanced-executive-program-data-science-ai',
          description: p.description || '',
          type: 'project'
        });
      }
    }
  }

  // 3. MATCH INSTRUCTORS
  const matchedInstructors: SearchResultItem[] = [];
  if (normQuery.includes('instructor') || normQuery.includes('who teaches') || normQuery.includes('faculty') || normQuery.includes('teacher') || normQuery.includes('evelyn') || normQuery.includes('kovac') || normQuery.includes('priya') || normQuery.includes('arun')) {
    for (const inst of allInstructors) {
      const iName = normalizeText(inst.name || '');
      const iDesig = normalizeText(inst.designation || '');
      const iExp = normalizeText(Array.isArray(inst.expertise) ? inst.expertise.join(' ') : (inst.expertise || ''));

      let matched = false;
      if (normQuery.includes('instructor') || normQuery.includes('faculty') || normQuery.includes('who teaches')) {
        matched = true;
      } else {
        for (const w of words) {
          if (w.length > 2 && (iName.includes(w) || iDesig.includes(w) || iExp.includes(w))) {
            matched = true;
            break;
          }
        }
      }

      if (matched) {
        matchedInstructors.push({
          id: inst.id || `inst-${Date.now()}`,
          title: inst.name || 'Faculty Member',
          category: inst.designation || 'Instructor',
          url: `/instructors/${inst.id || ''}`,
          description: inst.short_bio || inst.shortBio || inst.qualifications || '',
          type: 'instructor'
        });
      }
    }
  }

  // 4. MATCH STATIC PAGES
  const matchedPages: SearchResultItem[] = [];
  if (normQuery.includes('hire') || normQuery.includes('recruiter') || normQuery.includes('placement')) {
    matchedPages.push({
      id: 'page-hire',
      title: 'Hire From Us',
      category: 'Corporate Hiring',
      url: '/hire-from-us',
      description: 'Recruit job-ready talent in Data Science, AI, and Analytics with zero hiring fees.',
      type: 'page'
    });
  }
  if (normQuery.includes('become an instructor') || normQuery.includes('teach') || normQuery.includes('apply to teach')) {
    matchedPages.push({
      id: 'page-instructor',
      title: 'Become an Instructor',
      category: 'Teaching Opportunities',
      url: '/become-an-instructor',
      description: 'Join our faculty of industry experts and teach cutting-edge technology tracks.',
      type: 'page'
    });
  }
  if (normQuery.includes('partner') || normQuery.includes('partnership') || normQuery.includes('collaboration')) {
    matchedPages.push({
      id: 'page-partner',
      title: 'Become a Partner',
      category: 'Academic & Corporate Partnerships',
      url: '/become-a-partner',
      description: 'Partner with Edqoo for curriculum integration, campus training, and workforce upskilling.',
      type: 'page'
    });
  }

  return {
    courses: matchedCourses,
    projects: matchedProjects,
    instructors: matchedInstructors,
    pages: matchedPages
  };
}

// =============================================================================
// SYSTEM INSTRUCTION FOR GEMINI
// =============================================================================

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for Edqoo (this website).

Your job is to answer questions about this organization, its programs,
courses, instructors, projects, services, policies, and website.

You may ONLY use the information provided in the approved website
knowledge/context and current database information.

Do not invent information.

Do not guess.

Do not make up course fees, durations, instructors, certifications,
placements, salaries, job guarantees, schedules, eligibility requirements, partnerships, or
other organizational information.

If the requested information is not available in the provided
website knowledge, clearly say:
"I couldn't find information about that on our website. Please contact our support team for the most accurate information."

Never pretend that unknown information is known.

Keep answers concise, direct, helpful, and professional.
`;

// =============================================================================
// MAIN CHAT / QUERY CONTROLLER
// =============================================================================

export async function askGemini(message: string, history: ChatMessage[] = []): Promise<ChatResponse> {
  const contactInfo = getContactInfo();
  const rawQuery = (message || '').trim();
  const normQuery = normalizeText(rawQuery);

  // ---------------------------------------------------------------------------
  // STEP 1: DETECT KNOWN UNSUPPORTED / OUT-OF-SCOPE QUERIES (STATE 2)
  // ---------------------------------------------------------------------------
  if (
    normQuery.includes('best university in india') ||
    normQuery.includes('salary will i get') ||
    normQuery.includes('exact salary') ||
    normQuery.includes('guarantee me a job') ||
    normQuery.includes('100 placement') ||
    normQuery.includes('weather') ||
    normQuery.includes('capital of') ||
    normQuery.includes('who is the prime minister') ||
    normQuery.includes('tell me a joke') ||
    normQuery.includes('course that isn t on the website') ||
    normQuery.includes('course that is not on the website')
  ) {
    let specificMsg = "I couldn't find information about that on our website.";
    if (normQuery.includes('salary')) {
      specificMsg = "I don't have information about specific salary outcomes on our website.";
    } else if (normQuery.includes('guarantee') || normQuery.includes('placement')) {
      specificMsg = "I couldn't find information verifying job placement guarantees on our website.";
    }

    return {
      success: true,
      answer: specificMsg,
      source: 'website',
      confidence: 'unsupported',
      needsContact: true,
      results: [],
      errorCode: 'NOT_FOUND',
      contactInfo
    };
  }

  // ---------------------------------------------------------------------------
  // STEP 2: MULTI-SOURCE WEBSITE SEARCH (DATABASE FIRST)
  // ---------------------------------------------------------------------------
  let searchData;
  try {
    searchData = await directWebsiteSearch(rawQuery);
  } catch (dbErr) {
    console.error('Database query error during search:', dbErr);
    return {
      success: false,
      answer: "I'm temporarily unable to access our course information. Please contact our support team.",
      source: 'fallback',
      confidence: 'unsupported',
      needsContact: true,
      errorCode: 'DB_UNAVAILABLE',
      contactInfo
    };
  }

  const { courses: matchedCourses, projects: matchedProjects, instructors: matchedInstructors, pages: matchedPages } = searchData;

  // ---------------------------------------------------------------------------
  // STEP 3: DIRECT ANSWER GENERATION FOR KEYWORD & ENTITY SEARCHES
  // ---------------------------------------------------------------------------

  // Special Intent: Become an Instructor
  if (normQuery.includes('become an instructor') || normQuery.includes('become instructor') || normQuery.includes('apply to teach') || (normQuery.includes('become') && normQuery.includes('instructor'))) {
    return {
      success: true,
      answer: `To become an instructor at Edqoo:\n\n1. Visit our **/become-an-instructor** page.\n2. Submit your profile, teaching experience (minimum 3+ years in industry/academia), qualifications, and the courses you wish to teach.\n3. Our academic review board evaluates applications and arranges an onboarding discussion.`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: [{
        id: 'page-instructor',
        title: 'Become an Instructor',
        category: 'Teaching Opportunities',
        url: '/become-an-instructor',
        description: 'Join our faculty of industry experts and teach cutting-edge technology tracks.',
        type: 'page'
      }],
      contactInfo
    };
  }

  // Special Intent: Become a Partner
  if (normQuery.includes('partner') || normQuery.includes('partnership') || normQuery.includes('collaboration')) {
    return {
      success: true,
      answer: `Edqoo partners with academic institutions (colleges and universities) and corporate enterprises for:\n\n- **Institutions**: Curriculum integration, student upskilling bootcamps, and faculty development.\n- **Corporates**: Tailored team upskilling in Data & AI technologies.\n\nYou can submit a partnership proposal on our **/become-a-partner** page.`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: [{
        id: 'page-partner',
        title: 'Become a Partner',
        category: 'Academic & Corporate Partnerships',
        url: '/become-a-partner',
        description: 'Partner with Edqoo for curriculum integration, campus training, and workforce upskilling.',
        type: 'page'
      }],
      contactInfo
    };
  }

  // Special Intent: Hire From Us
  if (normQuery.includes('hire') || normQuery.includes('recruiter') || normQuery.includes('placement')) {
    return {
      success: true,
      answer: `Through our **Hire From Us** program, companies can recruit pre-vetted, job-ready talent in Data Science, AI/ML, Data Analytics, Python, and Power BI with zero hiring fees:\n\n1. Submit requirements on **/hire-from-us** (role, openings, skills, location, work mode).\n2. Our corporate relations team shortlists matched candidates with verified portfolios within 24-48 hours.\n3. Conduct direct technical interviews and onboarding.`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: [{
        id: 'page-hire',
        title: 'Hire From Us',
        category: 'Corporate Hiring',
        url: '/hire-from-us',
        description: 'Recruit job-ready talent in Data Science, AI, and Analytics with zero hiring fees.',
        type: 'page'
      }],
      contactInfo
    };
  }

  // Special Intent: Instructors / Faculty
  if (normQuery.includes('instructor') || normQuery.includes('faculty') || normQuery.includes('who teaches') || normQuery.includes('teachers') || normQuery.includes('evelyn') || normQuery.includes('kovac') || normQuery.includes('priya') || normQuery.includes('arun')) {
    return {
      success: true,
      answer: `Our programs are taught by experienced industry practitioners and researchers:\n\n` +
        `- **Dr. Evelyn Vance** — Lead AI & Machine Learning Faculty (12+ yrs exp, Ph.D. in CS & AI)\n` +
        `- **Michael Kovac** — Principal Data Scientist & Analytics Lead (10+ yrs exp in SQL & quantitative modeling)\n` +
        `- **Dr. Priya Sundaram** — Senior Faculty & Business Intelligence Specialist (9+ yrs exp in Power BI & DAX)\n` +
        `- **Arun Kumar** — Generative AI & Prompt Engineering Specialist\n\n` +
        `All faculty focus on live coding, hands-on architectures, and project guidance.`,
      source: 'database',
      confidence: 'supported',
      needsContact: false,
      results: matchedInstructors,
      contactInfo
    };
  }

  // Special Intent: Projects
  if (normQuery.includes('project') || normQuery.includes('capstone') || normQuery.includes('diwali') || normQuery.includes('netflix') || normQuery.includes('pneumonia') || normQuery.includes('kanoon') || normQuery.includes('suicide')) {
    return {
      success: true,
      answer: `Our programs include **${DATA_SCIENCE_AI_PROJECTS.length} approved real-world capstone projects**:\n\n` +
        DATA_SCIENCE_AI_PROJECTS.map((p, idx) => `${idx + 1}. **${p.title}** (${p.technologies.join(', ')})`).join('\n') +
        `\n\nEach capstone produces a verified portfolio item for recruitment evaluations!`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: matchedProjects.slice(0, 4),
      contactInfo
    };
  }

  // A. Course Matches Found
  if (matchedCourses.length > 0) {
    const isExactOrShortQuery = normQuery.split(' ').length <= 5 || 
      normQuery.startsWith('do you have') || 
      normQuery.startsWith('what courses') || 
      normQuery.startsWith('show me') || 
      normQuery.includes('python') || 
      normQuery.includes('java') || 
      normQuery.includes('html') || 
      normQuery.includes('excel') || 
      normQuery.includes('power bi') || 
      normQuery.includes('sql') || 
      normQuery.includes('digital marketing') || 
      normQuery.includes('gst') || 
      normQuery.includes('hr') || 
      normQuery.includes('finance') || 
      normQuery.includes('free');

    if (isExactOrShortQuery) {
      const count = matchedCourses.length;
      let intro = `Yes! We have learning options available.\n\nI found **${count} matching option${count > 1 ? 's' : ''}**:`;

      if (normQuery.includes('python')) {
        intro = `Yes! We have Python-related learning options available.\n\nI found **${count} option${count > 1 ? 's' : ''}**:`;
      } else if (normQuery.includes('free')) {
        intro = `Yes! We offer **6 Free Learning courses** designed for practical foundational skill-building:`;
      } else if (normQuery.includes('java')) {
        intro = `Yes! We have Java learning options available:`;
      } else if (normQuery.includes('data science')) {
        intro = `Yes! We offer industry-aligned **Data Science and AI** programs:`;
      }

      return {
        success: true,
        answer: intro,
        source: 'database',
        confidence: 'supported',
        needsContact: false,
        results: matchedCourses,
        contactInfo
      };
    }
  }

  // B. Projects Match
  if (matchedProjects.length > 0 && (normQuery.includes('project') || normQuery.includes('capstone') || matchedCourses.length === 0)) {
    return {
      success: true,
      answer: `Our programs include **${DATA_SCIENCE_AI_PROJECTS.length} approved real-world capstone projects**:\n\n` +
        DATA_SCIENCE_AI_PROJECTS.map((p, idx) => `${idx + 1}. **${p.title}** (${p.technologies.join(', ')})`).join('\n') +
        `\n\nEach capstone produces a verified portfolio item for recruitment evaluations!`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: matchedProjects.slice(0, 4),
      contactInfo
    };
  }

  // C. Instructors Match
  if (matchedInstructors.length > 0 && (normQuery.includes('instructor') || normQuery.includes('faculty') || normQuery.includes('who teaches') || normQuery.includes('evelyn') || normQuery.includes('kovac') || normQuery.includes('priya') || normQuery.includes('arun'))) {
    return {
      success: true,
      answer: `Our programs are taught by experienced industry practitioners and researchers:\n\n` +
        `- **Dr. Evelyn Vance** — Lead AI & Machine Learning Faculty (12+ yrs exp, Ph.D. in CS & AI)\n` +
        `- **Michael Kovac** — Principal Data Scientist & Analytics Lead (10+ yrs exp in SQL & quantitative modeling)\n` +
        `- **Dr. Priya Sundaram** — Senior Faculty & Business Intelligence Specialist (9+ yrs exp in Power BI & DAX)\n` +
        `- **Arun Kumar** — Generative AI & Prompt Engineering Specialist\n\n` +
        `All faculty focus on live coding, hands-on architectures, and project guidance.`,
      source: 'database',
      confidence: 'supported',
      needsContact: false,
      results: matchedInstructors,
      contactInfo
    };
  }

  // D. Static Pages Match
  if (matchedPages.length > 0) {
    if (normQuery.includes('hire')) {
      return {
        success: true,
        answer: `Through our **Hire From Us** program, companies can recruit pre-vetted, job-ready talent in Data Science, AI/ML, Data Analytics, Python, and Power BI with zero hiring fees.\n\n` +
          `1. Submit requirements on **/hire-from-us** (role, openings, skills, location, work mode).\n` +
          `2. Our corporate relations team shortlists matched candidates with verified portfolios within 24-48 hours.\n` +
          `3. Conduct direct technical interviews and onboarding.`,
        source: 'website',
        confidence: 'supported',
        needsContact: false,
        results: matchedPages,
        contactInfo
      };
    }
    if (normQuery.includes('become an instructor') || normQuery.includes('apply to teach')) {
      return {
        success: true,
        answer: `To become an instructor at Edqoo:\n\n1. Visit our **/become-an-instructor** page.\n2. Submit your profile, teaching experience (minimum 3+ years in industry/academia), qualifications, and the courses you wish to teach.\n3. Our academic review board evaluates applications and arranges an onboarding discussion.`,
        source: 'website',
        confidence: 'supported',
        needsContact: false,
        results: matchedPages,
        contactInfo
      };
    }
    if (normQuery.includes('partner')) {
      return {
        success: true,
        answer: `Edqoo partners with academic institutions (colleges and universities) and corporate enterprises for:\n\n- **Institutions**: Curriculum integration, student upskilling bootcamps, and faculty development.\n- **Corporates**: Tailored team upskilling in Data & AI technologies.\n\nYou can submit a partnership proposal on our **/become-a-partner** page.`,
        source: 'website',
        confidence: 'supported',
        needsContact: false,
        results: matchedPages,
        contactInfo
      };
    }
  }

  // E. Privacy & Terms
  if (normQuery.includes('privacy')) {
    return {
      success: true,
      answer: `Our **Privacy Policy** ensures that personal data (contact details and learning metrics) is encrypted and protected. We do NOT sell or trade user information to third parties. For full details, visit our **/privacy-policy** page or email support@edqoo.com.`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: [{ id: 'page-privacy', title: 'Privacy Policy', category: 'Policy', url: '/privacy-policy', type: 'page' }],
      contactInfo
    };
  }

  if (normQuery.includes('terms') || normQuery.includes('condition')) {
    return {
      success: true,
      answer: `Our **Terms & Conditions** govern the use of our educational platform. Notably, course curriculums, projects, technologies, and learning materials may be updated periodically based on technological advances and industry requirements. Visit **/terms-and-conditions** for full legal terms.`,
      source: 'website',
      confidence: 'supported',
      needsContact: false,
      results: [{ id: 'page-terms', title: 'Terms & Conditions', category: 'Policy', url: '/terms-and-conditions', type: 'page' }],
      contactInfo
    };
  }

  // ---------------------------------------------------------------------------
  // STEP 4: COMPLEX NATURAL LANGUAGE QUESTIONS -> RETRIEVE & ASK GEMINI
  // ---------------------------------------------------------------------------
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  // If no Gemini API key is configured and no direct database matches, return State 2 (Not Found)
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return {
      success: true,
      answer: "I couldn't find information about that on our website.",
      source: 'website',
      confidence: 'unsupported',
      needsContact: true,
      results: [],
      errorCode: 'NOT_FOUND',
      contactInfo
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Collect all relevant context chunks
    const allCoursesList = await getAllCourses();
    const coursesCatalogSummary = allCoursesList.map((c: any) => 
      `- Course: "${c.title}" | Category: ${c.category} | Skills: ${Array.isArray(c.skills) ? c.skills.join(', ') : c.skills} | Outcome: ${c.outcome || ''}`
    ).join('\n');

    const websiteContext = `
[COMPANY]
${STATIC_WEBSITE_KNOWLEDGE.company}

[COURSES CATALOG]
${coursesCatalogSummary}

[PROJECTS]
${STATIC_WEBSITE_KNOWLEDGE.projects}

[HIRE FROM US]
${STATIC_WEBSITE_KNOWLEDGE.hireFromUs}

[BECOME AN INSTRUCTOR]
${STATIC_WEBSITE_KNOWLEDGE.becomeInstructor}

[BECOME A PARTNER]
${STATIC_WEBSITE_KNOWLEDGE.becomePartner}

[TERMS & CONDITIONS]
${STATIC_WEBSITE_KNOWLEDGE.termsAndConditions}

[PRIVACY POLICY]
${STATIC_WEBSITE_KNOWLEDGE.privacyPolicy}
`;

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
[APPROVED WEBSITE CONTEXT & DATABASE DATA]
${websiteContext}

[USER QUESTION]
${rawQuery}
`
      }]
    });

    let geminiText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
          maxOutputTokens: 600
        }
      });
      geminiText = response.text?.trim() || '';
    } catch (gErr: any) {
      console.warn('Gemini 2.5 flash error, trying gemini-1.5-flash fallback:', gErr.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2,
          maxOutputTokens: 600
        }
      });
      geminiText = fallbackResponse.text?.trim() || '';
    }

    if (!geminiText) {
      return {
        success: true,
        answer: "I couldn't find information about that on our website.",
        source: 'website',
        confidence: 'unsupported',
        needsContact: true,
        results: [],
        errorCode: 'NOT_FOUND',
        contactInfo
      };
    }

    const lowerAns = geminiText.toLowerCase();
    const isUnknown = lowerAns.includes("couldn't find information") ||
                      lowerAns.includes("don't have that information") ||
                      lowerAns.includes("do not have that information") ||
                      lowerAns.includes("not available in the provided") ||
                      lowerAns.includes("not available on our website");

    return {
      success: true,
      answer: geminiText,
      source: 'gemini',
      confidence: isUnknown ? 'unsupported' : 'supported',
      needsContact: isUnknown,
      results: matchedCourses.length > 0 ? matchedCourses : undefined,
      errorCode: isUnknown ? 'NOT_FOUND' : undefined,
      contactInfo
    };

  } catch (geminiError: any) {
    console.error('Gemini API call failed:', geminiError.message);
    return {
      success: false,
      answer: "I'm unable to process your question right now. Please contact our support team directly.",
      source: 'fallback',
      confidence: 'unsupported',
      needsContact: true,
      errorCode: 'AI_SERVICE_UNAVAILABLE',
      contactInfo
    };
  }
}
