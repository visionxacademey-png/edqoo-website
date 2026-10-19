import { query } from '../server/db/index.js';

const NEW_IMAGE_URL = 'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';

async function update1to1Image() {
  try {
    console.log('--- UPDATING 1:1 COMMUNICATIVE ENGLISH MASTERY IMAGE IN NEONDB ---');
    
    // 1. Update courses table
    const courseRes = await query(
      `UPDATE courses 
       SET image = $1, hero_image = $1, updated_at = NOW() 
       WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
       RETURNING id, title, slug, image`,
      [NEW_IMAGE_URL]
    );

    console.log(`Updated courses rows: ${courseRes.rows.length}`);
    courseRes.rows.forEach(r => {
      console.log(`- Course [${r.id}] "${r.title}": ${r.image}`);
    });

    // 2. Check categories table
    const catRes = await query(
      `UPDATE categories 
       SET hero_image = $1, updated_at = NOW() 
       WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
       RETURNING id, name, slug, hero_image`,
      [NEW_IMAGE_URL]
    );

    console.log(`Updated categories rows: ${catRes.rows.length}`);
    catRes.rows.forEach(r => {
      console.log(`- Category [${r.id}] "${r.name}": ${r.hero_image}`);
    });

    // 3. Verify final state
    const verifyRes = await query(
      `SELECT id, title, slug, image, updated_at FROM courses WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'`
    );
    console.log('Verification in DB:', JSON.stringify(verifyRes.rows, null, 2));

  } catch (err: any) {
    console.error('Error updating image:', err.message);
  } finally {
    process.exit(0);
  }
}

update1to1Image();
