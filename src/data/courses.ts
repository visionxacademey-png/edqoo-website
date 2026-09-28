import type { Course, CurriculumSection, Module, TechStackGroup, ProjectItem } from '../types/index.js';

// =============================================================================
// GLOBAL REUSABLE DATA SCIENCE & AI PROJECT PORTFOLIO (7 Core Projects)
// =============================================================================
export const DATA_SCIENCE_AI_PROJECTS: ProjectItem[] = [
  {
    id: 'ds-ai-proj-1',
    category: 'AMAZON',
    title: 'Diwali Sales Analysis & Reporting',
    description: 'Analyzed customer purchasing behavior and sales performance during the Diwali sales period. Identified top-selling products, revenue trends, and customer segments using Python, machine learning, and data visualization.',
    technologies: ['Python', 'Machine Learning', 'Pandas', 'Data Visualization'],
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Diwali sales analysis, festive retail shopping and customer purchasing analytics'
  },
  {
    id: 'ds-ai-proj-2',
    category: 'NETFLIX',
    title: 'Netflix Data Analysis',
    description: 'Analyzed Netflix content data including genres, ratings, countries, and content types. Developed an interactive Power BI dashboard to uncover content trends and generate data-driven insights.',
    technologies: ['Power BI', 'DAX', 'Data Analysis', 'Data Visualization'],
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Entertainment streaming content analytics, viewer metrics and movie catalogue insights'
  },
  {
    id: 'ds-ai-proj-3',
    category: 'EV',
    title: 'Electric Vehicle Data Analysis',
    description: 'Examined electric vehicle adoption trends, vehicle categories, and regional distribution. Created interactive Tableau dashboards to visualize growth patterns and support EV market analysis.',
    technologies: ['Tableau', 'Data Analysis', 'Data Visualization', 'EV Analytics'],
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Electric vehicle charging station and clean transportation analytics'
  },
  {
    id: 'ds-ai-proj-4',
    category: 'AI',
    title: 'AI Interview Preparation Assistant',
    description: 'Built an AI-powered application that generates role-specific technical and HR interview questions using Generative AI. Developed the interactive application with Streamlit and secure API integration.',
    technologies: ['Python', 'Streamlit', 'Generative AI', 'LLM', 'API Integration'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'AI interview preparation assistant, conversational interface and career tech'
  },
  {
    id: 'ds-ai-proj-5',
    category: 'MEDICAL AI',
    title: 'Pneumonia Severity Detection Using Deep Learning',
    description: 'Developed an automated deep learning system to classify chest X-ray images into Pneumonia and Normal categories using transfer learning. Extended the system to analyze infection severity and support faster medical assessment.',
    technologies: ['Deep Learning', 'Transfer Learning', 'CNN', 'Medical AI'],
    projectType: 'Class Project',
    duration: 'Aug 2024 – Dec 2024',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Chest X-ray analysis, medical deep learning and healthcare diagnostics'
  },
  {
    id: 'ds-ai-proj-6',
    category: 'LEGAL AI',
    title: 'Kanoon Darpan AI – IPC Section Identification',
    description: 'Developed a multi-label NLP classification model using LegalBERT to identify relevant IPC sections from textual case descriptions. Fine-tuned the model using an annotated legal-document dataset to improve contextual understanding and generalization.',
    technologies: ['Python', 'NLP', 'LegalBERT', 'Transformers', 'Multi-Label Classification'],
    projectType: 'Mini Project',
    duration: 'Aug 2024 – Dec 2024',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Legal technology, AI-assisted legal research and IPC section classification'
  },
  {
    id: 'ds-ai-proj-7',
    category: 'NLP AI',
    title: 'Suicide Ideation Detection from Text',
    description: 'Developed an interactive NLP-based web application to detect potential suicide ideation from textual inputs using machine learning. Implemented the project as part of an NLP course and collaborated with a five-member team.',
    technologies: ['Python', 'NLP', 'Machine Learning', 'Text Classification', 'Web Application'],
    projectType: 'Class Project',
    duration: 'Mar 2024 – Jun 2024',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Natural language processing text analytics and machine learning classification'
  }
];

// =============================================================================
// GLOBAL REUSABLE FEATURE LISTS
// =============================================================================
export const COMMON_PROGRAM_FEATURES: string[] = [
  'Live Interactive Classes',
  'On-Demand Recorded Sessions',
  'Dedicated Learning Management System',
  'Campus Immersion Program',
  'Dedicated Mentor Support',
  'Priority Doubt-Clearing Support',
  'Professional Resume Building',
  'LinkedIn Profile Optimization',
  'Professional Communication Training',
  'Complete Interview Preparation',
  'Placement Assistance',
  'Major Capstone Project',
  'Real-World Projects',
  'Startup Incubation Support',
  'Top 2 Performers Rewarded'
];

export const TOOLS_UPSKILLS_FEATURES: string[] = [
  'Career guidance',
  'Resume building support',
  'Live sessions',
  'Hands-On Practical Labs',
  'Industry Capstone Projects',
  'Dedicated Mentor Support',
  'Priority Doubt-Clearing Support',
  'Course Completion Certificate'
];

// Display Categories for Program Tracks
export const PROGRAM_CATEGORIES = [
  'Data Science and AI',
  'Data Analytics and AI',
  'AI and Machine Learning',
  'Tools and Upskills',
  'Free Learning'
] as const;

export type ProgramCategory = typeof PROGRAM_CATEGORIES[number];

/**
 * Universal category name normalizer.
 * Maps any legacy abbreviation, variant, or partial string to the exact official full name.
 */
export function normalizeCategoryName(cat: string | null | undefined): string {
  if (!cat) return '';
  const trimmed = cat.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower === 'ds & ai' ||
    lower === 'ds and ai' ||
    lower === 'data science & ai' ||
    lower === 'data science and ai' ||
    lower === 'data science' ||
    lower === 'data-science' ||
    lower === 'ds &amp; ai' ||
    lower === 'ds/ai' ||
    lower === 'ds-ai' ||
    lower === 'data-science-and-ai'
  ) {
    return 'Data Science and AI';
  }

  if (
    lower === 'da & ai' ||
    lower === 'da and ai' ||
    lower === 'data analytics & ai' ||
    lower === 'data analytics and ai' ||
    lower === 'data analytics' ||
    lower === 'data-analytics' ||
    lower === 'da &amp; ai' ||
    lower === 'da/ai' ||
    lower === 'da-ai' ||
    lower === 'data-analytics-and-ai'
  ) {
    return 'Data Analytics and AI';
  }

  if (
    lower === 'ai & ml' ||
    lower === 'ai and ml' ||
    lower === 'ai & machine learning' ||
    lower === 'ai and machine learning' ||
    lower === 'machine learning' ||
    lower === 'machine-learning' ||
    lower === 'artificial intelligence' ||
    lower === 'ai' ||
    lower === 'ai &amp; ml' ||
    lower === 'ai/ml' ||
    lower === 'ai-ml' ||
    lower === 'ai-and-machine-learning'
  ) {
    return 'AI and Machine Learning';
  }

  if (
    lower === 'tools & upskills' ||
    lower === 'tools and upskills' ||
    lower === 'tools &amp; upskills' ||
    lower === 'tools-and-upskills' ||
    lower === 'tools' ||
    lower.includes('tools')
  ) {
    return 'Tools and Upskills';
  }

  if (
    lower === 'free learning' ||
    lower === 'free-learning' ||
    lower === 'free' ||
    lower.includes('free learning')
  ) {
    return 'Free Learning';
  }

  return trimmed;
}

/**
 * Ensures any course object has its category and categories array fully normalized to the official standard.
 */
export function normalizeCourseCategories(course: Course): Course {
  if (!course) return course;
  const normalizedCategory = normalizeCategoryName(course.category) || 'Tools and Upskills';
  const rawCategories = Array.isArray(course.categories) && course.categories.length > 0
    ? course.categories
    : [course.category];
  const normalizedCategories = Array.from(
    new Set(rawCategories.map(normalizeCategoryName).filter(Boolean))
  );

  const rawTech = course.technologyStack;
  let normalizedTech: Course['technologyStack'] = rawTech;
  if (
    Array.isArray(rawTech) &&
    rawTech.length > 0 &&
    typeof rawTech[0] === 'object' &&
    rawTech[0] !== null &&
    'category' in rawTech[0]
  ) {
    normalizedTech = (rawTech as TechStackGroup[]).map((item) => ({
      ...item,
      category: normalizeCategoryName(item.category)
    }));
  }

  return {
    ...course,
    category: normalizedCategory,
    categories: normalizedCategories.length > 0 ? normalizedCategories : [normalizedCategory],
    technologyStack: normalizedTech
  };
}

// Helper to convert curriculum sections to backward-compatible module format
function curriculumToModules(sections: CurriculumSection[]): Module[] {
  return sections.map((sec, idx) => ({
    id: `mod-${idx + 1}`,
    title: sec.title,
    description: sec.description || `Comprehensive training on ${sec.title}`,
    lessons: sec.topics.map((topic, lIdx) => ({
      id: `les-${idx + 1}-${lIdx + 1}`,
      title: topic,
      duration: '90 mins',
      isPreview: idx === 0 && lIdx === 0
    }))
  }));
}

// Helper to generate 15-Day curriculum structure
function create15DayCurriculum(topics: string[]): CurriculumSection[] {
  return topics.map((topic, index) => ({
    title: `Day ${index + 1}: ${topic}`,
    topics: [topic]
  }));
}

// =============================================================================
// MASTER PROGRAM CURRICULUMS
// =============================================================================

