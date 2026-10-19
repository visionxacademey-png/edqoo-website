import { query } from '../server/db/index';

async function updateCommunicativeEnglishStudents() {
  console.log('--- Updating 1:1 Communicative English Mastery Students Count in NeonDB ---');

  const updateRes = await query(`
    UPDATE courses
    SET
      students = 6201,
      updated_at = NOW()
    WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
    RETURNING id, title, rating, students
  `);

  if (updateRes.rows.length === 0) {
    throw new Error('Course 1-to-1-live-spoken-english not found!');
  }

  console.log('✅ Updated course in NeonDB:');
  console.log(JSON.stringify(updateRes.rows[0], null, 2));

  process.exit(0);
}

updateCommunicativeEnglishStudents().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
