import axios from 'axios';

async function testPorts() {
  try {
    const apiRes = await axios.get('http://localhost:5001/api/courses/1-to-1-live-spoken-english');
    console.log('API /api/courses/1-to-1-live-spoken-english title:', apiRes.data.title);
    console.log('API /api/courses/1-to-1-live-spoken-english image:', apiRes.data.image);
  } catch (e: any) {
    console.error('5001 API error:', e.message);
  }

  for (const port of [5173, 5174]) {
    try {
      const res = await axios.get(`http://localhost:${port}/`);
      console.log(`Port ${port} status:`, res.status);
    } catch (e: any) {
      console.log(`Port ${port} error:`, e.message);
    }
  }
  process.exit(0);
}

testPorts();
