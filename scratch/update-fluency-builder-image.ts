import { query } from '../server/db/index.js';

const NEW_FLUENCY_BUILDER_IMAGE = 'https://images.unsplash.com/photo-1714079761488-e0c9b9ac4138?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';

async function updateFluencyBuilderImage() {
  try {
    console.log('--- UPDATING FLUENCY BUILDER PLAN IMAGE IN NEONDB ---');

    // 1. Update courses table
    const courseRes = await query(
      `UPDATE courses 
       SET image = $1, hero_image = $1, updated_at = NOW() 
       WHERE id = 'standard-plan-telephonic-calling-sessions' 
          OR slug = 'standard-plan-telephonic-calling-sessions' 
          OR title = 'Fluency Builder Plan'
       RETURNING id, title, slug, image, updated_at`,
      [NEW_FLUENCY_BUILDER_IMAGE]
    );

    console.log(`Updated courses: ${courseRes.rows.length}`);
    courseRes.rows.forEach(r => {
      console.log(`- Course [${r.id}] "${r.title}": ${r.image}`);
    });

    // 2. Update categories table
    const catRes = await query(
      `UPDATE categories 
       SET hero_image = $1, updated_at = NOW() 
       WHERE id = 'cat-fluency-builder-plan' 
          OR slug = 'fluency-builder-plan' 
          OR name = 'Fluency Builder Plan'
       RETURNING id, name, slug, hero_image, updated_at`,
      [NEW_FLUENCY_BUILDER_IMAGE]
    );

    console.log(`Updated categories: ${catRes.rows.length}`);
    catRes.rows.forEach(r => {
      console.log(`- Category [${r.id}] "${r.name}": ${r.hero_image}`);
    });

    // 3. Verify final state
    const verifyCourse = await query(
      `SELECT id, title, slug, image, hero_image, updated_at 
       FROM courses 
       WHERE id = 'standard-plan-telephonic-calling-sessions'`
    );
    console.log('Verified course in DB:', JSON.stringify(verifyCourse.rows, null, 2));

    const verifyCat = await query(
      `SELECT id, name, slug, hero_image, updated_at 
       FROM categories 
       WHERE id = 'cat-fluency-builder-plan'`
    );
    console.log('Verified category in DB:', JSON.stringify(verifyCat.rows, null, 2));

  } catch (err: any) {
    console.error('Error updating Fluency Builder image:', err.message);
  } finally {
    process.exit(0);
  }
}

updateFluencyBuilderImage();
