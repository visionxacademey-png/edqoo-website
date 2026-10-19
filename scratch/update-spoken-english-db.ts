import { pool, query } from '../server/db/index';

async function main() {
  console.log('Checking current categories in DB...');
  const res = await query(`SELECT id, slug, name, badge, is_partner FROM categories WHERE id = 'cat-spoken-tutorial' OR slug LIKE '%spoken%' OR name ILIKE '%spoken%'`);
  console.log('Current rows:', res.rows);

  console.log("Updating cat-spoken-tutorial to 'Spoken English', badge = NULL, is_partner = false...");
  const updateRes = await query(`
    UPDATE categories 
    SET name = 'Spoken English', 
        title = 'Spoken English — English Mirror Spoken English Programs',
        badge = NULL, 
        is_partner = false 
    WHERE id = 'cat-spoken-tutorial'
    RETURNING id, slug, name, badge, is_partner
  `);
  console.log('Updated row:', updateRes.rows);

  console.log("Checking courses table category values...");
  const coursesRes = await query(`
    SELECT id, slug, title, category 
    FROM courses 
    WHERE category ILIKE '%spoken%' OR category ILIKE '%english%'
  `);
  console.log(`Found ${coursesRes.rows.length} courses:`, coursesRes.rows.map(r => ({ id: r.id, title: r.title, category: r.category })));

  await pool.end();
}

main().catch(console.error);
