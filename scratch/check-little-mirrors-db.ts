import { query } from '../server/db/index';

async function checkLittleMirrorsDB() {
  const courseRes = await query(`
    SELECT *
    FROM courses
    WHERE id = 'kids-1-to-1-english-fluency-program' OR slug = 'kids-1-to-1-english-fluency-program' OR slug = 'little-mirrors'
  `);
  console.log('--- LITTLE MIRRORS COURSE IN DB ---');
  console.log(JSON.stringify(courseRes.rows, null, 2));

  const catRes = await query(`
    SELECT *
    FROM categories
    WHERE id = 'cat-little-mirrors' OR slug = 'little-mirrors'
  `);
  console.log('--- LITTLE MIRRORS CATEGORY IN DB ---');
  console.log(JSON.stringify(catRes.rows, null, 2));

  process.exit(0);
}

checkLittleMirrorsDB();
