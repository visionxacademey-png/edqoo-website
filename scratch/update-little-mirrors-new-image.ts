import { query } from '../server/db/index.js';

const NEW_LITTLE_MIRRORS_IMAGE =
  'https://images.unsplash.com/photo-1586011876158-197fd32f15e2?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';

async function updateLittleMirrorsImage() {
  try {
    console.log('--- UPDATING LITTLE MIRRORS IMAGE IN NEONDB ---');

    // 1. Update courses table
    const courseRes = await query(
      `UPDATE courses 
       SET image = $1, hero_image = $1, updated_at = NOW() 
       WHERE id = 'kids-1-to-1-english-fluency-program' OR slug = 'kids-1-to-1-english-fluency-program'
       RETURNING id, title, slug, image, hero_image, updated_at`,
      [NEW_LITTLE_MIRRORS_IMAGE]
    );

    console.log(`Updated courses rows: ${courseRes.rows.length}`);
    courseRes.rows.forEach((r) => {
      console.log(`- Course [${r.id}] "${r.title}": ${r.image}`);
    });

    // 2. Update categories table
    const catRes = await query(
      `UPDATE categories 
       SET hero_image = $1, updated_at = NOW() 
       WHERE id = 'cat-little-mirrors' OR slug = 'little-mirrors'
       RETURNING id, name, slug, hero_image, updated_at`,
      [NEW_LITTLE_MIRRORS_IMAGE]
    );

    console.log(`Updated categories rows: ${catRes.rows.length}`);
    catRes.rows.forEach((r) => {
      console.log(`- Category [${r.id}] "${r.name}": ${r.hero_image}`);
    });

    // 3. Verify final state in courses
    const verifyCourse = await query(
      `SELECT id, title, slug, image, hero_image, updated_at 
       FROM courses 
       WHERE id = 'kids-1-to-1-english-fluency-program' OR slug = 'kids-1-to-1-english-fluency-program'`
    );
    console.log('Verified course in DB:', JSON.stringify(verifyCourse.rows, null, 2));

    // 4. Verify final state in categories
    const verifyCat = await query(
      `SELECT id, name, slug, hero_image, updated_at 
       FROM categories 
       WHERE id = 'cat-little-mirrors' OR slug = 'little-mirrors'`
    );
    console.log('Verified category in DB:', JSON.stringify(verifyCat.rows, null, 2));
  } catch (err: any) {
    console.error('Error updating Little Mirrors image:', err.message);
  } finally {
    process.exit(0);
  }
}

updateLittleMirrorsImage();
