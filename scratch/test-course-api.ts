async function testApi() {
  const t0 = Date.now();
  const res = await fetch('http://localhost:5001/api/courses');
  console.log('Status:', res.status, res.statusText);
  const data = await res.json();
  console.log(`Fetched ${data.length} courses in ${Date.now() - t0}ms`);
  
  // Verify the 4 removed courses do NOT exist
  const removedFound = data.filter((c: any) => 
    c.title.includes('3-Month IELTS') ||
    c.title.includes('30-Day Spoken') ||
    c.title.includes('Video Vault')
  );
  console.log('Removed courses in response:', removedFound.map((c: any) => c.title));

  // Verify the renamed course
  const renamed = data.find((c: any) => c.slug === '1-to-1-live-spoken-english' || c.id === '1-to-1-live-spoken-english');
  console.log('Renamed course title:', renamed ? renamed.title : 'Not found');
  console.log('Renamed course category:', renamed ? renamed.category : 'Not found');

  // Verify Spoken Tutorial category courses
  const spokenTutorialCourses = data.filter((c: any) => c.category === 'Spoken Tutorial');
  console.log('Spoken Tutorial courses count:', spokenTutorialCourses.length);
  spokenTutorialCourses.forEach((c: any) => console.log(' -', c.title));
}

testApi();
