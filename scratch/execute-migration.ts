import { query, pool } from '../server/db/index';

async function executeMigration() {
  try {
    console.log('--- STARTING DATABASE MIGRATION ---');

    // 1. Rename course "1-to-1 Live Spoken English" -> "1-to-1 Communicative English Mastery"
    const renameRes = await query(
      `UPDATE courses 
       SET title = '1-to-1 Communicative English Mastery', 
           updated_at = NOW() 
       WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
       RETURNING id, slug, title`,
      []
    );
    console.log(`✅ Renamed courses: ${renameRes.rowCount}`);
    for (const r of renameRes.rows) {
      console.log(`   - ID: ${r.id} | Slug: ${r.slug} | Title: "${r.title}"`);
    }

    // 2. Remove the four courses
    const deleteIds = [
      '3-month-ielts-master-plan',
      '30-day-spoken-english-transformation-handbook',
      'essential-self-paced-video-vault',
      'premium-self-paced-video-vault'
    ];

    const deleteRes = await query(
      `DELETE FROM courses 
       WHERE id = ANY($1) OR slug = ANY($1)
       RETURNING id, slug, title`,
      [deleteIds]
    );
    console.log(`🗑️ Deleted courses: ${deleteRes.rowCount}`);
    for (const r of deleteRes.rows) {
      console.log(`   - ID: ${r.id} | Slug: ${r.slug} | Title: "${r.title}"`);
    }

    // 3. Verify current English / Spoken Tutorial courses in DB
    const verifyRes = await query(`
      SELECT id, slug, title, category, status 
      FROM courses 
      WHERE category IN ('English Mirror', 'Spoken Tutorial')
         OR title ILIKE '%English%'
         OR title ILIKE '%Vault%'
         OR title ILIKE '%IELTS%'
         OR title ILIKE '%Handbook%'
      ORDER BY title ASC
    `);

    console.log('\n--- VERIFICATION OF REMAINING ENGLISH / SPOKEN TUTORIAL COURSES ---');
    console.log(`Total matching courses in DB: ${verifyRes.rows.length}`);
    for (const r of verifyRes.rows) {
      console.log(`- ID: "${r.id}" | Slug: "${r.slug}" | Title: "${r.title}" | Category: "${r.category}"`);
    }

    // 4. Specifically check that none of the 4 deleted courses remain
    const checkDeleted = await query(`
      SELECT id, slug, title FROM courses 
      WHERE title IN (
        '3-Month IELTS Master Plan',
        '30-Day Spoken English Transformation Handbook',
        'Premium Self-Paced Video Vault',
        'Essential Self-Paced Video Vault'
      ) OR id = ANY($1) OR slug = ANY($1)
    `, [deleteIds]);

    if (checkDeleted.rows.length === 0) {
      console.log('✅ CONFIRMED: None of the 4 removed courses exist in DB.');
    } else {
      console.error('❌ WARNING: Some deleted courses still exist in DB:', checkDeleted.rows);
    }

    // 5. Specifically check that "1-to-1 Live Spoken English" does NOT exist as a title
    const checkOldTitle = await query(`
      SELECT id, slug, title FROM courses 
      WHERE title = '1-to-1 Live Spoken English'
    `);
    if (checkOldTitle.rows.length === 0) {
      console.log('✅ CONFIRMED: No course with title "1-to-1 Live Spoken English" exists in DB.');
    } else {
      console.error('❌ WARNING: Course with old title still exists:', checkOldTitle.rows);
    }

    // 6. Check that "1-to-1 Communicative English Mastery" exists with ID "1-to-1-live-spoken-english"
    const checkNewTitle = await query(`
      SELECT id, slug, title FROM courses 
      WHERE title = '1-to-1 Communicative English Mastery' AND id = '1-to-1-live-spoken-english'
    `);
    if (checkNewTitle.rows.length === 1) {
      console.log('✅ CONFIRMED: "1-to-1 Communicative English Mastery" exists with ID "1-to-1-live-spoken-english" in DB.');
    } else {
      console.error('❌ WARNING: New course title check failed:', checkNewTitle.rows);
    }

  } catch (err: any) {
    console.error('Migration error:', err.message);
  } finally {
    if (pool) await pool.end();
    process.exit(0);
  }
}

executeMigration();
