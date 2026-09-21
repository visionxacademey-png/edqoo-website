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
// GLOBAL REUSABLE FEATURE LIST (Mandatory 15 Common Features for all Courses)
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
    lower === 'ds &amp; ai' ||
    lower === 'ds/ai' ||
    lower === 'ds-ai'
  ) {
    return 'Data Science and AI';
  }

  if (
    lower === 'da & ai' ||
    lower === 'da and ai' ||
    lower === 'data analytics & ai' ||
    lower === 'data analytics and ai' ||
    lower === 'da &amp; ai' ||
    lower === 'da/ai' ||
    lower === 'da-ai'
  ) {
    return 'Data Analytics and AI';
  }

  if (
    lower === 'ai & ml' ||
    lower === 'ai and ml' ||
    lower === 'ai & machine learning' ||
    lower === 'ai and machine learning' ||
    lower === 'ai &amp; ml' ||
    lower === 'ai/ml' ||
    lower === 'ai-ml'
  ) {
    return 'AI and Machine Learning';
  }

  if (
    lower === 'tools & upskills' ||
    lower === 'tools and upskills' ||
    lower === 'tools &amp; upskills' ||
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
      duration: '45–90 mins',
      isPreview: idx === 0 && lIdx === 0
    }))
  }));
}

// =============================================================================
// CENTRALIZED COURSE CATALOG (9 Unique Programs across all Category Tracks)
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

const pythonExecCurriculum: CurriculumSection[] = [
  {
    title: 'Python Syntax, Data Structures & Idiomatic Coding',
    topics: [
      'Core Python data types, memory model, and scope resolution',
      'List, dict, and set comprehensions for clean data transformation',
      'Functions, closures, decorators, and functional programming tools',
      'Robust error handling, custom exceptions, and logging best practices'
    ]
  },
  {
    title: 'Object-Oriented Programming & Modular Architecture',
    topics: [
      'Classes, encapsulation, inheritance, and polymorphism in modern Python',
      'Dunder methods, dataclasses, and abstract base classes (ABCs)',
      'SOLID principles and architectural design patterns',
      'Modular code packaging and dependency management'
    ]
  },
  {
    title: 'Data Processing, Automation & File Operations',
    topics: [
      'NumPy & Pandas foundations for rapid tabular processing',
      'Automated reading/writing of CSV, Excel, JSON, and XML files',
      'Web data extraction and automated scraping techniques',
      'Scheduled background task automation and process orchestration'
    ]
  },
  {
    title: 'REST APIs, Integration & Production Delivery',
    topics: [
      'Consuming external REST APIs and handling rate limits / authentication',
      'Building lightweight, high-performance web backends with FastAPI',
      'Automated testing with PyTest and environment configuration',
      'Hands-on Capstone: End-to-end executive automation workflow'
    ]
  }
];

const sqlExecCurriculum: CurriculumSection[] = [
  {
    title: 'Relational Database Concepts & Advanced Multi-Table Joins',
    topics: [
      'Relational schema design, entity relationships, and constraints',
      'Inner, outer, cross, and self joins for complex data combinations',
      'Group By, Having, conditional aggregations, and CASE statements',
      'Correlated and non-correlated subqueries'
    ]
  },
  {
    title: 'Common Table Expressions (CTEs) & Hierarchical Querying',
    topics: [
      'Building readable multi-step queries using Common Table Expressions',
      'Recursive CTEs for hierarchical, organizational, and graph data',
      'Temporary tables, table variables, and views for modular data logic',
      'Data modification transactions (INSERT, UPDATE, DELETE with CTEs)'
    ]
  },
  {
    title: 'Analytical Window Functions & Ranking',
    topics: [
      'Partitioning and ordering dynamics in SQL window calculations',
      'Ranking functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE',
      'Offset functions: LEAD, LAG, FIRST_VALUE, LAST_VALUE',
      'Running totals, moving averages, and cumulative distribution metrics'
    ]
  },
  {
    title: 'Query Optimization, Indexing & Real-World Case Studies',
    topics: [
      'Understanding execution plans and EXPLAIN query analysis',
      'B-Tree indexes, composite indexes, and index selectivity',
      'Query refactoring techniques to eliminate full table scans',
      'Hands-on Capstone: Enterprise data warehouse reporting queries'
    ]
  }
];

