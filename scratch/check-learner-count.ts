import { query } from '../server/db/index';

async function checkLearnerCount() {
  const res = await query(`
    SELECT id, title, rating, learners, students_count, enrolled_count, enrollment_count, total_enrolled, view_count
    FROM courses
    WHERE id = '1-to-1-live-spoken-english' OR slug = '1-to-1-live-spoken-english'
  `);
  console.log('Learners columns:', JSON.stringify(res.rows, null, 2));

  process.exit(0);
}

checkLearnerCount().catch(err => {
  console.log('Error querying specific columns, trying SELECT *');
  query(`SELECT * FROM courses WHERE id = '1-to-1-live-spoken-english'`)
    .then(r => {
      console.log('All course columns:');
      for (const [k, v] of Object.entries(r.rows[0])) {
        if (typeof v === 'number' || /420|learner|enroll|student/i.test(String(v)) || /learner|enroll|student|count/i.test(k)) {
          console.log(`[${k}]:`, v);
        }
      }
      process.exit(0);
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
});
