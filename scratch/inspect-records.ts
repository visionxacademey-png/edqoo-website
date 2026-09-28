import { pool, isNeonConnected, ensureDbInitialized, query } from '../server/db/index.ts';

async function main() {
  await ensureDbInitialized();
  if (!isNeonConnected || !pool) {
    console.log('Neon DB not connected!');
    process.exit(1);
  }

  // 1. Check all courses matching html or sql in title, slug, id
  const coursesRes = await query(`
    SELECT id, slug, title, category, status, is_active FROM (
      SELECT id, slug, title, category, status, 
             CASE WHEN column_name = 'is_active' THEN true ELSE NULL END as is_active 
      FROM courses
      CROSS JOIN (
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'is_active'
      ) c
    ) sub
    WHERE lower(title) LIKE '%html%' 
       OR lower(title) LIKE '%sql%'
       OR lower(slug) LIKE '%html%'
       OR lower(slug) LIKE '%sql%'
       OR lower(id) LIKE '%html%'
       OR lower(id) LIKE '%sql%'
  `).catch(async () => {
    // If is_active column doesn't exist
    return await query(`
      SELECT id, slug, title, category, status 
      FROM courses 
      WHERE lower(title) LIKE '%html%' 
         OR lower(title) LIKE '%sql%'
         OR lower(slug) LIKE '%html%'
         OR lower(slug) LIKE '%sql%'
         OR lower(id) LIKE '%html%'
         OR lower(id) LIKE '%sql%'
    `);
  });

  console.log('Courses matching html / sql:');
  console.log(coursesRes.rows);

  // 2. Check table schema for courses (does it have is_active or soft-delete columns?)
  const columnsRes = await query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'courses'
    ORDER BY ordinal_position
  `);
  console.log('Courses table columns:');
  console.log(columnsRes.rows.map(r => `${r.column_name} (${r.data_type})`));

  // 3. Check enquiries referencing html or sql courses
  const enquiriesRes = await query(`
    SELECT id, program, course_id, email, name 
    FROM enquiries 
    WHERE course_id IN ('html', 'advance-executive-sql')
       OR lower(program) LIKE '%html%' 
       OR lower(program) LIKE '%sql%'
  `);
  console.log('Enquiries referencing html/sql:', enquiriesRes.rows.length);
  console.log(enquiriesRes.rows);

  // 4. Check instructors referencing html or sql courses
  const instRes = await query(`
    SELECT id, name, courses 
    FROM instructors
  `);
  console.log('Instructors referencing html/sql:');
  for (const inst of instRes.rows) {
    const cStr = JSON.stringify(inst.courses || []);
    if (cStr.toLowerCase().includes('html') || cStr.toLowerCase().includes('sql')) {
      console.log(`Instructor: ${inst.name} (${inst.id}) courses:`, inst.courses);
    }
  }

  await pool.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
