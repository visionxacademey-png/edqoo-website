export interface PricingTier {
  durationMonths: number;
  label: string;
  price: number;
  priceFormatted: string;
  savingsNote?: string;
  isRecommended?: boolean;
}

export interface EnglishMirrorPlanOption {
  id: string;
  optionName: string;
  headline: string;
  durationPerSession: string;
  monthlyPrice: number;
  monthlyPriceFormatted: string;
  pricingTiers?: PricingTier[];
  schedule: string[];
  sessionCount: string;
  benefits: string[];
  discrepancyNote?: string;
}

export interface EnglishMirrorProgram {
  id: string;
  slug: string;
  title: string;
  badge: string;
  category: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  priceFormatted: string;
  pricingType: 'monthly_subscription' | 'fixed_program' | 'one_time_purchase';
  duration: string;
  format: '1-to-1 Google Meet' | 'Telephonic Voice Calling' | 'Self-Paced Video & E-PDFs' | 'Handbook / Digital Blueprint' | 'Executive 1:1 Coaching';
  targetAudience: string;
  schedule?: string;
  highlights: string[];
  benefits: string[];
  options?: EnglishMirrorPlanOption[];
  curriculumTopics?: string[];
  certificateIncluded: boolean;
  certificateCriteria?: string;
  partner: 'English Mirror';
  featured: boolean;
  status: 'active';
  accentGradient: string;
  iconName: string;
  image?: string;
}

