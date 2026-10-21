import axios from 'axios';
import { generateToken } from '../server/middleware/auth.js';

const API_BASE = 'http://localhost:5001/api';

async function runSecurityAudit() {
  console.log('🔒 ================================================');
  console.log('🔒 EDQOO COMPREHENSIVE SECURITY AUDIT & VERIFICATION');
  console.log('🔒 ================================================');

  let passed = 0;
  let total = 0;

  function assert(title: string, condition: boolean, details?: any) {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${title}`);
    } else {
      console.error(`❌ [FAIL] ${title}`, details || '');
    }
  }

  // 1. Test Admin Login with Valid Credentials
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@edqoo.com',
      password: 'OurdreamAdmin@2002'
    });
    assert('Admin login with OurdreamAdmin@2002 succeeds via bcrypt', res.status === 200 && !!res.data.token && res.data.user?.role === 'admin');
    var adminToken = res.data.token;
  } catch (err: any) {
    assert('Admin login with OurdreamAdmin@2002 succeeds via bcrypt', false, err.response?.data || err.message);
  }

  // 2. Test Admin Login with Wrong Password
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@edqoo.com',
      password: 'WrongPassword@123'
    });
    assert('Admin login with wrong password rejected with 401', false);
  } catch (err: any) {
    assert('Admin login with wrong password rejected with 401', err.response?.status === 401);
  }

  // 3. Test Admin Login with Old Password
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@edqoo.com',
      password: 'Admin@123456'
    });
    assert('Admin login with old password rejected with 401', false);
  } catch (err: any) {
    assert('Admin login with old password rejected with 401', err.response?.status === 401);
  }

  // 4. Test Student Login with Valid Credentials
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      email: 'alex.student@edqoo.com',
      password: 'Student@123456'
    });
    assert('Student login with Student@123456 succeeds via bcrypt', res.status === 200 && !!res.data.token && res.data.user?.role === 'user');
    var studentToken = res.data.token;
  } catch (err: any) {
    assert('Student login with Student@123456 succeeds via bcrypt', false, err.response?.data || err.message);
  }

  // 5. Test Non-existent User Login (Auto-provisioning prevention)
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: `nonexistent_${Date.now()}@edqoo-fake.com`,
      password: 'SomeRandomPassword@99'
    });
    assert('Login for non-existent user rejected (no auto-provisioning backdoor)', false);
  } catch (err: any) {
    assert('Login for non-existent user rejected (no auto-provisioning backdoor)', err.response?.status === 401);
  }

  // 6. Test Backdoor Token Bypass Attempt: "admin_token"
  try {
    await axios.get(`${API_BASE}/admin/stats`, {
      headers: { Authorization: 'Bearer admin_token' }
    });
    assert('Unverified admin_token bypass REJECTED', false);
  } catch (err: any) {
    assert('Unverified admin_token bypass REJECTED with 401', err.response?.status === 401);
  }

  // 7. Test Backdoor Token Bypass Attempt: "edqoo_jwt_admin_session_..."
  try {
    await axios.get(`${API_BASE}/admin/stats`, {
      headers: { Authorization: 'Bearer edqoo_jwt_admin_session_fake123' }
    });
    assert('Unverified edqoo_jwt_admin_session bypass REJECTED', false);
  } catch (err: any) {
    assert('Unverified edqoo_jwt_admin_session bypass REJECTED with 401', err.response?.status === 401);
  }

  // 8. Test Valid Signed Admin JWT on Admin Routes
  if (adminToken) {
    try {
      const res = await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      assert('Valid signed admin JWT allows access to admin stats', res.status === 200 && typeof res.data.totalUsers === 'number');
    } catch (err: any) {
      assert('Valid signed admin JWT allows access to admin stats', false, err.response?.data || err.message);
    }
  }

  // 9. Test Student JWT on Admin Routes (Privilege Escalation Prevention)
  if (studentToken) {
    try {
      await axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      assert('Student token access to admin routes is blocked with 403', false);
    } catch (err: any) {
      assert('Student token access to admin routes is blocked with 403', err.response?.status === 403);
    }
  }

  // 10. Test Fake Admin Email with User Role (Email substring escalation prevention)
  try {
    const fakeAdminToken = generateToken({
      id: 'usr-fake-admin',
      email: 'hacker-admin@gmail.com',
      role: 'user',
      name: 'Fake Admin'
    }, 'sess-fake-01');

    await axios.get(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${fakeAdminToken}` }
    });
    assert('Role user with "admin" in email blocked from admin routes', false);
  } catch (err: any) {
    assert('Role user with "admin" in email blocked from admin routes with 403', err.response?.status === 403);
  }

  // 11. Test Security Headers
  try {
    const res = await axios.get('http://localhost:5001/api/health');
    const headers = res.headers;
    const hasNosniff = headers['x-content-type-options'] === 'nosniff';
    const hasFrameOptions = !!headers['x-frame-options'];
    assert('Security Headers present (X-Content-Type-Options, X-Frame-Options)', hasNosniff && hasFrameOptions);
  } catch (err: any) {
    assert('Security Headers present', false, err.message);
  }

  // 12. Test Forgot Password (No user enumeration)
  try {
    const res = await axios.post(`${API_BASE}/auth/forgot-password`, {
      email: 'some.unknown.person@example.com'
    });
    assert('Forgot password endpoint returns safe response without enumeration', res.status === 200 && res.data.success);
  } catch (err: any) {
    assert('Forgot password endpoint returns safe response without enumeration', false, err.response?.data || err.message);
  }

  console.log('🔒 ================================================');
  console.log(`🔒 AUDIT RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('🔒 ================================================');

  if (passed === total) {
    console.log('🎉 ALL SECURITY CHECKS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED');
    process.exit(1);
  }
}

runSecurityAudit();
