import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000
  });

  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Existing tables in NeonDB:');
    res.rows.forEach(r => console.log(' -', r.table_name));

    const courseCount = await pool.query('SELECT count(*) FROM courses');
    console.log('Courses count:', courseCount.rows[0].count);

    const userCount = await pool.query('SELECT count(*) FROM users');
    console.log('Users count:', userCount.rows[0].count);

    const catCount = await pool.query('SELECT count(*) FROM categories');
    console.log('Categories count:', catCount.rows[0].count);
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkTables();
