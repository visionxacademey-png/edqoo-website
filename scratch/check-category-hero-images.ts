import { pool, query } from '../server/db/index';

async function checkCategoryImages() {
  const res = await query(`
    SELECT id, slug, name, parent_slug, hero_image, icon
    FROM categories
    WHERE parent_slug = 'spoken-tutorial' OR parent_id = 'cat-spoken-tutorial' OR slug = 'spoken-tutorial'
    ORDER BY display_order ASC
  `);

  console.log(`Found ${res.rows.length} Spoken Tutorial categories in DB:`);
  res.rows.forEach((r: any) => {
    console.log(`- [${r.slug}] ${r.name}`);
    console.log(`  hero_image: "${r.hero_image}"`);
  });

  await pool.end();
}

checkCategoryImages().catch(console.error);