const advancedDataScienceAndAiCurriculum: CurriculumSection[] = [
  {
    title: 'DATA SCIENCE & PROGRAMMING',
    topics: [
      'Python Programming',
      'Python for Data Science',
      'Object-Oriented Programming',
      'NumPy & Pandas',
      'Data Manipulation & Analysis',
      'Data Preprocessing',
      'Exploratory Data Analysis',
      'Data Visualization',
      'Statistical Analysis',
      'Probability & Inferential Statistics'
    ]
  },
  {
    title: 'DATABASE & DATA MANAGEMENT',
    topics: [
      'SQL Fundamentals',
      'Advanced SQL',
      'Database Concepts',
      'Joins, Subqueries & CTEs',
      'Functions & Stored Procedures',
      'Window Functions',
      'Query Optimization',
      'SQL-Based Business Case Studies'
    ]
  },
  {
    title: 'MACHINE LEARNING',
    topics: [
      'Machine Learning Fundamentals',
      'Supervised & Unsupervised Learning',
      'Regression & Classification',
      'Decision Trees & Random Forest',
      'Clustering Techniques',
      'Naive Bayes',
      'Ensemble Learning',
      'Feature Engineering & Selection',
      'Model Evaluation & Optimization',
      'Hyperparameter Tuning'
    ]
  },
  {
    title: 'ADVANCED AI & MACHINE LEARNING',
    topics: [
      'XGBoost, AdaBoost & Gradient Boosting',
      'PCA & LDA',
      'Gaussian Mixture Models',
      'Recommendation Systems',
      'Time Series Forecasting',
      'Predictive Analytics',
      'Advanced Machine Learning Case Studies'
    ]
  },
  {
    title: 'DEEP LEARNING & COMPUTER VISION',
    topics: [
      'Deep Learning Fundamentals',
      'Neural Networks & Perceptrons',
      'TensorFlow & Keras',
      'Fully Connected Networks',
      'Computer Vision',
      'Convolutional Neural Networks',
      'Transfer Learning & Fine-Tuning',
      'RNN & LSTM',
      'Model Training & Optimization'
    ]
  },
  {
    title: 'NLP & GENERATIVE AI',
    topics: [
      'Natural Language Processing',
      'Text Processing & Feature Extraction',
      'Sentiment Analysis',
      'Topic Modelling',
      'Text Summarization',
      'Transformers',
      'BERT & GPT',
      'Large Language Models',
      'Generative AI Applications',
      'AI/NLP Projects'
    ]
  },
  {
    title: 'BUSINESS INTELLIGENCE',
    topics: [
      'Power BI',
      'Data Visualization & Interactive Dashboards',
      'Power Query & M Query',
      'Data Modelling & DAX',
      'Time Intelligence',
      'Advanced DAX',
      'Analytics, Filters & Drill-Downs',
      'Power BI Service & Administration',
      'Power BI API, Embedded & Mobile',
      'Python, R & Azure SQL Integration'
    ]
  },
  {
    title: 'CLOUD, BIG DATA & DATA ENGINEERING',
    topics: [
      'Linux for Data Professionals',
      'Azure Fundamentals',
      'Azure Data Factory',
      'Data Pipelines & Workflows',
      'Cloud Data Integration',
      'Apache Spark',
      'Distributed Data Processing',
      'Data Processing at Scale'
    ]
  },
  {
    title: 'MLOPS & INDUSTRY PRACTICES',
    topics: [
      'Git & Version Control',
      'MLOps Fundamentals',
      'Model Deployment',
      'Model Lifecycle Management',
      'ML Project Workflows',
      'Industry Best Practices'
    ]
  },
  {
    title: 'HANDS-ON LEARNING & PROJECTS',
    topics: [
      'Real-World Data Science Case Studies',
      'Machine Learning Projects',
      'Deep Learning Projects',
      'NLP & Generative AI Projects',
      'Business Intelligence Dashboards',
      'Predictive Analytics Projects',
      'Recommendation Systems',
      'Time Series Projects',
      'End-to-End Capstone Projects'
    ]
  },
  {
    title: 'CAREER READINESS',
    topics: [
      'Industry-Oriented Assignments',
      'Portfolio Development',
      'Project Presentation',
      'Interview Preparation',
      'Data Science Career Guidance'
    ]
  }
];

const execProfCertCurriculum: CurriculumSection[] = [
  {
    title: 'PROGRAMMING & DATA FOUNDATIONS',
    topics: [
      'Python Programming',
      'Object-Oriented Programming',
      'NumPy & Pandas',
      'Data Cleaning & Preprocessing',
      'Exploratory Data Analysis',
      'Data Visualization',
      'Statistics & Probability',
      'SQL & Database Management'
    ]
  },
  {
    title: 'AI & MACHINE LEARNING TOOLKIT',
    topics: [
      'Regression & Classification',
      'Decision Trees & Ensemble Models',
      'Clustering',
      'Feature Engineering & Selection',
      'Model Evaluation',
      'Model Optimization',
      'Dimensionality Reduction',
      'Recommendation Systems',
      'Predictive Analytics',
      'Time Series Forecasting'
    ]
  },
  {
    title: 'DEEP LEARNING & INTELLIGENT SYSTEMS',
    topics: [
      'Neural Networks',
      'TensorFlow & Keras',
      'Computer Vision',
      'Convolutional Neural Networks',
      'Transfer Learning',
      'RNN & LSTM',
      'Deep Learning Applications'
    ]
  },
  {
    title: 'GENERATIVE AI & LANGUAGE TECHNOLOGIES',
    topics: [
      'Natural Language Processing',
      'Text Analytics',
      'Sentiment Analysis',
      'Topic Modelling',
      'Text Summarization',
      'Transformers',
      'BERT',
      'GPT',
      'Large Language Models',
      'Generative AI Applications'
    ]
  },
  {
    title: 'BUSINESS INTELLIGENCE & ANALYTICS',
    topics: [
      'Power BI Dashboards',
      'Data Modelling',
      'DAX & Time Intelligence',
      'Power Query & M Query',
      'Data Transformation',
      'Interactive Visualizations',
      'Slicers, Filters & Drill-Downs',
      'Power BI Service',
      'Power BI API & Embedded',
      'Advanced Power BI',
      'Python & R Integration',
      'Azure SQL Integration'
    ]
  },
  {
    title: 'CLOUD & DATA ENGINEERING',
    topics: [
      'Linux & Command Line',
      'File Handling & Data Extraction',
      'Azure Fundamentals',
      'Azure Data Factory',
      'Data Pipelines & Workflows',
      'Cloud Data Integration',
      'Apache Spark',
      'Large-Scale Data Processing'
    ]
  },
  {
    title: 'PROFESSIONAL DEVELOPMENT',
    topics: [
      'Hands-on Assignments',
      'Industry Case Studies',
      'End-to-End Projects',
      'Git & Version Control',
      'MLOps Fundamentals',
      'Model Deployment',
      'Portfolio Development',
      'Project Presentation',
      'Interview Preparation',
      'Career Guidance'
    ]
  },
  {
    title: 'CAPSTONE EXPERIENCE',
    topics: [
      'End-to-end industry-oriented capstone project involving data preparation, predictive modeling, visual dashboards, and cloud deployment'
    ]
  }
];

const dataScienceMasteryCurriculum: CurriculumSection[] = [
  {
    title: 'PYTHON & DATA HANDLING',
    topics: [
      'Python fundamentals',
      'Object-Oriented Programming',
      'NumPy',
      'Pandas',
      'Data preprocessing'
    ]
  },
  {
    title: 'DATA ANALYTICS & VISUALIZATION',
    topics: [
      'Exploratory Data Analysis',
      'Statistics',
      'Probability',
      'Feature Engineering',
      'Matplotlib',
      'Seaborn'
    ]
  },
  {
    title: 'MACHINE LEARNING',
    topics: [
      'Regression',
      'Classification',
      'Decision Trees',
      'Random Forest',
      'K-Means',
      'Naive Bayes',
      'Model Evaluation'
    ]
  },
  {
    title: 'ADVANCED ML CONCEPTS',
    topics: [
      'Feature Selection',
      'Model Optimization',
      'Cross-Validation',
      'Predictive Analytics'
    ]
  },
  {
    title: 'DEEP LEARNING',
    topics: [
      'Neural Networks',
      'TensorFlow',
      'Keras',
      'CNN',
      'Computer Vision',
      'Transfer Learning',
      'RNN & LSTM'
    ]
  },
  {
    title: 'PRACTICAL LEARNING',
    topics: [
      'Real-world datasets',
      'Case studies',
      'Assignments',
      'Industry-oriented projects'
    ]
  },
  {
    title: 'CAREER READINESS',
    topics: [
      'Git',
      'Project Documentation',
      'Portfolio Building',
      'Resume Optimization',
      'LinkedIn Optimization',
      'Interview Preparation',
      'Career Guidance'
    ]
  }
];

// =============================================================================
// TOOLS & UPSKILLS: 13 15-DAY CURRICULUMS
// =============================================================================

const generativeAiCurriculum = create15DayCurriculum([
  'Introduction to Generative AI & ChatGPT',
  'Understanding AI Tools & Their Applications',
  'ChatGPT Fundamentals & Effective Usage',
  'Prompting Fundamentals',
  'Hands-On Prompt Building',
  'ChatGPT for Research & Information',
  'ChatGPT for Content Creation',
  'ChatGPT for Productivity & Daily Work',
  'AI for Presentations & Documents',
  'AI for Business & Professional Applications',
  'AI Tools for Images, Audio & Video',
  'AI for Data & Analysis',
  'Hands-On AI Mini Project',
  'Project Improvement & Practical Applications',
  'Final Hands-On Project & Presentation'
]);

