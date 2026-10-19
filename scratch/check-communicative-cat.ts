import { query } from '../server/db/index.js';

async function checkCat() {
  try {
    const res = await query("SELECT * FROM categories WHERE name ILIKE '%communicative%' OR slug ILIKE '%communicative%' OR id ILIKE '%communicative%' OR id ILIKE '%1-to-1%' OR slug ILIKE '%1-to-1%'");
    console.log('Matching categories:', res.rows.length);
    res.rows.forEach(r => console.log(r));
  } catch (e: any) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}

checkCat();
