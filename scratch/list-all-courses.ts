import { query } from '../server/db/index.js';

async function listAllCourses() {
  try {
    const res = await query('SELECT id, title, slug, image FROM courses ORDER BY id');
    console.log(`Found ${res.rows.length} courses in NeonDB:`);
    res.rows.forEach((r, idx) => {
      console.log(`${idx + 1}. [${r.id}] "${r.title}" (slug: ${r.slug}) -> image: ${r.image}`);
    });
  } catch (err: any) {
    console.error(err.message);
  } finally {
    process.exit(0);
  }
}

listAllCourses();
