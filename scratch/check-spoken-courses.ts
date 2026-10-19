import { pool, query } from '../server/db/index';

async function checkCourses() {
  console.log('--- COURSES IN DATABASE ---');
  const res = await query(`
    SELECT id, slug, title, category, category_id, categories, image, hero_image, status
    FROM courses
    ORDER BY created_at DESC
  `);
  
  console.log(`Total courses in DB: ${res.rows.length}`);
  
  const spokenCourses = res.rows.filter((c: any) => {
    const cat = (c.category || '').toLowerCase();
    const catId = (c.category_id || '').toLowerCase();
    const categoriesStr = JSON.stringify(c.categories || []).toLowerCase();
    return (
      cat.includes('spoken') ||
      cat.includes('english') ||
      cat.includes('mirror') ||
      cat.includes('ielts') ||
      cat.includes('interview') ||
      cat.includes('fluency') ||
      catId.includes('spoken') ||
      catId.includes('english') ||
      categoriesStr.includes('spoken') ||
      categoriesStr.includes('english')
    );
  });

  console.log(`\nSpoken Tutorial / English Courses (${spokenCourses.length}):`);
  spokenCourses.forEach((c: any) => {
    console.log(`\nID: ${c.id}`);
    console.log(`Slug: ${c.slug}`);
    console.log(`Title: ${c.title}`);
    console.log(`Category: ${c.category}`);
    console.log(`Category ID: ${c.category_id}`);
    console.log(`Categories: ${JSON.stringify(c.categories)}`);
    console.log(`Image: ${c.image}`);
    console.log(`Hero Image: ${c.hero_image}`);
    console.log(`Status: ${c.status}`);
  });

  console.log('\n--- CHECK ALL COURSES WITH MISSING/NULL/EMPTY IMAGE ---');
  const missingImgCourses = res.rows.filter((c: any) => !c.image || c.image.trim() === '');
  console.log(`Courses without image: ${missingImgCourses.length}`);
  missingImgCourses.forEach((c: any) => {
    console.log(`- [${c.id}] ${c.title} (cat: ${c.category}, img: "${c.image}")`);
  });

  await pool.end();
}

checkCourses().catch(console.error);
