export const DEFAULT_ENGLISH_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop';

export interface SpokenTutorialSubCategory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  supportingText?: string;
  image: string;
  learningFormat: string;
  highlightText: string;
  enrolledStudents?: string;
  keyHighlights: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
  features: Array<{
    id: number;
    featureNumber?: string;
    title: string;
    description: string;
  }>;
  courseDetails: {
    overview: string[];
    detailsList: string[];
  };
  learningBenefits: string[];
  batchTimings?: {
    hasBatches: boolean;
    note?: string;
    batches: Array<{
      name: string;
      days: string;
      timing?: string;
    }>;
  };
  additionalDescription?: string;
}

export const SPOKEN_TUTORIAL_SUBCATEGORIES: SpokenTutorialSubCategory[] = [
  // 1. 1:1 Communicative English Mastery
  {
    id: '1-to-1-live-spoken-english',
    slug: '1-to-1-live-spoken-english',
    title: '1:1 Communicative English Mastery',
    subtitle: 'Flagship Live Program',
    description: 'Your Complete Path to Confident English Communication',
    supportingText: 'Live Coaching | Video Lessons | Daily Practice',
    image: '/images/spoken-tutorial/communicative-english.jpg',
    learningFormat: '15 Live 1-to-1 Google Meet sessions per month',
    highlightText: 'Mirror your success with fluent English',
    enrolledStudents: '4,631 Students Enrolled',
    keyHighlights: [
      {
        value: '15',
        label: 'Live 1:1 Sessions',
        description: 'Google Meet coaching (30 mins)'
      },
      {
        value: '25',
        label: 'Grammar Classes',
        description: 'HD recorded masterclasses'
      },
      {
        value: '25',
        label: 'Vocabulary Classes',
        description: 'Lifetime premium access'
      },
      {
        value: '50+',
        label: 'E-PDFs & JAM',
        description: 'Daily speaking practice'
      }
    ],
    features: [
      {
        id: 1,
        featureNumber: '01',
        title: '15 Live 1:1 Sessions',
        description: 'Expert-led speaking practice'
      },
      {
        id: 2,
        featureNumber: '02',
        title: '25 Grammar + 25 Vocabulary + 25 Habits',
        description: 'HD lessons with lifetime access and daily fluency habituation'
      },
      {
        id: 3,
        featureNumber: '03',
        title: '50+ E-PDFs + 200+ Power Words',
        description: 'Study resources for confident communication'
      },
      {
        id: 4,
        featureNumber: '04',
        title: 'Certification',
        description: 'Course completion certification for 3+ months enrollments'
      }
    ],
    courseDetails: {
      overview: [
        '15 Live 1-to-1 Google Meet sessions per month with personalized mentor feedback.',
        '25 Grammar + 25 Vocabulary recorded HD masterclasses with lifetime access.',
        '25 Success habits for consistent spoken English practice and fluency habituation.',
        '50+ Educational E-PDFs and 200+ Power Words with WhatsApp doubt support.'
      ],
      detailsList: [
        '15 Live 1:1 Sessions: 30 minutes each of dedicated Google Meet speaking practice',
        '25 Grammar + 25 Vocabulary: HD video masterclasses with lifetime access',
        '25 Success Habits: Guided routine to build continuous fluency and natural reflexes',
        '50+ E-PDFs + 200+ Power Words: Comprehensive study resources for confident communication',
        'Continuous WhatsApp doubt clarification and Just-A-Minute (JAM) fluency activities',
        'Course completion certification for enrollments of 3 months and above'
      ]
    },
    learningBenefits: [
      'Overcome speaking hesitation and speak with effortless natural reflex',
      'Personalized 1-on-1 attention with immediate trainer correction',
      'Rich conversational vocabulary and strong grammar fundamentals',
      'Interactive JAM drills that build instant impromptu speech agility'
    ],
    batchTimings: {
      hasBatches: true,
      note: 'Flexible 1-to-1 batch slots available to suit your daily routine.',
      batches: [
        {
          name: 'Batch A',
          days: 'Monday / Wednesday / Friday',
          timing: 'Flexible Scheduling'
        },
        {
          name: 'Batch B',
          days: 'Tuesday / Thursday / Saturday',
          timing: 'Flexible Scheduling'
        }
      ]
    }
  },

  // 2. Fluency Builder Plan
  {
    id: 'cat-fluency-builder-plan',
    slug: 'fluency-builder-plan',
    title: 'Fluency Builder Plan',
    subtitle: 'Telephonic Sessions',
    description: 'Your Complete Path to Confident English Communication',
    supportingText: 'Voice Calls | Recorded Lessons | Daily Practice',
    image: '/images/spoken-tutorial/fluency-builder-plan.jpg',
    learningFormat: 'Daily 1-1 voice calls + self-paced learning',
    highlightText: 'Mirror your success with fluent English',
    enrolledStudents: '3,842 Students Enrolled',
    keyHighlights: [
      {
        value: '25',
        label: 'Phone Call Sessions',
        description: 'Daily 15-minute 1:1 voice calls'
      },
      {
        value: '50',
        label: 'Recorded Classes',
        description: '25 Grammar + 25 Vocabulary'
      },
      {
        value: '50',
        label: 'Educational E-PDFs',
        description: 'Daily JAM updates included'
      },
      {
        value: '100%',
        label: 'Certification',
        description: 'Tenure of 3 months and above'
      }
    ],
    features: [
      {
        id: 1,
        title: '25 Phone Call Sessions',
        description: 'Daily 15-minute 1-1 voice calls with an expert trainer.'
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
        description: 'Earned for course tenures of 3 months and above.'
      }
    ],
    courseDetails: {
      overview: [
        'Telephonic learning format designed for individuals with busy routines.',
        'Daily one-to-one voice calls with a dedicated English communication expert.',
        'Self-paced learning supported by high-definition recorded lessons and downloadable materials.'
      ],
      detailsList: [
        '25 Phone Call Sessions: Daily 15-minute one-to-one voice calls with an expert trainer',
        '25 Grammar + 25 Vocabulary: Recorded HD classes with lifetime access',
        '50 E-PDFs + Daily JAM Updates: Educational resources with WhatsApp doubt support',
        'Certification: Certification eligibility according to the course tenure requirements',
        'Telephonic learning, daily one-to-one voice calls, and self-paced learning',
        'Mirror your success with fluent English'
      ]
    },
    learningBenefits: [
      'Eliminate telephonic hesitation and build natural spoken English reflex',
      'Daily 15-minute speaking practice fits conveniently into busy professional or academic schedules',
      'Master essential grammar fundamentals and expand practical conversational vocabulary',
      'Receive instant pronunciation and sentence structure corrections from your personal trainer',
      'Continuous WhatsApp support for resolving grammar doubts and daily JAM topics',
      'Earn course completion certification upon meeting tenure requirements'
    ],
    batchTimings: {
      hasBatches: true,
      note: 'Flexible daily time slots available from morning to evening.',
      batches: [
        {
          name: 'Morning Slot',
          days: 'Daily (Monday – Saturday)',
          timing: '7:00 AM – 11:00 AM (Pick your 15 mins)'
        },
        {
          name: 'Evening Slot',
          days: 'Daily (Monday – Saturday)',
          timing: '5:00 PM – 9:30 PM (Pick your 15 mins)'
        }
      ]
    }
  },

  // 2. Little Mirrors
  {
    id: 'cat-little-mirrors',
    slug: 'little-mirrors',
    title: 'Little Mirrors',
    subtitle: '1:1 English Fluency for Kids',
    description: 'Fun learning today, confident communicators tomorrow.',
    supportingText: 'Confidence first, fluency next — every child gets a trainer entirely to themselves.',
    image: '/images/spoken-tutorial/little-mirrors.jpg',
    learningFormat: 'Live 1:1 Google Meet classes with interactive activities, games, and worksheets.',
    highlightText: 'Each 30-minute class blends a simple concept, a fun speaking activity and a short worksheet.',
    enrolledStudents: '3,974 Students Enrolled',
    additionalDescription: 'Each 30-minute class blends a simple concept, a fun speaking activity and a short worksheet.',
    keyHighlights: [
      {
        value: '15',
        label: 'Live 1:1 sessions',
        description: 'Personalised individual attention'
      },
      {
        value: '30',
        label: 'Mins per session',
        description: 'Focused interactive session'
      },
      {
        value: 'Class 3–7 & 8–12',
        label: 'Eligible classes',
        description: 'Target school grades'
      }
    ],
    features: [
      {
        id: 1,
        title: '1:1 Live Classes',
        description: 'Personalised attention, no crowd and no comparison.'
      },
      {
        id: 2,
        title: 'Speaking Practice',
        description: 'Builds the confidence to speak up in every session.'
      },
      {
        id: 3,
        title: 'Fun & Interactive',
        description: 'Engaging activities, games and role play.'
      },
      {
        id: 4,
        title: 'Customised Curriculum',
        description: "Paced to your child's level."
      },
      {
        id: 5,
        title: 'Track Progress',
        description: 'Regular feedback, worksheets and an assessment.'
      },
      {
        id: 6,
        title: 'Confident Kids',
        description: 'Better communication for school and life.'
      }
    ],
    courseDetails: {
      overview: [
        '15 Live 1:1 Sessions designed specifically for children in Class 3–7 & 8–12.',
        '30 Minutes per Session with friendly, certified language mentors.',
        'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet.',
        'Personalised attention without crowding or comparison.'
      ],
      detailsList: [
        '15 Live 1:1 Sessions: 30 minutes per session on Google Meet',
        'Designed for children in Class 3–7 & 8–12',
        '1:1 Live Classes: Personalised attention without crowding or comparison',
        'Speaking Practice: Build confidence to speak up during every session',
        'Fun & Interactive: Engaging activities, games, and role-play',
        'Customised Curriculum: Learning paced according to the child\'s level',
        'Track Progress: Regular feedback, worksheets, and assessments',
        'Confident Kids: Improve communication skills for school and everyday life',
        'Blends a simple concept, a fun speaking activity, and a short worksheet in every class'
      ]
    },
    learningBenefits: [
      'Overcome shyness and develop eagerness to communicate in English',
      'Foster clear pronunciation, sentence formation, and conversational fluency',
      'Enhance school participation in classroom discussions, speeches, and debates',
      'Encouraging, patient mentors ensure learning feels like play rather than pressure',
      'Parents receive regular milestone progress updates and actionable feedback'
    ],
    batchTimings: {
      hasBatches: true,
      note: 'After-school and weekend schedules tailored to children.',
      batches: [
        {
          name: 'Weekday Batch',
          days: 'Monday / Wednesday / Friday',
          timing: 'Flexible after-school slots (4:00 PM – 7:30 PM)'
        },
        {
          name: 'Weekend Batch',
          days: 'Tuesday / Thursday / Saturday',
          timing: 'Flexible slots (4:00 PM – 7:30 PM)'
        }
      ]
    }
  },

  // 3. Corporate English Fluency Builder
  {
    id: 'cat-corporate-english-fluency-builder',
    slug: 'corporate-english-fluency-builder',
    title: 'Corporate English Fluency Builder',
    subtitle: 'Executive & Professional Fluency Track',
    description: 'Your Complete Path to Confident English Communication',
    supportingText: 'Live Coaching | Video Lessons | Daily Practice',
    image: '/images/spoken-tutorial/corporate-english.jpg',
    learningFormat: 'Live 1:1 coaching + self-paced learning',
    highlightText: 'Mirror your success with fluent English',
    enrolledStudents: '3,519 Students Enrolled',
    keyHighlights: [
      {
        value: '15',
        label: 'Live 1:1 Sessions',
        description: 'Google Meet coaching (30 mins)'
      },
      {
        value: '15',
        label: 'HD Vocabulary Classes',
        description: 'Lifetime premium access'
      },
      {
        value: '100+',
        label: 'Vocabulary Words',
        description: 'Intermediate to advanced level'
      },
      {
        value: '15',
        label: 'E-Books + Support',
        description: 'Doubt clarification & JAM activities'
      }
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
      overview: [
        'Live one-to-one coaching combined with self-paced learning.',
        'Individual coaching with dedicated feedback on executive presence.',
        'Vocabulary improvement targeting professional and workplace interactions.',
        'Daily practice habits supported by video lessons and WhatsApp assistance.'
      ],
      detailsList: [
        '15 Live 1:1 Google Meet Sessions: 30-minute individual practice sessions with an expert',
        '15 HD Vocabulary Classes: Access vocabulary lessons for continued learning',
        '100+ Vocabulary Words: Intermediate-to-advanced vocabulary development',
        '15 E-Books + WhatsApp Support: Doubt clarification and JAM activities',
        'Individual coaching with personalized focus',
        'Vocabulary improvement for corporate communication',
        'Daily practice and real-world scenario drills',
        'WhatsApp support for ongoing questions',
        'Video lessons with on-demand access',
        'Mirror your success with fluent English'
      ]
    },
    learningBenefits: [
      'Master high-stakes client meetings, project demos, and boardroom discussions',
      'Articulate complex technical or strategic thoughts with brevity and confidence',
      'Acquire 100+ high-impact corporate words, idioms, and transition phrasing',
      'Draft clear, authoritative formal emails, project briefs, and executive summaries',
      'Build executive gravitas, eliminating hesitant fillers and passive phrasing'
    ],
    batchTimings: {
      hasBatches: true,
      note: 'Executive friendly timings accommodating busy professional shifts.',
      batches: [
        {
          name: 'Track A',
          days: 'Monday / Wednesday / Friday',
          timing: 'Early Morning (7:00 AM – 9:00 AM) or Late Evening (7:00 PM – 10:00 PM)'
        },
        {
          name: 'Track B',
          days: 'Tuesday / Thursday / Saturday',
          timing: 'Early Morning (7:00 AM – 9:00 AM) or Late Evening (7:00 PM – 10:00 PM)'
        }
      ]
    }
  },

  // 4. IELTS Intensive
  {
    id: 'cat-ielts-intensive',
    slug: 'ielts-intensive',
    title: 'IELTS Intensive',
    subtitle: '1:1 Crash Training',
    description: 'Your Fast Track to a Higher Band Score',
    supportingText: 'Study • Practice • Get Your Dream Score!',
    image: '/images/spoken-tutorial/ielts-intensive.jpg',
    learningFormat: '15 Live 1:1 Google Meet Sessions (30 mins per session)',
    highlightText: 'Your Fast Track to a Higher Band Score',
    enrolledStudents: '1,121 Students Enrolled',
    keyHighlights: [
      {
        value: '15',
        label: 'Live 1:1 Sessions',
        description: 'Personalized coaching on Google Meet'
      },
      {
        value: '30',
        label: 'Minutes Each',
        description: 'Academic or General Training'
      },
      {
        value: '4',
        label: 'Modules Covered',
        description: 'Speaking, Reading, Writing, Listening'
      },
      {
        value: '1:1',
        label: 'Deep Dive',
        description: 'Diagnostic assessment & feedback'
      }
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
      overview: [
        '15 Live 1:1 Google Meet Sessions: 30 minutes per session, focused on academic or general training needs.',
        'Deep Dive Assessment: Assessment covering Speaking, Reading, Writing, and Listening.'
      ],
      detailsList: [
        '15 Live 1:1 Google Meet Sessions (30 minutes per session, focused on academic or general training needs)',
        'Deep Dive Assessment (Assessment covering Speaking, Reading, Writing, and Listening)'
      ]
    },
    learningBenefits: [
      'Expert Guidance',
      'Personalized Feedback',
      'Flexible Batches',
      'Track Your Progress'
    ],
    batchTimings: {
      hasBatches: true,
      note: 'Choose between standard weekday tracks with flexible timings supported.',
      batches: [
        {
          name: 'BATCH 1',
          days: 'Monday / Wednesday / Friday',
          timing: 'Flexible Timings Available'
        },
        {
          name: 'BATCH 2',
          days: 'Tuesday / Thursday / Saturday',
          timing: 'Flexible Timings Available'
        }
      ]
    }
  },

  // 5. Executive Interview Preparation Track
  {
    id: 'cat-executive-interview-prep-track',
    slug: 'executive-interview-prep-track',
    title: 'Executive Interview Preparation Track',
    subtitle: '1:1 Executive Interview Preparation Track',
    description: 'Personalized coaching to help you succeed in job interviews, career growth, and professional opportunities.',
    supportingText: 'Be Interview Ready!',
    image: '/images/spoken-tutorial/executive-interview.jpg',
    learningFormat: '12 Live 1:1 Sessions (Google Meet) \u2022 30 Minutes per Live Session',
    highlightText: 'Crack Interviews with Confidence',
    enrolledStudents: '4,276 Students Enrolled',
    keyHighlights: [
      {
        value: '12',
        label: 'Live 1:1 Sessions',
        description: 'Google Meet coaching'
      },
      {
        value: '30',
        label: 'Minutes Each',
        description: 'Focused live session'
      },
      {
        value: 'HR & Tech',
        label: 'Mock Interviews',
        description: 'Simulations & feedback'
      },
      {
        value: 'Custom',
        label: 'Industry Specific',
        description: 'Tailored to your goals'
      }
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
      overview: [
        '12 Live 1:1 Sessions (Google Meet)',
        '30 Minutes per Live Session',
        'Personalized feedback and improvement plan',
        'Mock interview practice (HR + Technical)'
      ],
      detailsList: [
        '12 Live 1:1 Sessions (Google Meet)',
        '30 Minutes per Live Session',
        'Personalized feedback and improvement plan',
        'Mock interview practice (HR + Technical)',
        'Resume building and self-introduction training',
        'Body language, confidence & professional etiquette',
        'Tips and strategies to answer commonly asked questions'
      ]
    },
    learningBenefits: [
      'Career Growth',
      'Build Confidence',
      'Professional Success',
      'Personalized Guidance'
    ],
    batchTimings: {
      hasBatches: true,
      note: 'Flexible batch scheduling to suit candidate convenience.',
      batches: [
        {
          name: 'Batch 1',
          days: 'Monday / Wednesday / Friday',
          timing: 'Flexible Scheduling'
        },
        {
          name: 'Batch 2',
          days: 'Tuesday / Thursday / Saturday',
          timing: 'Flexible Scheduling'
        }
      ]
    }
  }
];

