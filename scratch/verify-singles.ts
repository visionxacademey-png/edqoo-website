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

async function verifySingles() {
  const c1 = await get('/api/courses/standard-plan-telephonic-calling-sessions');
  console.log('Single Course 1 Image:', c1.title, c1.image);

  const c2 = await get('/api/courses/targeted-interview-prep-masterclass');
  console.log('Single Course 2 Image:', c2.title, c2.image);

  const cat1 = await get('/api/categories/fluency-builder-plan');
  console.log('Single Category 1 Hero Image:', cat1.name, cat1.heroImage);

  const cat2 = await get('/api/categories/executive-interview-preparation-track');
  console.log('Single Category 2 Hero Image:', cat2.name, cat2.heroImage);
}

verifySingles().catch(console.error);
