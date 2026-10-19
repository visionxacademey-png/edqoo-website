import { query } from '../server/db/index';

async function updateLittleMirrorsClassLevels() {
  console.log('--- Updating Little Mirrors to Class 3–7 & 8–12 in NeonDB ---');

  // 1. Update courses table
  const updatedProgramHighlights = [
    { label: 'Live 1:1 sessions', value: '15' },
    { label: 'Mins per session', value: '30' },
    { label: 'Eligible classes', value: 'Class 3–7 & 8–12' }
  ];

  const updatedWhoIsItFor = [
    'School students in Class 3–7 & 8–12 wanting to speak English naturally without shyness.',
    'High school students preparing for public speaking, presentations, and higher education.'
  ];

  const courseRes = await query(`
    UPDATE courses
    SET
      program_highlights = $1::jsonb,
      who_is_it_for = $2::jsonb,
      updated_at = NOW()
    WHERE id = 'kids-1-to-1-english-fluency-program' OR slug = 'kids-1-to-1-english-fluency-program'
    RETURNING id, title, program_highlights, who_is_it_for
  `, [JSON.stringify(updatedProgramHighlights), JSON.stringify(updatedWhoIsItFor)]);

  console.log('✅ Updated courses table for Little Mirrors:');
  console.log(JSON.stringify(courseRes.rows[0], null, 2));

  // 2. Update categories table
  const updatedHighlights = [
    '15 Live 1:1 Sessions: 30 minutes each with dedicated child trainer',
    'Designed for children in Class 3–7 & 8–12',
    'Blended 30-min structure: Concept + Speaking Activity + Worksheet',
    'Regular feedback, progress reports, and engaging role-play'
  ];

  const updatedKeyHighlights = [
    { label: 'Live 1:1 sessions', value: '15' },
    { label: 'Mins per session', value: '30' },
    { label: 'Eligible classes', value: 'Class 3–7 & 8–12' }
  ];

  const updatedCourseDetails = {
    attention: 'Personalised attention without crowding or comparison.',
    activities: 'Engaging games, role-play, and storytelling designed to spark child curiosity.',
    sessionCount: '15 Live 1:1 Sessions',
    targetAudience: 'Designed for children in Class 3–7 & 8–12.',
    sessionDuration: '30 Minutes per Session',
    blendedStructure: 'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet.'
  };

  const updatedFaqs = [
    {
      question: 'What age group or classes is Little Mirrors designed for?',
      answer: 'Little Mirrors is specially designed for children in Class 3–7 & 8–12.'
    },
    {
      question: 'How is each 30-minute class conducted?',
      answer: 'Each 30-minute class blends a simple concept, a fun speaking activity, and a short worksheet in a warm 1:1 environment.'
    },
    {
      question: 'Are classes one-to-one or in groups?',
      answer: 'All Little Mirrors sessions are strictly 1:1 live sessions to guarantee personalised attention without crowding or comparison.'
    }
  ];

  const catRes = await query(`
    UPDATE categories
    SET
      highlights = $1::jsonb,
      key_highlights = $2::jsonb,
      course_details = $3::jsonb,
      faqs = $4::jsonb,
      supporting_text = $5,
      seo_title = $6,
      seo_description = $7,
      updated_at = NOW()
    WHERE id = 'cat-little-mirrors' OR slug = 'little-mirrors'
    RETURNING id, title, highlights, key_highlights, course_details, supporting_text, seo_title, seo_description
  `, [
    JSON.stringify(updatedHighlights),
    JSON.stringify(updatedKeyHighlights),
    JSON.stringify(updatedCourseDetails),
    JSON.stringify(updatedFaqs),
    '1:1 Live Classes | Interactive Activities | Class 3–7 & 8–12',
    'Little Mirrors | 1:1 English Fluency for Kids (Class 3–7 & 8–12) | English Mirror',
    'Fun learning today, confident communicators tomorrow. Little Mirrors offers 15 live 1:1 English sessions (30 mins each) for kids in Class 3–7 & 8–12.'
  ]);

  console.log('✅ Updated categories table for Little Mirrors:');
  console.log(JSON.stringify(catRes.rows[0], null, 2));

  process.exit(0);
}

updateLittleMirrorsClassLevels().catch(err => {
  console.error('Error updating Little Mirrors:', err);
  process.exit(1);
});