export function getSubCategoryBySlug(slug: string): SpokenTutorialSubCategory | undefined {
  const norm = slug.toLowerCase().trim();
  return SPOKEN_TUTORIAL_SUBCATEGORIES.find(
    (item) =>
      item.slug === norm ||
      item.id === norm ||
      item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === norm ||
      ((item.id === '1-to-1-live-spoken-english' || item.slug === '1-to-1-live-spoken-english') &&
        (norm === '1-to-1-live-spoken-english' ||
          norm === '1:1-communicative-english-mastery' ||
          norm === '1-to-1-communicative-english-mastery' ||
          norm === '1-1-communicative-english-mastery' ||
          norm === 'communicative-english-mastery')) ||
      (item.id === 'cat-ielts-intensive' &&
        (norm === 'ielts-intensive' ||
          norm === '1-to-1-ielts-intensive' ||
          norm === 'ielts-intensive-crash-training' ||
          norm === 'ielts-intensive-1-to-1-crash-training')) ||
      (item.id === 'cat-executive-interview-prep-track' &&
        (norm === 'executive-interview-preparation-track' ||
          norm === 'executive-interview-prep-track' ||
          norm === '1-to-1-executive-interview-preparation-track' ||
          norm === 'targeted-interview-prep-masterclass')) ||
      (item.id === 'cat-corporate-english-fluency-builder' &&
        (norm === 'corporate-english-fluency-builder' ||
          norm === 'elite-corporate-transformation-track')) ||
      (item.id === 'cat-little-mirrors' &&
        (norm === 'little-mirrors' ||
          norm === 'little-hearts' ||
          norm === 'kids-1-to-1-english-fluency-program')) ||
      (item.id === 'cat-fluency-builder-plan' &&
        (norm === 'fluency-builder-plan' ||
          norm === 'standard-plan-telephonic-calling-sessions'))
  );
}

