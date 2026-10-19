import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function testBoth() {
  const url1 = process.env.DATABASE_URL;
  const url2 = url1.replace('&channel_binding=require', '').replace('channel_binding=require', '');

  console.log('--- TEST 1: Original URL ---');
  const pool1 = new Pool({ connectionString: url1, connectionTimeoutMillis: 10000 });
  try {
    const start = Date.now();
    await pool1.query('SELECT 1');
    console.log('URL 1 Success in', Date.now() - start, 'ms');
  } catch (e: any) {
    console.error('URL 1 Error:', e.message);
  } finally {
    await pool1.end();
  }

  console.log('--- TEST 2: Without channel_binding ---');
  const pool2 = new Pool({ connectionString: url2, connectionTimeoutMillis: 10000 });
  try {
    const start = Date.now();
    await pool2.query('SELECT 1');
    console.log('URL 2 Success in', Date.now() - start, 'ms');
  } catch (e: any) {
    console.error('URL 2 Error:', e.message);
  } finally {
    await pool2.end();
  }
}

testBoth();
