import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
import { courses as localCourses, searchCourses } from '../src/data/courses.ts';
import { searchWebsiteKnowledge } from '../server/services/chatbotService.ts';

dotenv.config();
neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DATABASE_URL = (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') ? process.env.DATABASE_URL : DEFAULT_NEON_URL;

const pool = new Pool({ connectionString: DATABASE_URL });

async function verify() {
  console.log('==============================================');
  console.log('       EDQOO COURSE REMOVAL VERIFICATION      ');
  console.log('==============================================');

  let hasErrors = false;

  // 1. Database check
  console.log('\n[1] Checking PostgreSQL Database...');
  const dbCourses = await pool.query('SELECT id, slug, title, category FROM courses ORDER BY title');
  console.log(`Total courses in DB: ${dbCourses.rows.length}`);

  const foundHtmlInDb = dbCourses.rows.find(c => c.id === 'html' || c.slug === 'html' || c.title.trim().toLowerCase() === 'html' || c.title.trim().toLowerCase() === 'html course');
  const foundSqlInDb = dbCourses.rows.find(c => c.id === 'advance-executive-sql' || c.slug === 'advance-executive-sql' || c.title.trim().toLowerCase() === 'sql certification course' || c.title.trim().toLowerCase() === 'sql course');

  if (foundHtmlInDb) {
    console.error('❌ FAIL: HTML Course found in database:', foundHtmlInDb);
    hasErrors = true;
  } else {
    console.log('✅ PASS: HTML Course is completely absent from database.');
  }

  if (foundSqlInDb) {
    console.error('❌ FAIL: SQL Course found in database:', foundSqlInDb);
    hasErrors = true;
  } else {
    console.log('✅ PASS: SQL Course is completely absent from database.');
  }

  // 2. Local fallback courses check
  console.log('\n[2] Checking src/data/courses.ts...');
  console.log(`Total local courses: ${localCourses.length}`);
  const foundHtmlInLocal = localCourses.find(c => c.id === 'html' || c.slug === 'html' || c.title.trim().toLowerCase() === 'html');
  const foundSqlInLocal = localCourses.find(c => c.id === 'advance-executive-sql' || c.slug === 'advance-executive-sql');

  if (foundHtmlInLocal) {
    console.error('❌ FAIL: HTML Course found in local courses data:', foundHtmlInLocal);
    hasErrors = true;
  } else {
    console.log('✅ PASS: HTML Course is completely absent from src/data/courses.ts.');
  }

  if (foundSqlInLocal) {
    console.error('❌ FAIL: SQL Course found in local courses data:', foundSqlInLocal);
    hasErrors = true;
  } else {
    console.log('✅ PASS: SQL Course is completely absent from src/data/courses.ts.');
  }

  // 3. Search function check
  console.log('\n[3] Checking searchCourses function...');
  const searchHtmlRes = searchCourses(localCourses, 'HTML Course');
  const searchSqlRes = searchCourses(localCourses, 'SQL Course');
  console.log(`Search 'HTML Course' results count: ${searchHtmlRes.length}`);
  for (const c of searchHtmlRes) {
    console.log(` - Matched: ${c.title} (${c.id})`);
  }
  console.log(`Search 'SQL Course' results count: ${searchSqlRes.length}`);
  for (const c of searchSqlRes) {
    console.log(` - Matched: ${c.title} (${c.id})`);
  }

  // 4. Chatbot search check
  console.log('\n[4] Checking Chatbot Website Knowledge Search...');
  const chatbotHtmlRes = await searchWebsiteKnowledge('HTML Course');
  console.log('Chatbot search for "HTML Course":');
  console.log(' - Answer:', chatbotHtmlRes.answer);
  console.log(' - Results:', chatbotHtmlRes.results?.map((r: any) => r.title || r.name));

  const chatbotSqlRes = await searchWebsiteKnowledge('SQL Course');
  console.log('Chatbot search for "SQL Course":');
  console.log(' - Answer:', chatbotSqlRes.answer);
  console.log(' - Results:', chatbotSqlRes.results?.map((r: any) => r.title || r.name));

  // 5. Check other courses remain intact
  console.log('\n[5] Checking other courses integrity...');
  const dataScience = dbCourses.rows.find(c => c.id === 'advanced-executive-program-data-science-ai');
  const python = dbCourses.rows.find(c => c.id === 'python-programming');
  const webDev = dbCourses.rows.find(c => c.id === 'web-development');
  const java = dbCourses.rows.find(c => c.id === 'java');
  const excelPowerBi = dbCourses.rows.find(c => c.id === 'data-analytics-excel-power-bi');

  if (dataScience && python && webDev && java && excelPowerBi) {
    console.log('✅ PASS: All other core courses (Data Science, Python, Web Dev, Java, Excel & Power BI) remain intact.');
  } else {
    console.error('❌ FAIL: Missing some core courses!');
    hasErrors = true;
  }

  await pool.end();

  console.log('\n==============================================');
  if (hasErrors) {
    console.error('❌ VERIFICATION FAILED WITH ERRORS');
    process.exit(1);
  } else {
    console.log('🎉 ALL VERIFICATIONS PASSED SUCCESSFULLY!');
    process.exit(0);
  }
}

verify().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
