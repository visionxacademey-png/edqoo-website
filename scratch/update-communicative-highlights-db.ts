import { query } from '../server/db/index';

async function updateCommunicativeEnglishHighlights() {
  console.log('--- Updating 1:1 Communicative English Mastery Core Highlights in NeonDB ---');

  const updatedFeatures = [
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
  ];

  const updateRes = await query(`
    UPDATE courses
    SET
      features = $1::jsonb,
      updated_at = NOW()
    WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
    RETURNING id, title, features
  `, [JSON.stringify(updatedFeatures)]);

  if (updateRes.rows.length === 0) {
    throw new Error('Course 1-to-1-live-spoken-english not found in courses table!');
  }

  console.log('✅ Updated course in DB:');
  console.log(JSON.stringify(updateRes.rows[0], null, 2));

  process.exit(0);
}

updateCommunicativeEnglishHighlights().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