const promptEngineeringCurriculum = create15DayCurriculum([
  'Introduction to Prompt Engineering',
  'Understanding AI Models & Prompt Behaviour',
  'Prompt Structure & Fundamentals',
  'Basic Prompting Techniques',
  'Hands-On Prompt Building',
  'Role-Based & Context-Based Prompting',
  'Few-Shot & Example-Based Prompting',
  'Chain-of-Thought & Structured Prompting',
  'Prompts for Content & Creativity',
  'Prompts for Business & Productivity',
  'Prompts for Data & Analysis',
  'Advanced Prompting Techniques',
  'Hands-On Prompt Engineering Project',
  'Project Testing & Optimization',
  'Final Prompt Engineering Project'
]);

const pythonProgrammingCurriculum = create15DayCurriculum([
  'Introduction to Python & Programming',
  'Python Setup & Development Environment',
  'Variables, Data Types & Operators',
  'Conditional Statements',
  'Loops & Iterations – Hands-On Practice',
  'Functions & Modular Programming',
  'Lists, Tuples, Sets & Dictionaries',
  'Strings & File Handling',
  'Error Handling & Debugging',
  'Object-Oriented Programming Basics',
  'Working with Libraries & Modules',
  'Python for Real-World Applications',
  'Hands-On Python Mini Project',
  'Project Development & Debugging',
  'Final Python Project & Presentation'
]);

const dataAnalyticsCurriculum = create15DayCurriculum([
  'Introduction to Data Analytics',
  'Excel Fundamentals for Data Analysis',
  'Data Cleaning & Preparation in Excel',
  'Excel Formulas & Functions',
  'Excel Data Analysis – Hands-On Practice',
  'Pivot Tables & Data Visualization',
  'Advanced Excel for Analytics',
  'Introduction to Power BI',
  'Data Import & Data Transformation',
  'Power BI Visualizations & Dashboard Creation',
  'Power BI Data Modeling',
  'Power BI Reports & Interactive Dashboards',
  'Hands-On Analytics Project',
  'Dashboard Development & Optimization',
  'Final Dashboard Project & Presentation'
]);

const dataScienceFoundationsCurriculum = create15DayCurriculum([
  'Introduction to Data Science',
  'Data Science Workflow & Tools',
  'Python for Data Science',
  'NumPy Fundamentals',
  'Pandas – Hands-On Data Manipulation',
  'Data Cleaning & Preprocessing',
  'Exploratory Data Analysis',
  'Data Visualization',
  'Statistics for Data Science',
  'Introduction to Machine Learning',
  'Supervised Learning',
  'Model Evaluation & Interpretation',
  'Hands-On Data Science Project',
  'Project Analysis & Model Improvement',
  'Final Data Science Project & Presentation'
]);

const ethicalHackingCurriculum = create15DayCurriculum([
  'Introduction to Cybersecurity & Ethical Hacking',
  'Networking Fundamentals',
  'Linux Fundamentals for Security',
  'Cybersecurity Tools & Lab Setup',
  'Information Gathering & Reconnaissance',
  'Vulnerability Identification',
  'Web Application Security Fundamentals',
  'Authentication & Password Security',
  'Network Security & Scanning',
  'Common Cyber Attacks & Prevention',
  'Security Testing Methodologies',
  'Ethical Hacking Tools – Hands-On Practice',
  'Hands-On Security Assessment Project',
  'Project Testing & Vulnerability Analysis',
  'Final Ethical Hacking Project & Report'
]);

const webDevelopmentCurriculum = create15DayCurriculum([
  'Introduction to Web Development',
  'HTML Fundamentals',
  'HTML Page Development – Hands-On Practice',
  'CSS Fundamentals',
  'Website Styling & Layout – Hands-On Practice',
  'Responsive Web Design',
  'JavaScript Fundamentals',
  'JavaScript & Web Interactivity',
  'Forms & User Interaction',
  'Introduction to Git & GitHub',
  'Website Development Project',
  'Advanced Website Styling & Functionality',
  'Hands-On Website Development',
  'Website Testing & Optimization',
  'Final Website Project & Deployment'
]);

const uiUxDesignCurriculum = create15DayCurriculum([
  'Introduction to UI/UX Design',
  'User-Centred Design Principles',
  'User Research & User Personas',
  'User Journey & Information Architecture',
  'Wireframing – Hands-On Practice',
  'UI Design Fundamentals',
  'Typography, Colours & Visual Design',
  'Introduction to Figma',
  'Figma Tools & Interface Design',
  'Interactive Prototyping',
  'Mobile & Web UI Design',
  'Usability Testing & Design Improvement',
  'Hands-On UI/UX Project',
  'Prototype Development & Refinement',
  'Final UI/UX Project & Presentation'
]);

const digitalMarketingCurriculum = create15DayCurriculum([
  'Introduction to Digital Marketing',
  'Digital Marketing Strategy',
  'Website & Landing Page Fundamentals',
  'Search Engine Optimization – SEO',
  'SEO – Hands-On Optimization',
  'Social Media Marketing',
  'Social Media Content Strategy',
  'Content Marketing',
  'Email Marketing',
  'Google Ads & Paid Advertising',
  'Social Media Advertising',
  'Analytics & Campaign Performance',
  'Hands-On Digital Marketing Campaign',
  'Campaign Analysis & Optimization',
  'Final Marketing Campaign Project'
]);

const cloudComputingAwsCurriculum = create15DayCurriculum([
  'Introduction to Cloud Computing',
  'Cloud Service Models & Architecture',
  'AWS Fundamentals & Account Setup',
  'AWS Management Console',
  'Amazon EC2 – Hands-On Practice',
  'Amazon S3 & Cloud Storage',
  'AWS Networking Fundamentals',
  'Databases & Cloud Data Services',
  'Identity & Access Management',
  'Cloud Security Fundamentals',
  'Serverless Computing & AWS Services',
  'Cloud Monitoring & Cost Management',
  'Hands-On AWS Cloud Project',
  'Project Deployment & Testing',
  'Final Cloud Project & Presentation'
]);

const hrManagementCurriculum = create15DayCurriculum([
  'Introduction to Human Resource Management',
  'HR Functions & Organizational Structure',
  'Recruitment & Talent Acquisition',
  'Job Description & Candidate Profiling',
  'Resume Screening & Shortlisting – Hands-On Practice',
  'Interview Process & Interview Techniques',
  'Employee Onboarding & Documentation',
  'Employee Engagement & Retention',
  'Performance Management',
  'Payroll & HR Administration Fundamentals',
  'HR Policies & Workplace Practices',
  'HR Tools, Excel & HR Analytics',
  'Hands-On HR Case Study',
  'HR Project & Practical Documentation',
  'Final HR Project & Presentation'
]);

const accountingFinanceCurriculum = create15DayCurriculum([
  'Introduction to Accounting & Finance',
  'Accounting Concepts & Principles',
  'Journal Entries & Ledger Accounts',
  'Trial Balance & Basic Accounting',
  'Practical Accounting Exercises',
  'Profit & Loss Statement',
  'Balance Sheet & Financial Statements',
  'Cash Flow & Working Capital',
  'Budgeting & Financial Planning',
  'GST & Basic Tax Concepts',
  'Excel for Accounting & Finance',
  'Financial Analysis & Business Decisions',
  'Hands-On Accounting Case Study',
  'Financial Statement Analysis Project',
  'Final Accounting & Finance Project'
]);

const contentWritingCurriculum = create15DayCurriculum([
  'Introduction to Content Writing',
  'Understanding Audiences & Content Strategy',
  'Writing Fundamentals & Structure',
  'Blog & Article Writing',
  'Hands-On Blog Writing',
  'Website & Landing Page Content',
  'Social Media Content Writing',
  'Copywriting & Marketing Content',
  'SEO Content Writing',
  'Email & Professional Communication',
  'Storytelling & Creative Writing',
  'AI Tools for Content Creation',
  'Hands-On Content Writing Project',
  'Editing, Proofreading & Content Optimization',
  'Final Content Portfolio & Presentation'
]);

const htmlCourseCurriculum: CurriculumSection[] = [
  {
    title: 'Module 1 — Introduction to HTML',
    topics: [
      'What is HTML?',
      'How the web works',
      'HTML document structure',
      'HTML5 overview',
      'Creating your first HTML page'
    ]
  },
  {
    title: 'Module 2 — HTML Elements and Attributes',
    topics: [
      'Headings',
      'Paragraphs',
      'Text formatting',
      'HTML attributes',
      'Comments',
      'Links',
      'Lists'
    ]
  },
  {
    title: 'Module 3 — Images and Multimedia',
    topics: [
      'Adding images',
      'Image attributes',
      'Audio',
      'Video',
      'Embedding external content',
      'Figure and figcaption'
    ]
  },
  {
    title: 'Module 4 — Tables',
    topics: [
      'Creating tables',
      'Table rows and columns',
      'Table headers',
      'Colspan and rowspan',
      'Accessible tables'
    ]
  },
  {
    title: 'Module 5 — HTML Forms',
    topics: [
      'Form structure',
      'Input fields',
      'Labels',
      'Textarea',
      'Select and option',
      'Radio buttons',
      'Checkboxes',
      'Buttons',
      'Form validation basics'
    ]
  },
  {
    title: 'Module 6 — Semantic HTML',
    topics: [
      'header',
      'nav',
      'main',
      'section',
      'article',
      'aside',
      'footer',
      'Why semantic HTML matters'
    ]
  },
  {
    title: 'Module 7 — HTML5 and Accessibility',
    topics: [
      'HTML5 features',
      'Accessibility fundamentals',
      'ARIA basics',
      'Accessible forms',
      'Semantic page structure'
    ]
  },
  {
    title: 'Module 8 — Practical Project',
    topics: [
      'Build a Responsive Personal Portfolio Website',
      'Semantic HTML & Navigation Structure',
      'Content Sections, Images & Media',
      'Interactive Contact Forms & Tables',
      'Accessible Page Structure & Deployment'
    ]
  }
];