const excelExecCurriculum: CurriculumSection[] = [
  {
    title: 'Modern Formulas & Dynamic Arrays',
    topics: [
      'Next-generation lookup functions: XLOOKUP, XMATCH, and INDEX/MATCH',
      'Dynamic array formulas: FILTER, SORT, SORTBY, UNIQUE, SEQUENCE',
      'Advanced formula efficiency using LET for local variables',
      'Custom reusable user-defined formulas using LAMBDA'
    ]
  },
  {
    title: 'Power Query & Automated ETL Transformations',
    topics: [
      'Connecting to diverse data sources (Excel, CSV, Web, Folders)',
      'Automated data cleaning, column splitting, unpivoting, and merging',
      'Building zero-code refreshable data transformation pipelines',
      'Introduction to M Query for custom transformation steps'
    ]
  },
  {
    title: 'Advanced PivotTables, Slicers & Data Modeling',
    topics: [
      'Multi-table PivotTables using Excel Data Model (Power Pivot)',
      'Interactive visual dashboarding with slicers, timelines, and drill-downs',
      'Calculated items, custom fields, and conditional formatting rules',
      'Dynamic chart creation for executive KPI summaries'
    ]
  },
  {
    title: 'Executive Financial & Business Decision Modeling',
    topics: [
      'Sensitivity analysis with Data Tables, Scenario Manager, and Goal Seek',
      'Building dynamic budget forecast and financial models',
      'Executive dashboard layout design and presentation standards',
      'Hands-on Capstone: C-Suite interactive financial dashboard'
    ]
  }
];

const powerBiExecCurriculum: CurriculumSection[] = [
  {
    title: 'Data Ingestion & Power Query Transformation',
    topics: [
      'Connecting to SQL databases, Excel workbooks, Web endpoints, and cloud data',
      'Data transformation, column shaping, type enforcement, and unpivoting',
      'Custom M functions and parameter-driven ETL workflows',
      'Scheduled data refresh configuration and optimization'
    ]
  },
  {
    title: 'Dimensional Data Modeling & Star Schema',
    topics: [
      'Fact tables vs Dimension tables architecture in Business Intelligence',
      'Creating 1-to-Many relationships, active vs inactive relationship paths',
      'Cross-filter direction mechanics and avoiding circular dependencies',
      'Optimizing data models for sub-second query performance'
    ]
  },
  {
    title: 'DAX Calculations & Time Intelligence',
    topics: [
      'Calculated columns vs Measures: Evaluation context and memory dynamics',
      'Mastering CALCULATE, FILTER, ALL, ALLEXCEPT, and context transitions',
      'Time intelligence formulas: YTD, QTD, MTD, YoY growth, and rolling averages',
      'Dynamic measure switching with calculation groups and disconnected tables'
    ]
  },
  {
    title: 'Interactive Dashboard Design & Power BI Service',
    topics: [
      'Visual hierarchy, bookmarks, tooltips, drill-throughs, and slicer sync',
      'Publishing reports to Power BI Service and configuring workspaces',
      'Row-Level Security (RLS) implementation and access management',
      'Hands-on Capstone: Complete enterprise revenue and KPI BI dashboard'
    ]
  }
];

const msOfficeExecCurriculum: CurriculumSection[] = [
  {
    title: 'Executive Word & Professional Document Design',
    topics: [
      'Advanced document structure, section breaks, and multi-level numbering',
      'Custom style sets, master templates, and automated table of contents',
      'Cross-referencing, citations, indexing, and mail merge automation',
      'Co-authoring, track changes, version history, and document protection'
    ]
  },
  {
    title: 'C-Suite PowerPoint & High-Impact Visual Presentations',
    topics: [
      'Slide Master customization, color palettes, and corporate template standards',
      'Information hierarchy, visual storytelling, and data-driven charts',
      'Morph transitions, subtle animations, and executive delivery modes',
      'Exporting interactive presentations, handouts, and video summaries'
    ]
  },
  {
    title: 'Spreadsheet Fluency for Workplace Productivity',
    topics: [
      'Core formulas (XLOOKUP, SUMIFS, COUNTIFS, IF/IFS, TEXT)',
      'PivotTable generation for instant weekly / monthly operational summaries',
      'Conditional formatting rules and data validation controls',
      'Creating clean, printable report views and automated trackers'
    ]
  },
  {
    title: 'Outlook, Microsoft Teams & M365 Cloud Collaboration',
    topics: [
      'Inbox zero strategies, advanced search folders, rules, and quick steps',
      'Calendar management, meeting scheduling, and shared mailbox coordination',
      'Microsoft Teams channels, integrations, and meeting workflows',
      'OneDrive cloud syncing, file permissions, and real-time team collaboration'
    ]
  }
];

