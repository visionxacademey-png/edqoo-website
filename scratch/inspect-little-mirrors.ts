import { query } from '../server/db/index';

async function inspectLittleMirrorsFields() {
  const courseRes = await query(`
    SELECT *
    FROM courses
    WHERE id = 'kids-1-to-1-english-fluency-program'
  `);
  const course = courseRes.rows[0];
  console.log('--- COURSE FIELDS MATCHING 3–7 or 3-7 or Primary ---');
  for (const [k, v] of Object.entries(course)) {
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (/3–7|3-7|Primary/i.test(s)) {
      console.log(`Course [${k}]:`, s);
    }
  }

  const catRes = await query(`
    SELECT *
    FROM categories
    WHERE id = 'cat-little-mirrors'
  `);
  const cat = catRes.rows[0];
  console.log('--- CATEGORY FIELDS MATCHING 3–7 or 3-7 or Primary ---');
  for (const [k, v] of Object.entries(cat)) {
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (/3–7|3-7|Primary/i.test(s)) {
      console.log(`Category [${k}]:`, s);
    }
  }

  process.exit(0);
}

inspectLittleMirrorsFields();