const cssCourseCurriculum: CurriculumSection[] = [
  {
    title: 'Module 1 — Introduction to CSS',
    topics: [
      'What is CSS?',
      'How CSS works with HTML',
      'Inline, Internal, and External CSS',
      'CSS Syntax and Selectors',
      'Colors, Backgrounds & Units (px, rem, %, vh/vw)'
    ]
  },
  {
    title: 'Module 2 — The CSS Box Model',
    topics: [
      'Understanding the Box Model',
      'Content, Padding, Border, Margin',
      'box-sizing: border-box',
      'Display properties (block, inline, inline-block, none)',
      'Visibility and Overflow handling'
    ]
  },
  {
    title: 'Module 3 — Typography and Styling',
    topics: [
      'Web Fonts and Google Fonts integration',
      'Font family, size, weight, line-height',
      'Text alignment, decoration, transformations',
      'Shadows (box-shadow, text-shadow)',
      'Gradients and borders'
    ]
  },
  {
    title: 'Module 4 — CSS Positioning & Layouts',
    topics: [
      'Static, Relative, Absolute, Fixed, Sticky positioning',
      'Z-index and Stacking Contexts',
      'Centering techniques in CSS',
      'Normal flow and element positioning'
    ]
  },
  {
    title: 'Module 5 — Flexbox Layouts',
    topics: [
      'Flex Container & Flex Items',
      'flex-direction, justify-content, align-items',
      'flex-wrap and align-content',
      'flex-grow, flex-shrink, flex-basis',
      'Building dynamic navigation bars & cards'
    ]
  },
  {
    title: 'Module 6 — CSS Grid Layouts',
    topics: [
      'Grid Container & Grid Items',
      'grid-template-columns and grid-template-rows',
      'fr unit, repeat(), minmax()',
      'grid-gap and Grid Areas',
      'Building complex responsive dashboard layouts'
    ]
  },
  {
    title: 'Module 7 — Responsive Web Design & Media Queries',
    topics: [
      'Mobile-First vs Desktop-First design',
      'Viewport Meta Tag',
      'CSS Media Queries (@media)',
      'Fluid layouts and responsive images',
      'Modern responsive design patterns'
    ]
  },
  {
    title: 'Module 8 — Transitions, Animations & Modern CSS',
    topics: [
      'CSS Transitions & Timing Functions',
      'CSS Keyframe Animations (@keyframes)',
      'Transformations (translate, rotate, scale)',
      'CSS Custom Properties (CSS Variables)',
      'Modern CSS features & Best Practices'
    ]
  },
  {
    title: 'Module 9 — Practical Project',
    topics: [
      'Build a Responsive Modern Landing Page & UI System',
      'Custom Flexbox Navigation & Grid Showcase',
      'Interactive Animated Cards & Modals',
      'Dark/Light Mode with CSS Variables',
      'Cross-Browser Testing & Responsive Deployment'
    ]
  }
];

const sqlCourseCurriculum: CurriculumSection[] = [
  {
    title: 'Module 1 — Introduction to Databases and SQL',
    topics: [
      'What is a database?',
      'Relational databases',
      'SQL overview',
      'Database tables',
      'Rows and columns',
      'Primary keys',
      'Foreign keys'
    ]
  },
  {
    title: 'Module 2 — Basic SQL Queries',
    topics: [
      'SELECT',
      'FROM',
      'DISTINCT',
      'WHERE',
      'Comparison operators',
      'Logical operators',
      'ORDER BY',
      'LIMIT'
    ]
  },
  {
    title: 'Module 3 — Data Manipulation',
    topics: [
      'INSERT',
      'UPDATE',
      'DELETE',
      'NULL values',
      'Constraints',
      'Basic data validation'
    ]
  },
  {
    title: 'Module 4 — SQL Functions',
    topics: [
      'Aggregate functions',
      'COUNT',
      'SUM',
      'AVG',
      'MIN',
      'MAX',
      'String functions',
      'Date functions',
      'Numeric functions'
    ]
  },
  {
    title: 'Module 5 — GROUP BY and HAVING',
    topics: [
      'GROUP BY',
      'Aggregating data',
      'HAVING',
      'Filtering aggregated results',
      'Practical analytics queries'
    ]
  },
  {
    title: 'Module 6 — SQL Joins',
    topics: [
      'INNER JOIN',
      'LEFT JOIN',
      'RIGHT JOIN',
      'FULL OUTER JOIN',
      'Self joins',
      'Joining multiple tables'
    ]
  },
  {
    title: 'Module 7 — Subqueries',
    topics: [
      'What is a subquery?',
      'Scalar subqueries',
      'Subqueries with WHERE',
      'Subqueries with FROM',
      'Correlated subqueries'
    ]
  },
  {
    title: 'Module 8 — Advanced SQL',
    topics: [
      'CASE statements',
      'CTEs',
      'Window functions',
      'Ranking',
      'Partitioning',
      'Practical advanced queries'
    ]
  },
  {
    title: 'Module 9 — Database Design Basics',
    topics: [
      'Normalization',
      'Relationships',
      'Primary keys',
      'Foreign keys',
      'Indexes',
      'Basic database design principles'
    ]
  },
  {
    title: 'Module 10 — Practical SQL Project',
    topics: [
      'Build and Analyze an E-Commerce Database',
      'Customer, Product & Order Schema Analysis',
      'Total Sales, Top Products & Monthly Revenue Queries',
      'Repeat Customer Purchase Behavior Analysis',
      'Order Statistics & Performance Query Optimization'
    ]
  }
];

// =============================================================================
// COMPLETE COURSES ARRAY
// =============================================================================

