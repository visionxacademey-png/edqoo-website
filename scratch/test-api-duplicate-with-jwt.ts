import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'edqoo_jwt_secret_key_2026';

async function testDuplicatePostWithJwt() {
  const token = jwt.sign(
    { id: 'admin-1', email: 'admin@edqoo.com', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  console.log('Generated admin test token.');

  // Attempt to insert duplicate name "Spoken Tutorial"
  const res1 = await fetch('http://localhost:5001/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Spoken Tutorial',
      slug: 'spoken-tutorial-new',
      displayOrder: 99
    })
  });

  console.log(`Test 1 status: ${res1.status} (expected 409 Conflict)`);
  const body1 = await res1.json();
  console.log('Test 1 body:', body1);

  // Attempt to insert lowercase duplicate "spoken tutorial"
  const res2 = await fetch('http://localhost:5001/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'spoken tutorial',
      slug: 'spoken-tutorial-lower',
      displayOrder: 99
    })
  });

  console.log(`Test 2 status: ${res2.status} (expected 409 Conflict)`);
  const body2 = await res2.json();
  console.log('Test 2 body:', body2);

  // Attempt to update another category to name "Spoken Tutorial"
  const res3 = await fetch('http://localhost:5001/api/categories/cat-data-science-ai', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: 'Spoken Tutorial',
      slug: 'data-science-and-ai'
    })
  });

  console.log(`Test 3 (PUT duplicate) status: ${res3.status} (expected 409 Conflict)`);
  const body3 = await res3.json();
  console.log('Test 3 body:', body3);
}

testDuplicatePostWithJwt().catch(console.error);
