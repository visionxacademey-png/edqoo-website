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
    const res = await pool.query("SELECT * FROM categories WHERE id IN ('cat-english-mirror', 'cat-spoken-tutorial')");
    for (const row of res.rows) {
      console.log('----------------------------------------------------');
      console.log('ID:', row.id);
      console.log('Slug:', row.slug);
      console.log('Name:', row.name);
      console.log('Title:', row.title);
      console.log('Subtitle:', row.subtitle);
      console.log('Display order:', row.display_order);
      console.log('Created at:', row.created_at);
      console.log('Updated at:', row.updated_at);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
