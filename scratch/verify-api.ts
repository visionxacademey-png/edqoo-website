import http from 'http';

function get(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function verify() {
  try {
    const courses = await get('/api/courses');
    const fCourse = courses.find((c: any) => c.id === 'standard-plan-telephonic-calling-sessions');
    const eCourse = courses.find((c: any) => c.id === 'targeted-interview-prep-masterclass');

    console.log('=== API COURSES CHECK ===');
    console.log('Fluency Builder Course Image:', fCourse?.image);
    console.log('Executive Interview Course Image:', eCourse?.image);

    const categories = await get('/api/categories');
    const fCat = categories.find((c: any) => c.id === 'cat-fluency-builder-plan');
    const eCat = categories.find((c: any) => c.id === 'cat-executive-interview-prep-track');

    console.log('\n=== API CATEGORIES CHECK ===');
    console.log('Fluency Builder Hero Image:', fCat?.heroImage);
    console.log('Executive Interview Hero Image:', eCat?.heroImage);
  } catch (err: any) {
    console.error('API Verification error:', err.message);
  }
}

verify();
