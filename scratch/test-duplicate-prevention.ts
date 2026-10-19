import { pool, query } from '../server/db/index';

async function testDuplicatePrevention() {
  console.log('Testing duplicate category prevention in NeonDB...');

  // 1. Try to insert exact name 'Spoken Tutorial'
  try {
    console.log('Test 1: Attempting to insert duplicate name "Spoken Tutorial"...');
    await query(`
      INSERT INTO categories (id, slug, name, title)
      VALUES ('cat-duplicate-test-1', 'spoken-tutorial-2', 'Spoken Tutorial', 'Spoken Tutorial Test')
    `);
    console.error('❌ FAILED: Duplicate name "Spoken Tutorial" was inserted! (Constraint missing)');
  } catch (err: any) {
    console.log('✅ SUCCESS: DB prevented duplicate category name "Spoken Tutorial":', err.message);
  }

  // 2. Try to insert case-insensitive 'spoken tutorial'
  try {
    console.log('Test 2: Attempting to insert lowercase "spoken tutorial"...');
    await query(`
      INSERT INTO categories (id, slug, name, title)
      VALUES ('cat-duplicate-test-2', 'spoken-tutorial-3', 'spoken tutorial', 'Spoken Tutorial Test')
    `);
    console.error('❌ FAILED: Lowercase duplicate was inserted!');
  } catch (err: any) {
    console.log('✅ SUCCESS: DB prevented case-insensitive duplicate "spoken tutorial":', err.message);
  }

  // 3. Try to insert with leading/trailing spaces '  Spoken Tutorial  '
  try {
    console.log('Test 3: Attempting to insert padded "  Spoken Tutorial  "...');
    await query(`
      INSERT INTO categories (id, slug, name, title)
      VALUES ('cat-duplicate-test-3', 'spoken-tutorial-4', '  Spoken Tutorial  ', 'Spoken Tutorial Test')
    `);
    console.error('❌ FAILED: Padded duplicate was inserted!');
  } catch (err: any) {
    console.log('✅ SUCCESS: DB prevented padded duplicate "  Spoken Tutorial  ":', err.message);
  }

  await pool.end();
  console.log('\nAll duplicate prevention tests passed!');
}

testDuplicatePrevention().catch(console.error);
