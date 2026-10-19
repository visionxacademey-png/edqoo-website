import axios from 'axios';

async function testLittleMirrorsApi() {
  try {
    const slug1Res = await axios.get('http://localhost:5001/api/courses/kids-1-to-1-english-fluency-program');
    console.log('1. /api/courses/kids-1-to-1-english-fluency-program:');
    console.log('   Title:', slug1Res.data.title);
    console.log('   Image:', slug1Res.data.image);

    const slug2Res = await axios.get('http://localhost:5001/api/courses/little-mirrors');
    console.log('2. /api/courses/little-mirrors:');
    console.log('   Title:', slug2Res.data.title);
    console.log('   Image:', slug2Res.data.image);

    const EXPECTED = 'https://images.unsplash.com/photo-1586011876158-197fd32f15e2?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D';
    if (slug1Res.data.image === EXPECTED && slug2Res.data.image === EXPECTED) {
      console.log('✅ BOTH ENDPOINTS RETURN EXACT MATCHING NEW IMAGE URL!');
    } else {
      console.log('❌ MISMATCH!');
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

testLittleMirrorsApi();
