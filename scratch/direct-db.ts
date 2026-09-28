import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;

const pool = new Pool({ connectionString: DATABASE_URL });

async function run() {
  console.log('Connecting directly...');
  const res = await pool.query("SELECT id, slug, title, category FROM courses WHERE id IN ('html', 'advance-executive-sql') OR slug IN ('html', 'advance-executive-sql', 'advanced-executive-sql') OR title ILIKE '%html%' OR title ILIKE '%sql%'");
  console.log('Matching courses:');
  console.log(res.rows);

  const allCourses = await pool.query("SELECT id, slug, title, category FROM courses ORDER BY id");
  console.log('Total courses in DB:', allCourses.rows.length);
  for (const c of allCourses.rows) {
    console.log(` - ${c.id} | ${c.slug} | ${c.title} | ${c.category}`);
  }

  const enquiries = await pool.query("SELECT id, course_id, program FROM enquiries WHERE course_id IN ('html', 'advance-executive-sql')");
  console.log('Enquiries referencing these IDs:', enquiries.rows);

  await pool.end();
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
