import axios from 'axios';

async function test() {
  const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
    email: 'admin@edqoo.com',
    password: 'OurdreamAdmin@2002'
  });
  const token = loginRes.data.token;
  
  const start = Date.now();
  const enqRes = await axios.get('http://localhost:5001/api/enquiries', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const elapsed = Date.now() - start;

  console.log(`Fetched ${enqRes.data.length} enquiries in ${elapsed}ms`);
  if (enqRes.data.length > 0) {
    console.log('Newest enquiry:', enqRes.data[0].id, enqRes.data[0].name, enqRes.data[0].submittedAt);
  }
  process.exit(0);
}

test();