export const courses: Course[] = [
  // ---------------------------------------------------------------------------
  // MASTER PROGRAMS
  // ---------------------------------------------------------------------------
  {
    id: 'advanced-executive-program-data-science-ai',
    slug: 'advanced-executive-program-data-science-ai',
    title: 'Advanced Executive Program in Data Science & Artificial Intelligence',
    category: 'Data Science and AI',
    categories: ['Data Science and AI'],
    shortDescription: 'Comprehensive 11-month industry track covering Data Science, AI, Machine Learning, Deep Learning, Generative AI, Power BI, Cloud & MLOps.',
    description: 'A comprehensive industry-focused program covering Data Science, Artificial Intelligence, Machine Learning, Generative AI, Business Intelligence, Cloud Computing, Big Data and MLOps.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    price: 128990,
    originalPrice: 169999,
    duration: '11 Months',
    liveHours: '90+ Hours',
    lessons: 88,
    level: 'Beginner to Advanced',
    rating: 4.92,
    students: 1480,
    status: 'available',
    featured: true,
    skills: [
      'Python for Data Science',
      'SQL & Database Management',
      'Machine Learning & Predictive Analytics',
      'Deep Learning & Computer Vision',
      'NLP & Generative AI',
      'Power BI & Advanced DAX',
      'Azure Cloud & Apache Spark',
      'MLOps & Model Deployment'
    ],
    curriculum: advancedDataScienceAndAiCurriculum,
    modules: curriculumToModules(advancedDataScienceAndAiCurriculum),
    technologyStack: [
      { category: 'Languages & Libraries', skills: ['Python', 'SQL', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn'] },
      { category: 'AI and Machine Learning', skills: ['Scikit-learn', 'TensorFlow', 'Keras', 'PyTorch', 'XGBoost'] },
      { category: 'Business Intelligence', skills: ['Power BI', 'Power Query', 'DAX', 'Time Intelligence'] },
      { category: 'Cloud & Big Data', skills: ['Microsoft Azure', 'Azure Data Factory', 'Apache Spark', 'Linux'] },
      { category: 'Deployment & MLOps', skills: ['Git', 'MLOps', 'Docker', 'CI/CD Pipelines', 'Model Deployment'] }
    ],
    projects: DATA_SCIENCE_AI_PROJECTS,
    careerReadiness: [
      'Industry-Oriented Assignments',
      'Portfolio Development',
      'Project Presentation',
      'Interview Preparation',
      'Data Science Career Guidance'
    ],
    outcome: 'Master modern Data Science, AI, Deep Learning, Cloud Data Engineering, and MLOps to deliver enterprise-grade predictive and generative AI solutions.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Basic mathematical familiarity with high school algebra and statistics.',
      'No prior programming background is mandatory; Python fundamentals are covered from scratch.',
      'A computer with internet access capable of running development environments.'
    ],
    whoIsItFor: [
      'Aspiring Data Scientists, Machine Learning Engineers, and AI Specialists.',
      'Software engineers transitioning into AI development and predictive intelligence.',
      'Data Analysts aiming to scale into deep learning and production MLOps workflows.',
      'Fresh graduates and STEM professionals seeking industry-ready AI portfolios.'
    ]
  },
  {
    id: 'executive-professional-certificate-data-science-ai',
    slug: 'executive-professional-certificate-data-science-ai',
    title: 'Executive Professional Certificate in Data Science and AI',
    category: 'Data Analytics and AI',
    categories: ['Data Analytics and AI'],
    shortDescription: 'Build practical expertise across Data Science, AI, Machine Learning, BI, Cloud and MLOps through hands-on industry labs.',
    description: 'Build practical expertise across Data Science, Artificial Intelligence, Machine Learning, Business Intelligence, Cloud Technologies and MLOps through a hands-on, industry-oriented learning experience.',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop',
    price: 88990,
    originalPrice: 169999,
    duration: '6 Months',
    liveHours: '70+ Hours',
    lessons: 64,
    level: 'Beginner to Advanced',
    rating: 4.89,
    students: 1240,
    status: 'available',
    featured: true,
    skills: [
      'Python Programming',
      'AI & Machine Learning Toolkit',
      'Deep Learning & Intelligent Systems',
      'Generative AI & Language Tech',
      'Business Intelligence & Analytics',
      'Cloud & Data Engineering',
      'MLOps Fundamentals'
    ],
    curriculum: execProfCertCurriculum,
    modules: curriculumToModules(execProfCertCurriculum),
    technologyStack: [
      { category: 'Languages & Libraries', skills: ['Python', 'SQL', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn'] },
      { category: 'AI and Machine Learning', skills: ['Scikit-learn', 'TensorFlow', 'Keras'] },
      { category: 'Business Intelligence', skills: ['Power BI', 'Power Query', 'DAX'] },
      { category: 'Cloud & Data', skills: ['Microsoft Azure', 'Azure Data Factory', 'Azure SQL', 'Apache Spark', 'Linux'] },
      { category: 'Development & Deployment', skills: ['Git', 'MLOps', 'Model Deployment'] }
    ],
    projects: DATA_SCIENCE_AI_PROJECTS,
    careerReadiness: [
      'Hands-on Assignments',
      'Industry Case Studies',
      'End-to-End Projects',
      'Git & Version Control',
      'MLOps Fundamentals',
      'Model Deployment',
      'Portfolio Development',
      'Project Presentation',
      'Interview Preparation',
      'Career Guidance'
    ],
    outcome: 'By the end of the program, learners will be equipped with practical knowledge across the modern Data Science and AI ecosystem and will be able to work with data, build predictive models, develop AI applications, create business dashboards and understand cloud-based workflows.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Willingness to learn data-driven problem-solving and software tools.',
      'No prior programming background required; core programming covered from fundamentals.',
      'Computer with internet access for practical coding exercises and BI labs.'
    ],
    whoIsItFor: [
      'Working professionals seeking practical upskilling in Data Science and AI.',
      'Analysts, IT professionals, and consultants transitioning into AI development.',
      'Graduates looking for an industry-recognized certificate and real-world portfolio.'
    ]
  },
  {
    id: 'data-science-mastery-program',
    slug: 'data-science-mastery-program',
    title: 'Data Science Mastery Program',
    category: 'AI and Machine Learning',
    categories: ['AI and Machine Learning'],
    shortDescription: 'Build strong foundations in Python, Data Analytics, Machine Learning and Deep Learning with hands-on projects.',
    description: 'A practical program designed to build strong foundations in Python, Data Analytics, Machine Learning and Deep Learning, with hands-on projects and career preparation.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    price: 50000,
    originalPrice: 49999,
    duration: '6 Months',
    liveHours: '60+ Hours',
    lessons: 56,
    level: 'Beginner to Intermediate',
    rating: 4.86,
    students: 1050,
    status: 'available',
    featured: true,
    skills: [
      'Python & Data Handling',
      'Data Analytics & Visualization',
      'Machine Learning Algorithms',
      'Advanced ML & Optimization',
      'Deep Learning & CNNs',
      'Portfolio & Career Readiness'
    ],
    curriculum: dataScienceMasteryCurriculum,
    modules: curriculumToModules(dataScienceMasteryCurriculum),
    projects: DATA_SCIENCE_AI_PROJECTS,
    careerReadiness: [
      'Git',
      'Project Documentation',
      'Portfolio Building',
      'Resume Optimization',
      'LinkedIn Optimization',
      'Interview Preparation',
      'Career Guidance'
    ],
    outcome: 'Build practical Data Science skills from Python and data analysis to Machine Learning and Deep Learning, while developing projects and a professional portfolio.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Basic familiarity with computers and numerical reasoning.',
      'No prior programming background required.',
      'Personal workstation suitable for running standard Python scripts and notebooks.'
    ],
    whoIsItFor: [
      'Beginners and graduates seeking structured entry into data science.',
      'Professionals wanting to master Python analytics, machine learning, and deep learning.',
      'Engineers seeking to build real-world project portfolios.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 13 TOOLS & UPSKILLS COURSES (24-Hour Duration, 15 Days Curriculum)
  // ---------------------------------------------------------------------------

  // 1. Generative AI & ChatGPT – Hands-On Practical Training
  {
    id: 'generative-ai-chatgpt',
    slug: 'generative-ai-chatgpt',
    title: 'Generative AI & ChatGPT – Hands-On Practical Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Master practical generative AI tools, prompt building, research automation, content creation, and real-world AI applications.',
    description: 'An intensive hands-on practical training in Generative AI & ChatGPT designed for students and professionals. Learn prompt construction, AI research, multi-media AI tools, data analysis, and build hands-on AI mini-projects.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Advanced',
    rating: 4.94,
    students: 1350,
    status: 'available',
    featured: true,
    skills: [
      'Generative AI',
      'ChatGPT',
      'Prompt Engineering',
      'AI Productivity',
      'Content Creation',
      'AI Tools (Images, Audio, Video)',
      'AI for Data Analysis',
      'AI Mini Projects'
    ],
    curriculum: generativeAiCurriculum,
    modules: curriculumToModules(generativeAiCurriculum),
    projects: [
      'Hands-On AI Mini Project & Workflow Automation',
      'Multi-Modal Content & Presentation Pipeline',
      'Final Hands-On AI Capstone & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'AI-Powered Workplace Productivity'
    ],
    outcome: 'Gain confident mastery over Generative AI and ChatGPT to accelerate research, automate repetitive content generation, analyze data, and build end-to-end practical AI applications.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A web browser with internet access.',
      'No prior technical or coding experience required.'
    ],
    whoIsItFor: [
      'Students looking to gain industry-standard AI productivity skills.',
      'Working professionals seeking practical hands-on generative AI workflows.',
      'Content creators, researchers, and aspiring tech practitioners.'
    ]
  },

  // 2. Prompt Engineering – Hands-On Practical Training
  {
    id: 'prompt-engineering',
    slug: 'prompt-engineering',
    title: 'Prompt Engineering – Hands-On Practical Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Master prompt structure, role-based prompting, few-shot conditioning, chain-of-thought, and advanced AI optimization.',
    description: 'A comprehensive practical training program in Prompt Engineering. Learn how AI models behave, build structured prompts, master few-shot and chain-of-thought techniques, and deliver real-world prompt engineering projects.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Advanced',
    rating: 4.93,
    students: 1280,
    status: 'available',
    featured: true,
    skills: [
      'Prompt Engineering',
      'AI Model Behaviour',
      'Role-Based Prompting',
      'Few-Shot Prompting',
      'Chain-of-Thought',
      'Structured Outputs',
      'Advanced Prompting Techniques'
    ],
    curriculum: promptEngineeringCurriculum,
    modules: curriculumToModules(promptEngineeringCurriculum),
    projects: [
      'Structured Prompt Engineering Architecture',
      'Project Testing & Optimization Suite',
      'Final Prompt Engineering Project'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Prompt Optimization Strategies'
    ],
    outcome: 'Learn how to accurately steer, constrain, and structure large language models to consistently produce high-precision outputs across complex business, analytical, and creative tasks.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer or laptop with internet access.',
      'No prior programming background required.'
    ],
    whoIsItFor: [
      'Students and graduates aiming to master AI interaction.',
      'Developers, analysts, and project managers automating complex cognitive workflows.',
      'Anyone looking to leverage prompt engineering for career growth.'
    ]
  },

  // 3. Python Programming – Hands-On Development
  {
    id: 'python-programming',
    slug: 'python-programming',
    title: 'Python Programming – Hands-On Development',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'From variables and loops to OOP, file handling, libraries, and real-world project development.',
    description: 'A structured, hands-on programming masterclass in Python. Learn Python setup, variables, data structures, functions, file handling, error debugging, OOP basics, modular libraries, and practical project deployment.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.91,
    students: 1420,
    status: 'available',
    featured: true,
    skills: [
      'Python Programming',
      'Variables & Data Types',
      'Loops & Conditionals',
      'Functions & Modular Code',
      'Lists, Tuples & Dictionaries',
      'Strings & File Handling',
      'OOP Basics',
      'Python Debugging'
    ],
    curriculum: pythonProgrammingCurriculum,
    modules: curriculumToModules(pythonProgrammingCurriculum),
    projects: [
      'Hands-On Python Mini Project',
      'Modular File & Data Automation Script',
      'Final Python Project & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Code Quality & Clean Architecture'
    ],
    outcome: 'Master foundational and object-oriented Python programming with practical hands-on development skills to build real-world software utilities and automated applications.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer running Windows, macOS, or Linux with Python 3.10+ installed (free download).'
    ],
    whoIsItFor: [
      'Students and beginners wanting a solid, hands-on start to coding.',
      'Engineers, analysts, and tech enthusiasts seeking Python fluency.'
    ]
  },

  // 4. Data Analytics with Excel & Power BI – Hands-On Training
  {
    id: 'data-analytics-excel-power-bi',
    slug: 'data-analytics-excel-power-bi',
    title: 'Data Analytics with Excel & Power BI – Hands-On Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Master Excel data cleaning, pivot tables, formulas, Power BI transformation, data modeling, and interactive dashboards.',
    description: 'An industry-aligned hands-on training combining Microsoft Excel and Power BI for data analytics. Master data cleaning, complex formulas, pivot tables, visual dashboards, Power BI data modeling, and interactive reporting.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Advanced',
    rating: 4.92,
    students: 1390,
    status: 'available',
    featured: true,
    skills: [
      'Data Analytics',
      'Excel Formulas & Functions',
      'Data Cleaning',
      'Pivot Tables & Charts',
      'Power BI Desktop',
      'Data Transformation',
      'Data Modeling',
      'Interactive Dashboards'
    ],
    curriculum: dataAnalyticsCurriculum,
    modules: curriculumToModules(dataAnalyticsCurriculum),
    projects: [
      'Excel Automated Analytics Model',
      'Power BI Interactive Executive Dashboard',
      'Final Dashboard Project & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Business Intelligence Portfolio'
    ],
    outcome: 'Acquire practical data manipulation, visual reporting, and business intelligence capabilities in Excel and Power BI to translate raw data into actionable decision-making insights.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'Microsoft Excel and Power BI Desktop (free download on Windows).'
    ],
    whoIsItFor: [
      'Students and graduates aiming for data analyst and BI reporting roles.',
      'Business, commerce, and finance professionals upgrading from spreadsheets to modern BI.'
    ]
  },

  // 5. Data Science Foundations – Hands-On Practical Training
  {
    id: 'data-science-foundations',
    slug: 'data-science-foundations',
    title: 'Data Science Foundations – Hands-On Practical Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Practical grounding in Python for data science, NumPy, Pandas, EDA, visualization, statistics, and supervised machine learning.',
    description: 'A hands-on practical training program covering Data Science fundamentals. Learn Python for Data Science, NumPy, Pandas data manipulation, exploratory data analysis, statistics, supervised machine learning, and model evaluation.',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.90,
    students: 1190,
    status: 'available',
    featured: false,
    skills: [
      'Data Science Foundations',
      'Python for Data Science',
      'NumPy & Pandas',
      'Data Cleaning',
      'Exploratory Data Analysis',
      'Statistics for Data Science',
      'Supervised Learning',
      'Model Evaluation'
    ],
    curriculum: dataScienceFoundationsCurriculum,
    modules: curriculumToModules(dataScienceFoundationsCurriculum),
    projects: [
      'Exploratory Data Analysis Case Study',
      'Supervised Learning Prediction Model',
      'Final Data Science Project & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Data Science Project Documentation'
    ],
    outcome: 'Establish a practical foundation across the end-to-end data science lifecycle from data preprocessing and exploratory analysis to training and evaluating machine learning models.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with Python and Jupyter Notebook installed.',
      'Basic mathematical and logical reasoning ability.'
    ],
    whoIsItFor: [
      'Students and STEM graduates building practical data science competencies.',
      'Software engineers and analysts looking to break into machine learning.'
    ]
  },

  // 6. Ethical Hacking – Hands-On Practical Training
  {
    id: 'ethical-hacking',
    slug: 'ethical-hacking',
    title: 'Ethical Hacking – Hands-On Practical Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Cybersecurity essentials, networking, Linux, vulnerability identification, web security, and hands-on penetration testing.',
    description: 'A hands-on cybersecurity and ethical hacking training program. Learn networking fundamentals, Linux security tools, information gathering, vulnerability identification, web application security, and ethical hacking methodologies.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.91,
    students: 1120,
    status: 'available',
    featured: false,
    skills: [
      'Cybersecurity Fundamentals',
      'Networking Security',
      'Linux for Security',
      'Reconnaissance & Scanning',
      'Vulnerability Identification',
      'Web Application Security',
      'Ethical Hacking Tools',
      'Security Assessment'
    ],
    curriculum: ethicalHackingCurriculum,
    modules: curriculumToModules(ethicalHackingCurriculum),
    projects: [
      'Network Vulnerability Assessment Lab',
      'Web Application Security Audit',
      'Final Ethical Hacking Project & Report'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Security Assessment Documentation'
    ],
    outcome: 'Understand cybersecurity defense mechanisms, identify security vulnerabilities in networks and web systems, and conduct structured ethical security assessments.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with virtualization capability for lab tools (guided setup provided).'
    ],
    whoIsItFor: [
      'Students and IT enthusiasts interested in cybersecurity and defense.',
      'System administrators and developers wanting to secure their applications.'
    ]
  },

  // 7. Web Development – Hands-On Website Development
  {
    id: 'web-development',
    slug: 'web-development',
    title: 'Web Development – Hands-On Website Development',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'HTML5, CSS3, responsive web design, JavaScript interactivity, Git/GitHub, and full website deployment.',
    description: 'An interactive, hands-on website development masterclass. Learn HTML5, CSS layout techniques, responsive design, JavaScript programming, DOM interactivity, Git & GitHub version control, and website deployment.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.92,
    students: 1260,
    status: 'available',
    featured: false,
    skills: [
      'Web Development',
      'HTML5',
      'CSS3 & Layouts',
      'Responsive Design',
      'JavaScript Fundamentals',
      'DOM Interactivity',
      'Git & GitHub',
      'Website Deployment'
    ],
    curriculum: webDevelopmentCurriculum,
    modules: curriculumToModules(webDevelopmentCurriculum),
    projects: [
      'Responsive Multi-Page Web Application',
      'Interactive JavaScript Client Project',
      'Final Website Project & Live Deployment'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Frontend Portfolio Building'
    ],
    outcome: 'Build modern, responsive, and interactive websites from scratch using clean HTML, modern CSS, JavaScript, and deploy them live to the web.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A desktop or laptop with a code editor like VS Code installed (free).'
    ],
    whoIsItFor: [
      'Students and beginners wanting to build real websites and interactive web apps.',
      'Aspiring frontend developers and digital creators.'
    ]
  },

  // 8. UI/UX Design – Hands-On Design & Prototyping
  {
    id: 'ui-ux-design',
    slug: 'ui-ux-design',
    title: 'UI/UX Design – Hands-On Design & Prototyping',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'User-centred design, user personas, wireframing, Figma interface design, interactive prototyping, and usability testing.',
    description: 'A practical UI/UX design masterclass focusing on user-centred design principles, user research, wireframing, visual design with Figma, interactive prototyping, mobile & web UI, and usability testing.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.93,
    students: 1180,
    status: 'available',
    featured: false,
    skills: [
      'UI/UX Design',
      'User Research',
      'User Personas',
      'Wireframing',
      'Visual Design & Typography',
      'Figma Tools',
      'Interactive Prototyping',
      'Usability Testing'
    ],
    curriculum: uiUxDesignCurriculum,
    modules: curriculumToModules(uiUxDesignCurriculum),
    projects: [
      'Mobile App UI/UX Wireframe & Design System',
      'High-Fidelity Interactive Figma Prototype',
      'Final UI/UX Project & Portfolio Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Design Case Study Presentation'
    ],
    outcome: 'Master end-to-end product design thinking and industry-standard Figma tools to research, wireframe, design, prototype, and test intuitive digital experiences.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with a modern web browser to run Figma (free tool).'
    ],
    whoIsItFor: [
      'Students and creative enthusiasts aspiring to become UI/UX and product designers.',
      'Developers, entrepreneurs, and product managers wanting design fluency.'
    ]
  },

  // 9. Digital Marketing – Hands-On Marketing & Campaign Training
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    title: 'Digital Marketing – Hands-On Marketing & Campaign Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Digital strategy, landing pages, SEO, social media marketing, content strategy, email marketing, Google Ads, and analytics.',
    description: 'A comprehensive hands-on digital marketing training. Master digital marketing strategy, landing page fundamentals, search engine optimization (SEO), social media marketing, email campaigns, Google Ads, and campaign performance analytics.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.90,
    students: 1210,
    status: 'available',
    featured: false,
    skills: [
      'Digital Marketing Strategy',
      'SEO (Search Engine Optimization)',
      'Social Media Marketing',
      'Content Marketing',
      'Email Marketing',
      'Google Ads',
      'Paid Social Advertising',
      'Campaign Analytics'
    ],
    curriculum: digitalMarketingCurriculum,
    modules: curriculumToModules(digitalMarketingCurriculum),
    projects: [
      'Search Engine Optimization & Keyword Strategy',
      'Multi-Channel Digital Advertising Campaign',
      'Final Marketing Campaign Project'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Digital Marketing Portfolio'
    ],
    outcome: 'Learn how to plan, launch, manage, and optimize multi-channel digital marketing campaigns that drive measurable traffic, leads, and brand engagement.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with internet access and basic familiarity with social platforms.'
    ],
    whoIsItFor: [
      'Students, commerce graduates, and marketers wanting hands-on campaign expertise.',
      'Business owners, freelancers, and growth specialists.'
    ]
  },

  // 10. Cloud Computing & AWS – Hands-On Cloud Training
  {
    id: 'cloud-computing-aws',
    slug: 'cloud-computing-aws',
    title: 'Cloud Computing & AWS – Hands-On Cloud Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Cloud architecture, AWS Management Console, EC2, S3, cloud networking, databases, IAM security, and serverless computing.',
    description: 'An industry-focused practical training in Cloud Computing & Amazon Web Services (AWS). Learn cloud models, AWS console, compute with EC2, storage with S3, VPC networking, cloud databases, IAM security, serverless architecture, and cost optimization.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.93,
    students: 1140,
    status: 'available',
    featured: false,
    skills: [
      'Cloud Computing',
      'AWS Architecture',
      'Amazon EC2',
      'Amazon S3 & Storage',
      'AWS Networking & VPC',
      'Cloud Databases',
      'IAM & Cloud Security',
      'Serverless Services'
    ],
    curriculum: cloudComputingAwsCurriculum,
    modules: curriculumToModules(cloudComputingAwsCurriculum),
    projects: [
      'Scalable Web Architecture Deployment on EC2 & S3',
      'Secure Multi-Tier Cloud Database Setup',
      'Final Cloud Project & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'AWS Cloud Infrastructure Best Practices'
    ],
    outcome: 'Gain hands-on proficiency in architecting, configuring, and managing enterprise cloud infrastructure and serverless workloads on Amazon Web Services.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with internet access to access the AWS Free Tier console.'
    ],
    whoIsItFor: [
      'Students and engineers aspiring for cloud engineering and DevOps roles.',
      'Developers and IT practitioners migrating systems to the cloud.'
    ]
  },

  // 11. HR Management – Hands-On HR Practices & Tools
  {
    id: 'hr-management',
    slug: 'hr-management',
    title: 'HR Management – Hands-On HR Practices & Tools',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Talent acquisition, job descriptions, resume screening, interviewing, onboarding, performance management, and HR analytics in Excel.',
    description: 'A practical human resources management training covering talent acquisition, job profiling, resume screening, interviewing techniques, employee onboarding, retention, performance appraisal, HR policies, and HR analytics using Excel.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.89,
    students: 980,
    status: 'available',
    featured: false,
    skills: [
      'Human Resource Management',
      'Talent Acquisition',
      'Candidate Profiling',
      'Resume Screening',
      'Interview Techniques',
      'Employee Onboarding',
      'Performance Management',
      'HR Analytics & Excel'
    ],
    curriculum: hrManagementCurriculum,
    modules: curriculumToModules(hrManagementCurriculum),
    projects: [
      'End-to-End Recruitment & Screening Workflow',
      'HR Analytics Dashboard & Performance Framework',
      'Final HR Project & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'HR Generalist Documentation'
    ],
    outcome: 'Master core human resource workflows from talent recruitment pipelines and structured interviews to compliance, onboarding, and spreadsheet-based HR analytics.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with Microsoft Excel or Google Sheets.'
    ],
    whoIsItFor: [
      'Management students, MBA graduates, and aspiring HR generalists.',
      'Team leads, administrators, and recruiters scaling talent operations.'
    ]
  },

  // 12. Accounting & Finance – Hands-On Practical Training
  {
    id: 'accounting-finance',
    slug: 'accounting-finance',
    title: 'Accounting & Finance – Hands-On Practical Training',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Journal entries, ledgers, trial balance, P&L, balance sheets, cash flow, budgeting, GST concepts, and financial modeling in Excel.',
    description: 'A practical accounting and corporate finance training. Learn accounting concepts, journal entries, ledgers, trial balances, profit & loss statements, balance sheets, cash flow management, budgeting, GST tax concepts, and financial modeling in Excel.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.90,
    students: 1040,
    status: 'available',
    featured: false,
    skills: [
      'Accounting Principles',
      'Journal & Ledger Accounts',
      'Trial Balance',
      'Profit & Loss Statements',
      'Balance Sheet Analysis',
      'Cash Flow & Working Capital',
      'GST & Tax Concepts',
      'Excel for Finance'
    ],
    curriculum: accountingFinanceCurriculum,
    modules: curriculumToModules(accountingFinanceCurriculum),
    projects: [
      'Comprehensive Bookkeeping & Financial Statement Model',
      'Corporate Cash Flow & Budgeting Simulation',
      'Final Accounting & Finance Project'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Financial Statement Interpretation'
    ],
    outcome: 'Build concrete, practical accounting and financial analysis skills to record business transactions, prepare financial statements, manage cash flows, and apply GST concepts.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with spreadsheet software (Excel/Google Sheets).'
    ],
    whoIsItFor: [
      'Commerce, finance, and business students.',
      'Small business owners, accountants, and finance associates.'
    ]
  },

  // 13. Content Writing – Hands-On Writing & Content Creation
  {
    id: 'content-writing',
    slug: 'content-writing',
    title: 'Content Writing – Hands-On Writing & Content Creation',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Content strategy, blog and article writing, landing page copy, social media writing, SEO writing, storytelling, and AI tools.',
    description: 'A hands-on professional content writing and copywriting training. Learn audience research, writing structure, blog & article writing, landing page copy, social media content, SEO writing, storytelling, AI tools for writers, editing, and portfolio building.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24 Hours',
    liveHours: '24 Hours',
    lessons: 15,
    level: 'Beginner to Intermediate',
    rating: 4.91,
    students: 1110,
    status: 'available',
    featured: false,
    skills: [
      'Content Writing',
      'Content Strategy',
      'Blog & Article Writing',
      'Landing Page Copywriting',
      'Social Media Content',
      'SEO Content Writing',
      'Storytelling',
      'AI Writing Tools'
    ],
    curriculum: contentWritingCurriculum,
    modules: curriculumToModules(contentWritingCurriculum),
    projects: [
      'SEO Blog & Article Writing Suite',
      'Brand Storytelling & Copywriting Portfolio',
      'Final Content Portfolio & Presentation'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Professional Content Portfolio'
    ],
    outcome: 'Master professional writing techniques across blogs, website copy, social media, and search-optimized content, while creating an industry-ready writing portfolio.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with internet access and basic word processing software.'
    ],
    whoIsItFor: [
      'Students and aspiring writers, bloggers, and copywriters.',
      'Marketers, communication specialists, and content creators.'
    ]
  },

  // 14. HTML – Modern Web Development Fundamentals
  {
    id: 'html',
    slug: 'html',
    title: 'HTML',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Learn HTML from the fundamentals and build a strong foundation for creating modern, structured web pages.',
    description: 'Master HTML from the basics to practical web development. Learn how to structure web pages, create forms, work with multimedia, build semantic layouts, and follow modern HTML5 practices.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24–36 Hours',
    liveHours: '24–36 Hours',
    lessons: 32,
    level: 'Beginner',
    rating: 4.92,
    students: 1240,
    status: 'available',
    featured: true,
    skills: [
      'HTML5',
      'Semantic HTML',
      'Web page structure',
      'Forms',
      'Tables',
      'Links',
      'Images',
      'Audio and video',
      'HTML attributes',
      'Accessibility basics',
      'Responsive page structure',
      'Modern HTML practices'
    ],
    curriculum: htmlCourseCurriculum,
    modules: curriculumToModules(htmlCourseCurriculum),
    projects: [
      'Build a Responsive Personal Portfolio Website',
      'Accessible Semantic Multi-Section Landing Page',
      'Interactive Multi-Field HTML Registration & Feedback Form'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Frontend Web Development Foundation'
    ],
    outcome: 'Master HTML from the basics to practical web development. Build modern, accessible, and responsive web pages and personal portfolio projects following industry-standard HTML5 semantics.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer with internet access and any modern web browser.',
      'A free code editor like VS Code or Notepad.',
      'No prior coding or technical background required.'
    ],
    whoIsItFor: [
      'Beginners and students starting their web development journey.',
      'Designers, marketers, and digital creators wanting to understand web page structure.',
      'Anyone preparing for frontend and full-stack software development.'
    ],
    seoTitle: 'HTML Course | Learn HTML5 & Web Development | Edqoo',
    seoDescription: 'Learn HTML5 from the fundamentals with Edqoo. Build practical web pages, forms, semantic layouts and real-world HTML projects.',
    seoKeywords: [
      'HTML',
      'HTML Course',
      'HTML5',
      'web development',
      'semantic HTML',
      'learn HTML',
      'frontend development',
      'Edqoo HTML'
    ]
  },

  // 15. CSS – Modern Web Styling & Responsive Design
  {
    id: 'css',
    slug: 'css',
    title: 'CSS',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Learn CSS from the fundamentals to advanced responsive layouts, Flexbox, Grid, animations, and modern UI styling.',
    description: 'Master CSS from styling basics to modern web layouts. Learn selectors, the box model, typography, colors, Flexbox, CSS Grid, responsive design with media queries, transitions, animations, and modern CSS3 practices.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24–36 Hours',
    liveHours: '24–36 Hours',
    lessons: 36,
    level: 'Beginner to Intermediate',
    rating: 4.93,
    students: 1190,
    status: 'available',
    featured: true,
    skills: [
      'CSS3',
      'CSS Selectors',
      'Box Model',
      'Flexbox',
      'CSS Grid',
      'Responsive Design',
      'Media Queries',
      'CSS Animations',
      'Typography & Colors',
      'UI Styling',
      'CSS Variables',
      'Modern CSS Practices'
    ],
    curriculum: cssCourseCurriculum,
    modules: curriculumToModules(cssCourseCurriculum),
    projects: [
      'Build a Responsive Modern Landing Page & UI System',
      'Interactive CSS Grid & Flexbox Dashboard',
      'Animated Micro-Interactions & Theme Switcher'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Frontend Styling & UI Portfolio'
    ],
    outcome: 'Master CSS3 styling, Flexbox, CSS Grid, and responsive web design to build visually stunning, fluid, and mobile-friendly web user interfaces.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'Basic understanding of HTML document structure.',
      'A computer with any modern web browser and a free code editor like VS Code.'
    ],
    whoIsItFor: [
      'Beginners and web designers wanting to master modern web styling and layouts.',
      'Frontend developers enhancing their UI design and responsive design capabilities.'
    ],
    seoTitle: 'CSS Course | Learn CSS3, Flexbox & Responsive Styling | Edqoo',
    seoDescription: 'Learn CSS3 from the fundamentals with Edqoo. Master Flexbox, CSS Grid, responsive web design, animations and modern UI styling.',
    seoKeywords: [
      'CSS',
      'CSS Course',
      'CSS3',
      'learn CSS',
      'Flexbox',
      'CSS Grid',
      'responsive design',
      'web styling',
      'Edqoo CSS'
    ]
  },

  // 15. SQL – Relational Database Querying & Data Analysis
  {
    id: 'sql',
    slug: 'sql',
    title: 'SQL',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Learn SQL from the fundamentals and build practical skills for querying, managing, and analyzing relational databases.',
    description: 'Learn SQL through practical, hands-on training. Understand relational databases, write queries, retrieve and manipulate data, work with multiple tables, perform aggregations, and use advanced SQL techniques for real-world data analysis.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 14999,
    duration: '24–36 Hours',
    liveHours: '24–36 Hours',
    lessons: 42,
    level: 'Beginner to Intermediate',
    rating: 4.93,
    students: 1380,
    status: 'available',
    featured: true,
    skills: [
      'SQL',
      'Relational databases',
      'SELECT queries',
      'Filtering',
      'Sorting',
      'Aggregations',
      'GROUP BY',
      'HAVING',
      'Joins',
      'Subqueries',
      'Functions',
      'Database design fundamentals',
      'Data manipulation',
      'Data analysis with SQL'
    ],
    curriculum: sqlCourseCurriculum,
    modules: curriculumToModules(sqlCourseCurriculum),
    projects: [
      'Build and Analyze an E-Commerce Database',
      'Customer Churn & Sales Retention SQL Analysis',
      'Multi-Table Relational Schema Design & Reporting System'
    ],
    careerReadiness: [
      'Career guidance',
      'Resume building support',
      'Live sessions',
      'Database Engineering & Analytics Portfolio'
    ],
    outcome: 'Master SQL from fundamentals to advanced multi-table joins, CTEs, window functions, and database design. Build and analyze complex relational databases to extract powerful business intelligence insights.',
    features: TOOLS_UPSKILLS_FEATURES,
    requirements: [
      'A computer running Windows, macOS, or Linux.',
      'Any free relational database or client (PostgreSQL, MySQL, SQLite, or DBeaver).',
      'No prior database or coding experience required.'
    ],
    whoIsItFor: [
      'Beginners and learners preparing for database, data analytics, and software development roles.',
      'Aspiring Data Analysts, Business Intelligence developers, and Software Engineers.',
      'Professionals seeking practical fluency in querying enterprise relational datasets.'
    ],
    seoTitle: 'SQL Course | Learn SQL & Database Queries | Edqoo',
    seoDescription: 'Learn SQL through practical database queries, joins, functions, subqueries and real-world data analysis projects with Edqoo.',
    seoKeywords: [
      'SQL',
      'SQL Course',
      'database',
      'SQL database',
      'relational database',
      'learn SQL',
      'data analysis with SQL',
      'Edqoo SQL'
    ]
  },

  // ---------------------------------------------------------------------------
  // FREE LEARNING PROGRAMS
  // ---------------------------------------------------------------------------
  {
    id: 'java',
    slug: 'java',
    title: 'Java',
    category: 'Free Learning',
    categories: ['Free Learning'],
    shortDescription: 'Java programming learning content.',
    description: 'Java programming learning content.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    price: 0,
    originalPrice: 0,
    duration: 'Self-Paced',
    lessons: 8,
    level: 'Beginner Friendly',
    rating: 4.93,
    students: 890,
    status: 'available',
    featured: false,
    skills: ['Java Core Syntax', 'Object-Oriented Programming (OOP)', 'Collections & Lists', 'Exception Handling'],
    curriculum: [
      {
        title: 'Java Programming Foundations',
        topics: [
          'Java Syntax, Variables & Data Types',
          'Control Flow & Loops',
          'Object-Oriented Programming (OOP)',
          'Collections Framework & Exception Handling'
        ]
      }
    ],
    modules: curriculumToModules([
      {
        title: 'Java Programming Foundations',
        topics: [
          'Java Syntax, Variables & Data Types',
          'Control Flow & Loops',
          'Object-Oriented Programming (OOP)',
          'Collections Framework & Exception Handling'
        ]
      }
    ]),
    projects: ['Console Student Management System', 'Object-Oriented Banking Application'],
    careerReadiness: ['Software Engineering Fundamentals', 'Java Coding Interview Starters'],
    outcome: 'Build foundational programming competencies in Java with solid grounding in object-oriented architecture and software development principles.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: ['A desktop or laptop computer with Java Development Kit (JDK) installed (free).'],
    whoIsItFor: ['Beginner programmers, engineering students, and developers wanting to learn Java.']
  }
];

