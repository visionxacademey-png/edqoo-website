import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

function getMaskedDbHost(url: string): string {
  try {
    const parsed = new URL(url.replace(/^postgresql:\/\//, 'http://'));
    return parsed.hostname || 'neon.tech';
  } catch {
    return 'neon.tech';
  }
}

async function test() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('[DB DEBUG]');
  console.log('Database host:', getMaskedDbHost(dbUrl || ''));
  console.log('Database URL configured:', !!dbUrl);

  const pool = new Pool({ connectionString: dbUrl });

  const timeRes = await pool.query('SELECT NOW()');
  console.log('Neon connection: SUCCESS');
  console.log('DB Time:', timeRes.rows[0].now);

  const tablesRes = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Public Tables in DB:', tablesRes.rows.map((r: any) => r.table_name));

  const columnsRes = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses'");
  console.log('Courses columns:', columnsRes.rows.map((r: any) => `${r.column_name} (${r.data_type})`));

  const countRes = await pool.query('SELECT COUNT(*) FROM courses');
  console.log('Neon course count:', countRes.rows[0].count);

  const sample = await pool.query('SELECT id, slug, title, category, status FROM courses ORDER BY created_at DESC LIMIT 15');
  console.log('Sample courses:', sample.rows);

  await pool.end();
}

test().catch((e) => {
  console.error('Error during DB test:', e);
  process.exit(1);
});
