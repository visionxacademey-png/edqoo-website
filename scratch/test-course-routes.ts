import { query } from '../server/db/index.js';

async function testQueryAndVerify() {
  try {
    const courseRes = await query(
      "SELECT id, slug, title, image, hero_image, updated_at FROM courses WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'"
    );

    console.log('✅ Found course:', courseRes.rows[0]);

    if (
      courseRes.rows[0].image ===
      'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
    ) {
      console.log('🎉 Course image matches EXACT requested URL!');
    } else {
      console.error('❌ Course image does NOT match! Current:', courseRes.rows[0].image);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

testQueryAndVerify();
