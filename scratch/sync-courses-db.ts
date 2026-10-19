import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function syncCourses() {
  try {
    console.log('🔄 Syncing Spoken Tutorial courses in NeonDB...');

    // 1. Fluency Builder Plan
    await pool.query(
      `UPDATE courses SET
        title = $1,
        category = $2,
        categories = $3::jsonb,
        category_id = $4,
        short_description = $5,
        description = $6,
        image = $7,
        features = $8::jsonb,
        updated_at = NOW()
      WHERE id = 'standard-plan-telephonic-calling-sessions'`,
      [
        'Fluency Builder Plan',
        'Spoken Tutorial',
        JSON.stringify(['Spoken Tutorial', 'Fluency Builder Plan', 'English Mirror', 'Telephonic English']),
        'cat-fluency-builder-plan',
        'Your Complete Path to Confident English Communication. Voice Calls | Recorded Lessons | Daily Practice.',
        'Your Complete Path to Confident English Communication. Daily 15-minute one-to-one voice calls with an expert trainer. Includes 25 Phone Call Sessions, 25 Grammar + 25 Vocabulary recorded HD classes with lifetime access, 50 E-PDFs + Daily JAM Updates with WhatsApp doubt support, and certification eligibility according to course tenure requirements. Telephonic learning, daily one-to-one voice calls, and self-paced learning. Mirror your success with fluent English.',
        '/images/spoken-tutorial/fluency-builder-plan.jpg',
        JSON.stringify([
          '25 Phone Call Sessions: Daily 15-minute one-to-one voice calls with an expert trainer',
          '25 Grammar + 25 Vocabulary: Recorded HD classes with lifetime access',
          '50 E-PDFs + Daily JAM Updates: Educational resources with WhatsApp doubt support',
          'Certification: Certification eligibility according to course tenure requirements',
          'Learning format: Telephonic learning, daily 1:1 voice calls, and self-paced learning',
          'Mirror your success with fluent English'
        ])
      ]
    );
    console.log('✅ Updated Fluency Builder Plan in DB');

    // 2. Little Mirrors
    await pool.query(
      `UPDATE courses SET
        title = $1,
        category = $2,
        categories = $3::jsonb,
        category_id = $4,
        short_description = $5,
        description = $6,
        image = $7,
        features = $8::jsonb,
        updated_at = NOW()
      WHERE id = 'kids-1-to-1-english-fluency-program'`,
      [
        'Little Mirrors',
        'Spoken Tutorial',
        JSON.stringify(['Spoken Tutorial', 'Little Mirrors', 'English Mirror', 'Kids Fluency']),
        'cat-little-mirrors',
        'Fun learning today, confident communicators tomorrow. 1:1 English Fluency for Kids in Primary Classes 3–7.',
        'Fun learning today, confident communicators tomorrow. 15 Live 1:1 Sessions (30 Minutes per Session) designed for children in Primary Classes 3–7. Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet. Features 1:1 Live Classes, Speaking Practice, Fun & Interactive activities, Customised Curriculum, Track Progress, and Confident Kids outcomes.',
        '/images/spoken-tutorial/little-mirrors.jpg',
        JSON.stringify([
          '1:1 Live Classes: Personalised attention without crowding or comparison',
          'Speaking Practice: Build confidence to speak up during every session',
          'Fun & Interactive: Engaging activities, games, and role-play',
          'Customised Curriculum: Learning paced according to child level',
          'Track Progress: Regular feedback, worksheets, and assessments',
          'Confident Kids: Improve communication skills for school and everyday life',
          '15 Live 1:1 Sessions | 30 Mins/Session | Primary Classes 3–7'
        ])
      ]
    );
    console.log('✅ Updated Little Mirrors in DB');

    // 3. Corporate English Fluency Builder
    await pool.query(
      `UPDATE courses SET
        title = $1,
        category = $2,
        categories = $3::jsonb,
        category_id = $4,
        short_description = $5,
        description = $6,
        supporting_text = $7,
        highlight_text = $8,
        image = $9,
        duration = $10,
        features = $11::jsonb,
        updated_at = NOW()
      WHERE id = 'elite-corporate-transformation-track'`,
      [
        'Corporate English Fluency Builder',
        'Spoken Tutorial',
        JSON.stringify(['Spoken Tutorial', 'Corporate English Fluency Builder', 'English Mirror', 'Corporate English']),
        'cat-corporate-english-fluency-builder',
        'Your Complete Path to Confident English Communication',
        'Your Complete Path to Confident English Communication',
        'Live Coaching | Video Lessons | Daily Practice',
        'Mirror your success with fluent English',
        '/images/spoken-tutorial/corporate-english.jpg',
        '1 Month',
        JSON.stringify([
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
        ])
      ]
    );
    console.log('✅ Updated Corporate English Fluency Builder in DB');

    // 4. IELTS Intensive
    await pool.query(
      `UPDATE courses SET
        title = $1,
        category = $2,
        categories = $3::jsonb,
        category_id = $4,
        short_description = $5,
        description = $6,
        image = $7,
        features = $8::jsonb,
        updated_at = NOW()
      WHERE id = 'ielts-intensive-1-to-1-crash-training'`,
      [
        'IELTS Intensive',
        'Spoken Tutorial',
        JSON.stringify(['Spoken Tutorial', 'IELTS Intensive', 'English Mirror', 'IELTS Preparation']),
        'cat-ielts-intensive',
        'Your Fast Track to a Higher Band Score. 1:1 Crash Training covering Speaking, Reading, Writing, and Listening.',
        'Your Fast Track to a Higher Band Score. 15 live one-to-one Google Meet sessions (30 minutes per live session) with assessment covering Speaking, Reading, Writing, and Listening. Batch 1: Monday / Wednesday / Friday, Batch 2: Tuesday / Thursday / Saturday. Features 1:1 Live Sessions, Complete IELTS Preparation across all 4 modules, Deep Dive Assessment, Targeted Practice, and Higher Band Score guidance. Start Your IELTS Journey Today!',
        '/images/spoken-tutorial/ielts-intensive.jpg',
        JSON.stringify([
          '1:1 Live Sessions: Personalised coaching on Google Meet',
          'Complete IELTS Preparation: Speaking, Reading, Writing, Listening',
          'Deep Dive Assessment: Identify strengths and areas for improvement',
          'Targeted Practice: Learn strategies, receive feedback, improve performance',
          'Higher Band Score: Guidance to work towards target score',
          '15 Live 1:1 Sessions | 30 Mins/Session',
          'Batch 1: Mon/Wed/Fri | Batch 2: Tue/Thu/Sat',
          'Start Your IELTS Journey Today!'
        ])
      ]
    );
    console.log('✅ Updated IELTS Intensive in DB');

    // 5. Executive Interview Preparation Track
    await pool.query(
      `UPDATE courses SET
        title = $1,
        category = $2,
        categories = $3::jsonb,
        category_id = $4,
        short_description = $5,
        description = $6,
        image = $7,
        features = $8::jsonb,
        updated_at = NOW()
      WHERE id = 'targeted-interview-prep-masterclass'`,
      [
        'Executive Interview Preparation Track',
        'Spoken Tutorial',
        JSON.stringify(['Spoken Tutorial', 'Executive Interview Preparation Track', 'English Mirror', 'Interview Preparation']),
        'cat-executive-interview-prep-track',
        'Crack Interviews with Confidence. Personalised coaching to succeed in job interviews, career growth, and professional opportunities.',
        'Crack Interviews with Confidence. Personalised coaching on Google Meet to help you succeed in job interviews, career growth, and professional opportunities. Course details: 15 live one-to-one sessions (30 minutes per live session), personalised feedback and improvement plan, mock interview practice for HR and technical interviews, resume building and self-introduction training, body language, confidence, and professional etiquette, and tips/strategies for commonly asked interview questions. Batch 1: Monday/Wednesday/Friday, Batch 2: Tuesday/Thursday/Saturday (Flexible). Start Your Interview Preparation Today!',
        '/images/spoken-tutorial/executive-interview.jpg',
        JSON.stringify([
          '15 Live 1:1 Sessions: Personalised coaching on Google Meet',
          'Mock Interviews: Practice real interview questions and receive feedback',
          'Resume & Self-Introduction: Learn to present yourself effectively',
          'Answer Strategy & Communication: Structure answers clearly with confidence',
          'Industry-Specific Preparation: Guidance based on industry, role, career goals',
          '15 Live 1:1 Sessions | 30 Mins/Session',
          'HR and Technical Mock Interview Practice',
          'Batch 1: Mon/Wed/Fri | Batch 2: Tue/Thu/Sat (Flexible)',
          'Start Your Interview Preparation Today!'
        ])
      ]
    );
    console.log('✅ Updated Executive Interview Preparation Track in DB');

    // Also update all English Mirror courses category to 'Spoken Tutorial' while retaining 'English Mirror' in categories
    await pool.query(`
      UPDATE courses
      SET category = 'Spoken Tutorial',
          categories = CASE 
            WHEN categories::text NOT ILIKE '%Spoken Tutorial%' THEN categories || '["Spoken Tutorial"]'::jsonb
            ELSE categories
          END
      WHERE category = 'English Mirror'
    `);
    console.log('✅ Updated remaining English Mirror courses to Spoken Tutorial category');

    console.log('🎉 Courses DB sync finished successfully!');
  } catch (err) {
    console.error('🔥 Error during courses sync:', err);
  } finally {
    await pool.end();
  }
}

syncCourses();
