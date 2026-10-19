import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function check() {
  try {
    const cats = await pool.query('SELECT id, slug, name, display_order FROM categories ORDER BY display_order ASC');
    console.log('Categories count:', cats.rows.length);
    console.log(cats.rows);
    const courses = await pool.query("SELECT id, slug, title, category FROM courses WHERE category ILIKE '%mirror%' OR category ILIKE '%spoken%' OR category ILIKE '%english%'");
    console.log('English/Mirror courses count:', courses.rows.length);
    for (const c of courses.rows) {
      console.log('  -', c.id, '|', c.slug, '|', c.title, '|', c.category);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}
check();
