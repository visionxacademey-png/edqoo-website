import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function testFastCheck() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000
  });

  const start = Date.now();
  console.log('Testing fast schema check...');
  const check = await pool.query(`
    SELECT COUNT(*) as count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name IN ('courses', 'users', 'categories', 'enquiries')
  `);
  console.log('Check finished in', Date.now() - start, 'ms. Result:', check.rows[0]);

  const coursesStart = Date.now();
  const coursesRes = await pool.query('SELECT id, slug, title FROM courses ORDER BY created_at DESC LIMIT 5');
  console.log('Courses query finished in', Date.now() - coursesStart, 'ms. Count:', coursesRes.rows.length);
  coursesRes.rows.forEach(c => console.log(' -', c.title));

  await pool.end();
}

testFastCheck();
