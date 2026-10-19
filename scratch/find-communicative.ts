import { query, resetPool } from '../server/db/index';

async function run() {
  try {
    console.log('--- SEARCHING FOR COMMUNICATIVE IN DATABASE ---');
    const res = await query(
      `SELECT id, slug, title, category, categories, is_active, status, short_description, description, image, price 
       FROM courses 
       WHERE title ILIKE '%Communicative%' OR id ILIKE '%communicative%' OR slug ILIKE '%communicative%'`
    );
    console.log('Courses found by title/id/slug communicative:', res.rows.length);
    console.log(JSON.stringify(res.rows, null, 2));

    console.log('--- ALL COURSES IN SPOKEN TUTORIAL CATEGORY ---');
    const spokenRes = await query(
      `SELECT id, slug, title, category, categories, is_active, status 
       FROM courses 
       WHERE category ILIKE '%spoken%' OR categories::text ILIKE '%spoken%'`
    );
    console.log('Spoken courses count:', spokenRes.rows.length);
    console.log(JSON.stringify(spokenRes.rows, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await resetPool();
  }
}

run();