const promptEngineeringExecCurriculum: CurriculumSection[] = [
  {
    title: 'Generative AI Foundations & Mental Models',
    topics: [
      'How LLMs process context: Tokens, embeddings, attention, and probability landscapes',
      'Understanding temperature, top-p, and frequency/presence penalties',
      'System prompts, developer instructions, and role conditioning frameworks',
      'Context window budgeting and managing token constraints'
    ]
  },
  {
    title: 'Advanced Prompting Frameworks & Reasoning Techniques',
    topics: [
      'Zero-Shot vs Few-Shot prompting with high-quality exemplars',
      'Chain-of-Thought (CoT) and Step-by-Step reasoning decomposition',
      'Directional Stimulus prompting and self-consistency sampling',
      'Role, Task, Context, Constraint (RTCC) prompt architecture'
    ]
  },
  {
    title: 'Structured Outputs, Guardrails & Reliability',
    topics: [
      'Enforcing strict JSON, XML, YAML, and Markdown tabular outputs',
      'Mitigating hallucinations through grounding and citations',
      'Prompt evaluation metrics and benchmarking across LLM versions',
      'Negative constraints, edge case handling, and defensive prompt framing'
    ]
  },
  {
    title: 'AI Tooling, Workflow Automation & Agentic Chains',
    topics: [
      'Function calling and structured tool integration with LLM APIs',
      'Multi-step workflow orchestration and automated text processing',
      'Practical workplace automation: Coding assistance, research, and analysis',
      'Hands-on Capstone: Building an automated executive AI workflow system'
    ]
  }
];

// =============================================================================
// COMPLETE COURSES ARRAY
// =============================================================================

