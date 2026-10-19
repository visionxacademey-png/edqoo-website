import { query } from '../server/db/index.js';

async function checkCoursesColumns() {
  const res = await query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'courses'
    ORDER BY ordinal_position;
  `);
  console.log('Columns in courses table:');
  res.rows.forEach(r => console.log(` - ${r.column_name}: ${r.data_type}`));
  process.exit(0);
}

checkCoursesColumns();
