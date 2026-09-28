import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://127.0.0.1:5001/api';
const ADMIN_TOKEN = 'edqoo_jwt_admin_session_test_key_12345';

async function main() {
  console.log('--- STARTING ADMIN DELETE VERIFICATION TEST ---');

  // 1. Health check
  try {
    const healthRes = await fetch(`${API_BASE}/debug/database`);
    const healthData = await healthRes.json();
    console.log('Database Status:', healthData.databaseConnected ? 'CONNECTED' : 'NOT CONNECTED');
    console.log('Course Count:', healthData.courseCount);
  } catch (err: any) {
    console.error('Health check failed:', err.message);
    process.exit(1);
  }

  // 2. Insert test course
  const testCourseId = `temp-test-del-${Date.now()}`;
  console.log(`\nCreating temporary test course "${testCourseId}"...`);

  const createRes = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`
    },
    body: JSON.stringify({
      id: testCourseId,
      title: 'Temporary Test Course for Deletion Verification',
      slug: testCourseId,
      category: 'Tools and Upskills',
      categories: ['Tools and Upskills'],
      price: 999,
      duration: '10 Hours',
      lessons: 5,
      rating: 4.8,
      status: 'available',
      description: 'This is a test course to verify permanent deletion from Neon PostgreSQL.',
      featured: false
    })
  });

  const createData = await createRes.json();
  console.log('Create Response Status:', createRes.status);
  console.log('Created Course:', createData.course?.id || createData.id);

  // 3. Verify it exists via GET /api/courses/:id
  const getRes = await fetch(`${API_BASE}/courses/${testCourseId}`);
  console.log('Get Test Course Status:', getRes.status);
  if (getRes.status !== 200) {
    console.error('Test course was not found after creation!');
    process.exit(1);
  }

  // 4. Test DELETE /api/courses/:id with Admin Auth
  console.log(`\nSending DELETE request for "${testCourseId}"...`);
  const delRes = await fetch(`${API_BASE}/courses/${testCourseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`
    }
  });

  const delData = await delRes.json();
  console.log('Delete Response HTTP Status:', delRes.status);
  console.log('Delete Response Body:', delData);

  if (delRes.status !== 200 || !delData.success) {
    console.error('DELETE operation failed!');
    process.exit(1);
  }

  // 5. Verify the record is gone from GET /api/courses/:id
  console.log('\nVerifying record is permanently removed...');
  const verifyRes = await fetch(`${API_BASE}/courses/${testCourseId}`);
  console.log('Subsequent GET HTTP Status (expecting 404):', verifyRes.status);

  // 6. Test second DELETE returns 404
  const secondDelRes = await fetch(`${API_BASE}/courses/${testCourseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`
    }
  });
  console.log('Second DELETE HTTP Status (expecting 404):', secondDelRes.status);
  const secondDelData = await secondDelRes.json();
  console.log('Second DELETE Response Body:', secondDelData);

  if (verifyRes.status === 404 && secondDelRes.status === 404) {
    console.log('\n✅ ALL TESTS PASSED: Course was permanently deleted from Neon DB!');
  } else {
    console.error('\n❌ VERIFICATION FAILED: Course was not properly deleted.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
