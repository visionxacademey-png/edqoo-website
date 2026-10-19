import { Pool } from '@neondatabase/serverless';

export interface SeedCategory {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  subtitle: string;
  icon: string;
  heroImage: string;
  heroBadge: string;
  highlights: string[];
  curriculumPillars: Array<{ title: string; desc: string }>;
  faqs: Array<{ question: string; answer: string }>;
  displayOrder: number;
  isActive: boolean;
  isPartner: boolean;
  badge?: string;
  seoTitle: string;
  seoDescription: string;
  metaKeywords: string[];
  parentId?: string;
  parentSlug?: string;
  features?: any[];
  courseDetails?: any;
  keyHighlights?: string[];
  learningBenefits?: string[];
  batchTimings?: any[];
  learningFormat?: string;
  supportingText?: string;
  highlightText?: string;
}

export const INITIAL_CATEGORIES: SeedCategory[] = [
  {
    id: 'cat-data-science-ai',
    slug: 'data-science-and-ai',
    name: 'Data Science and AI',
    title: 'Data Science and AI Courses & Certification Programs',
    description: 'Master data engineering, predictive modeling, deep learning architectures, and production AI with real-world enterprise projects and dedicated mentorship.',
    subtitle: 'Master data engineering, predictive modeling, deep learning architectures, and production AI with real-world enterprise projects and dedicated mentorship.',
    icon: 'brain',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Comprehensive Industry Program Track',
    highlights: [
      'Full-stack Data Science & Artificial Intelligence curriculum',
      'Hands-on projects with Amazon, Netflix, and Medical AI datasets',
      'Master Python, Machine Learning, Deep Learning, MLOps, and Power BI',
      'Placement assistance with interview coaching & portfolio reviews'
    ],
    curriculumPillars: [
      { title: 'Python & Statistical Foundations', desc: 'Object-oriented programming, data structures, NumPy, Pandas, exploratory analysis, and inferential statistics.' },
      { title: 'Machine Learning & Predictive Systems', desc: 'Supervised & unsupervised models, ensemble methods, XGBoost, feature engineering, and cross-validation.' },
      { title: 'Deep Learning & NLP Applications', desc: 'Neural networks, computer vision with CNNs, transfer learning, transformers, BERT, LLMs, and Generative AI.' },
      { title: 'Cloud Data & MLOps Pipelines', desc: 'SQL database mastery, Azure data pipelines, model deployment, version control with Git, and portfolio capstone.' }
    ],
    faqs: [
      {
        question: 'What is included in the Data Science and AI course?',
        answer: 'The program includes live interactive classes, on-demand session recordings, complete LMS access, 7+ industry capstone projects, 1-on-1 mentorship, resume optimization, and placement assistance.'
      },
      {
        question: 'Who is this Data Science and AI program for?',
        answer: 'It is designed for graduates, software developers, analysts, and working professionals looking to transition into high-growth Data Scientist, AI Engineer, and Machine Learning Specialist roles.'
      },
      {
        question: 'Do I need prior programming experience to enroll?',
        answer: 'No prior programming experience is required. We start with fundamental Python and mathematics foundations before progressing to advanced machine learning and deep neural networks.'
      },
      {
        question: 'What certification is provided upon completion?',
        answer: 'Graduates receive the verified Edqoo Professional Certificate in Data Science & Artificial Intelligence, highlighting verified project portfolio achievements.'
      }
    ],
    displayOrder: 1,
    isActive: true,
    isPartner: false,
    seoTitle: 'Edqoo Data Science and AI Programs | Master Online Tracks',
    seoDescription: 'Learn Data Science, Artificial Intelligence, Python, machine learning and practical analytics through Edqoo industry-focused Data Science and AI program.',
    metaKeywords: ['Edqoo Data Science', 'data science course', 'data science and AI course', 'online data science course', 'AI training']
  },
  {
    id: 'cat-data-analytics-ai',
    slug: 'data-analytics-and-ai',
    name: 'Data Analytics and AI',
    title: 'Data Analytics & AI Courses & Practical BI Training',
    description: 'Transform raw business data into strategic intelligence with advanced Power BI, Tableau, SQL querying, Python analytics, and AI automation.',
    subtitle: 'Transform raw business data into strategic intelligence with advanced Power BI, Tableau, SQL querying, Python analytics, and AI automation.',
    icon: 'chart',
    heroImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Executive Analytics & BI Track',
    highlights: [
      'Interactive executive dashboards with Power BI & Tableau',
      'Complex SQL query optimization and relational database design',
      'Automated reporting pipelines with Python & Excel integrations',
      'Real-world business intelligence case studies from retail & healthcare'
    ],
    curriculumPillars: [
      { title: 'Business Intelligence & Power BI', desc: 'DAX formulas, data modeling, Power Query transformations, and interactive dashboard publishing.' },
      { title: 'Relational Data & Advanced SQL', desc: 'Window functions, subqueries, aggregations, indexing, stored procedures, and data warehouse fundamentals.' },
      { title: 'Python for Business Analytics', desc: 'Automated ETL scripts, statistical charting with Seaborn/Plotly, and customer segmentation algorithms.' },
      { title: 'Executive Data Storytelling', desc: 'KPI selection, stakeholder presentation frameworks, and automated performance reporting.' }
    ],
    faqs: [
      {
        question: 'What tools are covered in the Data Analytics track?',
        answer: 'You will master Microsoft Power BI, Advanced Excel, SQL (PostgreSQL & MySQL), Tableau, and Python for data analysis.'
      },
      {
        question: 'Is this track suitable for non-technical professionals?',
        answer: 'Yes! The curriculum starts with intuitive spreadsheet analysis and structured business logic before expanding into SQL and Python scripting.'
      }
    ],
    displayOrder: 2,
    isActive: true,
    isPartner: false,
    seoTitle: 'Data Analytics & AI Courses | Edqoo Online Training',
    seoDescription: 'Master Power BI, Tableau, SQL, and Python data analytics with Edqoo industry-grade training and project mentoring.',
    metaKeywords: ['data analytics course', 'Power BI training', 'SQL for analytics', 'business intelligence course', 'Edqoo analytics']
  },
  {
    id: 'cat-ai-machine-learning',
    slug: 'ai-and-machine-learning',
    name: 'AI and Machine Learning',
    title: 'AI and Machine Learning Courses & Practical Training',
    description: 'Master deep learning, neural networks, computer vision, natural language processing, LLMs, and Generative AI systems built on PyTorch and TensorFlow.',
    subtitle: 'Master deep learning, neural networks, computer vision, natural language processing, LLMs, and Generative AI systems built on PyTorch and TensorFlow.',
    icon: 'cpu',
    heroImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Advanced AI & Neural Networks Track',
    highlights: [
      'Neural architectures, CNNs, RNNs, Transformers & Attention mechanisms',
      'Hands-on LLM fine-tuning, RAG pipelines, and LangChain orchestration',
      'Computer vision and multi-modal generative deep learning models',
      'Model optimization, quantization, and containerized cloud serving'
    ],
    curriculumPillars: [
      { title: 'Core Machine Learning Algorithms', desc: 'Regression, classification, SVMs, random forests, boosting methods, and model evaluation.' },
      { title: 'Deep Neural Architectures', desc: 'Backpropagation, PyTorch tensors, convolutional networks, and computer vision pipelines.' },
      { title: 'NLP & Large Language Models', desc: 'Tokenization, embeddings, attention mechanisms, HuggingFace transformers, and RAG architectures.' },
      { title: 'AI Production Deployment', desc: 'FastAPI model endpoints, Docker containerization, ONNX runtime, and real-time inference.' }
    ],
    faqs: [
      {
        question: 'What mathematical concepts are required for AI & ML?',
        answer: 'Basic familiarity with linear algebra, calculus, and probability is helpful, and our introductory module covers all essential mathematical concepts intuitively.'
      },
      {
        question: 'Do we build Generative AI and LLM applications?',
        answer: 'Yes, modern Generative AI, Retrieval-Augmented Generation (RAG), and prompt engineering are core components of this track.'
      }
    ],
    displayOrder: 3,
    isActive: true,
    isPartner: false,
    seoTitle: 'AI & Machine Learning Courses | Edqoo Master Training',
    seoDescription: 'Learn machine learning, deep learning, PyTorch, and Generative AI with hands-on industry projects on Edqoo.',
    metaKeywords: ['machine learning course', 'AI certification', 'deep learning training', 'PyTorch course', 'Generative AI training']
  },
  {
    id: 'cat-tools-upskills',
    slug: 'tools-and-upskills',
    name: 'Tools and Upskills',
    title: 'Executive Tools & Upskilling Short-Term Certifications',
    description: 'Fast-track your professional competency with hands-on executive programs in Python, Power BI, Advanced Excel, Prompt Engineering, MS Office, and UI/UX.',
    subtitle: 'Fast-track your professional competency with hands-on executive programs in Python, Power BI, Advanced Excel, Prompt Engineering, MS Office, and UI/UX.',
    icon: 'wrench',
    heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Executive Skill Acceleration',
    highlights: [
      'Intensive short-term executive certifications built for working professionals',
      'Immediate workplace application with practical case studies',
      'Flexible weekend and evening batches with live mentor access',
      'Verified individual skill certifications for LinkedIn profiles'
    ],
    curriculumPillars: [
      { title: 'Advanced Executive Excel', desc: 'VLOOKUP/XLOOKUP, index-match, dynamic arrays, pivot tables, financial modeling, and macro automation.' },
      { title: 'Executive Power BI', desc: 'Data importing, relationship modeling, DAX expressions, and executive visual reporting.' },
      { title: 'Prompt Engineering & AI Productivity', desc: 'LLM workflow optimization, structured prompting, AI agents, and corporate productivity tools.' },
      { title: 'Python Programming Essentials', desc: 'Scripting, file handling, automation, APIs, and data processing with Pandas.' }
    ],
    faqs: [
      {
        question: 'How long are the Tools and Upskills courses?',
        answer: 'Courses range from 12 to 24 live intensive hours, structured in flexible modules suitable for busy professionals.'
      },
      {
        question: 'Do I get a certificate for individual tool courses?',
        answer: 'Yes, each tool module awards a verified Edqoo Executive Certificate upon passing the practical capstone assessment.'
      }
    ],
    displayOrder: 4,
    isActive: true,
    isPartner: false,
    seoTitle: 'Executive Tools & Upskilling Courses | Edqoo',
    seoDescription: 'Upskill quickly in Python, Power BI, Advanced Excel, and Prompt Engineering with Edqoo executive short courses.',
    metaKeywords: ['upskilling courses', 'Power BI course', 'Advanced Excel training', 'Prompt Engineering', 'Python short course']
  },
  {
    id: 'cat-free-learning',
    slug: 'free-learning',
    name: 'Free Learning',
    title: 'Free Technology & Business Foundation Courses',
    description: 'Start your digital career with 100% free foundational masterclasses in HTML, Java, Digital Marketing, HR Management, Accounting, and Finance.',
    subtitle: 'Start your digital career with 100% free foundational masterclasses in HTML, Java, Digital Marketing, HR Management, Accounting, and Finance.',
    icon: 'book-open',
    heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    heroBadge: '100% Free Open Learning Initiative',
    highlights: [
      '100% free foundational courses with zero hidden costs',
      'Self-paced video modules and interactive exercises',
      'Beginner-friendly curriculum for students and career switchers',
      'Course completion badge and foundation certificate'
    ],
    curriculumPillars: [
      { title: 'Web Development Basics (HTML)', desc: 'Semantic markup, forms, tables, media embedding, and responsive structuring.' },
      { title: 'Java Programming Foundations', desc: 'Syntax, variables, loops, methods, object-oriented concepts, and basic algorithms.' },
      { title: 'Digital Marketing & Growth', desc: 'SEO essentials, social media marketing, content planning, and analytics.' },
      { title: 'Business & HR Fundamentals', desc: 'Talent acquisition, payroll basics, statutory compliance, and organizational behavior.' }
    ],
    faqs: [
      {
        question: 'Are the Free Learning courses really 100% free?',
        answer: 'Yes! All courses in the Free Learning category are completely free to access for all registered learners.'
      }
    ],
    displayOrder: 5,
    isActive: true,
    isPartner: false,
    seoTitle: 'Free Online Courses | Learn Tech & Business | Edqoo',
    seoDescription: 'Access free foundational courses in HTML, Java, Digital Marketing, HR, and Accounting with Edqoo Free Learning.',
    metaKeywords: ['free courses', 'free tech training', 'learn HTML free', 'learn Java free', 'free certification']
  },
  {
    id: 'cat-spoken-tutorial',
    slug: 'spoken-tutorial',
    name: 'Spoken English',
    title: 'Spoken English — English Mirror Spoken English Programs',
    description: 'Your Complete Path to Confident English Communication. Personalized 1:1 English fluency coaching, daily telephonic confidence building, IELTS intensive crash training, and corporate communication mastery.',
    subtitle: 'Mirror your success with fluent English',
    icon: 'message-circle',
    heroImage: '/images/spoken-tutorial/fluency-builder-plan.jpg',
    heroBadge: 'English Mirror Partner Track',
    highlights: [
      '1-on-1 personalized live coaching with certified language trainers',
      'Daily 15-minute telephonic speaking sessions for natural conversational fluency',
      'IELTS Band score crash training covering Speaking, Reading, Writing & Listening',
      'Corporate communication, email etiquette, and executive interview preparation'
    ],
    curriculumPillars: [
      { title: 'Fluency Builder Plan', desc: 'Daily 15-minute voice calls, 25 grammar and 25 vocabulary classes, WhatsApp doubt support, and certification eligibility.' },
      { title: 'Little Mirrors (Kids 1:1)', desc: '15 live 1:1 sessions for Class 3–7 & 8–12 blending simple concepts, fun speaking activities, and worksheets.' },
      { title: 'Corporate English Fluency', desc: '15 live 1:1 Google Meet coaching sessions, 100+ business vocabulary words, and daily communication practice.' },
      { title: 'IELTS Intensive & Interview Track', desc: 'Targeted preparation for all 4 IELTS modules and executive interview preparation with mock interview practice.' }
    ],
    faqs: [
      {
        question: 'How do the 1-to-1 telephonic sessions work?',
        answer: 'A dedicated English Mirror language expert calls you daily for structured 15-minute voice conversation practice, instant pronunciation correction, and vocabulary enhancement.'
      },
      {
        question: 'What subcategories are available under Spoken English?',
        answer: 'Spoken English features five specialized tracks: Fluency Builder Plan, Little Mirrors for Kids, Corporate English Fluency Builder, IELTS Intensive, and Executive Interview Preparation Track.'
      },
      {
        question: 'How do I enrol or enquire about a course?',
        answer: 'Click "Enquire Now" on any category card to submit an enquiry. An academic advisor will reach out to discuss schedule and batch options.'
      }
    ],
    displayOrder: 6,
    isActive: true,
    isPartner: false,
    badge: undefined,
    seoTitle: 'Spoken English | English Mirror 1:1 English Fluency Programs',
    seoDescription: 'Master English with English Mirror Spoken English. Choose from Fluency Builder Plan, Little Mirrors, Corporate English, IELTS Intensive, and Executive Interview Preparation.',
    metaKeywords: ['Spoken English', 'Spoken Tutorial', 'English Mirror', 'Fluency Builder Plan', 'Little Mirrors', 'IELTS Intensive', 'Corporate English', 'Interview Preparation']
  },
  {
    id: 'cat-fluency-builder-plan',
    slug: 'fluency-builder-plan',
    name: 'Fluency Builder Plan',
    title: 'Fluency Builder Plan — Telephonic Sessions',
    subtitle: 'Telephonic Sessions',
    description: 'Your Complete Path to Confident English Communication.',
    supportingText: 'Voice Calls | Recorded Lessons | Daily Practice',
    parentId: 'cat-spoken-tutorial',
    parentSlug: 'spoken-tutorial',
    icon: 'phone-call',
    heroImage: 'https://images.unsplash.com/photo-1714079761488-e0c9b9ac4138?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    heroBadge: 'Telephonic English Track',
    learningFormat: 'Telephonic learning, daily one-to-one voice calls, and self-paced learning.',
    keyHighlights: [
      '25 Phone Call Sessions (Daily 15 mins)',
      '50 Recorded Classes (25 Grammar + 25 Vocabulary)',
      '50 E-PDFs + Daily JAM Updates',
      'Certification Eligibility'
    ],
    features: [
      {
        id: 1,
        title: '25 Phone Call Sessions',
        description: 'Daily 15-minute one-to-one voice calls with an expert trainer.'
      },
      {
        id: 2,
        title: '25 Grammar + 25 Vocabulary',
        description: 'Recorded HD classes with lifetime access.'
      },
      {
        id: 3,
        title: '50 E-PDFs + Daily JAM Updates',
        description: 'Educational resources with WhatsApp doubt support.'
      },
      {
        id: 4,
        title: 'Certification',
        description: 'Certification eligibility according to the course tenure requirements.'
      }
    ],
    courseDetails: {
      format: 'Telephonic learning, daily one-to-one voice calls, and self-paced learning.',
      sessions: 'Daily 15-minute one-to-one voice calls with an expert trainer (25 calls).',
      recordedClasses: '25 Grammar + 25 Vocabulary recorded HD masterclasses with lifetime access.',
      resources: '50 E-PDFs with WhatsApp doubt support and daily JAM updates.',
      certification: 'Certification eligibility according to the course tenure requirements.',
      highlight: 'Mirror your success with fluent English.'
    },
    learningBenefits: [
      'Daily 15-minute voice calling builds natural speaking habits without camera anxiety',
      'Lifetime access to 25 HD Grammar and 25 HD Vocabulary masterclasses',
      'Continuous WhatsApp doubt clarification and daily Just-A-Minute (JAM) fluency prompts',
      'Official certification eligibility according to course tenure requirements'
    ],
    highlights: [
      '25 Phone Call Sessions: Daily 15-minute 1-on-1 voice calls with expert trainer',
      '25 Grammar + 25 Vocabulary recorded HD classes with lifetime access',
      '50 E-PDFs + Daily JAM updates with WhatsApp doubt support',
      'Certification eligibility according to course tenure requirements'
    ],
    curriculumPillars: [
      { title: 'Daily Telephonic Drills', desc: '15-minute daily 1-to-1 conversation sessions with immediate pronunciation and sentence correction.' },
      { title: 'Grammar Precision Vault', desc: '25 recorded HD video classes breaking down tenses, prepositions, sentence structure, and spoken patterns.' },
      { title: 'Vocabulary Expansion', desc: '25 recorded HD classes with high-frequency everyday and professional vocabulary words.' },
      { title: 'JAM Updates & E-PDFs', desc: 'Daily Just-A-Minute speaking challenges and 50 downloadable study worksheets via WhatsApp.' }
    ],
    faqs: [
      {
        question: 'How do the 25 phone call sessions take place?',
        answer: 'An expert trainer calls your phone directly once a day for a dedicated 15-minute one-to-one voice conversation session. No high-speed internet or video camera required.'
      },
      {
        question: 'How long do I have access to the recorded grammar and vocabulary classes?',
        answer: 'You receive lifetime access to all 25 Grammar and 25 Vocabulary recorded HD masterclasses and all 50 E-PDF resources.'
      },
      {
        question: 'How does WhatsApp doubt support work?',
        answer: 'You can ask questions and clarify doubts directly on WhatsApp with our academic support team throughout your course tenure.'
      }
    ],
    displayOrder: 1,
    isActive: true,
    isPartner: true,
    badge: 'TELEPHONIC TRACK',
    seoTitle: 'Fluency Builder Plan | Telephonic English Sessions | English Mirror',
    seoDescription: 'Master spoken English with Fluency Builder Plan: 25 phone call sessions, 50 recorded classes, 50 E-PDFs, and WhatsApp support. Mirror your success with fluent English.',
    metaKeywords: ['Fluency Builder Plan', 'Telephonic English', '1 on 1 phone call sessions', 'English Mirror', 'Spoken Tutorial']
  },
  {
    id: 'cat-little-mirrors',
    slug: 'little-mirrors',
    name: 'Little Mirrors',
    title: 'Little Mirrors — 1:1 English Fluency for Kids',
    subtitle: '1:1 English Fluency for Kids',
    description: 'Fun learning today, confident communicators tomorrow.',
    supportingText: '1:1 Live Classes | Interactive Activities | Class 3–7 & 8–12',
    parentId: 'cat-spoken-tutorial',
    parentSlug: 'spoken-tutorial',
    icon: 'smile',
    heroImage: '/images/spoken-tutorial/little-mirrors.jpg',
    heroBadge: 'Kids 1:1 Fluency',
    learningFormat: 'Live 1:1 interactive sessions with games, activities, and worksheets.',
    keyHighlights: [
      '15 Live 1:1 Sessions',
      '30 Minutes per Session',
      'Designed for children in Class 3–7 & 8–12'
    ],
    features: [
      {
        id: 1,
        title: '1:1 Live Classes',
        description: 'Personalised attention without crowding or comparison.'
      },
      {
        id: 2,
        title: 'Speaking Practice',
        description: 'Build confidence to speak up during every session.'
      },
      {
        id: 3,
        title: 'Fun & Interactive',
        description: 'Engaging activities, games, and role-play.'
      },
      {
        id: 4,
        title: 'Customised Curriculum',
        description: 'Learning paced according to the child\'s level.'
      },
      {
        id: 5,
        title: 'Track Progress',
        description: 'Regular feedback, worksheets, and assessments.'
      },
      {
        id: 6,
        title: 'Confident Kids',
        description: 'Improve communication skills for school and everyday life.'
      }
    ],
    courseDetails: {
      sessionCount: '15 Live 1:1 Sessions',
      sessionDuration: '30 Minutes per Session',
      targetAudience: 'Designed for children in Class 3–7 & 8–12.',
      blendedStructure: 'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet.',
      attention: 'Personalised attention without crowding or comparison.',
      activities: 'Engaging games, role-play, and storytelling designed to spark child curiosity.'
    },
    learningBenefits: [
      'Build unshakeable speaking confidence in school recitations and classroom discussions',
      'Eliminate hesitation, shyness, and comparison with dedicated 1:1 mentor attention',
      'Paced specifically according to the child\'s understanding level with regular progress assessments',
      'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet'
    ],
    highlights: [
      '15 Live 1:1 Sessions: 30 minutes each with dedicated child trainer',
      'Designed for children in Class 3–7 & 8–12',
      'Blended 30-min structure: Concept + Speaking Activity + Worksheet',
      'Regular feedback, progress reports, and engaging role-play'
    ],
    curriculumPillars: [
      { title: 'Interactive Speaking & Role-Play', desc: 'Conversational icebreakers, storytelling, describing hobbies, and cartoon-based dialogues.' },
      { title: 'Concept Understanding', desc: 'Everyday vocabulary, school grammar essentials, sentence structuring without rote memorization.' },
      { title: 'Fun Worksheets & Games', desc: 'Word puzzles, matching exercises, and reading aloud with rhythm and correct pronunciation.' },
      { title: 'Continuous Progress Tracking', desc: 'Regular feedback sharing with parents, milestone check-ins, and confidence assessment.' }
    ],
    faqs: [
      {
        question: 'What age group or classes is Little Mirrors designed for?',
        answer: 'Little Mirrors is specially designed for children in Class 3–7 & 8–12.'
      },
      {
        question: 'How is each 30-minute class conducted?',
        answer: 'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet in a warm 1:1 environment.'
      },
      {
        question: 'Are classes one-to-one or in groups?',
        answer: 'All Little Mirrors sessions are strictly 1:1 live sessions to guarantee personalised attention without crowding or comparison.'
      }
    ],
    displayOrder: 2,
    isActive: true,
    isPartner: true,
    badge: 'KIDS 1:1 TRACK',
    seoTitle: 'Little Mirrors | 1:1 English Fluency for Kids (Class 3–7 & 8–12) | English Mirror',
    seoDescription: 'Fun learning today, confident communicators tomorrow. Little Mirrors offers 15 live 1:1 English sessions (30 mins each) for kids in Class 3–7 & 8–12.',
    metaKeywords: ['Little Mirrors', 'English fluency for kids', '1 on 1 kids English', 'spoken English for children', 'English Mirror']
  },
  {
    id: 'cat-corporate-english-fluency-builder',
    slug: 'corporate-english-fluency-builder',
    name: 'Corporate English Fluency Builder',
    title: 'Corporate English Fluency Builder',
    subtitle: 'Live Coaching | Video Lessons | Daily Practice',
    description: 'Your Complete Path to Confident English Communication',
    supportingText: 'Live Coaching | Video Lessons | Daily Practice',
    highlightText: 'Mirror your success with fluent English',
    parentId: 'cat-spoken-tutorial',
    parentSlug: 'spoken-tutorial',
    icon: 'briefcase',
    heroImage: '/images/spoken-tutorial/corporate-english.jpg',
    heroBadge: 'Corporate English Track',
    learningFormat: 'Live 1:1 coaching + self-paced learning',
    keyHighlights: [
      '15 Live 1:1 Google Meet Sessions',
      '15 HD Vocabulary Masterclasses',
      '100+ Corporate Vocabulary Words',
      '15 E-Books + WhatsApp Doubt Support'
    ],
    features: [
      {
        id: 1,
        featureNumber: '01',
        title: '15 Live 1:1 Google Meet Sessions',
        description: '30 min individual practice with an expert.'
      },
      {
        id: 2,
        featureNumber: '02',
        title: '15 HD Vocabulary Classes',
        description: 'Lifetime premium access.'
      },
      {
        id: 3,
        featureNumber: '03',
        title: '100+ Vocabulary Words',
        description: 'Intermediate to advanced level.'
      },
      {
        id: 4,
        featureNumber: '04',
        title: '15 E-Books + WhatsApp Support',
        description: 'Doubt clarification & JAM activities.'
      }
    ],
    courseDetails: {
      format: 'Live one-to-one coaching combined with self-paced learning.',
      coaching: 'Individual coaching with certified senior corporate communication trainers.',
      vocabulary: 'Vocabulary improvement covering 100+ intermediate-to-advanced corporate words.',
      practice: 'Daily practice drills, Just-A-Minute (JAM) activities, and speaking habit development.',
      support: 'Continuous WhatsApp support for doubt clarification and prompt guidance.',
      lessons: '15 HD Vocabulary Masterclasses accessible for continued self-paced revision.',
      highlight: 'Mirror your success with fluent English.'
    },
    learningBenefits: [
      'Deliver persuasive workplace presentations, client pitches, and team updates',
      'Master 100+ high-impact corporate vocabulary words and business phrases',
      'Eliminate hesitation during executive discussions, board meetings, and calls',
      'Personalised 1:1 Google Meet practice with immediate trainer feedback and actionable improvement notes'
    ],
    highlights: [
      '15 Live 1:1 Google Meet Sessions: 30 minutes each with corporate coach',
      '15 HD Vocabulary Classes for continued self-paced mastery',
      '100+ Intermediate-to-Advanced business vocabulary words',
      '15 E-Books + WhatsApp doubt support and JAM activities'
    ],
    curriculumPillars: [
      { title: 'Meeting Poise & Communication', desc: 'Expressing viewpoints concisely, facilitating discussions, and articulating complex technical or business ideas.' },
      { title: 'Executive Vocabulary & Phrasing', desc: 'Tactful disagreement, negotiation language, assertive communication, and professional email phrasing.' },
      { title: 'Presentation & Pitch Delivery', desc: 'Slide storytelling, vocal modulation, handling impromptu client queries, and managing presentation pacing.' },
      { title: 'JAM Activities & Workbooks', desc: '15 downloadable business E-Books, spontaneous JAM speaking challenges, and ongoing mentor support.' }
    ],
    faqs: [
      {
        question: 'Who is Corporate English Fluency Builder designed for?',
        answer: 'It is tailored for working professionals, team leads, software engineers, managers, and executives aiming for confident communication in international and corporate workplaces.'
      },
      {
        question: 'What is the learning format?',
        answer: 'Live one-to-one coaching combined with self-paced learning: 15 live Google Meet sessions (30 mins each), 15 HD video masterclasses, 15 E-Books, and WhatsApp support.'
      },
      {
        question: 'Can session timings be adjusted around work schedules?',
        answer: 'Yes! Flexible evening and morning session slots are available to accommodate full-time working schedules.'
      }
    ],
    displayOrder: 3,
    isActive: true,
    isPartner: true,
    badge: 'CORPORATE TRACK',
    seoTitle: 'Corporate English Fluency Builder | 1:1 Executive Coaching | English Mirror',
    seoDescription: 'Your Complete Path to Confident English Communication. 15 live 1:1 Google Meet sessions, 15 HD vocabulary classes, and 100+ business words.',
    metaKeywords: ['Corporate English Fluency Builder', 'business English course', '1 on 1 corporate coaching', 'workplace communication', 'English Mirror']
  },
  {
    id: 'cat-ielts-intensive',
    slug: 'ielts-intensive',
    name: 'IELTS Intensive',
    title: 'IELTS Intensive',
    subtitle: '1:1 Crash Training',
    description: 'Your Fast Track to a Higher Band Score. Personalized coaching on Google Meet to help you achieve your target band score with complete preparation across Speaking, Reading, Writing, and Listening.',
    supportingText: '1:1 Crash Training',
    parentId: 'cat-spoken-tutorial',
    parentSlug: 'spoken-tutorial',
    icon: 'award',
    heroImage: '/images/spoken-tutorial/ielts-intensive.jpg',
    heroBadge: '1:1 Crash Training',
    learningFormat: '15 Live 1:1 Google Meet Sessions (30 mins per session)',
    keyHighlights: [
      '15 Live 1:1 Sessions',
      '30 Minutes per Session',
      'Speaking, Reading, Writing & Listening',
      'Deep Dive Assessment'
    ],
    features: [
      {
        id: 1,
        featureNumber: '01',
        title: '1:1 Live Sessions',
        description: 'Personalized coaching on Google Meet.'
      },
      {
        id: 2,
        featureNumber: '02',
        title: 'Complete IELTS Preparation',
        description: 'Speaking, Reading, Writing & Listening.'
      },
      {
        id: 3,
        featureNumber: '03',
        title: 'Deep Dive Assessment',
        description: 'Identify strengths and focus areas.'
      },
      {
        id: 4,
        featureNumber: '04',
        title: 'Targeted Practice',
        description: 'Strategies, tips and feedback.'
      },
      {
        id: 5,
        featureNumber: '05',
        title: 'Higher Band Score',
        description: 'Guidance to help you achieve your target score.'
      }
    ],
    courseDetails: {
      sessions: '15 Live 1:1 Google Meet Sessions',
      duration: '30 minutes per session, focused on academic or general training needs.',
      assessment: 'Assessment covering Speaking, Reading, Writing, and Listening.',
      sessionSummary: '15 Live Sessions | 30 Minutes Each',
      highlight: 'Start Your IELTS Journey Today!'
    },
    batchTimings: [
      {
        batch: 'BATCH 1',
        name: 'BATCH 1',
        days: 'Monday / Wednesday / Friday',
        flexible: true,
        label: 'BATCH 1'
      },
      {
        batch: 'BATCH 2',
        name: 'BATCH 2',
        days: 'Tuesday / Thursday / Saturday',
        flexible: true,
        label: 'BATCH 2'
      }
    ],
    learningBenefits: [
      'Expert Guidance',
      'Personalized Feedback',
      'Flexible Batches',
      'Track Your Progress'
    ],
    highlights: [
      '15 Live 1:1 Google Meet Sessions (30 mins per session)',
      'Complete IELTS coverage: Speaking, Reading, Writing, and Listening',
      'Deep Dive Assessment to identify strengths and improvement areas',
      'Flexible Batches: Mon/Wed/Fri or Tue/Thu/Sat'
    ],
    curriculumPillars: [
      { title: 'Speaking Mastery (Parts 1, 2 & 3)', desc: 'Fluency, coherence, lexical resources, cue card 1-minute planning, and mock interview drills.' },
      { title: 'Writing Task 1 & Task 2 Breakdown', desc: 'Academic graphs/letters, essay structure, argumentation, cohesion, and vocabulary range.' },
      { title: 'Reading Tactics & Time Management', desc: 'Skimming, scanning, True/False/Not Given strategies, and tackling complex texts under time limits.' },
      { title: 'Listening Comprehension & Traps', desc: 'Distractor identification, multiple accents, note completion, and spelling precision.' }
    ],
    faqs: [
      {
        question: 'Is this crash training suitable for Academic or General Training candidates?',
        answer: 'Yes! IELTS Intensive caters to both Academic (university admissions) and General Training (immigration/work visa) candidates.'
      },
      {
        question: 'What batch timings are available?',
        answer: 'We provide two convenient batch schedules: Batch 1 (Monday / Wednesday / Friday) and Batch 2 (Tuesday / Thursday / Saturday), with flexible slot allocation.'
      },
      {
        question: 'How do the mock speaking evaluations work?',
        answer: 'During live 1:1 Google Meet sessions, your mentor conducts simulated speaking interviews and provides immediate rubric scores and targeted feedback.'
      }
    ],
    displayOrder: 4,
    isActive: true,
    isPartner: true,
    badge: 'IELTS CRASH TRACK',
    seoTitle: 'IELTS Intensive | 1:1 Crash Training & Band Score Coaching | English Mirror',
    seoDescription: 'Your Fast Track to a Higher Band Score. 15 live 1:1 sessions covering Speaking, Reading, Writing, and Listening with deep dive assessment. Start your IELTS journey today!',
    metaKeywords: ['IELTS Intensive', '1 on 1 IELTS training', 'IELTS crash course', 'IELTS band score', 'English Mirror']
  },
  {
    id: 'cat-executive-interview-prep-track',
    slug: 'executive-interview-preparation-track',
    name: 'Executive Interview Preparation Track',
    title: '1:1 Executive Interview Preparation Track',
    subtitle: 'Crack Interviews with Confidence',
    description: 'Personalized coaching to help you succeed in job interviews, career growth, and professional opportunities.',
    supportingText: 'Be Interview Ready!',
    parentId: 'cat-spoken-tutorial',
    parentSlug: 'spoken-tutorial',
    icon: 'user-check',
    heroImage: '/images/spoken-tutorial/executive-interview.jpg',
    heroBadge: 'Executive Interview Track',
    learningFormat: '12 Live 1:1 Sessions (Google Meet) \u2022 30 Minutes per Live Session',
    keyHighlights: [
      '12 Live 1:1 Sessions',
      '30 Minutes per Live Session',
      'Mock interview practice (HR + Technical)',
      'Personalized feedback and improvement plan'
    ],
    features: [
      {
        id: 1,
        featureNumber: '01',
        title: '12 Live 1:1 Sessions',
        description: 'Personalized coaching on Google Meet.'
      },
      {
        id: 2,
        featureNumber: '02',
        title: 'Mock Interviews',
        description: 'Practice with real interview questions and feedback.'
      },
      {
        id: 3,
        featureNumber: '03',
        title: 'Resume & Self-Introduction',
        description: 'Learn to present yourself effectively.'
      },
      {
        id: 4,
        featureNumber: '04',
        title: 'Answer Strategy & Communication',
        description: 'Structure your answers with clarity and confidence.'
      },
      {
        id: 5,
        featureNumber: '05',
        title: 'Industry-Specific Preparation',
        description: 'Tailored guidance based on your domain and goals.'
      }
    ],
    courseDetails: {
      sessions: '12 Live 1:1 Sessions (Google Meet)',
      duration: '30 Minutes per Live Session',
      feedback: 'Personalized feedback and improvement plan',
      mockInterviews: 'Mock interview practice (HR + Technical)',
      resumeBuilding: 'Resume building and self-introduction training',
      etiquette: 'Body language, confidence & professional etiquette',
      tips: 'Tips and strategies to answer commonly asked questions',
      highlight: 'Start Your Interview Preparation Today!'
    },
    batchTimings: [
      {
        batch: 'Batch 1',
        days: 'Monday / Wednesday / Friday',
        flexible: true,
        label: 'Batch 1'
      },
      {
        batch: 'Batch 2',
        days: 'Tuesday / Thursday / Saturday',
        flexible: true,
        label: 'Batch 2'
      }
    ],
    learningBenefits: [
      'Career Growth',
      'Build Confidence',
      'Professional Success',
      'Personalized Guidance'
    ],
    highlights: [
      '12 Live 1:1 Sessions (30 mins per session on Google Meet)',
      'Mock interview practice for HR and technical rounds',
      'Resume building and self-introduction training',
      'Personalised feedback and improvement plan tailored to your industry'
    ],
    curriculumPillars: [
      { title: 'STAR Answer Strategy & Framing', desc: 'Structuring behavioral, situational, and competency answers clearly without hesitation.' },
      { title: 'Mock Interviews with Feedback', desc: 'Realistic interview simulations for HR and managerial rounds with instant constructive feedback.' },
      { title: 'Self-Introduction & Elevator Pitch', desc: 'Crafting unforgettable "Tell me about yourself" narratives that immediately command respect.' },
      { title: 'Body Language & Etiquette', desc: 'Eye contact on camera, posture, tone modulation, eliminating filler words, and professional follow-ups.' }
    ],
    faqs: [
      {
        question: 'What types of interviews does this track prepare me for?',
        answer: 'The program covers both HR behavioral rounds and role-specific technical/managerial interviews tailored to your industry.'
      },
      {
        question: 'Are batch timings flexible for employed candidates?',
        answer: 'Yes! Batch 1 (Mon/Wed/Fri) and Batch 2 (Tue/Thu/Sat) are flexible and can be scheduled to suit working hours.'
      },
      {
        question: 'Do mentors review my actual resume during the program?',
        answer: 'Yes! Your coach provides direct feedback and guidance on your resume, LinkedIn profile, and self-introduction narrative.'
      }
    ],
    displayOrder: 5,
    isActive: true,
    isPartner: true,
    badge: 'INTERVIEW PREP TRACK',
    seoTitle: 'Executive Interview Preparation Track | 1:1 Mock Interviews | English Mirror',
    seoDescription: 'Crack Interviews with Confidence. 12 live 1:1 sessions, HR and technical mock interviews, resume building, and answer strategy. Start your interview preparation today!',
    metaKeywords: ['Executive Interview Preparation Track', '1 on 1 mock interview', 'crack job interview', 'interview coaching', 'English Mirror']
  },
  {
    id: 'cat-cybersecurity',
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    title: 'Professional Cybersecurity & Ethical Hacking Track',
    description: 'Defend networks, analyze vulnerabilities, master penetration testing, and protect cloud infrastructure with hands-on offensive and defensive cybersecurity labs.',
    subtitle: 'Defend networks, analyze vulnerabilities, master penetration testing, and protect cloud infrastructure with hands-on offensive and defensive cybersecurity labs.',
    icon: 'shield',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    heroBadge: 'Offensive & Defensive Security Track',
    highlights: [
      'Network defense, Wireshark packet analysis, and firewall configuration',
      'Ethical hacking, OWASP Top 10 vulnerabilities, and Metasploit penetration testing',
      'Cloud security architecture for AWS & Azure environments',
      'Incident response, SOC analyst operations, and threat hunting workflows'
    ],
    curriculumPillars: [
      { title: 'Network Fundamentals & Linux Security', desc: 'TCP/IP protocols, routing security, Linux system hardening, and terminal penetration tools.' },
      { title: 'Ethical Hacking & Vulnerability Assessment', desc: 'Port scanning with Nmap, web application exploitation, Burp Suite, and SQL injection.' },
      { title: 'Cloud Security & DevSecOps', desc: 'IAM policies, container security, CI/CD pipeline scanning, and compliance frameworks.' },
      { title: 'SOC Operations & Threat Intelligence', desc: 'SIEM log monitoring, malware analysis basics, incident triage, and digital forensics.' }
    ],
    faqs: [
      {
        question: 'Do I get hands-on lab access for penetration testing?',
        answer: 'Yes! Every student gets dedicated virtual lab access pre-configured with Kali Linux, target machines, and vulnerability scanners.'
      }
    ],
    displayOrder: 7,
    isActive: true,
    isPartner: false,
    seoTitle: 'Cybersecurity & Ethical Hacking Course | Edqoo',
    seoDescription: 'Master ethical hacking, penetration testing, network defense, and SOC operations with Edqoo practical cybersecurity track.',
    metaKeywords: ['cybersecurity course', 'ethical hacking training', 'network security', 'penetration testing', 'SOC analyst']
  }
];

