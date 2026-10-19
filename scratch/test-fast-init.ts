import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function testFastConnection() {
  const t0 = Date.now();
  console.log('Testing fast connection to NeonDB...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`Connected in ${Date.now() - t0}ms. Server time:`, res.rows[0].now);

    const t1 = Date.now();
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('courses', 'users', 'categories')
    `);
    console.log(`Table check took ${Date.now() - t1}ms. Found:`, tableCheck.rows.map(r => r.table_name));

    const t2 = Date.now();
    const courses = await pool.query('SELECT id, slug, title, category FROM courses LIMIT 5');
    console.log(`Courses query took ${Date.now() - t2}ms. Sample courses:`, courses.rows);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
    console.log(`Total time: ${Date.now() - t0}ms`);
  }
}

testFastConnection();
