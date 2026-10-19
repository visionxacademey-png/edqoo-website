import { pool, query } from '../server/db/index.js';

async function check() {
  try {
    const courses = await query(`
      SELECT id, slug, title, image 
      FROM courses 
      WHERE id IN ('standard-plan-telephonic-calling-sessions', 'targeted-interview-prep-masterclass')
         OR title ILIKE '%Executive Interview%'
         OR title ILIKE '%Fluency Builder%'
    `);
    console.log('Courses in DB:');
    console.log(JSON.stringify(courses.rows, null, 2));

    const cats = await query(`
      SELECT id, slug, name, hero_image 
      FROM categories 
      WHERE id IN ('cat-fluency-builder-plan', 'cat-executive-interview-prep-track')
         OR name ILIKE '%Executive Interview%'
         OR name ILIKE '%Fluency Builder%'
    `);
    console.log('Categories in DB:');
    console.log(JSON.stringify(cats.rows, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await pool.end();
  }
}

check();
