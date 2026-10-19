import { query, pool } from '../server/db/index';

async function checkRelationships() {
  try {
    const courseIds = [
      '3-month-ielts-master-plan',
      '30-day-spoken-english-transformation-handbook',
      'premium-self-paced-video-vault',
      'essential-self-paced-video-vault',
      '1-to-1-live-spoken-english'
    ];

    console.log('Checking foreign keys or tables referencing courses...');

    // Check table foreign keys
    const fkRes = await query(`
      SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND ccu.table_name = 'courses';
    `);

    console.log('Foreign keys pointing to courses:', fkRes.rows);

    // Check enquiries table
    const enqRes = await query(`
      SELECT id, program, course_id, name, created_at 
      FROM enquiries 
      WHERE course_id = ANY($1) 
         OR program ILIKE ANY(ARRAY['%ielts%','%handbook%','%vault%','%1-to-1%'])
    `, [courseIds]);

    console.log(`Matching enquiries found: ${enqRes.rows.length}`);
    for (const row of enqRes.rows) {
      console.log(`- Enquiry: id=${row.id}, course_id=${row.course_id}, program="${row.program}"`);
    }

  } catch (err: any) {
    console.error('Error checking relationships:', err.message);
  } finally {
    if (pool) await pool.end();
    process.exit(0);
  }
}

checkRelationships();
