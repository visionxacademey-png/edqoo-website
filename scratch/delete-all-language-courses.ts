import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function run() {
  const ids = [
    'spoken-english-hindi',
    'spoken-english-malayalam',
    'spoken-english-kannada',
    'spoken-english-telugu',
    'spoken-english-tamil'
  ];

  console.log('🗑️ Deleting language courses from DB...');
  const res = await pool.query(
    'DELETE FROM courses WHERE id = ANY($1) OR slug = ANY($1) RETURNING id, title',
    [ids]
  );
  console.log('✅ Deleted', res.rowCount, 'courses:');
  res.rows.forEach(r => console.log(`   - [${r.id}] ${r.title}`));

  await pool.end();
}

run().catch(console.error);