// =============================================================================
// HELPER FUNCTIONS FOR FILTERING & DISCOVERY
// =============================================================================

/**
 * Filter courses by category tab.
 * 'all' or 'All Categories' returns unique courses.
 * Specific category returns courses whose `categories` includes that category name.
 */
export function filterCoursesByCategory(courseList: Course[], category: string): Course[] {
  if (!category || category === 'all' || category === 'All Categories') {
    return courseList;
  }
  const normalizedTarget = normalizeCategoryName(category).toLowerCase();
  const rawTarget = category.toLowerCase().trim();

  return courseList.filter((c) => {
    const rawCategories = c.categories || [c.category];
    return rawCategories.some((cat) => {
      const norm = normalizeCategoryName(cat).toLowerCase();
      const raw = (cat || '').toLowerCase().trim();
      return norm === normalizedTarget || raw === rawTarget || raw === normalizedTarget || norm === rawTarget;
    });
  });
}

/**
 * Calculates Damerau-Levenshtein distance for typo-tolerant fuzzy matching.
 */
function damerauLevenshtein(a: string, b: string): number {
  const n = a.length, m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;

  const matrix: number[][] = [];
  for (let i = 0; i <= n; i++) matrix[i] = [i];
  for (let j = 0; j <= m; j++) matrix[0][j] = j;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }
  return matrix[n][m];
}

