import { pool, isNeonConnected, ensureDbInitialized, query } from '../server/db/index.ts';

async function main() {
  await ensureDbInitialized();
  if (!isNeonConnected || !pool) {
    console.error('❌ Neon DB not connected!');
    process.exit(1);
  }

  console.log('✅ Connected to Neon PostgreSQL.');

  const res = await query('SELECT id, slug, title, category, categories, price, image, status FROM courses ORDER BY created_at DESC');
  console.log(`\n📚 Total Courses in Neon DB: ${res.rows.length}\n`);

  for (const row of res.rows) {
    console.log(`- [${row.category}] ${row.title} (slug: ${row.slug}, price: ₹${row.price}, image: ${row.image})`);
  }

  const instRes = await query('SELECT id, name, designation, organization FROM instructors ORDER BY created_at ASC');
  console.log(`\n👨‍🏫 Total Instructors in Neon DB: ${instRes.rows.length}\n`);
  for (const inst of instRes.rows) {
    console.log(`- ${inst.name} | ${inst.designation} (${inst.organization})`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});
