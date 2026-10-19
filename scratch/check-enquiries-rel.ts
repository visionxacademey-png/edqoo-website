import { pool, query } from '../server/db/index.js';

async function check() {
  const ids = ['spoken-english-malayalam', 'spoken-english-kannada', 'spoken-english-telugu', 'spoken-english-tamil'];
  const res = await query('SELECT id, course_id, program, name FROM enquiries WHERE course_id = ANY($1)', [ids]);
  console.log('Enquiries count:', res.rows.length);
  await pool.end();
}
check().catch(console.error);
