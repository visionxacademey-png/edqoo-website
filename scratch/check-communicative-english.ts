import { query } from '../server/db/index';

async function checkCommunicativeEnglish() {
  const courseRes = await query(`
    SELECT *
    FROM courses
    WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
  `);
  console.log('--- DB COURSE (1-to-1-live-spoken-english) ---');
  console.log(JSON.stringify(courseRes.rows, null, 2));

  const catRes = await query(`
    SELECT *
    FROM categories
    WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
  `);
  console.log('--- DB CATEGORY (1-to-1-live-spoken-english) ---');
  console.log(JSON.stringify(catRes.rows, null, 2));

  process.exit(0);
}

checkCommunicativeEnglish();
