import { query, resetPool } from '../server/db/index';

async function updateIeltsInDb() {
  console.log('--- UPDATING IELTS INTENSIVE IN NEON DATABASE ---');

  const features = [
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
  ];

  const courseDetails = {
    sessions: '15 Live 1:1 Google Meet Sessions',
    duration: '30 minutes per session, focused on academic or general training needs.',
    assessment: 'Deep Dive Assessment covering Speaking, Reading, Writing, and Listening.',
    sessionSummary: '15 Live Sessions | 30 Minutes Each',
    detailsList: [
      '15 Live 1:1 Google Meet Sessions: 30 minutes per session, focused on academic or general training needs.',
      'Deep Dive Assessment: Assessment covering Speaking, Reading, Writing, and Listening.'
    ]
  };

  const batchTimings = [
    {
      batch: 'BATCH 1',
      name: 'BATCH 1',
      days: 'Monday / Wednesday / Friday',
      label: 'BATCH 1',
      flexible: true
    },
    {
      batch: 'BATCH 2',
      name: 'BATCH 2',
      days: 'Tuesday / Thursday / Saturday',
      label: 'BATCH 2',
      flexible: true
    }
  ];

  const learningBenefits = [
    'Expert Guidance',
    'Personalized Feedback',
    'Flexible Batches',
    'Track Your Progress'
  ];

  const keyHighlights = [
    '15 Live 1:1 Sessions',
    '30 Minutes per Session',
    'All 4 IELTS Modules Covered',
    'Deep Dive Assessment'
  ];

  try {
    // 1. Update courses table
    const courseRes = await query(
      `UPDATE courses 
       SET title = $1,
           short_description = $2,
           description = $3,
           supporting_text = $4,
           highlight_text = $5,
           features = $6,
           image = $7,
           duration = $8
       WHERE id = 'ielts-intensive-1-to-1-crash-training'
       RETURNING id, title, short_description, description, supporting_text, highlight_text, features, image, duration`,
      [
        'IELTS Intensive',
        'Your Fast Track to a Higher Band Score. 1:1 Crash Training covering Speaking, Reading, Writing, and Listening.',
        'Your Fast Track to a Higher Band Score. Personalized coaching on Google Meet to help you achieve your target band score with complete preparation across Speaking, Reading, Writing, and Listening.',
        '1:1 Crash Training',
        'Your Fast Track to a Higher Band Score',
        JSON.stringify(features),
        '/images/spoken-tutorial/ielts-intensive.jpg',
        '1 Month'
      ]
    );

    console.log('✅ Updated course in courses table:', JSON.stringify(courseRes.rows[0], null, 2));

    // 2. Update categories table
    const catRes = await query(
      `UPDATE categories 
       SET name = $1,
           title = $2,
           subtitle = $3,
           description = $4,
           supporting_text = $5,
           highlight_text = $6,
           features = $7,
           hero_image = $8,
           course_details = $9,
           batch_timings = $10,
           learning_benefits = $11,
           key_highlights = $12
       WHERE id = 'cat-ielts-intensive'
       RETURNING id, name, title, subtitle, description, supporting_text, highlight_text, features, hero_image`,
      [
        'IELTS Intensive',
        'IELTS Intensive',
        '1:1 Crash Training',
        'Your Fast Track to a Higher Band Score. Personalized coaching on Google Meet to help you achieve your target band score with complete preparation across Speaking, Reading, Writing, and Listening.',
        '1:1 Crash Training',
        'Your Fast Track to a Higher Band Score',
        JSON.stringify(features),
        '/images/spoken-tutorial/ielts-intensive.jpg',
        JSON.stringify(courseDetails),
        JSON.stringify(batchTimings),
        JSON.stringify(learningBenefits),
        JSON.stringify(keyHighlights)
      ]
    );

    console.log('✅ Updated category in categories table:', JSON.stringify(catRes.rows[0], null, 2));
    console.log('Done database update!');
  } catch (err) {
    console.error('Error during DB update:', err);
  } finally {
    await resetPool();
  }
}

updateIeltsInDb();