export const englishMirrorPrograms: EnglishMirrorProgram[] = [
  {
    id: 'em-101',
    slug: '1-to-1-live-spoken-english',
    title: '1:1 Communicative English Mastery',
    badge: 'Flagship Live Program',
    category: 'Live Spoken English',
    image: '/images/spoken-tutorial/communicative-english.jpg',
    tagline: 'Live Coaching | Video Lessons | Daily Practice',
    shortDescription: 'Your Complete Path to Confident English Communication',
    fullDescription: 'Experience individualized English speaking training delivered live over Google Meet. Every session is completely dedicated to your speaking practice, complemented by HD vocabulary masterclasses, Just-A-Minute (JAM) drills, and weekly workbooks.',
    price: 3999,
    priceFormatted: '₹3,999 / Month',
    pricingType: 'monthly_subscription',
    duration: 'Flexible (1 to 12 Months)',
    format: '1-to-1 Google Meet',
    targetAudience: 'College Students, Job Seekers, Working Professionals & Beginners wanting fluent conversational English',
    schedule: 'Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday',
    highlights: [
      '15 Live 1-to-1 Google Meet sessions per month',
      'Dedicated individual speaking practice',
      '15 HD Vocabulary Classes with lifetime access',
      '100+ Intermediate to Advanced Vocabulary words',
      '15 Educational Workbooks & JAM activities'
    ],
    benefits: [
      '15 Live 1-1 Google Meet sessions every month',
      'Dedicated individual speaking practice in every session',
      '15 HD Recorded Vocabulary Classes',
      'Lifetime premium access to all class materials',
      '100+ intermediate to advanced vocabulary words',
      '15 educational workbooks with actionable exercises',
      'Continuous WhatsApp doubt clarification support',
      'Just-a-Minute (JAM) fluency building activities',
      'Flexible subscription terms (1, 2, 3, 6, 9, 12 Months)',
      'Professional Course Completion Certificate for subscriptions of 3 months and above'
    ],
    options: [
      {
        id: 'pro-opt-a',
        optionName: 'PRO OPTION A',
        headline: '30 Mins Live 1-1 Practice',
        durationPerSession: '30 Minutes per session',
        monthlyPrice: 3999,
        monthlyPriceFormatted: '₹3,999 / Month',
        schedule: ['Batch A: Monday / Wednesday / Friday', 'Batch B: Tuesday / Thursday / Saturday'],
        sessionCount: '15 Live 1-1 Google Meet sessions / month',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month', price: 3999, priceFormatted: '₹3,999' },
          { durationMonths: 2, label: '2 Months', price: 6999, priceFormatted: '₹6,999', savingsNote: 'Save ₹999' },
          { durationMonths: 3, label: '3 Months', price: 10999, priceFormatted: '₹10,999', isRecommended: true, savingsNote: 'Certificate Included' },
          { durationMonths: 6, label: '6 Months', price: 21999, priceFormatted: '₹21,999', savingsNote: 'Save ₹1,995' },
          { durationMonths: 9, label: '9 Months', price: 31999, priceFormatted: '₹31,999', savingsNote: 'Save ₹3,992' },
          { durationMonths: 12, label: '12 Months', price: 41999, priceFormatted: '₹41,999', savingsNote: 'Maximum Value' }
        ],
        benefits: [
          '15 Live 1-1 Google Meet sessions',
          '30-minute dedicated individual speaking practice',
          '15 HD Vocabulary Classes',
          'Lifetime premium access',
          '100+ intermediate to advanced vocabulary words',
          '15 educational workbooks',
          'WhatsApp doubt clarification',
          'Just-a-Minute (JAM) activities',
          'Flexible subscription terms',
          'Professional course completion certificate for 3+ months'
        ]
      },
      {
        id: 'pro-opt-b',
        optionName: 'PRO OPTION B',
        headline: '45 Mins Daily 1-1 Practice',
        durationPerSession: '45 Mins (Catalogue Specification)',
        monthlyPrice: 5499,
        monthlyPriceFormatted: '₹5,499 / Month',
        schedule: ['Batch 1 – Monday / Wednesday / Friday', 'Batch 2 – Tuesday / Thursday / Saturday'],
        sessionCount: 'Live 1-1 Google Meet sessions',
        discrepancyNote: 'Catalogue Notice: Program title specifies 45 Mins Practice, while source bullet notes 30 Minutes dedicated individual speaking practice. Flagged for partner confirmation.',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month', price: 5499, priceFormatted: '₹5,499' },
          { durationMonths: 2, label: '2 Months', price: 9999, priceFormatted: '₹9,999', savingsNote: 'Save ₹999' },
          { durationMonths: 3, label: '3 Months', price: 13999, priceFormatted: '₹13,999', isRecommended: true, savingsNote: 'Certificate Included' },
          { durationMonths: 6, label: '6 Months', price: 28999, priceFormatted: '₹28,999', savingsNote: 'Save ₹3,995' },
          { durationMonths: 9, label: '9 Months', price: 38999, priceFormatted: '₹38,999', savingsNote: 'Save ₹10,492' },
          { durationMonths: 12, label: '12 Months', price: 51999, priceFormatted: '₹51,999', savingsNote: 'Maximum Value' }
        ],
        benefits: [
          'Batch 1 – Monday / Wednesday / Friday OR Batch 2 – Tuesday / Thursday / Saturday',
          'Live 1-1 Google Meet sessions with certified fluency mentor',
          'HD Vocabulary Classes with extended vocabulary drills',
          '200+ intermediate to advanced vocabulary words',
          'Educational workbooks & guided daily speaking prompts',
          'WhatsApp support & continuous feedback',
          'JAM (Just-a-Minute) activities',
          'Flexible terms',
          'Professional certification for subscriptions of 3 months and above'
        ]
      }
    ],
    curriculumTopics: [
      'Eliminating Spoken Hesitation & Building Instant Response Habit',
      'Everyday Idiomatic English & Natural Conversational Flow',
      'Workplace & Social Discussion Fluency',
      'Grammar in Real-Time Speech (Without Overthinking Rules)',
      'JAM Drills, Impromptu Speaking & Articulation Drills'
    ],
    certificateIncluded: true,
    certificateCriteria: 'Awarded for subscriptions of 3 months and above upon completion of live sessions and evaluations.',
    partner: 'English Mirror',
    featured: true,
    status: 'active',
    accentGradient: 'from-purple-600 via-indigo-600 to-purple-800',
    iconName: 'Video'
  },
  {
    id: 'em-102',
    slug: 'standard-plan-telephonic-sessions',
    title: 'Fluency Builder Plan',
    badge: 'Telephonic Sessions',
    category: 'Telephonic English',
    image: '/images/spoken-tutorial/fluency-builder-plan.jpg',
    tagline: 'Voice Calls | Recorded Lessons | Daily Practice',
    shortDescription: 'Your Complete Path to Confident English Communication',
    fullDescription: 'Your Complete Path to Confident English Communication. Daily 15-minute 1-1 voice calls with an expert trainer.',
    price: 2500,
    priceFormatted: '₹2,500 / Month',
    pricingType: 'monthly_subscription',
    duration: 'Flexible (1 to 12 Months)',
    format: 'Telephonic Voice Calling',
    targetAudience: 'Working Professionals, Commuters, Homemakers & Learners on the go',
    schedule: 'Daily direct 1-to-1 phone calling sessions (Monday to Saturday)',
    highlights: [
      'Daily 1-to-1 direct voice phone call session',
      '25 phone call sessions per month',
      '25 Recorded HD Grammar Classes + 25 Vocabulary Classes',
      '50 Educational E-PDFs & Lifetime Access',
      'Daily JAM updates & WhatsApp doubt clarification'
    ],
    benefits: [
      'Daily 1-to-1 voice calling practice with personal trainer',
      'Dedicated phone call session per day (15 min or 30 min options)',
      '25 phone call sessions per month',
      '25 Recorded HD Grammar Classes',
      '25 Vocabulary Classes',
      'Lifetime access to all video lessons and resources',
      '50 Educational E-PDFs and practice worksheets',
      'WhatsApp doubt clarification support',
      'Daily JAM updates',
      'Professional Certification for course tenures of 3 months and above'
    ],
    options: [
      {
        id: 'std-opt-a',
        optionName: 'OPTION A',
        headline: '15 Mins Daily Voice Practice',
        durationPerSession: '15 Minutes phone call session',
        monthlyPrice: 2500,
        monthlyPriceFormatted: '₹2,500 / Month',
        schedule: ['Daily 1-to-1 voice calling', '25 phone call sessions / month'],
        sessionCount: '25 phone call sessions per month',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month', price: 2500, priceFormatted: '₹2,500' },
          { durationMonths: 2, label: '2 Months', price: 4799, priceFormatted: '₹4,799', savingsNote: 'Save ₹201' },
          { durationMonths: 3, label: '3 Months', price: 6999, priceFormatted: '₹6,999', isRecommended: true, savingsNote: 'Certificate Included' },
          { durationMonths: 6, label: '6 Months', price: 13999, priceFormatted: '₹13,999', savingsNote: 'Save ₹1,001' },
          { durationMonths: 9, label: '9 Months', price: 18999, priceFormatted: '₹18,999', savingsNote: 'Save ₹3,501' },
          { durationMonths: 12, label: '12 Months', price: 24999, priceFormatted: '₹24,999', savingsNote: 'Best Annual Rate' }
        ],
        benefits: [
          'Daily 1-to-1 voice calling',
          '15-minute phone call session',
          '25 phone call sessions',
          '25 Recorded HD Grammar Classes',
          '25 Vocabulary Classes',
          'Lifetime access',
          '50 Educational E-PDFs',
          'WhatsApp doubt clarification',
          'Daily JAM updates',
          'Certification for course tenures of 3 months and above'
        ]
      },
      {
        id: 'std-opt-b',
        optionName: 'OPTION B',
        headline: '30 Mins Daily Voice Practice',
        durationPerSession: '30 Minutes phone call session',
        monthlyPrice: 4499,
        monthlyPriceFormatted: '₹4,499 / Month',
        schedule: ['Daily 1-to-1 voice calling', '25 phone call sessions / month'],
        sessionCount: '25 phone call sessions per month',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month', price: 4499, priceFormatted: '₹4,499' },
          { durationMonths: 2, label: '2 Months', price: 8499, priceFormatted: '₹8,499', savingsNote: 'Save ₹499' },
          { durationMonths: 3, label: '3 Months', price: 11999, priceFormatted: '₹11,999', isRecommended: true, savingsNote: 'Certificate Included' },
          { durationMonths: 6, label: '6 Months', price: 22999, priceFormatted: '₹22,999', savingsNote: 'Save ₹3,995' },
          { durationMonths: 9, label: '9 Months', price: 32999, priceFormatted: '₹32,999', savingsNote: 'Save ₹7,492' },
          { durationMonths: 12, label: '12 Months', price: 42999, priceFormatted: '₹42,999', savingsNote: 'Save ₹10,989' }
        ],
        benefits: [
          'All benefits from Standard framework',
          '30-minute direct 1-to-1 voice call speaking practice daily',
          '25 phone call sessions every month',
          '25 HD Grammar + 25 HD Vocabulary recorded classes',
          '50 Educational E-PDFs',
          'WhatsApp doubt resolution',
          'Certification for course tenures of 3 months and above'
        ]
      }
    ],
    certificateIncluded: true,
    certificateCriteria: 'Available for subscribers completing 3 months or more.',
    partner: 'English Mirror',
    featured: true,
    status: 'active',
    accentGradient: 'from-indigo-600 to-purple-800',
    iconName: 'Phone'
  },
  {
    id: 'em-105',
    slug: 'kids-1-to-1-english-fluency-program',
    title: 'Little Mirrors',
    badge: '1:1 English Fluency for Kids',
    category: 'Kids Fluency',
    image: '/images/spoken-tutorial/little-mirrors.jpg',
    tagline: '1:1 English Fluency for Kids',
    shortDescription: 'Fun learning today, confident communicators tomorrow.',
    fullDescription: 'Fun learning today, confident communicators tomorrow. Confidence first, fluency next — every child gets a trainer entirely to themselves.',
    price: 3999,
    priceFormatted: '₹3,999 / Month',
    pricingType: 'monthly_subscription',
    duration: 'Flexible (1 to 12 Months)',
    format: '1-to-1 Google Meet',
    targetAudience: 'School children (Class 3–7 & 8–12)',
    schedule: 'Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday',
    highlights: [
      '15 Live 1:1 sessions',
      '30 Mins per session',
      'Class 3–7 & 8–12'
    ],
    benefits: [
      'Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday scheduling',
      '15 Live 1-1 Google Meet sessions',
      '30-minute individual speaking practice',
      'Age-appropriate interaction & friendly guidance',
      'Conversational fluency & active storytelling',
      'Public presentation skills & school debate readiness',
      'School grammar accuracy reinforcement',
      'Natural pronunciation & clear articulation'
    ],
    options: [
      {
        id: 'kids-tier',
        optionName: 'Kids Fluency 1-1 Tier',
        headline: 'Class 3–7 & 8–12 Tracks',
        durationPerSession: '30 Minutes per session',
        monthlyPrice: 3999,
        monthlyPriceFormatted: '₹3,999 / Month',
        schedule: ['Mon / Wed / Fri OR Tue / Thu / Sat', '15 Live 1-1 Google Meet sessions'],
        sessionCount: '15 Live 1-1 Google Meet sessions / month',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month', price: 3999, priceFormatted: '₹3,999' },
          { durationMonths: 2, label: '2 Months', price: 6999, priceFormatted: '₹6,999', savingsNote: 'Save ₹999' },
          { durationMonths: 3, label: '3 Months', price: 10999, priceFormatted: '₹10,999', isRecommended: true, savingsNote: 'Certificate Included' },
          { durationMonths: 6, label: '6 Months', price: 21999, priceFormatted: '₹21,999', savingsNote: 'Save ₹1,995' },
          { durationMonths: 9, label: '9 Months', price: 31999, priceFormatted: '₹31,999', savingsNote: 'Save ₹3,992' },
          { durationMonths: 12, label: '12 Months', price: 41999, priceFormatted: '₹41,999', savingsNote: 'Best Academic Term' }
        ],
        benefits: [
          '15 Live 1-1 Google Meet sessions',
          '30-minute individual speaking practice',
          'Age-appropriate interaction',
          'Conversational fluency',
          'Public presentation skills',
          'School grammar accuracy',
          'Natural pronunciation',
          'Certificate for subscriptions of 3+ months'
        ]
      }
    ],
    certificateIncluded: true,
    certificateCriteria: 'Certificate awarded for subscriptions of 3 months and above.',
    partner: 'English Mirror',
    featured: true,
    status: 'active',
    accentGradient: 'from-purple-600 via-pink-600 to-indigo-700',
    iconName: 'Smile'
  },
  {
    id: 'em-106',
    slug: 'ielts-expert-training-modules',
    title: 'IELTS Expert Training Modules',
    badge: 'Target Band 7.5 – 8.5',
    category: 'IELTS Preparation',
    image: '/images/spoken-tutorial/ielts-intensive.jpg',
    tagline: 'Intensive 1:1 IELTS Preparation for Academic & General Training',
    shortDescription: 'Rigorous 1-to-1 coaching covering Speaking, Writing, Reading, and Listening with real-time criteria-specific essay reviews and targeted band score elevation strategies.',
    fullDescription: 'Achieve your required IELTS band score with targeted expert mentoring. Experience individualized 1-to-1 coaching across Speaking, Writing, Reading, and Listening modules with real-time criteria-specific essay reviews and band elevation strategies.',
    price: 4999,
    priceFormatted: '₹4,999 / Month',
    pricingType: 'monthly_subscription',
    duration: '1 to 2 Months Flexible',
    format: '1-to-1 Google Meet',
    targetAudience: 'Study Abroad Aspirants, PR Applicants & Healthcare / Technical Professionals seeking Band 7.5+',
    highlights: [
      'Academic and General Training parameter coverage',
      'Speaking, Reading, Writing, Listening modules',
      'Deep-dive assessment & individualized feedback',
      'Mock tests & criteria-specific essay reviews',
      'Targeted band score elevation strategies'
    ],
    benefits: [
      'Rigorous evaluation & individual error diagnosis',
      'Full coverage of Speaking, Reading, Writing & Listening',
      'Criteria-specific essay evaluations with Lexical Resource scoring',
      'Real-time mock interviews replicating official test standards',
      'Professional strategies and time-management techniques'
    ],
    options: [
      {
        id: 'ielts-crash',
        optionName: 'PROGRAM 1',
        headline: 'IELTS Intensive 1:1 Crash Training',
        durationPerSession: '30 Minutes focused session',
        monthlyPrice: 4999,
        monthlyPriceFormatted: '₹4,999 / Month',
        schedule: ['Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday'],
        sessionCount: '15 Live 1-1 Google Meet sessions / month',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month Intensive', price: 4999, priceFormatted: '₹4,999', isRecommended: true },
          { durationMonths: 2, label: '2 Months', price: 9499, priceFormatted: '₹9,499' }
        ],
        benefits: [
          'Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday',
          '15 Live 1-1 Google Meet sessions',
          '30-minute focused sessions',
          'Academic or General Training parameters',
          'Speaking module practice & instant assessment',
          'Reading comprehension tips & timed practice',
          'Writing Task 1 & Task 2 breakdown',
          'Listening drills & audio accent familiarity',
          'Deep-dive diagnostic assessment'
        ]
      }
    ],
    certificateIncluded: true,
    certificateCriteria: 'IELTS Training Course Completion Certificate provided.',
    partner: 'English Mirror',
    featured: true,
    status: 'active',
    accentGradient: 'from-purple-700 via-indigo-700 to-slate-900',
    iconName: 'Award'
  },
  {
    id: 'em-107',
    slug: 'elite-corporate-transformation-track',
    title: 'Corporate English Fluency Builder — Elite Corporate Transformation Track',
    badge: 'Executive & Professional Track',
    category: 'Corporate English',
    image: '/images/spoken-tutorial/corporate-english.jpg',
    tagline: 'Specially Built for Corporate Executives & Working Professionals',
    shortDescription: 'High-impact 1-to-1 training focused on workplace communication: professional pitch delivery, high-stakes presentations, negotiation vocabulary, formal emailing, and active boardroom listening.',
    fullDescription: 'Designed exclusively for corporate executives, managers, software engineers, and business leaders who need polished, authoritative English in executive environments. Sharpen your presentation poise, boardroom communication, and negotiation language.',
    price: 3999,
    priceFormatted: '₹3,999 / Month',
    pricingType: 'monthly_subscription',
    duration: 'Flexible (1 to 12 Months)',
    format: '1-to-1 Google Meet',
    targetAudience: 'Corporate Executives, Team Leads, Tech Professionals, Managers & Consultants',
    schedule: 'Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday (Flexible Executive Slots)',
    highlights: [
      '15 Live 1-1 Google Meet sessions / month (30 mins each)',
      'Professional pitch delivery & office presentations',
      'Negotiation vocabulary & formal corporate emailing',
      'Active boardroom listening & executive articulation',
      '15 HD Vocabulary Classes & 15 Educational Workbooks'
    ],
    benefits: [
      'Monday / Wednesday / Friday OR Tuesday / Thursday / Saturday',
      '15 Live 1-1 Google Meet sessions',
      '30-minute dedicated individual speaking practice',
      '15 HD Vocabulary Classes',
      '100+ intermediate to advanced business vocabulary words',
      '15 educational workbooks with practical business scenarios',
      'WhatsApp doubt clarification support',
      'JAM activities customized for corporate topics',
      'Flexible terms for working professionals',
      'Professional course completion certificate for subscriptions of 3 months and above',
      'Focus areas: Professional pitch delivery, high-impact office presentations, negotiation vocabulary, formal emailing, active boardroom listening'
    ],
    options: [
      {
        id: 'corp-tier',
        optionName: 'Corporate Transformation Track',
        headline: 'Elite Executive 1-to-1 Coaching',
        durationPerSession: '30 Minutes per session',
        monthlyPrice: 3999,
        monthlyPriceFormatted: '₹3,999 / Month',
        schedule: ['Mon / Wed / Fri OR Tue / Thu / Sat', '15 Live 1-1 Google Meet sessions'],
        sessionCount: '15 Live 1-1 Google Meet sessions / month',
        pricingTiers: [
          { durationMonths: 1, label: '1 Month', price: 3999, priceFormatted: '₹3,999' },
          { durationMonths: 2, label: '2 Months', price: 6999, priceFormatted: '₹6,999', savingsNote: 'Save ₹999' },
          { durationMonths: 3, label: '3 Months', price: 10999, priceFormatted: '₹10,999', isRecommended: true, savingsNote: 'Certificate Included' },
          { durationMonths: 6, label: '6 Months', price: 21999, priceFormatted: '₹21,999', savingsNote: 'Save ₹1,995' },
          { durationMonths: 9, label: '9 Months', price: 31999, priceFormatted: '₹31,999', savingsNote: 'Save ₹3,992' },
          { durationMonths: 12, label: '12 Months', price: 41999, priceFormatted: '₹41,999', savingsNote: 'Corporate Executive Pack' }
        ],
        benefits: [
          '15 Live 1-1 Google Meet sessions',
          '30-minute dedicated individual speaking practice',
          '15 HD Vocabulary Classes',
          '100+ intermediate to advanced vocabulary words',
          '15 educational workbooks',
          'Professional pitch delivery',
          'High-impact office presentations',
          'Negotiation vocabulary',
          'Formal emailing & active boardroom listening',
          'Certification for subscriptions of 3+ months'
        ]
      }
    ],
    curriculumTopics: [
      'Executive Presence & Authoritative Tone in Meetings',
      'High-Stakes Client Presentations & Pitching',
      'Persuasive Negotiation Phrasing & Counter-Proposals',
      'Clear, Concise Formal Business Emailing & Documentation',
      'Handling Tough Q&A & Boardroom Impromptu Discussion'
    ],
    certificateIncluded: true,
    certificateCriteria: 'Executive Certification awarded for subscriptions of 3 months and above.',
    partner: 'English Mirror',
    featured: true,
    status: 'active',
    accentGradient: 'from-purple-800 via-indigo-900 to-slate-950',
    iconName: 'Briefcase'
  },
  {
    id: 'em-108',
    slug: '1-to-1-executive-interview-preparation-track',
    title: '1:1 Executive Interview Preparation Track',
    badge: 'Targeted Interview Masterclass',
    category: 'Interview Preparation',
    image: '/images/spoken-tutorial/executive-interview.jpg',
    tagline: 'Intensive 1-to-1 Mock Interviews & Behavioral Strategy',
    shortDescription: 'Targeted 1-to-1 interview masterclass featuring custom behavioral questions, salary negotiation practice, corporate etiquette, and industry-targeted real-time mock interviews.',
    fullDescription: 'Eliminate interview anxiety and articulate your true career value. Work one-on-one with an expert interview coach through intensive simulated mock interviews, tailored answer frameworks for behavioral questions, and strategic salary negotiation phrasing.',
    price: 3999,
    priceFormatted: '₹3,999 / Program',
    pricingType: 'fixed_program',
    duration: 'Intensive Masterclass Track',
    format: 'Executive 1:1 Coaching',
    targetAudience: 'Job Candidates, Career Changers, Senior Developers, Managers & Leadership Candidates',
    schedule: '3 high-impact sessions per week (30 minutes each)',
    highlights: [
      '3 high-impact sessions per week (30 minutes each)',
      'Intensive 1-to-1 format tailored to your target job role',
      'Custom behavioral questions (STAR Framework) drills',
      'Salary negotiation practice & phrasing',
      'Industry-targeted real-time mock interviews with immediate metrics'
    ],
    benefits: [
      '3 high-impact sessions per week',
      '30 minutes each',
      'Intensive 1-to-1 format',
      'Custom behavioral questions formulated for your target company/role',
      'Salary negotiation practice & tactical phrasing',
      'Corporate etiquette & professional body language',
      'Industry-targeted real-time mock interviews',
      'Immediate diagnostic metrics and performance breakdown'
    ],
    certificateIncluded: true,
    certificateCriteria: 'Executive Interview Completion Credential provided upon program completion.',
    partner: 'English Mirror',
    featured: true,
    status: 'active',
    accentGradient: 'from-violet-700 via-purple-800 to-indigo-950',
    iconName: 'UserCheck'
  }
];

