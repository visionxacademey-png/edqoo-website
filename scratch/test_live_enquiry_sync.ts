import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

async function runLiveSyncTest() {
  console.log('--- STARTING LIVE ENQUIRY SYNC & DB RELIABILITY TEST ---');

  // 1. Authenticate as Admin
  console.log('1. Authenticating as Admin (admin@edqoo.com)...');
  const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
    email: 'admin@edqoo.com',
    password: 'OurdreamAdmin@2002'
  });

  const token = loginRes.data.token;
  if (!token) {
    throw new Error('Admin login failed: No token received.');
  }
  console.log('   Admin authentication successful. Token received.');

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 2. Fetch baseline enquiries
  console.log('2. Fetching baseline enquiries via GET /api/enquiries...');
  const initialEnquiriesRes = await axios.get(`${BASE_URL}/api/enquiries`, authHeaders);
  const baselineCount = initialEnquiriesRes.data.length;
  console.log(`   Baseline enquiry count: ${baselineCount}`);

  // Fetch baseline stats
  const initialStatsRes = await axios.get(`${BASE_URL}/api/admin/stats`, authHeaders);
  const baselineStatsTotal = initialStatsRes.data.totalEnquiries;
  console.log(`   Baseline admin stats totalEnquiries: ${baselineStatsTotal}`);

  // 3. Visitor submits a new enquiry via public form POST /api/enquiries
  const testTimestamp = Date.now();
  const testEnquiryPayload = {
    name: `Automated Test Visitor ${testTimestamp}`,
    email: `test_visitor_${testTimestamp}@example.com`,
    phone: '9876543210',
    program: 'Full Stack Web Development & AI Tools',
    category: 'Tools & Upskills',
    source: 'Website Live Sync Verification',
    leadStatus: 'Completed',
    status: 'Submitted',
    message: 'Testing live enquiry updates without manual page refresh.'
  };

  console.log('3. Submitting new enquiry via POST /api/enquiries...');
  const submitRes = await axios.post(`${BASE_URL}/api/enquiries`, testEnquiryPayload);

  if (submitRes.status !== 201 || !submitRes.data.success) {
    throw new Error(`Failed to submit enquiry: status ${submitRes.status}`);
  }

  const createdEnquiry = submitRes.data.enquiry;
  console.log(`   Enquiry created successfully: ID=${createdEnquiry.id}, submittedAt=${createdEnquiry.submittedAt}`);

  // 4. Verify admin sync retrieves the enquiry immediately
  console.log('4. Calling GET /api/enquiries to simulate admin auto-sync polling...');
  const syncedEnquiriesRes = await axios.get(`${BASE_URL}/api/enquiries`, authHeaders);
  const syncedList = syncedEnquiriesRes.data;

  console.log(`   New enquiry count: ${syncedList.length} (Expected: ${baselineCount + 1})`);
  if (syncedList.length !== baselineCount + 1) {
    throw new Error(`Count mismatch: expected ${baselineCount + 1}, got ${syncedList.length}`);
  }

  // 5. Verify the newly submitted enquiry is at index 0 (newest at top)
  const topEnquiry = syncedList[0];
  console.log(`   Top enquiry in list: ID=${topEnquiry.id}, Name="${topEnquiry.name}"`);
  if (topEnquiry.id !== createdEnquiry.id) {
    throw new Error(`Ordering failure: Newest enquiry ${createdEnquiry.id} is not at index 0! (Found ${topEnquiry.id})`);
  }
  console.log('   Newest enquiry is at index 0.');

  // 6. Verify dashboard stats update
  console.log('5. Calling GET /api/admin/stats to verify dashboard metrics synchronization...');
  const syncedStatsRes = await axios.get(`${BASE_URL}/api/admin/stats`, authHeaders);
  const newStatsTotal = syncedStatsRes.data.totalEnquiries;
  console.log(`   New stats totalEnquiries: ${newStatsTotal} (Expected: ${baselineStatsTotal + 1})`);
  if (newStatsTotal !== baselineStatsTotal + 1) {
    throw new Error(`Stats mismatch: expected ${baselineStatsTotal + 1}, got ${newStatsTotal}`);
  }

  // 7. Test status update action
  console.log('6. Testing admin status update for newly created lead...');
  const updateRes = await axios.patch(
    `${BASE_URL}/api/enquiries/${createdEnquiry.id}`,
    { status: 'Contacted', notes: 'Automated test counselor note: Called student.' },
    authHeaders
  );
  if (!updateRes.data.success || updateRes.data.enquiry.status !== 'Contacted') {
    throw new Error('Failed to update enquiry status.');
  }
  console.log('   Enquiry status updated to "Contacted" successfully.');

  // 8. Test unauthorized protection
  console.log('7. Verifying security: Unauthorized GET /api/enquiries without token...');
  try {
    await axios.get(`${BASE_URL}/api/enquiries`);
    throw new Error('Security failure: Unauthorized request was not blocked!');
  } catch (err: any) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      console.log(`   Unauthorized access correctly blocked with HTTP ${err.response.status}.`);
    } else {
      throw err;
    }
  }

  console.log('\n========================================');
  console.log('ALL LIVE SYNC & RELIABILITY TESTS PASSED!');
  console.log('========================================');
}

runLiveSyncTest().catch((err) => {
  console.error('TEST FAILED:', err.message || err);
  process.exit(1);
});
