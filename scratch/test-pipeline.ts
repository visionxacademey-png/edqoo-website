async function testPipeline() {
  console.log('=== STEP 1: Direct Backend Diagnostic Endpoint (5001) ===');
  try {
    const res = await fetch('http://127.0.0.1:5001/api/debug/database');
    const data = await res.json();
    console.log('Debug status:', res.status);
    console.log('Database connected:', data.databaseConnected);
    console.log('Course count:', data.courseCount);
    console.log('Database host:', data.databaseHost);
  } catch (err: any) {
    console.error('Failed to query backend debug endpoint:', err.message);
  }

  console.log('\n=== STEP 2: Direct Backend Courses Endpoint (5001) ===');
  try {
    const res = await fetch('http://127.0.0.1:5001/api/courses');
    const data = await res.json();
    console.log('Courses status:', res.status);
    console.log('Courses returned count:', Array.isArray(data) ? data.length : typeof data);
    if (Array.isArray(data) && data.length > 0) {
      console.log('Sample course titles:', data.slice(0, 5).map((c: any) => c.title));
    }
  } catch (err: any) {
    console.error('Failed to query backend courses endpoint:', err.message);
  }

  console.log('\n=== STEP 3: Frontend Vite Proxy Debug Endpoint (5173) ===');
  try {
    const res = await fetch('http://127.0.0.1:5173/api/debug/database');
    const data = await res.json();
    console.log('Vite proxy debug status:', res.status);
    console.log('Course count via Vite proxy:', data.courseCount);
  } catch (err: any) {
    console.error('Failed to query Vite proxy debug endpoint:', err.message);
  }

  console.log('\n=== STEP 4: Frontend Vite Proxy Courses Endpoint (5173) ===');
  try {
    const res = await fetch('http://127.0.0.1:5173/api/courses');
    const data = await res.json();
    console.log('Vite proxy courses status:', res.status);
    console.log('Course count via Vite proxy:', Array.isArray(data) ? data.length : typeof data);
  } catch (err: any) {
    console.error('Failed to query Vite proxy courses endpoint:', err.message);
  }
}

testPipeline();
