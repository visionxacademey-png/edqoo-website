import { query, resetPool } from '../server/db/index';

async function main() {
  console.log('--- UPDATING EXECUTIVE INTERVIEW PREPARATION TRACK IN DATABASE ---');

  const interviewFeatures = [
    {
      id: 1,
      featureNumber: '01',
      title: '15 Live 1:1 Sessions',
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
  ];

  const courseDetailsList = [
    '15 Live 1:1 Sessions (Google Meet)',
    '30 Minutes per Live Session',
    'Personalized feedback and improvement plan',
    'Mock interview practice (HR + Technical)',
    'Resume building and self-introduction training',
    'Body language, confidence & professional etiquette',
    'Tips and strategies to answer commonly asked questions'
  ];

  const batchTimings = [
    {
      name: 'Batch 1',
      batch: 'Batch 1',
      days: 'Monday / Wednesday / Friday',
      timing: 'Flexible Scheduling',
      label: 'Flexible Scheduling'
    },
    {
      name: 'Batch 2',
      batch: 'Batch 2',
      days: 'Tuesday / Thursday / Saturday',
      timing: 'Flexible Scheduling',
      label: 'Flexible Scheduling'
    }
  ];

  const bottomBenefits = [
    'Career Growth',
    'Build Confidence',
    'Professional Success',
    'Personalized Guidance'
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
    WHERE id = 'targeted-interview-prep-masterclass'
    RETURNING id, title, short_description, description, supporting_text, highlight_text, features, image, duration`,
    [
      'Executive Interview Preparation Track',
      'Crack Interviews with Confidence. Personalized coaching to help you succeed in job interviews, career growth, and professional opportunities.',
      'Personalized coaching to help you succeed in job interviews, career growth, and professional opportunities.',
      'Be Interview Ready!',
      'Crack Interviews with Confidence',
      JSON.stringify(interviewFeatures),
      '/images/spoken-tutorial/executive-interview.jpg',
      '1 Month'
    ]
  );

  if (courseRes.rows.length > 0) {
    console.log('✅ Updated course in courses table:', JSON.stringify(courseRes.rows[0], null, 2));
  } else {
    console.warn('⚠️ Course targeted-interview-prep-masterclass not found in courses table');
  }

  // 2. Update categories table
  const catRes = await query(
    `UPDATE categories SET
      name = $1,
      title = $2,
      subtitle = $3,
      description = $4,
      supporting_text = $5,
      highlight_text = $6,
      features = $7::jsonb,
      course_details = $8::jsonb,
      batch_timings = $9::jsonb,
      learning_benefits = $10::jsonb,
      hero_image = $11,
      updated_at = NOW()
    WHERE id = 'cat-executive-interview-prep-track' OR slug = 'executive-interview-preparation-track'
    RETURNING id, name, title, subtitle, description, supporting_text, highlight_text, features, hero_image`,
    [
      'Executive Interview Preparation Track',
      '1:1 Executive Interview Preparation Track',
      'Crack Interviews with Confidence',
      'Personalized coaching to help you succeed in job interviews, career growth, and professional opportunities.',
      'Be Interview Ready!',
      'Crack Interviews with Confidence',
      JSON.stringify(interviewFeatures),
      JSON.stringify({
        detailsList: courseDetailsList,
        sessionSummary: '15 Live Sessions | 30 Minutes Each'
      }),
      JSON.stringify(batchTimings),
      JSON.stringify(bottomBenefits),
      '/images/spoken-tutorial/executive-interview.jpg'
    ]
  );

  if (catRes.rows.length > 0) {
    console.log('✅ Updated category in categories table:', JSON.stringify(catRes.rows[0], null, 2));
  } else {
    console.warn('⚠️ Category cat-executive-interview-prep-track not found in categories table');
  }

  await resetPool();
  console.log('Done database update!');
}

main().catch(console.error);
