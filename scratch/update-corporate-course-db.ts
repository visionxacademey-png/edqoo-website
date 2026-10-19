import { query, resetPool } from '../server/db/index';

async function main() {
  console.log('--- UPDATING CORPORATE ENGLISH FLUENCY BUILDER IN DATABASE ---');

  const courseFeatures = [
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
  ];

  // 1. Update courses table
  const courseRes = await query(
    `UPDATE courses SET
      title = $1,
      short_description = $2,
      description = $3,
      supporting_text = $4,
      highlight_text = $5,
      features = $6::jsonb,
      image = $7,
      duration = $8,
      updated_at = NOW()
    WHERE id = 'elite-corporate-transformation-track'
    RETURNING id, title, short_description, supporting_text, highlight_text, features, image, duration`,
    [
      'Corporate English Fluency Builder',
      'Your Complete Path to Confident English Communication',
      'Your Complete Path to Confident English Communication',
      'Live Coaching | Video Lessons | Daily Practice',
      'Mirror your success with fluent English',
      JSON.stringify(courseFeatures),
      '/images/spoken-tutorial/corporate-english.jpg',
      '1 Month'
    ]
  );

  if (courseRes.rows.length > 0) {
    console.log('✅ Updated course in courses table:', JSON.stringify(courseRes.rows[0], null, 2));
  } else {
    console.warn('⚠️ Course elite-corporate-transformation-track not found in courses table');
  }

  // 2. Update categories table
  const catRes = await query(
    `UPDATE categories SET
      name = $1,
      title = $2,
      description = $3,
      supporting_text = $4,
      highlight_text = $5,
      learning_format = $6,
      features = $7::jsonb,
      hero_image = $8,
      updated_at = NOW()
    WHERE id = 'cat-corporate-english-fluency-builder'
    RETURNING id, name, title, description, supporting_text, highlight_text, learning_format, features, hero_image`,
    [
      'Corporate English Fluency Builder',
      'Corporate English Fluency Builder',
      'Your Complete Path to Confident English Communication',
      'Live Coaching | Video Lessons | Daily Practice',
      'Mirror your success with fluent English',
      'Live 1:1 coaching + self-paced learning',
      JSON.stringify(courseFeatures),
      '/images/spoken-tutorial/corporate-english.jpg'
    ]
  );

  if (catRes.rows.length > 0) {
    console.log('✅ Updated category in categories table:', JSON.stringify(catRes.rows[0], null, 2));
  } else {
    console.warn('⚠️ Category cat-corporate-english-fluency-builder not found in categories table');
  }

  await resetPool();
  console.log('Done!');
}

main().catch(console.error);
