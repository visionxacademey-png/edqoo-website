import { query, resetPool } from '../server/db/index';

async function run() {
  try {
    const res = await query(
      `SELECT id, slug, title, category, categories, short_description, description, supporting_text, highlight_text, features, image, price, original_price 
       FROM courses 
       WHERE id ILIKE '%ielts%' OR slug ILIKE '%ielts%' OR title ILIKE '%ielts%'`
    );
    console.log('COURSES COUNT:', res.rows.length);
    console.log('COURSES:', JSON.stringify(res.rows, null, 2));

    const catRes = await query(
      `SELECT id, slug, name, title, subtitle, description, supporting_text, highlight_text, features, hero_image, key_highlights, learning_format, course_details, batch_timings, learning_benefits 
       FROM categories 
       WHERE id ILIKE '%ielts%' OR slug ILIKE '%ielts%' OR name ILIKE '%ielts%'`
    );
    console.log('CATEGORIES COUNT:', catRes.rows.length);
    console.log('CATEGORIES:', JSON.stringify(catRes.rows, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await resetPool();
  }
}

run();
