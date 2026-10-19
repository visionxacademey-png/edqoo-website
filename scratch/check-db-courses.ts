import { query, pool } from '../server/db/index';

async function main() {
  try {
    const res = await query('SELECT id, slug, title, category, status FROM courses ORDER BY title ASC');
    console.log(`Total courses in DB: ${res.rows.length}`);
    for (const r of res.rows) {
      if (
        r.category === 'English Mirror' ||
        r.category === 'Spoken Tutorial' ||
        r.title.toLowerCase().includes('english') ||
        r.title.toLowerCase().includes('vault') ||
        r.title.toLowerCase().includes('ielts') ||
        r.slug.includes('vault') ||
        r.slug.includes('spoken') ||
        r.slug.includes('ielts') ||
        r.slug.includes('1-to-1')
      ) {
        console.log(`- ID: "${r.id}" | Slug: "${r.slug}" | Title: "${r.title}" | Category: "${r.category}" | Status: "${r.status}"`);
      }
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  } finally {
    if (pool) await pool.end();
    process.exit(0);
  }
}

main();
