import { pool, query } from '../server/db/index';

async function main() {
  const res = await query(`
    SELECT id, slug, title, category, category_id, category_ids, categories 
    FROM courses 
    WHERE category ILIKE '%spoken%' 
       OR category ILIKE '%english%' 
       OR slug LIKE '1-to-1-%' 
       OR slug LIKE 'standard-plan%' 
       OR slug LIKE 'kids-1-%' 
       OR slug LIKE 'ielts-%' 
       OR slug LIKE 'elite-corporate%' 
       OR slug LIKE 'targeted-interview%'
  `);
  console.log(`Found ${res.rows.length} courses:`);
  res.rows.forEach(r => {
    console.log(`- ${r.title} | id: ${r.id} | slug: ${r.slug} | cat: ${r.category} | cat_id: ${r.category_id} | cat_ids: ${JSON.stringify(r.category_ids)} | cats: ${JSON.stringify(r.categories)}`);
  });
  await pool.end();
}

main().catch(console.error);
