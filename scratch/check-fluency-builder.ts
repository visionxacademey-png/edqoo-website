import { query } from '../server/db/index';

async function checkFluencyBuilder() {
  const courseRes = await query(`
    SELECT id, title, slug, rating, students
    FROM courses
    WHERE id = 'standard-plan-telephonic-calling-sessions'
       OR slug = 'standard-plan-telephonic-calling-sessions'
       OR slug = 'fluency-builder-plan'
       OR title ILIKE '%fluency builder%'
  `);
  console.log('--- FLUENCY BUILDER COURSE IN DB ---');
  console.log(JSON.stringify(courseRes.rows, null, 2));

  const catRes = await query(`
    SELECT id, title, slug, name
    FROM categories
    WHERE id = 'cat-fluency-builder-plan' OR slug = 'fluency-builder-plan'
  `);
  console.log('--- FLUENCY BUILDER CATEGORY IN DB ---');
  console.log(JSON.stringify(catRes.rows, null, 2));

  process.exit(0);
}

checkFluencyBuilder();