/**
 * Checks if query fuzzy matches target string.
 */
function isFuzzyMatchText(query: string, target: string): boolean {
  if (!query || !target) return false;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  if (t.includes(q)) return true;
  if (q.length < 3) return false;

  const qWords = q.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  const tWords = t.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);

  if (qWords.length === 0 || tWords.length === 0) return false;

  return qWords.every((qWord) => {
    return tWords.some((tWord) => {
      if (tWord.includes(qWord) || qWord.includes(tWord)) return true;
      const maxAllowedDist = qWord.length <= 4 ? 1 : 2;
      const dist = damerauLevenshtein(qWord, tWord);
      return dist <= maxAllowedDist;
    });
  });
}

/**
 * Full-text and typo-tolerant search across Title, Description, Categories, Skills, and Curriculum Topics.
 */
export function searchCourses(courseList: Course[], query: string): Course[] {
  if (!query || !query.trim()) return courseList;
  const term = query.toLowerCase().trim();
  const termClean = term.replace(/\b(course|courses|program|programs|training|classes|class|track|tracks)\b/gi, '').trim();
  const tokens = term.split(/\s+/).filter(Boolean);

  return courseList.filter((course) => {
    // 1. Direct text includes check
    if (course.title.toLowerCase().includes(term)) return true;
    if (course.description.toLowerCase().includes(term)) return true;
    if (course.shortDescription?.toLowerCase().includes(term)) return true;

    // Check categories
    if ((course.categories || [course.category]).some((cat) => cat.toLowerCase().includes(term))) {
      return true;
    }

    // Check skills
    if (course.skills?.some((s) => s.toLowerCase().includes(term))) return true;

    // Check curriculum sections and topics
    if (
      course.curriculum?.some(
        (sec) =>
          sec.title.toLowerCase().includes(term) ||
          sec.topics.some((t) => t.toLowerCase().includes(term))
      )
    ) {
      return true;
    }

    // Check projects & outcome
    if (
      course.projects?.some((p) => {
        const text = typeof p === 'string' ? p : `${p.title} ${p.description} ${p.technologies.join(' ')} ${p.category || ''}`;
        return text.toLowerCase().includes(term);
      })
    ) {
      return true;
    }
    if (course.outcome?.toLowerCase().includes(term)) return true;

    // Cleaned search term match (e.g. "HTML course" -> matches "HTML")
    if (termClean && termClean !== term) {
      if (course.title.toLowerCase().includes(termClean)) return true;
      if (course.skills?.some((s) => s.toLowerCase().includes(termClean))) return true;
      if (course.shortDescription?.toLowerCase().includes(termClean)) return true;
    }

    // Token conjunction match (all tokens match somewhere in course text)
    if (tokens.length > 1) {
      const fullText = [
        course.title,
        course.description,
        course.shortDescription || '',
        course.category,
        ...(course.categories || []),
        ...(course.skills || []),
        ...(course.curriculum?.flatMap((sec) => [sec.title, ...(sec.topics || [])]) || []),
        ...(course.projects?.map((p) => typeof p === 'string' ? p : p.title) || [])
      ].join(' ').toLowerCase();

      if (tokens.every((tok) => fullText.includes(tok))) return true;
    }

    // 2. Typo-tolerant Fuzzy check across Title, Categories, and Skills
    if (isFuzzyMatchText(term, course.title)) return true;
    if (termClean && isFuzzyMatchText(termClean, course.title)) return true;
    if (course.skills?.some((s) => isFuzzyMatchText(term, s))) return true;
    if ((course.categories || [course.category]).some((cat) => isFuzzyMatchText(term, cat))) return true;

    return false;
  });
}
