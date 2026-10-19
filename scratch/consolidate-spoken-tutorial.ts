import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.webSocketConstructor = ws;
const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

async function consolidate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting Spoken Tutorial consolidation transaction...');
    await client.query('BEGIN');

    // 1. Verify existing Spoken Tutorial categories
    const existing = await client.query(`
      SELECT id, slug, name, parent_id, parent_slug 
      FROM categories 
      WHERE id IN ('cat-spoken-tutorial', 'cat-english-mirror') OR slug IN ('spoken-tutorial', 'english-mirror')
    `);
    console.log('Found categories to consolidate:');
    console.table(existing.rows);

    const canonicalId = 'cat-spoken-tutorial';
    const duplicateId = 'cat-english-mirror';

    // 2. Ensure canonical category has complete metadata
    await client.query(`
      UPDATE categories SET
        slug = 'spoken-tutorial',
        name = 'Spoken Tutorial',
        title = 'Spoken Tutorial — English Mirror Spoken English Programs',
        description = 'Your Complete Path to Confident English Communication. Personalized 1:1 English fluency coaching, daily telephonic confidence building, IELTS intensive crash training, and executive interview preparation.',
        subtitle = 'Mirror your success with fluent English',
        icon = 'message-circle',
        hero_image = '/images/spoken-tutorial/fluency-builder-plan.jpg',
        hero_badge = 'English Mirror Partner Track',
        display_order = 6,
        is_active = true,
        is_partner = true,
        badge = 'ENGLISH MIRROR',
        parent_id = NULL,
        parent_slug = NULL,
        updated_at = NOW()
      WHERE id = $1
    `, [canonicalId]);
    console.log(`✅ Verified canonical parent category: ${canonicalId}`);

    // 3. Ensure all 5 subcategories point to canonical parent
    const subcategoryIds = [
      'cat-fluency-builder-plan',
      'cat-little-mirrors',
      'cat-corporate-english-fluency-builder',
      'cat-ielts-intensive',
      'cat-executive-interview-prep-track'
    ];

    for (const subId of subcategoryIds) {
      await client.query(`
        UPDATE categories SET
          parent_id = $1,
          parent_slug = 'spoken-tutorial',
          updated_at = NOW()
        WHERE id = $2
      `, [canonicalId, subId]);
    }
    console.log('✅ Linked all 5 subcategories to canonical parent cat-spoken-tutorial');

    // 4. Migrate any courses that reference the duplicate category ID
    const courseUpdateRes = await client.query(`
      UPDATE courses SET
        category_id = $1,
        updated_at = NOW()
      WHERE category_id = $2
    `, [canonicalId, duplicateId]);
    console.log(`✅ Migrated ${courseUpdateRes.rowCount} courses from ${duplicateId} to ${canonicalId}`);

    // Update categories array if it contained duplicate ID or slug
    await client.query(`
      UPDATE courses SET
        categories = (
          SELECT jsonb_agg(DISTINCT CASE 
            WHEN elem = '"cat-english-mirror"' THEN '"cat-spoken-tutorial"'::jsonb
            WHEN elem = '"english-mirror"' THEN '"spoken-tutorial"'::jsonb
            ELSE elem 
          END)
          FROM jsonb_array_elements(categories) elem
        )
      WHERE categories::text ILIKE '%cat-english-mirror%' OR categories::text ILIKE '%"english-mirror"%'
    `);

    // 5. Migrate any enquiries that reference duplicate category
    const enqUpdateRes = await client.query(`
      UPDATE enquiries SET
        course_id = CASE WHEN course_id = $1 THEN $2 ELSE course_id END,
        category = CASE WHEN category = 'English Mirror' OR category = $1 THEN 'Spoken Tutorial' ELSE category END,
        updated_at = NOW()
      WHERE course_id = $1 OR category = $1 OR category = 'English Mirror'
    `, [duplicateId, canonicalId]);
    console.log(`✅ Migrated ${enqUpdateRes.rowCount} enquiries`);

    // 6. Delete duplicate category
    const deleteRes = await client.query(`
      DELETE FROM categories 
      WHERE id = $1
    `, [duplicateId]);
    console.log(`✅ Deleted duplicate category ${duplicateId} (${deleteRes.rowCount} row deleted)`);

    // 7. Add Unique Index on LOWER(TRIM(name)) to prevent future duplicates at database level
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS categories_name_lower_idx 
      ON categories (LOWER(TRIM(name)));
    `);
    console.log('✅ Created UNIQUE index categories_name_lower_idx on LOWER(TRIM(name))');

    await client.query('COMMIT');
    console.log('🎉 Transaction COMMITTED successfully!');

    // 8. Verify final categories table
    const finalCats = await client.query(`
      SELECT id, slug, name, parent_id, parent_slug, display_order, is_active, is_partner 
      FROM categories 
      ORDER BY display_order ASC, name ASC
    `);
    console.log('\n=== FINAL CATEGORIES IN DATABASE ===');
    console.table(finalCats.rows);

    const spokenCount = finalCats.rows.filter(c => c.name.toLowerCase().includes('spoken tutorial'));
    console.log(`\nSpoken Tutorial categories count: ${spokenCount.length}`);
    if (spokenCount.length === 1) {
      console.log('✅ EXACTLY ONE Spoken Tutorial category exists!');
    } else {
      console.error('❌ Multiple Spoken Tutorial categories still exist!');
    }

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('🔥 Error during consolidation:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

consolidate();
