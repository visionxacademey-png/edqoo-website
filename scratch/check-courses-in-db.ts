import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

async function checkCourses() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000
  });

  try {
    const res = await pool.query('SELECT id, slug, title, category FROM courses ORDER BY title');
    console.log(`Total courses in DB: ${res.rows.length}`);
    const removedCheck = res.rows.filter(c => 
      c.title.includes('3-Month IELTS') ||
      c.title.includes('30-Day Spoken') ||
      c.title.includes('Video Vault')
    );
    console.log('Removed courses found:', removedCheck);

    const renamedCheck = res.rows.filter(c =>
      c.title.includes('1-to-1 Communicative English') ||
      c.slug.includes('1-to-1-live-spoken-english') ||
      c.slug.includes('1-to-1-communicative-english')
    );
    console.log('Renamed course found:', renamedCheck);
  } finally {
    await pool.end();
  }
}

checkCourses();
