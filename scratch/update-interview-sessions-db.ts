import { query } from '../server/db/index';

async function updateExecutiveInterviewInDB() {
  console.log('--- Updating Executive Interview Preparation Track to 12 Live Sessions in NeonDB ---');

  // 1. Update courses table
  // Fetch current features
  const courseRes = await query(`
    SELECT id, features
    FROM courses
    WHERE id = 'targeted-interview-prep-masterclass'
  `);

  if (courseRes.rows.length === 0) {
    throw new Error('Course targeted-interview-prep-masterclass not found!');
  }

  const courseFeatures = courseRes.rows[0].features || [];
  if (courseFeatures.length > 0) {
    courseFeatures[0].title = '12 Live 1:1 Sessions';
  }

  const updateCourseRes = await query(`
    UPDATE courses
    SET
      live_hours = '12 Live Sessions',
      lessons = 12,
      features = $1::jsonb,
      updated_at = NOW()
    WHERE id = 'targeted-interview-prep-masterclass'
    RETURNING id, title, live_hours, lessons, features
  `, [JSON.stringify(courseFeatures)]);

  console.log('✅ Updated courses table:');
  console.log(JSON.stringify(updateCourseRes.rows[0], null, 2));

  // 2. Update categories table
  const catRes = await query(`
    SELECT id, highlights, features, course_details, key_highlights, seo_description
    FROM categories
    WHERE id = 'cat-executive-interview-prep-track' OR slug = 'executive-interview-preparation-track'
  `);

  if (catRes.rows.length === 0) {
    throw new Error('Category cat-executive-interview-prep-track not found!');
  }

  const cat = catRes.rows[0];
  const catHighlights = Array.isArray(cat.highlights)
    ? cat.highlights.map((h: string) => h.replace(/15 Live|9 Live/g, '12 Live'))
    : ['12 Live 1:1 Sessions (30 mins per session on Google Meet)', 'Mock interview practice for HR and technical rounds', 'Resume building and self-introduction training', 'Personalised feedback and improvement plan tailored to your industry'];

  const catFeatures = Array.isArray(cat.features) ? cat.features : [];
  if (catFeatures.length > 0) {
    catFeatures[0].title = '12 Live 1:1 Sessions';
  }

  const catCourseDetails = cat.course_details || {};
  if (Array.isArray(catCourseDetails.detailsList)) {
    catCourseDetails.detailsList = catCourseDetails.detailsList.map((d: string) => d.replace(/15 Live|9 Live/g, '12 Live'));
  }
  catCourseDetails.sessionSummary = '12 Live Sessions | 30 Minutes Each';

  const catKeyHighlights = Array.isArray(cat.key_highlights)
    ? cat.key_highlights.map((kh: string) => kh.replace(/15 Live|9 Live/g, '12 Live'))
    : ['12 Live 1:1 Sessions', '30 Minutes per Live Session', 'HR & Technical Mock Interviews', 'Personalised Feedback & Improvement Plan'];

  const seoDescription = (cat.seo_description || '').replace(/15 live|9 live/gi, '12 live');

  const updateCatRes = await query(`
    UPDATE categories
    SET
      highlights = $1::jsonb,
      features = $2::jsonb,
      course_details = $3::jsonb,
      key_highlights = $4::jsonb,
      seo_description = $5,
      learning_format = $6,
      updated_at = NOW()
    WHERE id = 'cat-executive-interview-prep-track' OR slug = 'executive-interview-preparation-track'
    RETURNING id, title, highlights, features, course_details, key_highlights, learning_format
  `, [
    JSON.stringify(catHighlights),
    JSON.stringify(catFeatures),
    JSON.stringify(catCourseDetails),
    JSON.stringify(catKeyHighlights),
    seoDescription,
    '12 Live 1:1 Sessions (Google Meet) • 30 Minutes per Live Session'
  ]);

  console.log('✅ Updated categories table:');
  console.log(JSON.stringify(updateCatRes.rows[0], null, 2));

  process.exit(0);
}

updateExecutiveInterviewInDB().catch(err => {
  console.error('Error updating DB:', err);
  process.exit(1);
});
