import { pool, query } from '../server/db/index.js';

async function deleteLanguageCourses() {
  console.log('🗑️ Deleting language course records from NeonDB...');

  const ids = [
    'spoken-english-malayalam',
    'spoken-english-kannada',
    'spoken-english-telugu',
    'spoken-english-tamil'
  ];

  const res = await query(
    'DELETE FROM courses WHERE id = ANY($1) OR slug = ANY($1) RETURNING id, title',
    [ids]
  );

  console.log(`✅ Deleted ${res.rows.length} language course records:`);
  res.rows.forEach(r => console.log(`   - [${r.id}] ${r.title}`));

  // Verify that all 5 genuine Spoken Tutorial courses are still intact
  const spokenCourses = await query(`
    SELECT id, slug, title, image 
    FROM courses 
    WHERE category = 'Spoken Tutorial' OR categories::text ILIKE '%Spoken Tutorial%'
    ORDER BY title ASC
  `);

  console.log('\n--- REMAINING SPOKEN TUTORIAL COURSES IN DB ---');
  spokenCourses.rows.forEach(c => {
    console.log(`- ${c.title} (ID: ${c.id})`);
    console.log(`  Image: ${c.image}`);
  });

  await pool.end();
}

deleteLanguageCourses().catch(console.error);
