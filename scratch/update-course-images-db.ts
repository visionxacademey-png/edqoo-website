import { pool, query } from '../server/db/index';

const COURSE_IMAGES: Record<string, string> = {
  // 1. Fluency Builder Plan — Person with headset / phone calling
  'standard-plan-telephonic-calling-sessions':
    'https://images.unsplash.com/photo-1714079761488-e0c9b9ac4138?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // 2. Little Mirrors — Child learning English with laptop
  'kids-1-to-1-english-fluency-program':
    'https://images.unsplash.com/photo-1586011876158-197fd32f15e2?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // 3. Corporate English Fluency Builder — Professionals communicating in business meeting
  'elite-corporate-transformation-track':
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',

  // 4. IELTS Intensive — Student studying English with laptop and notebooks
  'ielts-intensive-1-to-1-crash-training':
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',

  // 5. Executive Interview Preparation Track — Professional in job interview coaching
  'targeted-interview-prep-masterclass':
    'https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',

  // 6. 1-to-1 Communicative English Mastery
  '1-to-1-live-spoken-english':
    'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
};

const CATEGORY_IMAGES: Record<string, string> = {
  'cat-fluency-builder-plan':
    'https://images.unsplash.com/photo-1714079761488-e0c9b9ac4138?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'cat-little-mirrors':
    'https://images.unsplash.com/photo-1586011876158-197fd32f15e2?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'cat-corporate-english-fluency-builder':
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
  'cat-ielts-intensive':
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
  'cat-executive-interview-prep-track':
    'https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  'cat-spoken-tutorial':
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop'
};

async function updateDbImages() {
  console.log('--- UPDATING COURSE IMAGES IN NEONDB ---');
  for (const [courseId, imageUrl] of Object.entries(COURSE_IMAGES)) {
    const res = await query(
      'UPDATE courses SET image = $1, updated_at = NOW() WHERE id = $2 RETURNING id, title, image',
      [imageUrl, courseId]
    );
    if (res.rows.length > 0) {
      console.log(`✅ Updated course [${res.rows[0].id}]: ${res.rows[0].title}`);
      console.log(`   Image: ${res.rows[0].image}`);
    } else {
      console.log(`⚠️ Course not found: ${courseId}`);
    }
  }

  console.log('\n--- UPDATING CATEGORY HERO IMAGES IN NEONDB ---');
  for (const [catId, imageUrl] of Object.entries(CATEGORY_IMAGES)) {
    const res = await query(
      'UPDATE categories SET hero_image = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, hero_image',
      [imageUrl, catId]
    );
    if (res.rows.length > 0) {
      console.log(`✅ Updated category [${res.rows[0].id}]: ${res.rows[0].name}`);
      console.log(`   Hero Image: ${res.rows[0].hero_image}`);
    } else {
      console.log(`⚠️ Category not found: ${catId}`);
    }
  }

  await pool.end();
  console.log('\nDatabase image update complete.');
}

updateDbImages().catch(console.error);
