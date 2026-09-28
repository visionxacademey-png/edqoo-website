import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;

const pool = new Pool({ connectionString: DATABASE_URL });

async function run() {
  console.log('--- Executing Database Course Removal ---');
  
  // 1. Delete HTML and SQL courses from courses table
  const deleteRes = await pool.query(`
    DELETE FROM courses 
    WHERE id IN ('html', 'advance-executive-sql') 
       OR slug IN ('html', 'advance-executive-sql', 'advanced-executive-sql')
    RETURNING id, slug, title, category
  `);
  console.log(`Deleted ${deleteRes.rows.length} course(s) from PostgreSQL database:`, deleteRes.rows);

  // 2. Update Instructor Michael Kovac's assigned courses in DB if present
  const instCheck = await pool.query("SELECT id, name, courses FROM instructors WHERE id = 'inst-2' OR name ILIKE '%Michael Kovac%'");
  if (instCheck.rows.length > 0) {
    const inst = instCheck.rows[0];
    const coursesArr = typeof inst.courses === 'string' ? JSON.parse(inst.courses) : (inst.courses || []);
    const filteredCourses = coursesArr.filter((c: string) => !c.toLowerCase().includes('sql'));
    await pool.query("UPDATE instructors SET courses = $1, updated_at = NOW() WHERE id = $2", [
      JSON.stringify(filteredCourses),
      inst.id
    ]);
    console.log(`Updated instructor ${inst.name} courses from:`, coursesArr, 'to:', filteredCourses);
  }

  // 3. Verify total remaining courses
  const remaining = await pool.query("SELECT id, slug, title, category FROM courses ORDER BY title");
  console.log(`Total remaining courses in DB: ${remaining.rows.length}`);
  for (const c of remaining.rows) {
    console.log(` - [${c.category}] ${c.title} (${c.id})`);
  }

  // 4. Verify enquiries are preserved
  const enqCount = await pool.query("SELECT COUNT(*) FROM enquiries");
  console.log(`Total enquiries preserved: ${enqCount.rows[0].count}`);

  await pool.end();
  console.log('--- Database Removal Completed Successfully ---');
  process.exit(0);
}

run().catch(err => {
  console.error('Error executing database removal:', err);
  process.exit(1);
});
