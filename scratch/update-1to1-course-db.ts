import { query } from '../server/db/index.js';

async function update1to1Course() {
  try {
    console.log('1. Adding supporting_text and highlight_text columns if not present...');
    await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS supporting_text TEXT');
    await query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS highlight_text TEXT');

    const featuresData = [
      {
        id: 1,
        featureNumber: '01',
        title: '15 Live 1:1 Sessions',
        description: 'Expert-led speaking practice'
      },
      {
        id: 2,
        featureNumber: '02',
        title: '25 Grammar + 25 Vocabulary',
        description: 'HD lessons with lifetime access'
      },
      {
        id: 3,
        featureNumber: '03',
        title: '25 Success Habits',
        description: 'Build consistent speaking practice'
      },
      {
        id: 4,
        featureNumber: '04',
        title: '50+ E-PDFs + 200+ Power Words',
        description: 'Study resources for confident communication'
      }
    ];

    console.log('2. Updating 1:1 Communicative English Mastery course in NeonDB...');
    const result = await query(
      `UPDATE courses 
       SET title = $1,
           description = $2,
           short_description = $3,
           supporting_text = $4,
           highlight_text = $5,
           features = $6::jsonb,
           updated_at = NOW()
       WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
       RETURNING id, slug, title, description, short_description, supporting_text, highlight_text, features`,
      [
        '1:1 Communicative English Mastery',
        'Your Complete Path to Confident English Communication',
        'Your Complete Path to Confident English Communication',
        'Live Coaching | Video Lessons | Daily Practice',
        'Mirror your success with fluent English',
        JSON.stringify(featuresData)
      ]
    );

    console.log('Update result row count:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('Updated record:', JSON.stringify(result.rows[0], null, 2));
    }
  } catch (err: any) {
    console.error('Error updating course in DB:', err.message);
  } finally {
    process.exit(0);
  }
}

update1to1Course();
