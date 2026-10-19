import { initDb, getDbStatus, isNeonConnected, pool } from '../server/db/index';

async function testInitDb() {
  console.log('Testing initDb()...');
  const start = Date.now();
  try {
    await initDb();
    console.log('initDb() finished in', Date.now() - start, 'ms');
    console.log('Status:', getDbStatus());
  } catch (e: any) {
    console.error('initDb() failed in', Date.now() - start, 'ms:', e.message);
  } finally {
    if (pool) await pool.end();
  }
}

testInitDb();
