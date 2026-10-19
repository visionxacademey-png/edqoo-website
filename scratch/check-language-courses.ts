import { query } from '../server/db/index';

async function check() {
  const coursesRes = await query('SELECT id, slug, title, category, categories FROM courses WHERE category ILIKE $1 OR title ILIKE $2 OR title ILIKE $3 OR title ILIKE $4 OR title ILIKE $5', [
    '%Spoken%',
    '%Malayalam%',
    '%Kannada%',
    '%Telugu%',
    '%Tamil%'
  ]);
  console.log('Found courses:', coursesRes.rows);

  const catRes = await query('SELECT id, slug, name, parent_id FROM categories WHERE name ILIKE $1 OR name ILIKE $2 OR name ILIKE $3 OR name ILIKE $4 OR name ILIKE $5 OR slug ILIKE $6', [
    '%Malayalam%',
    '%Kannada%',
    '%Telugu%',
    '%Tamil%',
    '%Language%',
    '%spoken-tutorial%'
  ]);
  console.log('Found categories:', catRes.rows);
  process.exit(0);
}

check().catch(console.error);
