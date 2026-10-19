import { query } from '../server/db/index';

async function inspectFluencyBuilderDetails() {
  const courseRes = await query(`
    SELECT *
    FROM courses
    WHERE id = 'standard-plan-telephonic-calling-sessions'
  `);
  console.log('--- ALL FLUENCY BUILDER COURSE FIELDS ---');
  const course = courseRes.rows[0];
  for (const [k, v] of Object.entries(course)) {
    if (typeof v === 'number' || /680|learner|student|enroll|rating/i.test(String(v))) {
      console.log(`Course [${k}]:`, v);
    }
  }

  const catRes = await query(`
    SELECT *
    FROM categories
    WHERE id = 'cat-fluency-builder-plan'
  `);
  console.log('--- ALL FLUENCY BUILDER CATEGORY FIELDS ---');
  const cat = catRes.rows[0];
  for (const [k, v] of Object.entries(cat)) {
    if (typeof v === 'number' || /680|learner|student|enroll|rating/i.test(String(v))) {
      console.log(`Category [${k}]:`, v);
    }
  }

  process.exit(0);
}

inspectFluencyBuilderDetails();
