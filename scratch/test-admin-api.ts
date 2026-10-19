async function testAdminFlow() {
  console.log('Testing admin login and course management APIs...');
  
  // 1. Test db status endpoint
  const statusRes = await fetch('http://localhost:5001/api/health').catch(() => null);
  if (statusRes) {
    console.log('Health check:', await statusRes.json());
  }

  // 2. Fetch courses list as AdminCourses does
  const coursesRes = await fetch('http://localhost:5001/api/courses');
  const courses = await coursesRes.json();
  console.log(`Admin courses fetch: returned ${courses.length} courses from DB.`);

  // Verify all course fields necessary for admin table
  const sample = courses[0];
  console.log('Sample course fields:', {
    id: sample.id,
    title: sample.title,
    category: sample.category,
    price: sample.price,
    status: sample.status,
    featured: sample.featured
  });
}

testAdminFlow();
