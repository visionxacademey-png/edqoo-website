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
    const res = await pool.query(`
      UPDATE categories 
      SET name = 'Spoken English' 
      WHERE id = 'cat-spoken-tutorial' OR slug = 'spoken-tutorial'
      RETURNING id, slug, name
    `);
    console.log('Successfully updated category:', res.rows);

    // Also check what categories endpoint will return
    const all = await pool.query(`
      SELECT id, slug, name, parent_id, parent_slug 
      FROM categories 
      ORDER BY display_order ASC
    `);
    console.log('All categories now:');
    console.table(all.rows);
  } catch (err) {
    console.error('Error updating category:', err);
  } finally {
    await pool.end();
  }
}

main();
