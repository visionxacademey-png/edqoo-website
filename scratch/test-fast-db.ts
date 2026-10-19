import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const DATABASE_URL = (rawDbUrl && rawDbUrl !== 'YOUR_NEON_DATABASE_URL_HERE') ? rawDbUrl : DEFAULT_NEON_URL;

let pool: Pool | null = null;
let isNeonConnected = false;
let dbReady = false;
let initPromise: Promise<void> | null = null;

function getOrCreatePool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000
    });
    pool.on('error', (err: any) => {
      console.warn('⚠️ [DB] Neon pool idle client error notice:', err?.message || err);
    });
  }
  return pool;
}

async function resetPool() {
  if (pool) {
    try { await pool.end(); } catch {}
    pool = null;
  }
}

async function initDb(): Promise<void> {
  if (dbReady && isNeonConnected && pool) return;
  const currentPool = getOrCreatePool();
  try {
    const t0 = Date.now();
    const res = await currentPool.query('SELECT NOW()');
    isNeonConnected = true;
    dbReady = true;
    console.log(`Connected in ${Date.now() - t0}ms:`, res.rows[0].now);
  } catch (err: any) {
    isNeonConnected = false;
    dbReady = false;
    throw err;
  }
}

function ensureDbInitialized(): Promise<void> {
  if (dbReady && isNeonConnected && pool) return Promise.resolve();
  if (!initPromise) {
    initPromise = initDb()
      .then(() => {
        dbReady = true;
        isNeonConnected = true;
      })
      .catch((err) => {
        initPromise = null;
        dbReady = false;
        isNeonConnected = false;
        throw err;
      });
  }
  return initPromise;
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

async function query(text: string, params: any[] = []) {
  if (!dbReady || !isNeonConnected || !pool) {
    await ensureDbInitialized();
  }
  let lastError: any = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const currentPool = getOrCreatePool();
      return await currentPool.query(text, params);
    } catch (err: any) {
      lastError = err;
      console.warn(`Query attempt ${attempt} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        if (err.message?.includes('Connection terminated') || err.message?.includes('WebSocket is not open')) {
          await resetPool();
        }
        await new Promise(r => setTimeout(r, INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1)));
      }
    }
  }
  throw lastError;
}

async function run() {
  console.log('--- Step 1: Ensure DB initialized ---');
  await ensureDbInitialized();
  console.log('Status: connected =', isNeonConnected);

  console.log('--- Step 2: Query courses ---');
  const t0 = Date.now();
  const res = await query('SELECT count(*) FROM courses');
  console.log(`Courses count query (${Date.now() - t0}ms):`, res.rows[0].count);

  console.log('--- Step 3: Query courses list ---');
  const t1 = Date.now();
  const list = await query('SELECT id, slug, title FROM courses LIMIT 3');
  console.log(`Courses list query (${Date.now() - t1}ms):`, list.rows);

  await resetPool();
  console.log('--- Completed successfully! ---');
}

run();
