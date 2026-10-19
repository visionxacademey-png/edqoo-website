import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

const languageCourses = [
  {
    id: 'spoken-english-malayalam',
    slug: 'spoken-english-malayalam',
    title: 'Spoken English in Malayalam',
    category: 'Spoken Tutorial',
    categories: ['Spoken Tutorial', 'English Mirror', 'Spoken English in Malayalam'],
    short_description: 'Learn to speak English confidently with explanations and guidance in Malayalam.',
    description: 'Learn to speak English confidently with explanations and guidance in Malayalam. Our comprehensive bilingual curriculum is tailored to bridge your native tongue to fluent, professional English with dedicated 1:1 speaking practice.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    price: 2999,
    original_price: 5999,
    duration: '3 Months',
    live_hours: '40+ Live Hours',
    lessons: 36,
    level: 'Beginner to Intermediate',
    rating: 4.9,
    students: 1250,
    status: 'available',
    featured: true,
    skills: ['Everyday Conversations', 'Pronunciation & Phonetics', 'Grammar in Malayalam Context', 'Confidence Building', 'Bilingual Vocabulary'],
    who_is_it_for: ['Malayalam speakers seeking fluent conversational English', 'Working professionals and job seekers', 'Students preparing for higher education or interviews'],
    requirements: ['Comfortable understanding Malayalam', 'Smartphone or laptop with internet connection'],
    outcome: 'Speak fluent English with natural sentence flow, eliminating hesitation and grammatical doubts with Malayalam-grounded guidance.',
    features: [
      { id: 'f1', title: 'Malayalam-to-English Mentorship', description: 'Live bilingual guidance breaking down complex grammar into simple Malayalam explanations.' },
      { id: 'f2', title: 'Daily Conversational Drills', description: 'Real-world dialogue practice simulating everyday, workplace, and social scenarios.' },
      { id: 'f3', title: 'Personalized Accent & Fluency Coaching', description: 'Targeted correction for mother-tongue influence and phonetics.' },
      { id: 'f4', title: 'Verifiable Course Certificate', description: 'Receive English Mirror conversational certification upon completion.' }
    ]
  },
  {
    id: 'spoken-english-kannada',
    slug: 'spoken-english-kannada',
    title: 'Spoken English in Kannada',
    category: 'Spoken Tutorial',
    categories: ['Spoken Tutorial', 'English Mirror', 'Spoken English in Kannada'],
    short_description: 'Improve your English speaking skills through easy explanations in Kannada.',
    description: 'Improve your English speaking skills through easy explanations in Kannada. Practice everyday dialogue, overcome communication barriers, and gain speaking confidence with bilingual mentors.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    price: 2999,
    original_price: 5999,
    duration: '3 Months',
    live_hours: '40+ Live Hours',
    lessons: 36,
    level: 'Beginner to Intermediate',
    rating: 4.8,
    students: 980,
    status: 'available',
    featured: true,
    skills: ['Spoken Fluency', 'Kannada to English Translation Mastery', 'Workplace English', 'Active Listening', 'Vocabulary Building'],
    who_is_it_for: ['Kannada speakers who want to communicate confidently in English', 'Graduates and college students', 'Professionals aiming for career growth'],
    requirements: ['Comfortable understanding Kannada', 'Smartphone or laptop with internet connection'],
    outcome: 'Develop effortless conversational fluency in English while understanding grammatical concepts through Kannada explanations.',
    features: [
      { id: 'f1', title: 'Kannada-Guided Concept Clarification', description: 'Clear grammatical rules explained intuitively through everyday Kannada analogies.' },
      { id: 'f2', title: '1:1 Interactive Speech Sessions', description: 'Dedicated speaking time with zero peer judgment or crowding.' },
      { id: 'f3', title: 'Workplace & Professional Communication', description: 'Master emails, client calls, and presentation dialogue in English.' },
      { id: 'f4', title: 'Verifiable Course Certificate', description: 'Receive English Mirror conversational certification upon completion.' }
    ]
  },
  {
    id: 'spoken-english-telugu',
    slug: 'spoken-english-telugu',
    title: 'Spoken English in Telugu',
    category: 'Spoken Tutorial',
    categories: ['Spoken Tutorial', 'English Mirror', 'Spoken English in Telugu'],
    short_description: 'Learn everyday English conversations with guidance in Telugu.',
    description: 'Learn everyday English conversations with guidance in Telugu. Bridge the gap between understanding and speaking through live conversational sessions and intuitive Telugu-based explanations.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    price: 2999,
    original_price: 5999,
    duration: '3 Months',
    live_hours: '40+ Live Hours',
    lessons: 36,
    level: 'Beginner to Intermediate',
    rating: 4.9,
    students: 4234,
    status: 'available',
    featured: true,
    skills: ['Everyday Conversations', 'Telugu-to-English Thought Framing', 'Fluency & Accent Training', 'Public Speaking', 'Grammar Essentials'],
    who_is_it_for: ['Telugu native speakers aiming for English fluency', 'IT & corporate job aspirants', 'Homemakers and entrepreneurs'],
    requirements: ['Comfortable understanding Telugu', 'Smartphone or laptop with internet connection'],
    outcome: 'Transform hesitation into fluent speech with clear Telugu-to-English language structuring and daily conversation drills.',
    features: [
      { id: 'f1', title: 'Telugu-to-English Sentence Architecture', description: 'Step-by-step guidance on thinking directly in English without awkward mental translation.' },
      { id: 'f2', title: 'Real-Time Pronunciation Guidance', description: 'Personalized phonetics and cadence fine-tuning for crisp, clear speech.' },
      { id: 'f3', title: 'Interview & Career Preparation', description: 'Mock interview drills, executive introductions, and HR conversational skills.' },
      { id: 'f4', title: 'Verifiable Course Certificate', description: 'Receive English Mirror conversational certification upon completion.' }
    ]
  },
  {
    id: 'spoken-english-tamil',
    slug: 'spoken-english-tamil',
    title: 'Spoken English in Tamil',
    category: 'Spoken Tutorial',
    categories: ['Spoken Tutorial', 'English Mirror', 'Spoken English in Tamil'],
    short_description: 'Build English fluency step by step with clear explanations in Tamil.',
    description: 'Build English fluency step by step with clear explanations in Tamil. Master English sentence formation, eliminate hesitation, and speak with confidence in personal and professional situations.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    price: 2999,
    original_price: 5999,
    duration: '3 Months',
    live_hours: '40+ Live Hours',
    lessons: 36,
    level: 'Beginner to Intermediate',
    rating: 4.9,
    students: 1650,
    status: 'available',
    featured: true,
    skills: ['Step-by-step Fluency', 'Tamil-based Grammar Bridge', 'Interview Speaking Skills', 'Idioms & Daily Phrases', 'Tone & Confidence'],
    who_is_it_for: ['Tamil speakers looking to speak fluent English without fear', 'College students and job seekers', 'Working professionals targeting promotions'],
    requirements: ['Comfortable understanding Tamil', 'Smartphone or laptop with internet connection'],
    outcome: 'Achieve clear, expressive English speaking ability through systematic, structured lessons explained in Tamil.',
    features: [
      { id: 'f1', title: 'Bilingual Tamil-English Framework', description: 'Systematic modular learning linking Tamil grammar concepts directly to English syntax.' },
      { id: 'f2', title: 'Active Speaking Practice', description: 'Engaging 1:1 speaking sessions that break conversational hesitation from day one.' },
      { id: 'f3', title: 'Accent Neutralization & Confidence', description: 'Guided practice on speech clarity, pacing, and professional vocabulary.' },
      { id: 'f4', title: 'Verifiable Course Certificate', description: 'Receive English Mirror conversational certification upon completion.' }
    ]
  },
  {
    id: 'spoken-english-hindi',
    slug: 'spoken-english-hindi',
    title: 'Spoken English in Hindi',
    category: 'Spoken Tutorial',
    categories: ['Spoken Tutorial', 'English Mirror', 'Spoken English in Hindi'],
    short_description: 'Learn spoken English confidently with explanations and guidance in Hindi.',
    description: 'Learn spoken English confidently with explanations and guidance in Hindi. Our comprehensive bilingual curriculum is tailored to bridge your native tongue to fluent, professional English with dedicated 1:1 speaking practice.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    price: 2999,
    original_price: 5999,
    duration: '3 Months',
    live_hours: '40+ Live Hours',
    lessons: 36,
    level: 'Beginner to Intermediate',
    rating: 4.9,
    students: 1850,
    status: 'available',
    featured: true,
    skills: ['Everyday Conversations', 'Pronunciation & Phonetics', 'Grammar in Hindi Context', 'Confidence Building', 'Bilingual Vocabulary'],
    who_is_it_for: ['Hindi speakers seeking fluent conversational English', 'Working professionals and job seekers', 'Students preparing for higher education or interviews'],
    requirements: ['Comfortable understanding Hindi', 'Smartphone or laptop with internet connection'],
    outcome: 'Speak fluent English with natural sentence flow, eliminating hesitation and grammatical doubts with Hindi-grounded guidance.',
    features: [
      { id: 'f1', title: 'Hindi-to-English Mentorship', description: 'Live bilingual guidance breaking down complex grammar into simple Hindi explanations.' },
      { id: 'f2', title: 'Daily Conversational Drills', description: 'Real-world dialogue practice simulating everyday, workplace, and social scenarios.' },
      { id: 'f3', title: 'Personalized Accent & Fluency Coaching', description: 'Targeted correction for mother-tongue influence and phonetics.' },
      { id: 'f4', title: 'Verifiable Course Certificate', description: 'Receive English Mirror conversational certification upon completion.' }
    ]
  }
];

