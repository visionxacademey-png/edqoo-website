import { pool, query } from '../server/db/index.js';

const FLUENCY_BUILDER_IMAGE =
  'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';

const EXECUTIVE_INTERVIEW_IMAGE =
  'https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';

async function updateDatabase() {
  console.log('🔄 Updating course and category images in NeonDB PostgreSQL...');

  // 1. Update courses table
  // Fluency Builder Plan
  const courseRes1 = await query(
    `UPDATE courses 
     SET image = $1, updated_at = NOW() 
     WHERE id = 'standard-plan-telephonic-calling-sessions'
     RETURNING id, slug, title, image, updated_at`,
    [FLUENCY_BUILDER_IMAGE]
  );
  console.log('✅ Updated course 1 (Fluency Builder Plan):', courseRes1.rows[0]);

  // Executive Interview Preparation Track
  const courseRes2 = await query(
    `UPDATE courses 
     SET image = $1, updated_at = NOW() 
     WHERE id = 'targeted-interview-prep-masterclass'
     RETURNING id, slug, title, image, updated_at`,
    [EXECUTIVE_INTERVIEW_IMAGE]
  );
  console.log('✅ Updated course 2 (Executive Interview Preparation Track):', courseRes2.rows[0]);

  // 2. Update categories table
  // Fluency Builder Plan category
  const catRes1 = await query(
    `UPDATE categories 
     SET hero_image = $1, updated_at = NOW() 
     WHERE id = 'cat-fluency-builder-plan'
     RETURNING id, slug, name, hero_image, updated_at`,
    [FLUENCY_BUILDER_IMAGE]
  );
  console.log('✅ Updated category 1 (Fluency Builder Plan):', catRes1.rows[0]);

  // Executive Interview Preparation Track category
  const catRes2 = await query(
    `UPDATE categories 
     SET hero_image = $1, updated_at = NOW() 
     WHERE id = 'cat-executive-interview-prep-track'
     RETURNING id, slug, name, hero_image, updated_at`,
    [EXECUTIVE_INTERVIEW_IMAGE]
  );
  console.log('✅ Updated category 2 (Executive Interview Preparation Track):', catRes2.rows[0]);

  console.log('\n--- VERIFYING ALL SPOKEN TUTORIAL COURSES & CATEGORIES IN DB ---');
  const allCourses = await query(`
    SELECT id, slug, title, image 
    FROM courses 
    WHERE id IN ('standard-plan-telephonic-calling-sessions', 'targeted-interview-prep-masterclass')
  `);
  console.log('Courses in DB:', JSON.stringify(allCourses.rows, null, 2));

  const allCats = await query(`
    SELECT id, slug, name, hero_image 
    FROM categories 
    WHERE id IN ('cat-fluency-builder-plan', 'cat-executive-interview-prep-track')
  `);
  console.log('Categories in DB:', JSON.stringify(allCats.rows, null, 2));

  await pool.end();
  console.log('\n✨ Database updates completed successfully.');
}

updateDatabase().catch((err) => {
  console.error('🔥 Error updating database:', err);
  process.exit(1);
});
