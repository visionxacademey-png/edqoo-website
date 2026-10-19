import { query } from '../server/db/index.js';

async function check() {
  try {
    const c = await query("SELECT id, title, slug FROM courses WHERE title ILIKE '%heart%' OR slug ILIKE '%heart%'");
    console.log('Courses matching heart:', c.rows);
    const cat = await query("SELECT id, title, slug FROM categories WHERE title ILIKE '%heart%' OR slug ILIKE '%heart%'");
    console.log('Categories matching heart:', cat.rows);

    const allCourses = await query("SELECT id, title, slug FROM courses");
    console.log('All course titles:', allCourses.rows.map(r => `[${r.id}] "${r.title}" (${r.slug})`));

    const allCategories = await query("SELECT id, title, slug FROM categories");
    console.log('All category titles:', allCategories.rows.map(r => `[${r.id}] "${r.title}" (${r.slug})`));
  } catch (err: any) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

check();
