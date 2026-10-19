import { pool, query } from '../server/db/index.js';

async function checkLanguagesInDb() {
  const res = await query(`
    SELECT id, slug, title, category 
    FROM courses 
    WHERE id IN ('spoken-english-malayalam', 'spoken-english-kannada', 'spoken-english-telugu', 'spoken-english-tamil')
       OR slug IN ('spoken-english-malayalam', 'spoken-english-kannada', 'spoken-english-telugu', 'spoken-english-tamil')
       OR title ILIKE '%to English%'
       OR title ILIKE '%മലയാളം%'
       OR title ILIKE '%ಕನ್ನಡ%'
       OR title ILIKE '%తెలుగు%'
       OR title ILIKE '%தமிழ்%'
  `);
  console.log('Language courses in DB:', JSON.stringify(res.rows, null, 2));

  const cats = await query(`
    SELECT id, slug, name 
    FROM categories 
    WHERE id IN ('spoken-english-malayalam', 'spoken-english-kannada', 'spoken-english-telugu', 'spoken-english-tamil')
       OR slug IN ('spoken-english-malayalam', 'spoken-english-kannada', 'spoken-english-telugu', 'spoken-english-tamil')
  `);
  console.log('Language categories in DB:', JSON.stringify(cats.rows, null, 2));

  await pool.end();
}

checkLanguagesInDb().catch(console.error);
