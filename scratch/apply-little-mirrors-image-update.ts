import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE')
  ? process.env.DATABASE_URL
  : DEFAULT_NEON_URL;

const NEW_IMAGE_URL = '/images/spoken-tutorial/little-mirrors.jpg';

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  try {
    console.log('🔄 Updating course image in NeonDB...');
    const courseRes = await pool.query(
      `UPDATE courses
       SET image = $1,
           updated_at = NOW()
       WHERE id = 'kids-1-to-1-english-fluency-program' OR slug = 'kids-1-to-1-english-fluency-program'
       RETURNING id, title, slug, image, updated_at`,
      [NEW_IMAGE_URL]
    );
    console.log('✅ Courses updated:', courseRes.rows);

    console.log('🔄 Updating category hero_image in NeonDB...');
    const catRes = await pool.query(
      `UPDATE categories
       SET hero_image = $1,
           updated_at = NOW()
       WHERE id = 'cat-little-mirrors' OR slug = 'little-mirrors'
       RETURNING id, name, slug, hero_image, updated_at`,
      [NEW_IMAGE_URL]
    );
    console.log('✅ Categories updated:', catRes.rows);

    // Verify
    const verifyCourse = await pool.query(
      `SELECT id, slug, title, image FROM courses WHERE id = 'kids-1-to-1-english-fluency-program'`
    );
    console.log('🔍 Verified course:', verifyCourse.rows[0]);

    const verifyCat = await pool.query(
      `SELECT id, slug, name, hero_image FROM categories WHERE id = 'cat-little-mirrors'`
    );
    console.log('🔍 Verified category:', verifyCat.rows[0]);
  } catch (err) {
    console.error('❌ Error updating DB:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
