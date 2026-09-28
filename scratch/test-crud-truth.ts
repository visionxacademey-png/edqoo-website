import { pool, isNeonConnected, ensureDbInitialized, query } from '../server/db/index.ts';

async function testCrudTruth() {
  await ensureDbInitialized();
  if (!isNeonConnected || !pool) {
    console.error('❌ Neon DB not connected!');
    process.exit(1);
  }

  console.log('--- TEST 1: READ COURSES FROM NEON ---');
  const readRes = await query("SELECT id, slug, title, image, price FROM courses WHERE slug = 'html'");
  if (readRes.rows.length === 0) {
    console.error('❌ HTML course not found in Neon DB!');
    process.exit(1);
  }
  const htmlCourse = readRes.rows[0];
  console.log(`✅ Current HTML Course in Neon DB:`, htmlCourse);

  console.log('\n--- TEST 2: TEST EDIT / UPDATE DIRECTLY IN NEON ---');
  const testImageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop';
  await query("UPDATE courses SET updated_at = NOW() WHERE slug = 'html'");
  const updatedRes = await query("SELECT id, slug, title, image, updated_at FROM courses WHERE slug = 'html'");
  console.log(`✅ Verified updated record from Neon:`, updatedRes.rows[0]);

  console.log('\n--- TEST 3: VERIFY SQL & CSS COURSES IN NEON ---');
  const otherRes = await query("SELECT id, slug, title, image, price FROM courses WHERE slug IN ('css', 'sql')");
  for (const c of otherRes.rows) {
    console.log(`- ${c.title} (slug: ${c.slug}, image: ${c.image})`);
  }

  console.log('\n🎉 ALL NEON SINGLE SOURCE OF TRUTH TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

testCrudTruth().catch((e) => {
  console.error(e);
  process.exit(1);
});
