import bcrypt from 'bcryptjs';
import { query, ensureDbInitialized } from '../server/db/index.js';

async function verify() {
  await ensureDbInitialized();
  
  // Test admin
  const adminRes = await query("SELECT id, email, password_hash FROM users WHERE email = 'admin@edqoo.com'");
  if (adminRes.rows.length > 0) {
    const matchAdmin = await bcrypt.compare('OurdreamAdmin@2002', adminRes.rows[0].password_hash);
    console.log('Admin OurdreamAdmin@2002 matches DB hash:', matchAdmin);
  }

  // Test student
  const studentRes = await query("SELECT id, email, password_hash FROM users WHERE email = 'alex.student@edqoo.com'");
  if (studentRes.rows.length > 0) {
    const matchStudent = await bcrypt.compare('Student@123456', studentRes.rows[0].password_hash);
    console.log('Student Student@123456 matches DB hash:', matchStudent);
    if (!matchStudent) {
      console.log('Updating student hash to bcrypt of Student@123456...');
      const studentHash = await bcrypt.hash('Student@123456', 10);
      await query("UPDATE users SET password_hash = $1 WHERE email = 'alex.student@edqoo.com'", [studentHash]);
      console.log('Student password hash updated.');
    }
  }

  process.exit(0);
}

verify();
