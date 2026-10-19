import { query, getOrCreatePool } from '../server/db/index.js';

async function inspectCourse() {
  try {
    const res = await query("SELECT * FROM courses WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'");
    console.log('Found course:', res.rows.length);
    if (res.rows.length > 0) {
      console.log(JSON.stringify(res.rows[0], null, 2));
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

inspectCourse();
