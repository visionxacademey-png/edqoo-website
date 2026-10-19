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
    const catRes = await pool.query(`
      SELECT id, slug, name, parent_id, parent_slug, display_order, is_active, is_partner, created_at 
      FROM categories 
      ORDER BY display_order ASC, name ASC
    `);
    console.log('=== ALL CATEGORIES IN DATABASE ===');
    console.table(catRes.rows);

    const spokenRows = catRes.rows.filter(r => 
      (r.name && r.name.toLowerCase().includes('spoken tutorial')) || 
      (r.slug && r.slug.includes('spoken-tutorial')) ||
      (r.name && r.name.toLowerCase().includes('english mirror')) ||
      (r.slug && r.slug.includes('english-mirror'))
    );
    console.log('\n=== POTENTIAL SPOKEN TUTORIAL / ENGLISH MIRROR CATEGORIES ===');
    console.table(spokenRows);

    // Also check courses pointing to these categories
    const coursesRes = await pool.query(`
      SELECT id, slug, title, category, category_id, categories 
      FROM courses 
      ORDER BY id ASC
    `);
    console.log('\n=== ALL COURSES AND THEIR CATEGORY REFERENCES ===');
    console.table(coursesRes.rows);

    // Check enquiries referencing categories or courses
    const enquiriesRes = await pool.query(`
      SELECT id, name, program, details 
      FROM enquiries 
      LIMIT 20
    `);
    console.log('\n=== RECENT ENQUIRIES ===');
    console.table(enquiriesRes.rows);

  } catch (err) {
    console.error('Error running check:', err);
  } finally {
    await pool.end();
  }
}

main();
