import { query } from '../server/db/index';

async function checkHours() {
  const res = await query(`
    SELECT id, title, live_hours, duration, features
    FROM courses
    WHERE id = 'targeted-interview-prep-masterclass'
  `);
  console.log('Course hours & features:', JSON.stringify(res.rows, null, 2));
  process.exit(0);
}

checkHours();
