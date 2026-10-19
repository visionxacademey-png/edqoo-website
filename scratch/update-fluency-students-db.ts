import { query } from '../server/db/index';

async function updateFluencyStudents() {
  console.log('Updating Fluency Builder Plan learner count to 5523 in NeonDB...');
  
  const updateRes = await query(`
    UPDATE courses
    SET students = 5523, updated_at = NOW()
    WHERE id = 'standard-plan-telephonic-calling-sessions'
       OR slug = 'standard-plan-telephonic-calling-sessions'
    RETURNING id, title, slug, rating, students;
  `);

  console.log('Update result:');
  console.log(JSON.stringify(updateRes.rows, null, 2));

  // Verify other courses were NOT changed
  const checkOthersRes = await query(`
    SELECT id, title, slug, rating, students
    FROM courses
    WHERE id IN (
      '1-to-1-live-spoken-english',
      'kids-1-to-1-english-fluency-program',
      'elite-corporate-transformation-track',
      'targeted-interview-prep-masterclass'
    )
  `);

  console.log('Other courses check:');
  console.log(JSON.stringify(checkOthersRes.rows, null, 2));

  process.exit(0);
}

updateFluencyStudents().catch((err) => {
  console.error('Error updating fluency builder students:', err);
  process.exit(1);
});
