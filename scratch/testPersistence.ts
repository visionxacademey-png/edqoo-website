import axios from 'axios';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

const API_BASE = 'http://localhost:5001/api';
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE')
  ? process.env.DATABASE_URL
  : DEFAULT_NEON_URL;

const pool = new Pool({ connectionString: DATABASE_URL });

async function runTests() {
  console.log('🧪 ================= STARTING PERSISTENCE TEST SUITE =================');
  
  // 1. Admin Login
  console.log('\n🔑 1. Logging in as Admin (admin@edqoo.com)...');
  const loginRes = await axios.post(`${API_BASE}/auth/login`, {
    email: 'admin@edqoo.com',
    password: 'Admin@123456'
  });
  const token = loginRes.data.token;
  console.log('✅ Admin logged in successfully! Token acquired.');

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // ----------------------------------------------------
  // TEST SUITE 1: INSTRUCTOR IMAGE UPDATE & PERSISTENCE
  // ----------------------------------------------------
  console.log('\n🧑‍🏫 2. Testing Instructor Image Update Persistence (Dr. Rajesh Nair)...');
  const instId = 'inst-1';
  const initialInstDb = await pool.query('SELECT id, name, image, profile_image FROM instructors WHERE id = $1', [instId]);
  const originalInstImage = initialInstDb.rows[0]?.profile_image || initialInstDb.rows[0]?.image;
  console.log(`Original DB Instructor Image: ${originalInstImage}`);

  const testImageA = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop&test=image_a';
  const testImageB = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop&test=image_b';

  // TEST A: Change to IMAGE A
  console.log('\n--- TEST A: Admin changes Instructor Image to IMAGE A ---');
  const updateInstRes = await axios.put(`${API_BASE}/instructors/${instId}`, {
    name: 'Dr. Rajesh Nair',
    designation: 'Chief AI Scientist & Lead Instructor',
    profileImage: testImageA,
    image: testImageA
  }, { headers: authHeaders });

  console.log('API Response Image:', updateInstRes.data.instructor.profileImage);

  // Verify in NeonDB directly
  const dbInstCheckA = await pool.query('SELECT id, name, image, profile_image FROM instructors WHERE id = $1', [instId]);
  const dbImageA = dbInstCheckA.rows[0]?.profile_image;
  console.log(`Direct NeonDB Image: ${dbImageA}`);
  if (dbImageA !== testImageA) {
    throw new Error(`TEST A FAILED: Direct DB value ${dbImageA} does not match expected ${testImageA}`);
  }
  console.log('✅ TEST A PASSED: Direct DB contains IMAGE A.');

  // TEST B & C: Refresh Admin and Public Endpoints
  console.log('\n--- TEST B & C: Refresh Admin and Public Endpoints ---');
  const publicInstRes = await axios.get(`${API_BASE}/instructors`);
  const publicInst = publicInstRes.data.find((i: any) => i.id === instId);
  console.log(`Public Endpoint Image: ${publicInst?.profileImage || publicInst?.image}`);
  if ((publicInst?.profileImage || publicInst?.image) !== testImageA) {
    throw new Error(`TEST C FAILED: Public endpoint returned ${publicInst?.profileImage || publicInst?.image}, expected ${testImageA}`);
  }
  console.log('✅ TEST B & C PASSED: Public GET endpoint returns IMAGE A.');

  // TEST D: Change to IMAGE B
  console.log('\n--- TEST D: Admin changes Instructor Image to IMAGE B ---');
  await axios.put(`${API_BASE}/instructors/${instId}`, {
    name: 'Dr. Rajesh Nair',
    designation: 'Chief AI Scientist & Lead Instructor',
    profileImage: testImageB,
    image: testImageB
  }, { headers: authHeaders });

  const dbInstCheckB = await pool.query('SELECT id, name, image, profile_image FROM instructors WHERE id = $1', [instId]);
  const dbImageB = dbInstCheckB.rows[0]?.profile_image;
  console.log(`Direct NeonDB Image B: ${dbImageB}`);
  if (dbImageB !== testImageB) {
    throw new Error(`TEST D FAILED: Direct DB value ${dbImageB} does not match expected ${testImageB}`);
  }
  console.log('✅ TEST D PASSED: Direct DB contains IMAGE B.');

  // TEST E: Simulate DB Initialization / Server Restart
  console.log('\n--- TEST E: Simulate Server Re-initialization & initDb() ---');
  // Trigger initDb logic / call public endpoint that ensures DB is initialized
  await axios.get(`${API_BASE}/health`);
  await axios.get(`${API_BASE}/courses`);
  await axios.get(`${API_BASE}/instructors`);

  const dbInstAfterRestart = await pool.query('SELECT id, name, image, profile_image FROM instructors WHERE id = $1', [instId]);
  const dbImageAfterRestart = dbInstAfterRestart.rows[0]?.profile_image;
  console.log(`Direct NeonDB Image After Startup/Re-init: ${dbImageAfterRestart}`);
  if (dbImageAfterRestart !== testImageB) {
    throw new Error(`TEST E FAILED: Image reverted to ${dbImageAfterRestart}! Expected ${testImageB}`);
  }
  console.log('✅ TEST E PASSED: Direct DB STILL contains IMAGE B after re-initialization!');

  // ----------------------------------------------------
  // TEST SUITE 2: COURSE IMAGE UPDATE & PERSISTENCE
  // ----------------------------------------------------
  console.log('\n📚 3. Testing Course Image Update Persistence (Advanced Executive Program in Data Science & AI)...');
  const courseId = 'advanced-executive-program-data-science-ai';
  const initialCourseDb = await pool.query('SELECT id, title, image FROM courses WHERE id = $1', [courseId]);
  console.log(`Original DB Course Image: ${initialCourseDb.rows[0]?.image}`);

  const courseImageA = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop&test=course_img_a';
  const courseImageB = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop&test=course_img_b';

  console.log('\n--- TEST Course Update to IMAGE A ---');
  await axios.put(`${API_BASE}/courses/${courseId}`, {
    image: courseImageA
  }, { headers: authHeaders });

  const dbCourseCheckA = await pool.query('SELECT id, image FROM courses WHERE id = $1', [courseId]);
  console.log(`Direct NeonDB Course Image: ${dbCourseCheckA.rows[0]?.image}`);
  if (dbCourseCheckA.rows[0]?.image !== courseImageA) {
    throw new Error(`Course TEST A FAILED: Direct DB value ${dbCourseCheckA.rows[0]?.image} != ${courseImageA}`);
  }
  console.log('✅ Course Image Update to IMAGE A Verified in NeonDB.');

  console.log('\n--- TEST Course Update to IMAGE B ---');
  await axios.put(`${API_BASE}/courses/${courseId}`, {
    image: courseImageB
  }, { headers: authHeaders });

  const dbCourseCheckB = await pool.query('SELECT id, image FROM courses WHERE id = $1', [courseId]);
  console.log(`Direct NeonDB Course Image: ${dbCourseCheckB.rows[0]?.image}`);
  if (dbCourseCheckB.rows[0]?.image !== courseImageB) {
    throw new Error(`Course TEST B FAILED: Direct DB value ${dbCourseCheckB.rows[0]?.image} != ${courseImageB}`);
  }
  console.log('✅ Course Image Update to IMAGE B Verified in NeonDB.');

  // Simulate multiple GET requests and health checks
  for (let i = 0; i < 5; i++) {
    await axios.get(`${API_BASE}/courses/${courseId}`);
    await axios.get(`${API_BASE}/health`);
  }

  const dbCourseFinal = await pool.query('SELECT id, image FROM courses WHERE id = $1', [courseId]);
  console.log(`Direct NeonDB Course Image after repeated requests: ${dbCourseFinal.rows[0]?.image}`);
  if (dbCourseFinal.rows[0]?.image !== courseImageB) {
    throw new Error(`Course persistence FAILED: reverted to ${dbCourseFinal.rows[0]?.image}`);
  }
  console.log('✅ Course Image Remains 100% Persistent as IMAGE B.');

  // Restore original instructor image for cleanliness
  console.log('\n🧹 Restoring test instructor to clean state...');
  await axios.put(`${API_BASE}/instructors/${instId}`, {
    name: 'Dr. Rajesh Nair',
    designation: 'Chief AI Scientist & Lead Instructor',
    profileImage: originalInstImage,
    image: originalInstImage
  }, { headers: authHeaders });

  const cleanInstCheck = await pool.query('SELECT profile_image FROM instructors WHERE id = $1', [instId]);
  console.log(`Cleaned DB Instructor Image: ${cleanInstCheck.rows[0]?.profile_image}`);

  console.log('\n🎉 ================= ALL PERSISTENCE TESTS PASSED (100% SUCCESS) =================\n');
  await pool.end();
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