export interface EnglishMirrorFAQ {
  question: string;
  answer: string;
  category: 'General' | 'Sessions & Schedule' | 'Pricing & Plans' | 'Certification & Policies';
}

export const englishMirrorFAQs: EnglishMirrorFAQ[] = [
  {
    category: 'General',
    question: 'What is English Mirror, and how does it partner with Edqoo?',
    answer: 'English Mirror is a premier habit-based English communication company offering personalized 1-to-1 spoken English transformation tracks. Edqoo has partnered with English Mirror to provide learners with direct access to certified communication trainers alongside Edqoo’s technical masterclasses.'
  },
  {
    category: 'General',
    question: 'How is English Mirror different from generic English courses or group classes?',
    answer: 'Unlike group lectures where students rarely get more than 2 minutes to speak, English Mirror programs provide 100% dedicated 1-to-1 speaking time with a private trainer. Every session is active speaking practice, tailored feedback, and habit-building drills like JAM.'
  },
  {
    category: 'Sessions & Schedule',
    question: 'What schedule options are available for live Google Meet sessions?',
    answer: 'Live 1-to-1 Google Meet sessions are structured in flexible batches: Batch 1 (Monday / Wednesday / Friday) or Batch 2 (Tuesday / Thursday / Saturday). You can choose morning, afternoon, or evening time slots that match your daily routine.'
  },
  {
    category: 'Sessions & Schedule',
    question: 'What is the Standard Telephonic Plan?',
    answer: 'The Standard Plan conducts daily 1-to-1 speaking sessions over direct phone calls (15 mins or 30 mins, 25 sessions/month). It requires no video or laptop and is ideal for busy commuters and professionals on the go, plus includes 50 HD recorded grammar and vocabulary classes.'
  },
  {
    category: 'Pricing & Plans',
    question: 'Can I subscribe for multiple months to get discounted pricing?',
    answer: 'Yes! Subscriptions are available in 1 Month, 2 Months, 3 Months, 6 Months, 9 Months, and 12 Months. Longer plans provide substantial savings and include an official Course Completion Certificate.'
  },
  {
    category: 'Certification & Policies',
    question: 'When do I receive a Course Completion Certificate?',
    answer: 'Professional course completion certificates are awarded for all subscriptions of 3 months and above across 1-to-1 Communicative English Mastery, Standard Telephonic Plan, Kids Fluency, Corporate Track, and IELTS tracks upon completing the sessions.'
  },
  {
    category: 'Certification & Policies',
    question: 'What is the refund policy for English Mirror programs?',
    answer: 'In accordance with English Mirror’s official policy, refund requests may only be submitted before the learner’s first scheduled live session. Once the first live or telephonic session has commenced, subscriptions become non-refundable.'
  }
];

