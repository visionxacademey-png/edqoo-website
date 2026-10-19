import { query, pool } from '../server/db/index';

async function checkCourse() {
  try {
    const res = await query('SELECT * FROM courses WHERE id = $1 OR slug = $1', ['1-to-1-live-spoken-english']);
    if (res.rows.length > 0) {
      console.log('Course found:');
      console.log(JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log('Course not found!');
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    if (pool) await pool.end();
    process.exit(0);
  }
}

checkCourse();
