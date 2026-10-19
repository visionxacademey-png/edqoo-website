import http from 'http';

function get(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== VERIFYING CATALOGUE & COURSES ===');
  const res = await get('/api/courses');
  const courses: any[] = res.body;

  const unwantedIds = [
    'spoken-english-malayalam',
    'spoken-english-kannada',
    'spoken-english-telugu',
    'spoken-english-tamil'
  ];

  const foundUnwanted = courses.filter(c => unwantedIds.includes(c.id) || unwantedIds.includes(c.slug));
  console.log(`Unwanted language courses in catalogue: ${foundUnwanted.length} (Expected: 0)`);
  if (foundUnwanted.length > 0) {
    console.error('❌ Found unwanted courses:', foundUnwanted.map(c => c.id));
  } else {
    console.log('✅ No language courses found in catalogue!');
  }

  // Verify 404 for removed courses
  for (const id of unwantedIds) {
    const singleRes = await get(`/api/courses/${id}`);
    console.log(`GET /api/courses/${id} status: ${singleRes.status} (Expected: 404)`);
  }

  // Verify 5 genuine Spoken Tutorial courses exist
  const genuineIds = [
    'standard-plan-telephonic-calling-sessions',
    'kids-1-to-1-english-fluency-program',
    'elite-corporate-transformation-track',
    'ielts-intensive-1-to-1-crash-training',
    'targeted-interview-prep-masterclass'
  ];

  console.log('\n=== VERIFYING GENUINE SPOKEN TUTORIAL COURSES ===');
  for (const id of genuineIds) {
    const found = courses.find(c => c.id === id);
    if (found) {
      console.log(`✅ [${found.id}] ${found.title}`);
      console.log(`   Image: ${found.image}`);
    } else {
      console.error(`❌ Missing genuine course: ${id}`);
    }
  }
}

verifyAll().catch(console.error);