export const courses: Course[] = [
  // ---------------------------------------------------------------------------
  // 1. Advanced Executive Program in Data Science & Artificial Intelligence
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

  // ---------------------------------------------------------------------------
  // 2. Executive Professional Certificate in Data Science & AI
  // ---------------------------------------------------------------------------
  {
    id: 'executive-professional-certificate-data-science-ai',
    slug: 'executive-professional-certificate-data-science-ai',
    title: 'Executive Professional Certificate in Data Science and AI',
    category: 'Data Science and AI',
    categories: ['Data Science and AI'],
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
    outcome: 'By the end of the program, learners will be equipped with practical knowledge across the modern Data Science and AI ecosystem and will be able to work with data, build predictive models, develop AI applications, create business dashboards and understand cloud-based and production-oriented workflows.',
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

  // ---------------------------------------------------------------------------
  // 3. Data Science Mastery Program
  // ---------------------------------------------------------------------------
  {
    id: 'data-science-mastery-program',
    slug: 'data-science-mastery-program',
    title: 'Data Science Mastery Program',
    category: 'Data Science and AI',
    categories: ['Data Science and AI'],
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
  // 4. Advance Executive in Python (Shared across 4 categories)
  // ---------------------------------------------------------------------------
  {
    id: 'advance-executive-python',
    slug: 'advance-executive-python',
    title: 'Python training program',
    category: 'Tools and Upskills',
    categories: ['Data Science and AI', 'Data Analytics and AI', 'AI and Machine Learning', 'Tools and Upskills'],
    shortDescription: 'Master modern Python scripting, OOP design, data manipulation with Pandas, automation, and API integration.',
    description: 'An intensive executive masterclass in Python covering programming foundations, object-oriented design, data manipulation, automation scripting, and API development.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 17999,
    duration: 'Flexible duration',
    liveHours: '30+ Hours',
    lessons: 28,
    level: 'Intermediate',
    rating: 4.88,
    students: 960,
    status: 'available',
    featured: false,
    skills: [
      'Advanced Python Scripting',
      'Object-Oriented Design',
      'NumPy & Pandas',
      'REST API Integration',
      'Workflow Automation',
      'Error Handling & Logging'
    ],
    curriculum: pythonExecCurriculum,
    modules: curriculumToModules(pythonExecCurriculum),
    projects: [
      'Automated Data Pipeline Scripting',
      'Custom REST API Service with FastAPI',
      'Modular Business Analytics Tool'
    ],
    careerReadiness: [
      'Code Quality & Best Practices',
      'Git Version Control',
      'Technical Interview Prep'
    ],
    outcome: 'Master professional Python scripting and modular design to automate repetitive workflows and develop robust data-driven applications.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Basic familiarity with computer operating systems and spreadsheets.',
      'Computer with Python 3.10+ installed (installation guidance provided).'
    ],
    whoIsItFor: [
      'Working professionals seeking to automate daily tasks and data workflows.',
      'Analysts and developers looking to level up their scripting and modular architecture.',
      'Team leads and managers who want practical code fluency.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 5. Advance Executive in SQL (Shared across 4 categories)
  // ---------------------------------------------------------------------------
  {
    id: 'advance-executive-sql',
    slug: 'advance-executive-sql',
    title: 'SQL Certification Course',
    category: 'Tools and Upskills',
    categories: ['Data Science and AI', 'Data Analytics and AI', 'AI and Machine Learning', 'Tools and Upskills'],
    shortDescription: 'Master advanced database queries, analytical window functions, complex CTEs, database indexing, and query optimization.',
    description: 'Master advanced database queries, analytical window functions, complex CTEs, database indexing, query optimization, and enterprise relational data manipulation.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 15999,
    duration: 'Flexible duration',
    liveHours: '25+ Hours',
    lessons: 24,
    level: 'Intermediate',
    rating: 4.87,
    students: 990,
    status: 'available',
    featured: false,
    skills: [
      'Advanced SQL Queries',
      'Window Functions (RANK, LEAD, LAG)',
      'Recursive CTEs & Subqueries',
      'Query Plan Optimization',
      'Relational Database Modeling'
    ],
    curriculum: sqlExecCurriculum,
    modules: curriculumToModules(sqlExecCurriculum),
    projects: [
      'Analytical Data Warehouse Queries',
      'Customer Cohort Analysis',
      'Database Query Performance Tuning'
    ],
    careerReadiness: [
      'SQL Business Case Studies',
      'Query Optimization Best Practices',
      'Technical Interview Prep'
    ],
    outcome: 'Gain complete authority over complex relational queries, analytical window functions, and database query optimization for high-scale analytics.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Basic conceptual understanding of tables, rows, and columns.',
      'Access to a modern web browser or SQL client interface.'
    ],
    whoIsItFor: [
      'Data analysts, BI professionals, and software developers seeking query mastery.',
      'Product managers and business specialists wanting direct database querying capability.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 6. Advance Executive in Excel (Shared across 4 categories)
  // ---------------------------------------------------------------------------
  {
    id: 'advance-executive-excel',
    slug: 'advance-executive-excel',
    title: 'Avanced excel course',
    category: 'Tools and Upskills',
    categories: ['Data Science and AI', 'Data Analytics and AI', 'AI and Machine Learning', 'Tools and Upskills'],
    shortDescription: 'Transform spreadsheet workflows with Dynamic Arrays (XLOOKUP, FILTER), Power Query automated ETL, and executive modeling.',
    description: 'Transform spreadsheet workflows with modern Dynamic Arrays (XLOOKUP, FILTER, UNIQUE), Power Query automated ETL transformations, PivotTables, and executive business modeling.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 13999,
    duration: 'Flexible duration',
    liveHours: '25+ Hours',
    lessons: 22,
    level: 'Beginner to Intermediate',
    rating: 4.87,
    students: 1180,
    status: 'available',
    featured: false,
    skills: [
      'Modern Excel Formulas (XLOOKUP, LET, LAMBDA)',
      'Dynamic Array Functions (FILTER, SORT, UNIQUE)',
      'Power Query Automated ETL',
      'Advanced PivotTables & Slicers',
      'Executive Business Modeling'
    ],
    curriculum: excelExecCurriculum,
    modules: curriculumToModules(excelExecCurriculum),
    projects: [
      'Automated Financial & Operational Model',
      'Executive KPI Tracking Dashboard',
      'Power Query Multi-Source Data Pipeline'
    ],
    careerReadiness: [
      'Data Storytelling with Spreadsheets',
      'Executive Dashboard Presentation',
      'Business Decision Modeling'
    ],
    outcome: 'Develop high-speed data manipulation, dynamic array calculation, and automated reporting abilities to build C-Suite grade business dashboards.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Microsoft Excel (2019, 2021, or Microsoft 365) installed on desktop or laptop.'
    ],
    whoIsItFor: [
      'Business analysts, finance professionals, accountants, and marketing specialists.',
      'Managers seeking to automate routine reporting and design dynamic executive dashboards.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 7. Advance Executive in Power BI (Shared across 4 categories)
  // ---------------------------------------------------------------------------
  {
    id: 'Power-bi',
    slug: 'advance-executive-power-bi',
    title: 'Power BI',
    category: 'Tools and Upskills',
    categories: ['Data Science and AI', 'Data Analytics and AI', 'AI and Machine Learning', 'Tools and Upskills'],
    shortDescription: 'Build enterprise-grade BI solutions, master DAX computations, design Star Schemas, and deploy interactive reports.',
    description: 'Build enterprise-grade business intelligence solutions, master DAX computations, design dimensional data models (Star Schema), and deploy executive interactive reporting.',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 16999,
    duration: 'Flexible duration',
    liveHours: '30+ Hours',
    lessons: 25,
    level: 'Intermediate',
    rating: 4.89,
    students: 1050,
    status: 'available',
    featured: false,
    skills: [
      'Power BI Desktop & Service',
      'Power Query ETL & M Query',
      'Dimensional Modeling & Star Schemas',
      'DAX Calculations & Time Intelligence',
      'Interactive KPI Dashboards'
    ],
    curriculum: powerBiExecCurriculum,
    modules: curriculumToModules(powerBiExecCurriculum),
    projects: [
      'Enterprise Sales & Revenue BI Dashboard',
      'Customer Retention & Churn Analytics',
      'Supply Chain Performance Tracker'
    ],
    careerReadiness: [
      'BI Architecture Portfolio',
      'Dashboard Usability Standards',
      'BI Analyst Interview Prep'
    ],
    outcome: 'Master the end-to-end business intelligence lifecycle from raw data modeling and DAX computation to executive interactive dashboard deployment.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'A computer running Windows 10/11 capable of running Power BI Desktop (free download).'
    ],
    whoIsItFor: [
      'Professionals aiming to transition from spreadsheets to robust Business Intelligence reporting.',
      'Data analysts, team leads, and consultants building visual analytics solutions.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 8. Advance Executive in MS Office (Tools and Upskills)
  // ---------------------------------------------------------------------------
  {
    id: 'advance-executive-ms-office',
    slug: 'advance-executive-ms-office',
    title: 'Advance Executive in MS Office',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Comprehensive executive suite mastery across Microsoft Word, Excel, PowerPoint, Outlook, and M365 collaboration tools.',
    description: 'Comprehensive executive suite mastery across Microsoft Word, Excel, PowerPoint, Outlook, and collaborative Microsoft 365 cloud workflows to maximize workplace productivity.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 12999,
    duration: 'Flexible duration',
    liveHours: '20+ Hours',
    lessons: 20,
    level: 'Beginner to Intermediate',
    rating: 4.82,
    students: 820,
    status: 'available',
    featured: false,
    skills: [
      'Microsoft 365 Cloud Ecosystem',
      'Advanced Excel Data Analysis',
      'Executive Word Document Design',
      'High-Impact PowerPoint Presentations',
      'Outlook & Teams Collaboration'
    ],
    curriculum: msOfficeExecCurriculum,
    modules: curriculumToModules(msOfficeExecCurriculum),
    projects: [
      'Executive Pitch Deck Design',
      'Corporate Report Template System',
      'Productivity Workflow Automation'
    ],
    careerReadiness: [
      'Executive Communication',
      'Workplace Productivity Best Practices',
      'Document Management'
    ],
    outcome: 'Achieve complete fluency across Microsoft 365 applications to deliver boardroom-quality documents, presentations, spreadsheets, and collaborative team workflows.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'Access to Microsoft Office suite or Microsoft 365 subscription on a desktop or laptop.'
    ],
    whoIsItFor: [
      'Executive assistants, office managers, administrative leads, and corporate professionals.',
      'Anyone seeking end-to-end fluency and productivity across the entire Microsoft productivity suite.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 9. Advance Executive in Prompt Engineering (Tools and Upskills)
  // ---------------------------------------------------------------------------
  {
    id: 'advance-executive-prompt-engineering',
    slug: 'advance-executive-prompt-engineering',
    title: 'Prompt Engineering',
    category: 'Tools and Upskills',
    categories: ['Tools and Upskills'],
    shortDescription: 'Master generative AI prompting, Chain-of-Thought, structured outputs, guardrails, and enterprise AI workflows.',
    description: 'Master practical generative AI prompting techniques, Chain-of-Thought, few-shot prompting, structured JSON/XML outputs, automated workflow integrations, and enterprise AI tooling.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    price: 4990,
    originalPrice: 18999,
    duration: 'Flexible duration',
    liveHours: '25+ Hours',
    lessons: 26,
    level: 'Beginner to Advanced',
    rating: 4.93,
    students: 1320,
    status: 'available',
    featured: true,
    skills: [
      'Prompt Engineering Frameworks',
      'Few-Shot & Chain-of-Thought',
      'Structured Output Generation',
      'Guardrails & Hallucination Prevention',
      'AI Workflow Automation'
    ],
    curriculum: promptEngineeringExecCurriculum,
    modules: curriculumToModules(promptEngineeringExecCurriculum),
    projects: [
      'Automated Content & Code Generator',
      'Enterprise Knowledge Extraction Assistant',
      'Multi-Step LLM Workflow Pipeline'
    ],
    careerReadiness: [
      'AI-Augmented Productivity Portfolio',
      'Prompt Optimization Case Studies',
      'Emerging AI Trends'
    ],
    outcome: 'Learn how to effectively instruct, constrain, and orchestrate large language models to automate complex knowledge tasks with reliable, structured outputs.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: [
      'A web browser with internet access to interact with modern AI models (ChatGPT, Claude, Gemini).',
      'No prior programming knowledge required.'
    ],
    whoIsItFor: [
      'Executives, product managers, software engineers, content strategists, and consultants.',
      'Professionals eager to multiply their day-to-day productivity using cutting-edge Generative AI.'
    ]
  },

  // ---------------------------------------------------------------------------
  // 10. HR (Free Learning)
  // ---------------------------------------------------------------------------
  {
    id: 'hr',
    slug: 'hr',
    title: 'HR',
    category: 'Free Learning',
    categories: ['Free Learning'],
    shortDescription: 'Human Resources learning content.',
    description: 'Human Resources learning content.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
    price: 0,
    originalPrice: 0,
    duration: 'Self-Paced',
    lessons: 6,
    level: 'Beginner Friendly',
    rating: 4.88,
    students: 540,
    status: 'available',
    featured: false,
    skills: ['HR Operations', 'Talent Acquisition', 'Employee Relations', 'Workplace Management'],
    curriculum: [
      {
        title: 'Human Resources Fundamentals',
        topics: [
          'HR Operations & Policies',
          'Talent Acquisition & Recruitment',
          'Employee Engagement & Performance',
          'Workplace Compliance & Labor Relations'
        ]
      }
    ],
    modules: curriculumToModules([
      {
        title: 'Human Resources Fundamentals',
        topics: [
          'HR Operations & Policies',
          'Talent Acquisition & Recruitment',
          'Employee Engagement & Performance',
          'Workplace Compliance & Labor Relations'
        ]
      }
    ]),
    projects: ['HR Policy Handbook Design', 'Recruitment Workflow Matrix'],
    careerReadiness: ['HR Generalist Foundations', 'Workplace Communication Best Practices'],
    outcome: 'Gain practical knowledge of fundamental Human Resources operations, talent recruitment pipelines, and employee management practices.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: ['No prior HR experience required. Basic interest in people operations and management.'],
    whoIsItFor: ['Aspiring HR professionals, management students, and team leaders.']
  },

  // ---------------------------------------------------------------------------
  // 11. Finance (Free Learning)
  // ---------------------------------------------------------------------------
  {
    id: 'finance',
    slug: 'finance',
    title: 'Finance',
    category: 'Free Learning',
    categories: ['Free Learning'],
    shortDescription: 'Finance learning content.',
    description: 'Finance learning content.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop',
    price: 0,
    originalPrice: 0,
    duration: 'Self-Paced',
    lessons: 6,
    level: 'Beginner Friendly',
    rating: 4.90,
    students: 620,
    status: 'available',
    featured: false,
    skills: ['Financial Analysis', 'Budgeting & Planning', 'Financial Statements', 'Corporate Finance Basics'],
    curriculum: [
      {
        title: 'Finance Essentials',
        topics: [
          'Principles of Finance & Accounting',
          'Financial Statement Analysis',
          'Budgeting & Cash Flow Management',
          'Corporate Investment & Capital Planning'
        ]
      }
    ],
    modules: curriculumToModules([
      {
        title: 'Finance Essentials',
        topics: [
          'Principles of Finance & Accounting',
          'Financial Statement Analysis',
          'Budgeting & Cash Flow Management',
          'Corporate Investment & Capital Planning'
        ]
      }
    ]),
    projects: ['Corporate Financial Statement Review', 'Cash Flow Budget Model'],
    careerReadiness: ['Financial Decision-Making', 'Budget Analysis Fundamentals'],
    outcome: 'Understand essential financial concepts, interpret financial statements, and apply fundamental budgeting principles in business.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: ['Basic arithmetic skills and interest in corporate finance fundamentals.'],
    whoIsItFor: ['Students, entrepreneurs, and professionals seeking a solid grounding in corporate and personal finance.']
  },

  // ---------------------------------------------------------------------------
  // 12. Digital Marketing (Free Learning)
  // ---------------------------------------------------------------------------
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Free Learning',
    categories: ['Free Learning'],
    shortDescription: 'Digital marketing learning content.',
    description: 'Digital marketing learning content.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    price: 0,
    originalPrice: 0,
    duration: 'Self-Paced',
    lessons: 6,
    level: 'Beginner Friendly',
    rating: 4.92,
    students: 780,
    status: 'available',
    featured: false,
    skills: ['SEO Fundamentals', 'Social Media Strategy', 'Content Marketing', 'Digital Campaign Analytics'],
    curriculum: [
      {
        title: 'Digital Marketing Fundamentals',
        topics: [
          'Digital Marketing Channels & Strategy',
          'Search Engine Optimization (SEO)',
          'Social Media & Content Marketing',
          'Campaign Performance & Web Analytics'
        ]
      }
    ],
    modules: curriculumToModules([
      {
        title: 'Digital Marketing Fundamentals',
        topics: [
          'Digital Marketing Channels & Strategy',
          'Search Engine Optimization (SEO)',
          'Social Media & Content Marketing',
          'Campaign Performance & Web Analytics'
        ]
      }
    ]),
    projects: ['Search Engine Optimization Strategy Plan', 'Multi-Channel Brand Campaign Blueprint'],
    careerReadiness: ['Digital Growth Portfolio', 'Marketing Analytics Overview'],
    outcome: 'Learn the core channels and growth mechanics of modern digital marketing, including search engine visibility and social media campaigns.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: ['Internet connection and basic familiarity with social platforms and search engines.'],
    whoIsItFor: ['Students, small business owners, career switchers, and marketing enthusiasts.']
  },

  // ---------------------------------------------------------------------------
  // 13. Accounting and GST (Free Learning)
  // ---------------------------------------------------------------------------
  {
    id: 'accounting-and-gst',
    slug: 'accounting-and-gst',
    title: 'Accounting and GST',
    category: 'Free Learning',
    categories: ['Free Learning'],
    shortDescription: 'Accounting and GST learning content.',
    description: 'Accounting and GST learning content.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    price: 0,
    originalPrice: 0,
    duration: 'Self-Paced',
    lessons: 6,
    level: 'Beginner Friendly',
    rating: 4.87,
    students: 490,
    status: 'available',
    featured: false,
    skills: ['Double-Entry Bookkeeping', 'GST Compliance', 'Tax Invoicing', 'Ledger Balancing'],
    curriculum: [
      {
        title: 'Accounting and GST Essentials',
        topics: [
          'Financial Accounting Principles',
          'Ledger & Trial Balance Preparation',
          'GST Law, Framework & Invoicing',
          'GST Returns & Compliance Filing'
        ]
      }
    ],
    modules: curriculumToModules([
      {
        title: 'Accounting and GST Essentials',
        topics: [
          'Financial Accounting Principles',
          'Ledger & Trial Balance Preparation',
          'GST Law, Framework & Invoicing',
          'GST Returns & Compliance Filing'
        ]
      }
    ]),
    projects: ['Business Bookkeeping & Ledger Setup', 'GST Invoice & Filing Simulation'],
    careerReadiness: ['Accounting Documentation Standards', 'GST Filing Best Practices'],
    outcome: 'Develop practical skills in recording financial transactions, maintaining books of accounts, and navigating Goods and Services Tax compliance.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: ['Basic mathematical and numerical ability.'],
    whoIsItFor: ['Commerce students, accountants, business owners, and finance assistants.']
  },

  // ---------------------------------------------------------------------------
  // 14. Java (Free Learning)
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
  },

  // ---------------------------------------------------------------------------
  // 15. HTML (Free Learning)
  // ---------------------------------------------------------------------------
  {
    id: 'html',
    slug: 'html',
    title: 'HTML',
    category: 'Free Learning',
    categories: ['Free Learning'],
    shortDescription: 'HTML and web-development fundamentals.',
    description: 'HTML and web-development fundamentals.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
    price: 0,
    originalPrice: 0,
    duration: 'Self-Paced',
    lessons: 6,
    level: 'Beginner Friendly',
    rating: 4.91,
    students: 950,
    status: 'available',
    featured: false,
    skills: ['HTML5 Tags & Structure', 'Web Forms & Inputs', 'Semantic Web Elements', 'Web Standards'],
    curriculum: [
      {
        title: 'HTML & Web Development Fundamentals',
        topics: [
          'HTML Document Structure & Tags',
          'Text Formatting, Links & Images',
          'Forms, Inputs & Validation',
          'Semantic HTML5 & Best Practices'
        ]
      }
    ],
    modules: curriculumToModules([
      {
        title: 'HTML & Web Development Fundamentals',
        topics: [
          'HTML Document Structure & Tags',
          'Text Formatting, Links & Images',
          'Forms, Inputs & Validation',
          'Semantic HTML5 & Best Practices'
        ]
      }
    ]),
    projects: ['Personal Portfolio Webpage', 'Interactive Multi-Section Registration Form'],
    careerReadiness: ['Web Development Foundation', 'Clean Code and Semantic Markup'],
    outcome: 'Master HyperText Markup Language to construct clean, accessible, and structured web pages from scratch.',
    features: COMMON_PROGRAM_FEATURES,
    requirements: ['Any modern web browser and a free code editor (like VS Code or Notepad).'],
    whoIsItFor: ['Anyone starting their web development journey, students, and digital creators.']
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
 * Full-text search across Title, Description, Categories, Skills, and Curriculum Topics.
 */
export function searchCourses(courseList: Course[], query: string): Course[] {
  if (!query || !query.trim()) return courseList;
  const term = query.toLowerCase().trim();

  return courseList.filter((course) => {
    // Check title & description
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

    // Check legacy modules
    if (
      course.modules?.some(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          m.lessons?.some((l) => l.title.toLowerCase().includes(term))
      )
    ) {
      return true;
    }

    // Check projects & outcome
    if (
      course.projects?.some((p) => {
        const text = typeof p === 'string' ? p : `${p.title} ${p.description} ${p.technologies.join(' ')} ${p.category}`;
        return text.toLowerCase().includes(term);
      })
    ) {
      return true;
    }
    if (course.outcome?.toLowerCase().includes(term)) return true;

    return false;
  });
}
