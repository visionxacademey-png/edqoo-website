import axios from 'axios';

async function testApi() {
  try {
    const res = await axios.get('http://localhost:5001/api/courses?_t=' + Date.now());
    const courses = res.data;
    console.log(`API returned ${courses.length} courses:`);

    const titles = courses.map((c: any) => c.title);
    console.log('\nAll course titles:');
    titles.forEach((t: string, i: number) => console.log(`${i + 1}. ${t}`));

    const removedCourseNames = [
      '3-Month IELTS Master Plan',
      '30-Day Spoken English Transformation Handbook',
      'Premium Self-Paced Video Vault',
      'Essential Self-Paced Video Vault'
    ];

    console.log('\n--- VERIFYING REMOVALS ---');
    for (const name of removedCourseNames) {
      const found = courses.some((c: any) => c.title.toLowerCase() === name.toLowerCase());
      console.log(`- "${name}": ${found ? '❌ STILL PRESENT' : '✅ ABSENT (SUCCESS)'}`);
    }

    console.log('\n--- VERIFYING RENAMED COURSE ---');
    const oldFound = courses.some((c: any) => c.title.toLowerCase() === '1-to-1 live spoken english');
    console.log(`- Old title "1-to-1 Live Spoken English": ${oldFound ? '❌ STILL PRESENT' : '✅ ABSENT'}`);

    const newCourse = courses.find((c: any) => c.title === '1-to-1 Communicative English Mastery');
    if (newCourse) {
      console.log(`- New title "1-to-1 Communicative English Mastery": ✅ FOUND (ID: ${newCourse.id}, slug: ${newCourse.slug})`);
    } else {
      console.log('- New title "1-to-1 Communicative English Mastery": ❌ NOT FOUND');
    }

    // Test course detail by slug
    console.log('\n--- VERIFYING SLUG ENDPOINTS ---');
    const slug1Res = await axios.get('http://localhost:5001/api/courses/1-to-1-live-spoken-english');
    console.log(`- /api/courses/1-to-1-live-spoken-english: Title = "${slug1Res.data.title}"`);

    const slug2Res = await axios.get('http://localhost:5001/api/courses/1-to-1-communicative-english-mastery');
    console.log(`- /api/courses/1-to-1-communicative-english-mastery: Title = "${slug2Res.data.title}"`);

  } catch (err: any) {
    console.error('API test failed:', err.message);
  }
  process.exit(0);
}

testApi();
