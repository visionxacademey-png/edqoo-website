import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function testConn() {
  const url = process.env.DATABASE_URL;
  console.log('Testing connection to NeonDB with URL length:', url?.length);
  const start = Date.now();
  
  const pool = new Pool({
    connectionString: url,
    connectionTimeoutMillis: 15000
  });

  try {
    console.log('Acquiring client...');
    const client = await pool.connect();
    console.log('Connected! Latency:', Date.now() - start, 'ms');
    const res = await client.query('SELECT NOW() as now, count(*) as count from courses');
    console.log('Query success:', res.rows[0]);
    client.release();
  } catch (err: any) {
    console.error('Connection failed:', err.message, err.stack);
  } finally {
    await pool.end();
  }
}

testConn();
