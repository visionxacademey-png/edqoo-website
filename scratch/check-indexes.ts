import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function main() {
  try {
    const indexesRes = await pool.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'categories'
    `);
    console.log('Categories indexes:');
    console.table(indexesRes.rows);

    const constraintsRes = await pool.query(`
      SELECT conname, contype, pg_get_constraintdef(oid) as def 
      FROM pg_constraint 
      WHERE conrelid = 'categories'::regclass
    `);
    console.log('Categories constraints:');
    console.table(constraintsRes.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
