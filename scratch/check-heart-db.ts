import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_NEON_URL;

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  try {
    const tables = ['courses', 'categories', 'instructors', 'enquiries'];
    for (const table of tables) {
      const res = await pool.query(`SELECT * FROM ${table}`);
      const matched = res.rows.filter(row => JSON.stringify(row).toLowerCase().includes('heart'));
      console.log(`Table ${table} matches for 'heart':`, matched.length);
      if (matched.length > 0) {
        console.log(matched);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