export function getEnrolledStudentsForSubCategory(subcat: { id?: string; slug?: string; title?: string; enrolledStudents?: string }): string {
  if (subcat.enrolledStudents) return subcat.enrolledStudents;

  const titleLower = (subcat.title || '').toLowerCase();
  const slugLower = (subcat.slug || '').toLowerCase();
  const idLower = (subcat.id || '').toLowerCase();

  if (titleLower.includes('ielts') || slugLower.includes('ielts') || idLower.includes('ielts')) {
    return '1,121 Students Enrolled';
  }
  if (titleLower.includes('communicative') || slugLower.includes('1-to-1-live') || idLower.includes('1-to-1-live')) {
    return '4,631 Students Enrolled';
  }
  if (titleLower.includes('fluency builder') || slugLower.includes('fluency-builder') || idLower.includes('fluency-builder')) {
    return '3,842 Students Enrolled';
  }
  if (titleLower.includes('little mirrors') || slugLower.includes('little-mirrors') || idLower.includes('little-mirrors') || slugLower.includes('little-hearts')) {
    return '3,974 Students Enrolled';
  }
  if (titleLower.includes('corporate') || slugLower.includes('corporate') || idLower.includes('corporate')) {
    return '3,519 Students Enrolled';
  }
  if (titleLower.includes('interview') || slugLower.includes('interview') || idLower.includes('interview')) {
    return '4,276 Students Enrolled';
  }

  return '3,842 Students Enrolled';
}

