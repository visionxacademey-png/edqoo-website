import { query } from '../server/db/index';

async function checkCategories() {
  const res = await query(`
    SELECT id, slug, name, title, features
    FROM categories
    WHERE title ILIKE '%communicative%' OR name ILIKE '%communicative%' OR id ILIKE '%spoken%'
  `);
  console.log('Categories matching:', JSON.stringify(res.rows, null, 2));
  process.exit(0);
}

checkCategories();
