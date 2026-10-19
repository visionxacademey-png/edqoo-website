async function testDuplicatePost() {
  console.log('Testing duplicate category creation via API...');
  
  // Note: /api/categories POST requires admin auth, let's test by generating a token or calling db directly,
  // or testing with fetch if we login as admin.
  // Let's test with admin login:
  try {
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@edqoo.com', password: 'AdminPassword123!' })
    });
    
    let token = '';
    if (loginRes.ok) {
      const data = await loginRes.json();
      token = data.token;
      console.log('Logged in as admin successfully.');
    } else {
      console.log('Admin login with default credentials returned:', loginRes.status);
    }

    if (token) {
      const postRes = await fetch('http://localhost:5001/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Spoken Tutorial',
          slug: 'spoken-tutorial-duplicate',
          displayOrder: 99
        })
      });
      console.log(`POST response status: ${postRes.status} (expected 409 Conflict)`);
      const body = await postRes.json();
      console.log('Response body:', body);
      if (postRes.status === 409) {
        console.log('✅ Duplicate category creation properly prevented by API with 409 Conflict!');
      } else {
        console.error('❌ Expected 409 Conflict but got:', postRes.status);
      }
    }
  } catch (err: any) {
    console.error('Test error:', err.message);
  }
}

testDuplicatePost();
