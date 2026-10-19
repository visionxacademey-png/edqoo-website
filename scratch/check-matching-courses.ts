import { query } from '../server/db/index.js';

async function checkAllCoursesMatching() {
  try {
    const res = await query(
      "SELECT id, slug, title, image, hero_image FROM courses WHERE title ILIKE '%communicative%' OR slug ILIKE '%communicative%' OR id ILIKE '%1-to-1%' OR slug ILIKE '%1-to-1%'"
    );
    console.log('Courses matching:', JSON.stringify(res.rows, null, 2));
  } catch (e: any) {
    console.error(e.message);
  } finally {
    process.exit(0);
  }
}

checkAllCoursesMatching();
