import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function checkReferences() {
  try {
    // 1. Check all tables with category_id or similar columns
    const tables = ['courses', 'categories', 'enquiries', 'leads', 'users'];
    for (const table of tables) {
      try {
        const colsRes = await pool.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
        `, [table]);
        console.log(`\nTable ${table} columns:`, colsRes.rows.map(r => r.column_name).join(', '));
      } catch (e) {
        console.log(`Table ${table} does not exist or error:`, e.message);
      }
    }

    // Check specific references to cat-english-mirror
    const courseMatch = await pool.query(`
      SELECT id, title, category, category_id, categories 
      FROM courses 
      WHERE category_id IN ('cat-english-mirror', 'cat-spoken-tutorial')
         OR category ILIKE '%spoken tutorial%'
         OR category ILIKE '%english mirror%'
         OR categories::text ILIKE '%cat-english-mirror%'
         OR categories::text ILIKE '%cat-spoken-tutorial%'
    `);
    console.log('\nCourses matched with either category:');
    console.table(courseMatch.rows);

    const enquiryMatch = await pool.query(`
      SELECT id, name, program, details 
      FROM enquiries 
      WHERE details::text ILIKE '%cat-english-mirror%'
         OR details::text ILIKE '%cat-spoken-tutorial%'
         OR details::text ILIKE '%english-mirror%'
         OR details::text ILIKE '%spoken-tutorial%'
         OR program ILIKE '%spoken tutorial%'
         OR program ILIKE '%english mirror%'
    `);
    console.log('\nEnquiries matched:');
    console.table(enquiryMatch.rows);

    // Check categories referencing cat-english-mirror as parent
    const childMatch = await pool.query(`
      SELECT id, slug, name, parent_id, parent_slug 
      FROM categories 
      WHERE parent_id IN ('cat-english-mirror', 'cat-spoken-tutorial')
         OR parent_slug IN ('english-mirror', 'spoken-tutorial')
    `);
    console.log('\nCategories with parent:');
    console.table(childMatch.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkReferences();
