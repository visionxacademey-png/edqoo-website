import { pool, query, isDbConnected } from '../server/db/index';

async function main() {
  console.log('Querying categories from Neon DB...');
  const res = await query(`
    SELECT id, slug, name, parent_id, parent_slug, display_order, is_active
    FROM categories
    ORDER BY display_order ASC, name ASC
  `);
  
  console.log(`Total categories in DB: ${res.rows.length}`);
  console.log('\n--- ALL CATEGORIES ---');
  res.rows.forEach((r: any) => {
    console.log(`ID: ${(r.id || '').padEnd(25)} | SLUG: ${(r.slug || '').padEnd(35)} | NAME: ${(r.name || '').padEnd(35)} | PARENT: ${r.parent_slug || 'TOP-LEVEL'}`);
  });

  const spokenTutorials = res.rows.filter((r: any) => r.name.toLowerCase().trim() === 'spoken tutorial');
  console.log(`\nParent categories named 'Spoken Tutorial': ${spokenTutorials.length}`);
  spokenTutorials.forEach((r: any) => {
    console.log(` -> ID: ${r.id}, SLUG: ${r.slug}, PARENT_ID: ${r.parent_id}`);
  });

  const subcats = res.rows.filter((r: any) => r.parent_slug === 'spoken-tutorial' || r.parent_id === 'cat-spoken-tutorial');
  console.log(`\nSubcategories under 'Spoken Tutorial': ${subcats.length}`);
  subcats.forEach((r: any) => {
    console.log(` -> ID: ${r.id}, SLUG: ${r.slug}, NAME: ${r.name}`);
  });

  await pool.end();
}

main().catch(console.error);