export interface PolicySection {
  id: string;
  title: string;
  content: string[];
}

export const englishMirrorPoliciesConfig = {
  version: '2026.1',
  lastUpdated: 'February 2026',
  partnerName: 'English Mirror',
  platformHost: 'Edqoo',
  supportPlaceholders: {
    whatsapp: '[Insert WhatsApp number]',
    email: '[Insert support email address]',
    hours: '[Insert support hours]',
    escalationContact: '[Insert escalation contact]'
  },
  sections: [
    {
      id: 'terms-and-conditions',
      title: '1. Terms & Conditions',
      content: [
        'Welcome to English Mirror, a partner learning experience hosted on Edqoo. By enrolling in or accessing any English Mirror spoken English program, masterclass, or learning resource, you agree to comply with these terms.',
        'English Mirror delivers specialized spoken English, corporate communication, IELTS preparation, and interview training programs.',
        'All course materials, HD videos, workbooks, and blueprints provided are proprietary educational assets licensed exclusively for your individual personal learning.'
      ]
    },
    {
      id: 'enrolment',
      title: '2. Enrolment & Learner Eligibility',
      content: [
        'Enrolment in any English Mirror course is confirmed upon completion of the admission form and verified fee payment.',
        'Learners must provide accurate contact details (Full Name, Phone Number, WhatsApp Number, and Email Address) to facilitate seamless trainer assignment and session scheduling.',
        'Age-specific programs such as the Kids 1:1 English Fluency Program require parent or guardian consent for learners below 18 years of age.'
      ]
    },
    {
      id: 'scheduling-and-attendance',
      title: '3. Scheduling & Attendance Policy',
      content: [
        'Live 1-to-1 sessions are conducted via Google Meet or telephonic voice calling according to your selected batch schedule (e.g., Monday/Wednesday/Friday or Tuesday/Thursday/Saturday).',
        'Learners are expected to join sessions on time. Session durations (15 mins, 30 mins, 45 mins, or 1 hour as per program) begin promptly at the scheduled time slot.',
        'If you need to reschedule an individual session, notice must be provided at least 6 hours in advance through the official support channel or designated trainer chat to permit schedule adjustment.'
      ]
    },
    {
      id: 'payments-and-subscriptions',
      title: '4. Payments & Subscriptions',
      content: [
        'Subscription programs (1, 2, 3, 6, 9, or 12 months) must be paid in full at the time of subscription activation.',
        'Multi-month plans are discounted packages intended for continuous learning and are billed upfront for the selected tenure.'
      ]
    },
    {
      id: 'refund-policy',
      title: '5. Refund Policy (Strict Terms)',
      content: [
        'Refund requests may be submitted ONLY prior to the learner’s first scheduled live or telephonic session.',
        'Once the first live session, telephonic call, or onboarding consultation has commenced, the subscription becomes strictly non-refundable and non-transferable.'
      ]
    },
    {
      id: 'code-of-conduct',
      title: '6. Code of Conduct & Academic Etiquette',
      content: [
        'Learners and trainers are expected to maintain professional, courteous, and respectful conduct during all 1-to-1 live sessions and messaging groups.',
        'Recording or distributing 1-to-1 trainer interactions without explicit written consent is strictly prohibited.',
        'Any form of harassment, hate speech, or disruptive behavior will result in immediate termination of access without refund.'
      ]
    },
    {
      id: 'privacy-policy',
      title: '7. Privacy Policy & Student Data Protection',
      content: [
        'English Mirror respects learner privacy and is committed to protecting personal information.',
        'Information collected includes: Full Name, Phone Number, Email Address, WhatsApp Number, Learning Data, Attendance Records, Progress Notes, Assessment Results, and Trainer Communication Records.',
        'Student data is used exclusively to deliver personalized instruction, schedule sessions, monitor learning progression, and issue certificates.',
        'English Mirror and Edqoo strictly DO NOT sell, rent, or trade student data to third parties.'
      ]
    },
    {
      id: 'support-and-escalation',
      title: '8. Support Details & Official Contacts',
      content: [
        'For queries regarding trainer scheduling, doubt clarification, or subscription renewals, please reach out via our official support channels:',
        'WhatsApp Support: [Insert WhatsApp number]',
        'Support Email: [Insert support email address]',
        'Support Operating Hours: [Insert support hours]',
        'Escalation Desk: [Insert escalation contact]',
        'Note: Contact parameters will be updated with live partner channels upon final partner onboarding.'
      ]
    }
  ]
};
