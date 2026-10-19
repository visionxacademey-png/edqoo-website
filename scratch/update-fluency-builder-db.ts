import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    console.log('⚡ Updating Fluency Builder Plan in NeonDB...');

    // 1. Ensure columns exist on courses table
    await pool.query(`
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS supporting_text TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS highlight_text TEXT;
    `);

    // 2. Ensure columns exist on categories table
    await pool.query(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS supporting_text VARCHAR(255);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS highlight_text VARCHAR(255);
    `);

    const features = [
      {
        id: 1,
        featureNumber: '01',
        title: '25 Phone Call Sessions',
        description: 'Daily 15-minute 1-1 voice calls with an expert trainer.'
      },
      {
        id: 2,
        featureNumber: '02',
        title: '25 Grammar + 25 Vocabulary',
        description: 'Recorded HD classes with lifetime access.'
      },
      {
        id: 3,
        featureNumber: '03',
        title: '50 E-PDFs + Daily JAM Updates',
        description: 'Educational resources with WhatsApp doubt support.'
      },
      {
        id: 4,
        featureNumber: '04',
        title: 'Certification',
        description: 'Earned for course tenures of 3 months and above.'
      }
    ];

    // 3. Update existing course record (id: standard-plan-telephonic-calling-sessions)
    const updateCourseRes = await pool.query(
      `UPDATE courses
       SET title = $1,
           description = $2,
           short_description = $3,
           supporting_text = $4,
           highlight_text = $5,
           features = $6::jsonb,
           updated_at = NOW()
       WHERE id = 'standard-plan-telephonic-calling-sessions'
          OR slug = 'standard-plan-telephonic-calling-sessions'
          OR slug = 'fluency-builder-plan'
       RETURNING id, slug, title, description, supporting_text, highlight_text, features`,
      [
        'Fluency Builder Plan',
        'Your Complete Path to Confident English Communication',
        'Your Complete Path to Confident English Communication',
        'Voice Calls | Recorded Lessons | Daily Practice',
        'Mirror your success with fluent English',
        JSON.stringify(features)
      ]
    );

    console.log('✅ Course updated:', JSON.stringify(updateCourseRes.rows, null, 2));

    // 4. Update category record if exists
    const updateCatRes = await pool.query(
      `UPDATE categories
       SET name = 'Fluency Builder Plan',
           title = 'Fluency Builder Plan — Telephonic Sessions',
           subtitle = 'Telephonic Sessions',
           description = 'Your Complete Path to Confident English Communication',
           supporting_text = 'Voice Calls | Recorded Lessons | Daily Practice',
           highlight_text = 'Mirror your success with fluent English',
           features = $1::jsonb,
           updated_at = NOW()
       WHERE slug = 'fluency-builder-plan'
          OR id = 'cat-fluency-builder-plan'
       RETURNING id, slug, name, title, description, supporting_text, highlight_text`,
      [JSON.stringify(features)]
    );

    console.log('✅ Category updated:', JSON.stringify(updateCatRes.rows, null, 2));
  } catch (err) {
    console.error('❌ Error updating DB:', err);
  } finally {
    await pool.end();
  }
}

main();
