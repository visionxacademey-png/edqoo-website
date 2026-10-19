import { query, resetPool } from '../server/db/index';

async function run() {
  try {
    const res = await query(
      `SELECT id, slug, title, category, categories, short_description, description, supporting_text, highlight_text, features, image, price, original_price 
       FROM courses 
       WHERE id ILIKE '%corporate%' OR slug ILIKE '%corporate%' OR title ILIKE '%Corporate%'`
    );
    console.log('COURSES COUNT:', res.rows.length);
    console.log('COURSES:', JSON.stringify(res.rows, null, 2));

    const catRes = await query(
      `SELECT id, slug, name, title, description, supporting_text, highlight_text, features, hero_image, key_highlights, learning_format 
       FROM categories 
       WHERE id ILIKE '%corporate%' OR slug ILIKE '%corporate%' OR name ILIKE '%Corporate%'`
    );
    console.log('CATEGORIES COUNT:', catRes.rows.length);
    console.log('CATEGORIES:', JSON.stringify(catRes.rows, null, 2));

    // Also check all columns in courses table
    const colsRes = await query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses' ORDER BY ordinal_position`
    );
    console.log('COURSE COLUMNS:', colsRes.rows.map((r: any) => r.column_name).join(', '));

    // And categories columns
    const catColsRes = await query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories' ORDER BY ordinal_position`
    );
    console.log('CATEGORY COLUMNS:', catColsRes.rows.map((r: any) => r.column_name).join(', '));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await resetPool();
  }
}

run();
