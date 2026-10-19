import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function sync() {
  try {
    console.log('🔄 Applying column migrations to categories table...');
    await pool.query(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id VARCHAR(100);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_slug VARCHAR(255);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS course_details JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS key_highlights JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS learning_benefits JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS batch_timings JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS learning_format VARCHAR(255);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS supporting_text VARCHAR(255);
    `);
    console.log('✅ Column migrations applied successfully.');

    // 1. Parent Category: Spoken Tutorial
    const parentCategory = {
      id: 'cat-spoken-tutorial',
      slug: 'spoken-tutorial',
      name: 'Spoken Tutorial',
      title: 'Spoken Tutorial — English Mirror Spoken English Programs',
      description: 'Your Complete Path to Confident English Communication. Personalized 1:1 English fluency coaching, daily telephonic confidence building, IELTS intensive crash training, and executive interview preparation.',
      subtitle: 'Mirror your success with fluent English',
      icon: 'message-circle',
      hero_image: '/images/spoken-tutorial/fluency-builder-plan.jpg',
      hero_badge: 'English Mirror Partner Track',
      highlights: JSON.stringify([
        '1-on-1 personalized live coaching with certified language trainers',
        'Daily 15-minute telephonic speaking sessions for natural conversational fluency',
        'IELTS Band score crash training covering Speaking, Reading, Writing & Listening',
        'Corporate communication, email etiquette, and executive interview preparation'
      ]),
      curriculum_pillars: JSON.stringify([
        { title: 'Fluency Builder Plan', desc: 'Daily 15-minute voice calls, 25 grammar and 25 vocabulary classes, WhatsApp doubt support, and certification eligibility.' },
        { title: 'Little Mirrors (Kids 1:1)', desc: '15 live 1:1 sessions for primary classes 3–7 blending simple concepts, fun speaking activities, and worksheets.' },
        { title: 'Corporate English Fluency', desc: '15 live 1:1 Google Meet coaching sessions, 100+ business vocabulary words, and daily communication practice.' },
        { title: 'IELTS Intensive & Interview Track', desc: 'Targeted preparation for all 4 IELTS modules and executive interview preparation with mock interview practice.' }
      ]),
      faqs: JSON.stringify([
        {
          question: 'How do the 1-to-1 telephonic sessions work?',
          answer: 'A dedicated English Mirror language expert calls you daily for structured 15-minute voice conversation practice, instant pronunciation correction, and vocabulary enhancement.'
        },
        {
          question: 'What subcategories are available under Spoken Tutorial?',
          answer: 'Spoken Tutorial features five specialized tracks: Fluency Builder Plan, Little Mirrors for Kids, Corporate English Fluency Builder, IELTS Intensive, and Executive Interview Preparation Track.'
        },
        {
          question: 'How do I enrol or enquire about a course?',
          answer: 'Click "Enquire Now" on any category card to submit an enquiry. An academic advisor will reach out to discuss schedule and batch options.'
        }
      ]),
      display_order: 6,
      is_active: true,
      is_partner: true,
      badge: 'ENGLISH MIRROR',
      seo_title: 'Spoken Tutorial | English Mirror 1:1 English Fluency Programs',
      seo_description: 'Master English with English Mirror Spoken Tutorial. Choose from Fluency Builder Plan, Little Mirrors, Corporate English, IELTS Intensive, and Executive Interview Preparation.',
      meta_keywords: JSON.stringify(['Spoken Tutorial', 'English Mirror', 'Fluency Builder Plan', 'Little Mirrors', 'IELTS Intensive', 'Corporate English', 'Interview Preparation'])
    };

    // Check if cat-spoken-tutorial or cat-english-mirror exists
    const checkParent = await pool.query("SELECT id FROM categories WHERE id IN ('cat-spoken-tutorial', 'cat-english-mirror') OR slug IN ('spoken-tutorial', 'english-mirror')");
    if (checkParent.rows.length === 0) {
      await pool.query(
        `INSERT INTO categories (
          id, slug, name, title, description, subtitle, icon, hero_image, hero_badge,
          highlights, curriculum_pillars, faqs, display_order, is_active, is_partner,
          badge, seo_title, seo_description, meta_keywords, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13, $14, $15, $16, $17, $18, $19::jsonb, NOW(), NOW())`,
        [
          parentCategory.id, parentCategory.slug, parentCategory.name, parentCategory.title,
          parentCategory.description, parentCategory.subtitle, parentCategory.icon,
          parentCategory.hero_image, parentCategory.hero_badge, parentCategory.highlights,
          parentCategory.curriculum_pillars, parentCategory.faqs, parentCategory.display_order,
          parentCategory.is_active, parentCategory.is_partner, parentCategory.badge,
          parentCategory.seo_title, parentCategory.seo_description, parentCategory.meta_keywords
        ]
      );
      console.log('✅ Inserted parent category Spoken Tutorial');
    } else {
      const existingId = checkParent.rows[0].id;
      await pool.query(
        `UPDATE categories SET
          name = $1, title = $2, description = $3, subtitle = $4,
          icon = $5, hero_image = $6, hero_badge = $7, highlights = $8::jsonb,
          curriculum_pillars = $9::jsonb, faqs = $10::jsonb, display_order = $11,
          is_active = $12, is_partner = $13, badge = $14, seo_title = $15,
          seo_description = $16, meta_keywords = $17::jsonb, updated_at = NOW()
        WHERE id = $18`,
        [
          parentCategory.name, parentCategory.title, parentCategory.description,
          parentCategory.subtitle, parentCategory.icon, parentCategory.hero_image,
          parentCategory.hero_badge, parentCategory.highlights, parentCategory.curriculum_pillars,
          parentCategory.faqs, parentCategory.display_order, parentCategory.is_active,
          parentCategory.is_partner, parentCategory.badge, parentCategory.seo_title,
          parentCategory.seo_description, parentCategory.meta_keywords, existingId
        ]
      );
      console.log(`✅ Updated existing category (${existingId}) to Spoken Tutorial`);
    }

    // 2. The 5 Subcategories
    const subcategories = [
      {
        id: 'cat-fluency-builder-plan',
        slug: 'fluency-builder-plan',
        name: 'Fluency Builder Plan',
        title: 'Fluency Builder Plan — Telephonic Sessions',
        subtitle: 'Telephonic Sessions',
        description: 'Your Complete Path to Confident English Communication.',
        supporting_text: 'Voice Calls | Recorded Lessons | Daily Practice',
        parent_id: 'cat-spoken-tutorial',
        parent_slug: 'spoken-tutorial',
        icon: 'phone-call',
        hero_image: '/images/spoken-tutorial/fluency-builder-plan.jpg',
        hero_badge: 'Telephonic English Track',
        learning_format: 'Telephonic learning, daily one-to-one voice calls, and self-paced learning.',
        key_highlights: JSON.stringify([
          '25 Phone Call Sessions (Daily 15 mins)',
          '50 Recorded Classes (25 Grammar + 25 Vocabulary)',
          '50 E-PDFs + Daily JAM Updates',
          'Certification Eligibility'
        ]),
        features: JSON.stringify([
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
        ]),
        course_details: JSON.stringify({
          format: 'Telephonic learning, daily one-to-one voice calls, and self-paced learning.',
          sessions: 'Daily 15-minute one-to-one voice calls with an expert trainer (25 calls).',
          recordedClasses: '25 Grammar + 25 Vocabulary recorded HD masterclasses with lifetime access.',
          resources: '50 E-PDFs with WhatsApp doubt support and daily JAM updates.',
          certification: 'Certification eligibility according to the course tenure requirements.',
          highlight: 'Mirror your success with fluent English.'
        }),
        learning_benefits: JSON.stringify([
          'Daily 15-minute voice calling builds natural speaking habits without camera anxiety',
          'Lifetime access to 25 HD Grammar and 25 HD Vocabulary masterclasses',
          'Continuous WhatsApp doubt clarification and daily Just-A-Minute (JAM) fluency prompts',
          'Official certification eligibility according to course tenure requirements'
        ]),
        highlights: JSON.stringify([
          '25 Phone Call Sessions: Daily 15-minute 1-on-1 voice calls with expert trainer',
          '25 Grammar + 25 Vocabulary recorded HD classes with lifetime access',
          '50 E-PDFs + Daily JAM updates with WhatsApp doubt support',
          'Certification eligibility according to course tenure requirements'
        ]),
        curriculum_pillars: JSON.stringify([
          { title: 'Daily Telephonic Drills', desc: '15-minute daily 1-to-1 conversation sessions with immediate pronunciation and sentence correction.' },
          { title: 'Grammar Precision Vault', desc: '25 recorded HD video classes breaking down tenses, prepositions, sentence structure, and spoken patterns.' },
          { title: 'Vocabulary Expansion', desc: '25 recorded HD classes with high-frequency everyday and professional vocabulary words.' },
          { title: 'JAM Updates & E-PDFs', desc: 'Daily Just-A-Minute speaking challenges and 50 downloadable study worksheets via WhatsApp.' }
        ]),
        faqs: JSON.stringify([
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
        ]),
        display_order: 1,
        is_active: true,
        is_partner: true,
        badge: 'TELEPHONIC TRACK',
        seo_title: 'Fluency Builder Plan | Telephonic English Sessions | English Mirror',
        seo_description: 'Master spoken English with Fluency Builder Plan: 25 phone call sessions, 50 recorded classes, 50 E-PDFs, and WhatsApp support. Mirror your success with fluent English.',
        meta_keywords: JSON.stringify(['Fluency Builder Plan', 'Telephonic English', '1 on 1 phone call sessions', 'English Mirror', 'Spoken Tutorial'])
      },
      {
        id: 'cat-little-mirrors',
        slug: 'little-mirrors',
        name: 'Little Mirrors',
        title: 'Little Mirrors — 1:1 English Fluency for Kids',
        subtitle: '1:1 English Fluency for Kids',
        description: 'Fun learning today, confident communicators tomorrow.',
        supporting_text: '1:1 Live Classes | Interactive Activities | Primary Classes 3–7',
        parent_id: 'cat-spoken-tutorial',
        parent_slug: 'spoken-tutorial',
        icon: 'smile',
        hero_image: '/images/spoken-tutorial/little-mirrors.jpg',
        hero_badge: 'Kids 1:1 Fluency',
        learning_format: 'Live 1:1 interactive sessions with games, activities, and worksheets.',
        key_highlights: JSON.stringify([
          '15 Live 1:1 Sessions',
          '30 Minutes per Session',
          'Designed for children in Primary Classes 3–7'
        ]),
        features: JSON.stringify([
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
        ]),
        course_details: JSON.stringify({
          sessionCount: '15 Live 1:1 Sessions',
          sessionDuration: '30 Minutes per Session',
          targetAudience: 'Designed for children in Primary Classes 3–7.',
          blendedStructure: 'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet.',
          attention: 'Personalised attention without crowding or comparison.',
          activities: 'Engaging games, role-play, and storytelling designed to spark child curiosity.'
        }),
        learning_benefits: JSON.stringify([
          'Build unshakeable speaking confidence in school recitations and classroom discussions',
          'Eliminate hesitation, shyness, and comparison with dedicated 1:1 mentor attention',
          'Paced specifically according to the child\'s understanding level with regular progress assessments',
          'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet'
        ]),
        highlights: JSON.stringify([
          '15 Live 1:1 Sessions: 30 minutes each with dedicated child trainer',
          'Designed for children in Primary Classes 3–7',
          'Blended 30-min structure: Concept + Speaking Activity + Worksheet',
          'Regular feedback, progress reports, and engaging role-play'
        ]),
        curriculum_pillars: JSON.stringify([
          { title: 'Interactive Speaking & Role-Play', desc: 'Conversational icebreakers, storytelling, describing hobbies, and cartoon-based dialogues.' },
          { title: 'Concept Understanding', desc: 'Everyday vocabulary, school grammar essentials, sentence structuring without rote memorization.' },
          { title: 'Fun Worksheets & Games', desc: 'Word puzzles, matching exercises, and reading aloud with rhythm and correct pronunciation.' },
          { title: 'Continuous Progress Tracking', desc: 'Regular feedback sharing with parents, milestone check-ins, and confidence assessment.' }
        ]),
        faqs: JSON.stringify([
          {
            question: 'What age group or classes is Little Mirrors designed for?',
            answer: 'Little Mirrors is specially designed for children in Primary Classes 3 to 7.'
          },
          {
            question: 'How is each 30-minute class conducted?',
            answer: 'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet in a warm 1:1 environment.'
          },
          {
            question: 'Are classes one-to-one or in groups?',
            answer: 'All Little Mirrors sessions are strictly 1:1 live sessions to guarantee personalised attention without crowding or comparison.'
          }
        ]),
        display_order: 2,
        is_active: true,
        is_partner: true,
        badge: 'KIDS 1:1 TRACK',
        seo_title: 'Little Mirrors | 1:1 English Fluency for Kids (Classes 3–7) | English Mirror',
        seo_description: 'Fun learning today, confident communicators tomorrow. Little Mirrors offers 15 live 1:1 English sessions (30 mins each) for kids in Classes 3–7.',
        meta_keywords: JSON.stringify(['Little Mirrors', 'English fluency for kids', '1 on 1 kids English', 'spoken English for children', 'English Mirror'])
      },
      {
        id: 'cat-corporate-english-fluency-builder',
        slug: 'corporate-english-fluency-builder',
        name: 'Corporate English Fluency Builder',
        title: 'Corporate English Fluency Builder — Live Coaching',
        subtitle: 'Live Coaching | Video Lessons | Daily Practice',
        description: 'Your Complete Path to Confident English Communication.',
        supporting_text: 'Live Coaching | Video Lessons | Daily Practice',
        parent_id: 'cat-spoken-tutorial',
        parent_slug: 'spoken-tutorial',
        icon: 'briefcase',
        hero_image: '/images/spoken-tutorial/corporate-english.jpg',
        hero_badge: 'Corporate English Track',
        learning_format: 'Live one-to-one coaching combined with self-paced learning.',
        key_highlights: JSON.stringify([
          '15 Live 1:1 Google Meet Sessions',
          '15 HD Vocabulary Masterclasses',
          '100+ Corporate Vocabulary Words',
          '15 E-Books + WhatsApp Doubt Support'
        ]),
        features: JSON.stringify([
          {
            id: 1,
            title: '15 Live 1:1 Google Meet Sessions',
            description: '30-minute individual practice sessions with an expert.'
          },
          {
            id: 2,
            title: '15 HD Vocabulary Classes',
            description: 'Access vocabulary lessons for continued learning.'
          },
          {
            id: 3,
            title: '100+ Vocabulary Words',
            description: 'Intermediate-to-advanced vocabulary development.'
          },
          {
            id: 4,
            title: '15 E-Books + WhatsApp Support',
            description: 'Doubt clarification and JAM activities.'
          }
        ]),
        course_details: JSON.stringify({
          format: 'Live one-to-one coaching combined with self-paced learning.',
          coaching: 'Individual coaching with certified senior corporate communication trainers.',
          vocabulary: 'Vocabulary improvement covering 100+ intermediate-to-advanced corporate words.',
          practice: 'Daily practice drills, Just-A-Minute (JAM) activities, and speaking habit development.',
          support: 'Continuous WhatsApp support for doubt clarification and prompt guidance.',
          lessons: '15 HD Vocabulary Masterclasses accessible for continued self-paced revision.',
          highlight: 'Mirror your success with fluent English.'
        }),
        learning_benefits: JSON.stringify([
          'Deliver persuasive workplace presentations, client pitches, and team updates',
          'Master 100+ high-impact corporate vocabulary words and business phrases',
          'Eliminate hesitation during executive discussions, board meetings, and calls',
          'Personalised 1:1 Google Meet practice with immediate trainer feedback and actionable improvement notes'
        ]),
        highlights: JSON.stringify([
          '15 Live 1:1 Google Meet Sessions: 30 minutes each with corporate coach',
          '15 HD Vocabulary Classes for continued self-paced mastery',
          '100+ Intermediate-to-Advanced business vocabulary words',
          '15 E-Books + WhatsApp doubt support and JAM activities'
        ]),
        curriculum_pillars: JSON.stringify([
          { title: 'Meeting Poise & Communication', desc: 'Expressing viewpoints concisely, facilitating discussions, and articulating complex technical or business ideas.' },
          { title: 'Executive Vocabulary & Phrasing', desc: 'Tactful disagreement, negotiation language, assertive communication, and professional email phrasing.' },
          { title: 'Presentation & Pitch Delivery', desc: 'Slide storytelling, vocal modulation, handling impromptu client queries, and managing presentation pacing.' },
          { title: 'JAM Activities & Workbooks', desc: '15 downloadable business E-Books, spontaneous JAM speaking challenges, and ongoing mentor support.' }
        ]),
        faqs: JSON.stringify([
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
        ]),
        display_order: 3,
        is_active: true,
        is_partner: true,
        badge: 'CORPORATE TRACK',
        seo_title: 'Corporate English Fluency Builder | 1:1 Executive Coaching | English Mirror',
        seo_description: 'Your Complete Path to Confident English Communication. 15 live 1:1 Google Meet sessions, 15 HD vocabulary classes, and 100+ business words.',
        meta_keywords: JSON.stringify(['Corporate English Fluency Builder', 'business English course', '1 on 1 corporate coaching', 'workplace communication', 'English Mirror'])
      },
      {
        id: 'cat-ielts-intensive',
        slug: 'ielts-intensive',
        name: 'IELTS Intensive',
        title: 'IELTS Intensive — 1:1 Crash Training',
        subtitle: '1:1 Crash Training',
        description: 'Your Fast Track to a Higher Band Score.',
        supporting_text: 'Personalised Coaching | All 4 IELTS Modules | Deep Dive Assessment',
        parent_id: 'cat-spoken-tutorial',
        parent_slug: 'spoken-tutorial',
        icon: 'award',
        hero_image: '/images/spoken-tutorial/ielts-intensive.jpg',
        hero_badge: 'IELTS 1:1 Crash Track',
        learning_format: 'Personalised coaching on Google Meet with diagnostic evaluation.',
        key_highlights: JSON.stringify([
          '15 Live 1:1 Google Meet Sessions',
          '30 Minutes per Live Session',
          'Complete IELTS Preparation (Speaking, Reading, Writing, Listening)',
          'Deep Dive Diagnostic Assessment'
        ]),
        features: JSON.stringify([
          {
            id: 1,
            title: '1:1 Live Sessions',
            description: 'Personalised coaching on Google Meet.'
          },
          {
            id: 2,
            title: 'Complete IELTS Preparation',
            description: 'Preparation for Speaking, Reading, Writing, and Listening.'
          },
          {
            id: 3,
            title: 'Deep Dive Assessment',
            description: 'Identify strengths and areas for improvement.'
          },
          {
            id: 4,
            title: 'Targeted Practice',
            description: 'Learn strategies, receive feedback, and improve performance.'
          },
          {
            id: 5,
            title: 'Higher Band Score',
            description: 'Get guidance to work towards your target IELTS score.'
          }
        ]),
        course_details: JSON.stringify({
          sessions: '15 live one-to-one Google Meet sessions.',
          duration: '30 minutes per live session.',
          assessment: 'Assessment covering Speaking, Reading, Writing, and Listening.',
          strategies: 'Targeted exam strategy breakdowns, cue card practice, and criteria scoring rubrics.',
          highlight: 'Start Your IELTS Journey Today!'
        }),
        batch_timings: JSON.stringify([
          {
            batch: 'Batch 1',
            days: 'Monday / Wednesday / Friday',
            flexible: true,
            label: 'Flexible Timings'
          },
          {
            batch: 'Batch 2',
            days: 'Tuesday / Thursday / Saturday',
            flexible: true,
            label: 'Flexible Timings'
          }
        ]),
        learning_benefits: JSON.stringify([
          'Accelerate your preparation across all 4 modules: Speaking, Reading, Writing, and Listening',
          'Pinpoint band-limiting errors with deep dive diagnostic assessment and individual feedback',
          'Master examiner scoring criteria, lexical resource usage, and coherent paragraph structuring',
          'Personalised mock speaking interviews with immediate score rubrics and targeted improvement tips'
        ]),
        highlights: JSON.stringify([
          '15 Live 1:1 Google Meet Sessions (30 mins per session)',
          'Complete IELTS coverage: Speaking, Reading, Writing, and Listening',
          'Deep Dive Assessment to identify strengths and improvement areas',
          'Flexible Batches: Mon/Wed/Fri or Tue/Thu/Sat'
        ]),
        curriculum_pillars: JSON.stringify([
          { title: 'Speaking Mastery (Parts 1, 2 & 3)', desc: 'Fluency, coherence, lexical resources, cue card 1-minute planning, and mock interview drills.' },
          { title: 'Writing Task 1 & Task 2 Breakdown', desc: 'Academic graphs/letters, essay structure, argumentation, cohesion, and vocabulary range.' },
          { title: 'Reading Tactics & Time Management', desc: 'Skimming, scanning, True/False/Not Given strategies, and tackling complex texts under time limits.' },
          { title: 'Listening Comprehension & Traps', desc: 'Distractor identification, multiple accents, note completion, and spelling precision.' }
        ]),
        faqs: JSON.stringify([
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
        ]),
        display_order: 4,
        is_active: true,
        is_partner: true,
        badge: 'IELTS CRASH TRACK',
        seo_title: 'IELTS Intensive | 1:1 Crash Training & Band Score Coaching | English Mirror',
        seo_description: 'Your Fast Track to a Higher Band Score. 15 live 1:1 sessions covering Speaking, Reading, Writing, and Listening with deep dive assessment. Start your IELTS journey today!',
        meta_keywords: JSON.stringify(['IELTS Intensive', '1 on 1 IELTS training', 'IELTS crash course', 'IELTS band score', 'English Mirror'])
      },
      {
        id: 'cat-executive-interview-prep-track',
        slug: 'executive-interview-preparation-track',
        name: 'Executive Interview Preparation Track',
        title: 'Executive Interview Preparation Track — 1:1 Coaching',
        subtitle: '1:1 Executive Interview Preparation',
        description: 'Crack Interviews with Confidence.',
        supporting_text: 'Personalised coaching to help you succeed in job interviews, career growth, and professional opportunities.',
        parent_id: 'cat-spoken-tutorial',
        parent_slug: 'spoken-tutorial',
        icon: 'user-check',
        hero_image: '/images/spoken-tutorial/executive-interview.jpg',
        hero_badge: 'Interview Coaching Track',
        learning_format: '1:1 live sessions on Google Meet with simulated mock interviews.',
        key_highlights: JSON.stringify([
          '15 Live 1:1 Sessions',
          '30 Minutes per Live Session',
          'HR & Technical Mock Interviews',
          'Personalised Feedback & Improvement Plan'
        ]),
        features: JSON.stringify([
          {
            id: 1,
            title: '15 Live 1:1 Sessions',
            description: 'Personalised coaching on Google Meet.'
          },
          {
            id: 2,
            title: 'Mock Interviews',
            description: 'Practice real interview questions and receive feedback.'
          },
          {
            id: 3,
            title: 'Resume & Self-Introduction',
            description: 'Learn to present yourself effectively.'
          },
          {
            id: 4,
            title: 'Answer Strategy & Communication',
            description: 'Structure answers clearly and communicate with confidence.'
          },
          {
            id: 5,
            title: 'Industry-Specific Preparation',
            description: 'Receive guidance based on your industry, role, and career goals.'
          }
        ]),
        course_details: JSON.stringify({
          sessions: '15 live one-to-one sessions.',
          duration: '30 minutes per live session.',
          feedback: 'Personalised feedback and improvement plan.',
          mockInterviews: 'Mock interview practice for HR and technical interviews.',
          resumeBuilding: 'Resume building and self-introduction training.',
          etiquette: 'Body language, confidence, and professional etiquette.',
          tips: 'Tips and strategies for commonly asked interview questions.',
          highlight: 'Start Your Interview Preparation Today!'
        }),
        batch_timings: JSON.stringify([
          {
            batch: 'Batch 1',
            days: 'Monday / Wednesday / Friday',
            flexible: true,
            label: 'Flexible Scheduling'
          },
          {
            batch: 'Batch 2',
            days: 'Tuesday / Thursday / Saturday',
            flexible: true,
            label: 'Flexible Scheduling'
          }
        ]),
        learning_benefits: JSON.stringify([
          'Structure high-impact answers using the STAR method (Situation, Task, Action, Result)',
          'Overcome nervousness with simulated mock interviews for HR and technical rounds',
          'Craft a compelling self-introduction and polished resume that catches recruiter attention',
          'Master professional body language, vocal confidence, and corporate etiquette'
        ]),
        highlights: JSON.stringify([
          '15 Live 1:1 Sessions (30 mins per session on Google Meet)',
          'Mock interview practice for HR and technical rounds',
          'Resume building and self-introduction training',
          'Personalised feedback and improvement plan tailored to your industry'
        ]),
        curriculum_pillars: JSON.stringify([
          { title: 'STAR Answer Strategy & Framing', desc: 'Structuring behavioral, situational, and competency answers clearly without hesitation.' },
          { title: 'Mock Interviews with Feedback', desc: 'Realistic interview simulations for HR and managerial rounds with instant constructive feedback.' },
          { title: 'Self-Introduction & Elevator Pitch', desc: 'Crafting unforgettable "Tell me about yourself" narratives that immediately command respect.' },
          { title: 'Body Language & Etiquette', desc: 'Eye contact on camera, posture, tone modulation, eliminating filler words, and professional follow-ups.' }
        ]),
        faqs: JSON.stringify([
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
        ]),
        display_order: 5,
        is_active: true,
        is_partner: true,
        badge: 'INTERVIEW PREP TRACK',
        seo_title: 'Executive Interview Preparation Track | 1:1 Mock Interviews | English Mirror',
        seo_description: 'Crack Interviews with Confidence. 15 live 1:1 sessions, HR and technical mock interviews, resume building, and answer strategy. Start your interview preparation today!',
        meta_keywords: JSON.stringify(['Executive Interview Preparation Track', '1 on 1 mock interview', 'crack job interview', 'interview coaching', 'English Mirror'])
      }
    ];

    for (const sub of subcategories) {
      const checkSub = await pool.query('SELECT id FROM categories WHERE id = $1 OR slug = $2', [sub.id, sub.slug]);
      if (checkSub.rows.length === 0) {
        await pool.query(
          `INSERT INTO categories (
            id, slug, name, title, description, subtitle, icon, hero_image, hero_badge,
            highlights, curriculum_pillars, faqs, display_order, is_active, is_partner,
            badge, seo_title, seo_description, meta_keywords,
            parent_id, parent_slug, features, course_details, key_highlights,
            learning_benefits, batch_timings, learning_format, supporting_text,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10::jsonb, $11::jsonb, $12::jsonb, $13, $14, $15,
            $16, $17, $18, $19::jsonb,
            $20, $21, $22::jsonb, $23::jsonb, $24::jsonb,
            $25::jsonb, $26::jsonb, $27, $28,
            NOW(), NOW()
          )`,
          [
            sub.id, sub.slug, sub.name, sub.title, sub.description, sub.subtitle, sub.icon,
            sub.hero_image, sub.hero_badge, sub.highlights, sub.curriculum_pillars, sub.faqs,
            sub.display_order, sub.is_active, sub.is_partner, sub.badge, sub.seo_title,
            sub.seo_description, sub.meta_keywords,
            sub.parent_id, sub.parent_slug, sub.features, sub.course_details, sub.key_highlights,
            sub.learning_benefits, (sub as any).batch_timings || '[]', sub.learning_format, sub.supporting_text
          ]
        );
        console.log(`✅ Inserted subcategory: ${sub.name} (${sub.slug})`);
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
            sub.name, sub.title, sub.description, sub.subtitle, sub.icon,
            sub.hero_image, sub.hero_badge, sub.highlights, sub.curriculum_pillars,
            sub.faqs, sub.display_order, sub.is_active, sub.is_partner, sub.badge,
            sub.seo_title, sub.seo_description, sub.meta_keywords,
            sub.parent_id, sub.parent_slug, sub.features, sub.course_details,
            sub.key_highlights, sub.learning_benefits, (sub as any).batch_timings || '[]',
            sub.learning_format, sub.supporting_text,
            sub.id, sub.slug
          ]
        );
        console.log(`✅ Updated subcategory: ${sub.name} (${sub.slug})`);
      }
    }

    console.log('🎉 Database category synchronization complete!');
  } catch (err) {
    console.error('🔥 Error during sync:', err);
  } finally {
    await pool.end();
  }
}

sync();
