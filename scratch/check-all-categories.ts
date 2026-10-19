import { query } from '../server/db/index.js';

async function checkCategories() {
  try {
    const res = await query('SELECT id, name, slug, hero_image FROM categories');
    console.log('Categories in DB:');
    res.rows.forEach(c => {
      console.log(`- [${c.id}] name: "${c.name}", slug: "${c.slug}", hero_image: "${c.hero_image}"`);
    });
  } catch (e: any) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}

checkCategories();
