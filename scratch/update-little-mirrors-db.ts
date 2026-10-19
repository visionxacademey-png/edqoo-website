import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const HIGHLIGHTS = [
  { value: '15', label: 'Live 1:1 sessions' },
  { value: '30', label: 'Mins per session' },
  { value: '3–7', label: 'Primary classes' }
];

const FEATURES = [
  {
    id: 1,
    featureNumber: '01',
    title: '1:1 Live Classes',
    description: 'Personalised attention, no crowd and no comparison.'
  },
  {
    id: 2,
    featureNumber: '02',
    title: 'Speaking Practice',
    description: 'Builds the confidence to speak up in every session.'
  },
  {
    id: 3,
    featureNumber: '03',
    title: 'Fun & Interactive',
    description: 'Engaging activities, games and role play.'
  },
  {
    id: 4,
    featureNumber: '04',
    title: 'Customised Curriculum',
    description: "Paced to your child's level."
  },
  {
    id: 5,
    featureNumber: '05',
    title: 'Track Progress',
    description: 'Regular feedback, worksheets and an assessment.'
  },
  {
    id: 6,
    featureNumber: '06',
    title: 'Confident Kids',
    description: 'Better communication for school and life.'
  }
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('🔄 Updating Little Mirrors course in courses table...');
    const courseRes = await pool.query(
      `UPDATE courses SET
        title = $1,
        short_description = $2,
        description = $3,
        supporting_text = $4,
        highlight_text = $5,
        program_highlights = $6::jsonb,
        features = $7::jsonb,
        updated_at = NOW()
      WHERE id = 'kids-1-to-1-english-fluency-program' OR slug = 'kids-1-to-1-english-fluency-program'
      RETURNING id, title, slug, supporting_text, highlight_text, features, program_highlights`,
      [
        'Little Mirrors',
        'Fun learning today, confident communicators tomorrow.',
        'Fun learning today, confident communicators tomorrow.',
        '1:1 English Fluency for Kids',
        'Each 30-minute class blends a simple concept, a fun speaking activity and a short worksheet.',
        JSON.stringify(HIGHLIGHTS),
        JSON.stringify(FEATURES)
      ]
    );
    console.log('✅ Course updated:', courseRes.rows);

    console.log('🔄 Updating Little Mirrors category in categories table...');
    const catRes = await pool.query(
      `UPDATE categories SET
        name = $1,
        title = $1,
        subtitle = $2,
        description = $3,
        supporting_text = $4,
        highlight_text = $5,
        key_highlights = $6::jsonb,
        features = $7::jsonb,
        updated_at = NOW()
      WHERE id = 'cat-little-mirrors' OR slug = 'little-mirrors'
      RETURNING id, name, slug, subtitle, description, supporting_text, highlight_text, key_highlights, features`,
      [
        'Little Mirrors',
        '1:1 English Fluency for Kids',
        'Fun learning today, confident communicators tomorrow.',
        'Confidence first, fluency next — every child gets a trainer entirely to themselves.',
        'Each 30-minute class blends a simple concept, a fun speaking activity and a short worksheet.',
        JSON.stringify(HIGHLIGHTS),
        JSON.stringify(FEATURES)
      ]
    );
    console.log('✅ Category updated:', catRes.rows);
  } catch (err) {
    console.error('❌ Error updating DB:', err);
  } finally {
    await pool.end();
  }
}

main();
