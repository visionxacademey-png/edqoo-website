import { query, ensureDbInitialized } from '../server/db/index.js';

async function check() {
  try {
    await ensureDbInitialized();
    const res = await query('SELECT id, name, email, role, length(password_hash) as hash_len, substring(password_hash, 1, 12) as prefix FROM users ORDER BY created_at DESC');
    console.log('TOTAL_USERS:', res.rows.length);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