async function run() {
  const client = await pool.connect();
  try {
    console.log('🔄 Upserting 4 language courses into NeonDB...');
    for (const c of languageCourses) {
      await client.query(`
        INSERT INTO courses (
          id, slug, title, category, categories, short_description, description,
          image, price, original_price, duration, live_hours, lessons, level,
          rating, students, status, featured, skills, who_is_it_for, requirements,
          outcome, features, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5::jsonb, $6, $7,
          $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19::jsonb, $20::jsonb, $21::jsonb,
          $22, $23::jsonb, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          categories = EXCLUDED.categories,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          duration = EXCLUDED.duration,
          live_hours = EXCLUDED.live_hours,
          lessons = EXCLUDED.lessons,
          level = EXCLUDED.level,
          rating = EXCLUDED.rating,
          students = EXCLUDED.students,
          status = EXCLUDED.status,
          featured = EXCLUDED.featured,
          skills = EXCLUDED.skills,
          who_is_it_for = EXCLUDED.who_is_it_for,
          requirements = EXCLUDED.requirements,
          outcome = EXCLUDED.outcome,
          features = EXCLUDED.features,
          updated_at = NOW()
      `, [
        c.id, c.slug, c.title, c.category, JSON.stringify(c.categories),
        c.short_description, c.description, c.image, c.price, c.original_price,
        c.duration, c.live_hours, c.lessons, c.level, c.rating, c.students,
        c.status, c.featured, JSON.stringify(c.skills), JSON.stringify(c.who_is_it_for),
        JSON.stringify(c.requirements), c.outcome, JSON.stringify(c.features)
      ]);
      console.log(`✅ Upserted course: [${c.id}] ${c.title}`);
    }
    console.log('🎉 Successfully saved all 4 language courses to NeonDB.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('❌ Error upserting language courses:', err);
  process.exit(1);
});
