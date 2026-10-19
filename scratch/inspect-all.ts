import { query } from '../server/db/index';

async function inspectAllFields() {
  const courseRes = await query(`SELECT * FROM courses WHERE id = 'targeted-interview-prep-masterclass'`);
  const course = courseRes.rows[0];
  console.log('--- ALL COURSE FIELDS WITH NUMBERS OR SESSIONS ---');
  for (const [key, val] of Object.entries(course)) {
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (/9|15|session|live/i.test(str)) {
      console.log(`Course [${key}]:`, str);
    }
  }

  const catRes = await query(`SELECT * FROM categories WHERE id = 'cat-executive-interview-prep-track'`);
  const cat = catRes.rows[0];
  console.log('--- ALL CATEGORY FIELDS WITH NUMBERS OR SESSIONS ---');
  for (const [key, val] of Object.entries(cat)) {
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (/9|15|session|live/i.test(str)) {
      console.log(`Category [${key}]:`, str);
    }
  }

  process.exit(0);
}

inspectAllFields();
