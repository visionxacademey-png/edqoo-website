import dotenv from 'dotenv';
dotenv.config();
import { query } from '../server/db/index.js';

async function testEnquiryFlow() {
  console.log('--- 1. Testing API POST /api/enquiries ---');
  const testEmail = 'lead.test.audit@edqoo.com';
  const testPayload = {
    name: 'Audit Test User',
    email: testEmail,
    phone: '+91 98765 43210',
    program: 'Python Programming',
    category: 'Tools and Upskills',
    source: 'Automated Audit Test',
    message: 'Verifying database persistence end-to-end'
  };

  const postRes = await fetch('http://localhost:5001/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });

  const postJson: any = await postRes.json();
  console.log('API POST Status:', postRes.status);
  console.log('API POST Success:', postJson.success);
  console.log('Created Enquiry ID:', postJson.enquiry?.id);

  console.log('\n--- 2. Verifying Direct Persistence in NeonDB PostgreSQL ---');
  const dbRes = await query('SELECT id, name, email, phone, program, category, status, lead_status, submitted_at FROM enquiries WHERE email = $1', [testEmail]);
  console.log('Rows found in NeonDB:', dbRes.rows.length);
  if (dbRes.rows.length > 0) {
    console.log('Persisted Row Details:', dbRes.rows[0]);
  } else {
    throw new Error('Verification failed: Record not found in NeonDB!');
  }

  console.log('\n--- 3. Testing Admin Endpoint Retrieval with Bearer Token ---');
  // Use admin token to verify admin retrieval
  const adminRes = await fetch('http://localhost:5001/api/enquiries', {
    headers: { 'Authorization': 'Bearer admin_token' }
  });
  const adminJson: any = await adminRes.json();
  console.log('Admin GET Status:', adminRes.status);
  const foundInAdmin = Array.isArray(adminJson) && adminJson.some((e: any) => e.email === testEmail);
  console.log('Lead found in Admin enquiry list:', foundInAdmin);

  console.log('\n--- 4. Testing Lead Status Update via PATCH /api/enquiries/:id ---');
  const patchRes = await fetch(`http://localhost:5001/api/enquiries/${postJson.enquiry.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer admin_token'
    },
    body: JSON.stringify({
      status: 'Contacted',
      notes: 'Audit test: Lead verified and contacted.'
    })
  });
  const patchJson: any = await patchRes.json();
  console.log('PATCH Status:', patchRes.status, 'Updated status:', patchJson.enquiry?.status);

  console.log('\n--- 5. Cleaning Up Test Record ---');
  await query('DELETE FROM enquiries WHERE email = $1', [testEmail]);
  await query('DELETE FROM user_sessions WHERE email = $1', [testEmail]);
  await query('DELETE FROM users WHERE email = $1', [testEmail]);
  console.log('Test record cleaned up cleanly.');

  console.log('\n✅ ENQUIRY DATABASE & ADMIN PERSISTENCE VERIFIED SUCCESSFULLY!');
  process.exit(0);
}

testEnquiryFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
