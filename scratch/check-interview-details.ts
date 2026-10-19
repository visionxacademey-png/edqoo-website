import { query } from '../server/db/index';

async function checkInterviewCourse() {
  try {
    const courseRes = await query(`
      SELECT *
      FROM courses
      WHERE id = 'targeted-interview-prep-masterclass' OR slug = 'targeted-interview-prep-masterclass'
    `);
    console.log('--- COURSE IN DB ---');
    console.log(JSON.stringify(courseRes.rows, null, 2));

    const catRes = await query(`
      SELECT *
      FROM categories
      WHERE id = 'cat-executive-interview-prep-track' OR slug = 'executive-interview-prep-track'
    `);
    console.log('--- CATEGORY IN DB ---');
    console.log(JSON.stringify(catRes.rows, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkInterviewCourse();