export async function seedCategories(pool: Pool | null, mockStore: any): Promise<void> {
  if (pool) {
    try {
      for (const cat of INITIAL_CATEGORIES) {
        const checkRes = await pool.query('SELECT id FROM categories WHERE id = $1 OR slug = $2', [cat.id, cat.slug]);
        if (checkRes.rows.length === 0) {
          await pool.query(
            `INSERT INTO categories (
              id, slug, name, title, description, subtitle, icon,
              hero_image, hero_badge, highlights, curriculum_pillars, faqs,
              display_order, is_active, is_partner, badge, seo_title, seo_description, meta_keywords,
              parent_id, parent_slug, features, course_details, key_highlights,
              learning_benefits, batch_timings, learning_format, supporting_text,
              created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10::jsonb, $11::jsonb, $12::jsonb,
              $13, $14, $15, $16, $17, $18, $19::jsonb,
              $20, $21, $22::jsonb, $23::jsonb, $24::jsonb,
              $25::jsonb, $26::jsonb, $27, $28,
              NOW(), NOW()
            )`,
            [
              cat.id,
              cat.slug,
              cat.name,
              cat.title,
              cat.description,
              cat.subtitle,
              cat.icon,
              cat.heroImage,
              cat.heroBadge,
              JSON.stringify(cat.highlights || []),
              JSON.stringify(cat.curriculumPillars || []),
              JSON.stringify(cat.faqs || []),
              cat.displayOrder,
              cat.isActive,
              cat.isPartner,
              cat.badge || null,
              cat.seoTitle,
              cat.seoDescription,
              JSON.stringify(cat.metaKeywords || []),
              cat.parentId || null,
              cat.parentSlug || null,
              JSON.stringify(cat.features || []),
              JSON.stringify(cat.courseDetails || {}),
              JSON.stringify(cat.keyHighlights || []),
              JSON.stringify(cat.learningBenefits || []),
              JSON.stringify(cat.batchTimings || []),
              cat.learningFormat || null,
              cat.supportingText || null
            ]
          );
          console.log(`✅ [DB SEED] Seeded category: ${cat.name} (${cat.slug})`);
        } else {
          await pool.query(
            `UPDATE categories SET
              name = $1, title = $2, description = $3, subtitle = $4, icon = $5,
              hero_image = $6, hero_badge = $7, highlights = $8::jsonb, curriculum_pillars = $9::jsonb,
              faqs = $10::jsonb, display_order = $11, is_active = $12, is_partner = $13, badge = $14,
              seo_title = $15, seo_description = $16, meta_keywords = $17::jsonb,
              parent_id = $18, parent_slug = $19, features = $20::jsonb, course_details = $21::jsonb,
              key_highlights = $22::jsonb, learning_benefits = $23::jsonb, batch_timings = $24::jsonb,
              learning_format = $25, supporting_text = $26, updated_at = NOW()
            WHERE id = $27 OR slug = $28`,
            [
              cat.name,
              cat.title,
              cat.description,
              cat.subtitle,
              cat.icon,
              cat.heroImage,
              cat.heroBadge,
              JSON.stringify(cat.highlights || []),
              JSON.stringify(cat.curriculumPillars || []),
              JSON.stringify(cat.faqs || []),
              cat.displayOrder,
              cat.isActive,
              cat.isPartner,
              cat.badge || null,
              cat.seoTitle,
              cat.seoDescription,
              JSON.stringify(cat.metaKeywords || []),
              cat.parentId || null,
              cat.parentSlug || null,
              JSON.stringify(cat.features || []),
              JSON.stringify(cat.courseDetails || {}),
              JSON.stringify(cat.keyHighlights || []),
              JSON.stringify(cat.learningBenefits || []),
              JSON.stringify(cat.batchTimings || []),
              cat.learningFormat || null,
              cat.supportingText || null,
              cat.id,
              cat.slug
            ]
          );
        }
      }
    } catch (err: any) {
      console.warn('⚠️ [DB SEED] Notice on seeding categories:', err.message);
    }
  }

  // Populate mockStore.categories
  if (mockStore) {
    if (!Array.isArray(mockStore.categories)) {
      mockStore.categories = [];
    }
    for (const cat of INITIAL_CATEGORIES) {
      const existsIndex = mockStore.categories.findIndex((c: any) => c.id === cat.id || c.slug === cat.slug);
      if (existsIndex === -1) {
        mockStore.categories.push({
          ...cat,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      } else {
        mockStore.categories[existsIndex] = {
          ...mockStore.categories[existsIndex],
          ...cat,
          updatedAt: Date.now()
        };
      }
    }
  }
}
