import dotenv from 'dotenv';
import { askGemini, getAllCourses } from './chatbotService.js';

dotenv.config();

interface TestCase {
  id: number;
  query: string;
  expectType?: 'courses' | 'projects' | 'instructors' | 'page' | 'general';
  expectKeywordInTitleOrAnswer?: string;
  expectUrl?: string;
  expectMinResults?: number;
  expectRejection?: boolean;
}

const TEST_CASES: TestCase[] = [
  // --- A. EXACT & MISSPELLED COURSE SEARCHES ---
  { id: 1, query: 'python', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 2, query: 'Python', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 3, query: 'PYTHON', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 4, query: 'ptyhon', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 5, query: 'pyhton', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 6, query: 'pythn', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 7, query: 'pytho', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  { id: 8, query: 'python course', expectKeywordInTitleOrAnswer: 'python', expectMinResults: 1 },
  
  { id: 9, query: 'java', expectKeywordInTitleOrAnswer: 'java', expectMinResults: 1 },
  { id: 10, query: 'jav', expectKeywordInTitleOrAnswer: 'java', expectMinResults: 1 },
  { id: 11, query: 'jvaa', expectKeywordInTitleOrAnswer: 'java', expectMinResults: 1 },
  { id: 12, query: 'jaav', expectKeywordInTitleOrAnswer: 'java', expectMinResults: 1 },

  { id: 13, query: 'power bi', expectKeywordInTitleOrAnswer: 'power bi', expectMinResults: 1 },
  { id: 14, query: 'powerbi', expectKeywordInTitleOrAnswer: 'power bi', expectMinResults: 1 },
  { id: 15, query: 'powr bi', expectKeywordInTitleOrAnswer: 'power bi', expectMinResults: 1 },
  { id: 16, query: 'power b', expectKeywordInTitleOrAnswer: 'power bi', expectMinResults: 1 },

  { id: 17, query: 'data science', expectKeywordInTitleOrAnswer: 'data science', expectMinResults: 1 },
  { id: 18, query: 'dtaa science', expectKeywordInTitleOrAnswer: 'data science', expectMinResults: 1 },
  { id: 19, query: 'data scince', expectKeywordInTitleOrAnswer: 'data science', expectMinResults: 1 },
  { id: 20, query: 'datasience', expectKeywordInTitleOrAnswer: 'data science', expectMinResults: 1 },

  { id: 21, query: 'digital marketing', expectKeywordInTitleOrAnswer: 'digital marketing', expectMinResults: 1 },
  { id: 22, query: 'marketing', expectKeywordInTitleOrAnswer: 'marketing', expectMinResults: 1 },
  { id: 23, query: 'prompt', expectKeywordInTitleOrAnswer: 'prompt', expectMinResults: 1 },
  { id: 24, query: 'gen ai', expectKeywordInTitleOrAnswer: 'generative ai', expectMinResults: 1 },
  { id: 25, query: 'ethical hacking', expectKeywordInTitleOrAnswer: 'ethical hacking', expectMinResults: 1 },
  { id: 26, query: 'aws', expectKeywordInTitleOrAnswer: 'aws', expectMinResults: 1 },
  { id: 27, query: 'ui ux', expectKeywordInTitleOrAnswer: 'ui/ux', expectMinResults: 1 },
  { id: 28, query: 'hr', expectKeywordInTitleOrAnswer: 'hr', expectMinResults: 1 },
  { id: 29, query: 'accounting', expectKeywordInTitleOrAnswer: 'accounting', expectMinResults: 1 },
  { id: 30, query: 'content writing', expectKeywordInTitleOrAnswer: 'content writing', expectMinResults: 1 },

  // --- B. EXACT & MISSPELLED WEBSITE PAGE SEARCHES ---
  { id: 31, query: 'privacy', expectUrl: '/privacy-policy' },
  { id: 32, query: 'privacy policy', expectUrl: '/privacy-policy' },
  { id: 26, query: 'privcy', expectUrl: '/privacy-policy' },
  { id: 27, query: 'prvacy policy', expectUrl: '/privacy-policy' },

  { id: 28, query: 'terms', expectUrl: '/terms-and-conditions' },
  { id: 29, query: 'terms and conditions', expectUrl: '/terms-and-conditions' },
  { id: 30, query: 'term', expectUrl: '/terms-and-conditions' },
  { id: 31, query: 'terms conditons', expectUrl: '/terms-and-conditions' },

  { id: 32, query: 'contact', expectUrl: '/contact' },
  { id: 33, query: 'contct', expectUrl: '/contact' },

  { id: 34, query: 'instructor', expectMinResults: 2 }, // Disambiguation between Directory and Become Instructor
  { id: 35, query: 'instrutor', expectMinResults: 1 },
  { id: 36, query: 'become an instructor', expectUrl: '/become-an-instructor' },

  { id: 37, query: 'partner', expectUrl: '/become-a-partner' },
  { id: 38, query: 'parter', expectUrl: '/become-a-partner' },
  { id: 39, query: 'become a partner', expectUrl: '/become-a-partner' },

  { id: 40, query: 'leadership', expectUrl: '/leadership-council' },
  { id: 41, query: 'leadershp', expectUrl: '/leadership-council' },

  { id: 42, query: 'hire', expectUrl: '/hire-from-us' },
  { id: 43, query: 'hire from us', expectUrl: '/hire-from-us' },

  { id: 44, query: 'projects', expectMinResults: 1 },
  { id: 45, query: 'prjects', expectMinResults: 1 },

  { id: 46, query: 'free learning', expectUrl: '/courses' },
  { id: 47, query: 'free courses', expectUrl: '/courses' },
  { id: 48, query: 'fre lernng', expectUrl: '/courses' },

  { id: 49, query: 'tools', expectUrl: '/courses' },
  { id: 50, query: 'tools and upskills', expectUrl: '/courses' },

  // --- C. CONTENT QUESTIONS ---
  { id: 51, query: 'how can I become an instructor?', expectUrl: '/become-an-instructor' },
  { id: 52, query: 'how can I become a partner?', expectUrl: '/become-a-partner' },
  { id: 53, query: 'how can I contact you?', expectUrl: '/contact' },
  { id: 54, query: 'what is your privacy policy?', expectUrl: '/privacy-policy' },
  { id: 55, query: 'how do you use my data?', expectUrl: '/privacy-policy' },
  { id: 56, query: 'what are your terms?', expectUrl: '/terms-and-conditions' },
  { id: 57, query: 'who are your instructors?', expectUrl: '/instructors' },
  { id: 58, query: 'what projects do you have?', expectMinResults: 1 },

  // --- D. BROAD DISCOVERY & PREFIX ---
  { id: 59, query: 'courses', expectMinResults: 4 },
  { id: 60, query: 'give me courses', expectMinResults: 4 },
  { id: 61, query: 'P', expectMinResults: 1 },
  { id: 62, query: 'D', expectMinResults: 1 },
  { id: 63, query: 'J', expectMinResults: 1 },

  // --- E. UNRELATED QUERY REJECTION ---
  { id: 64, query: 'xyzabc', expectRejection: true }
];

async function runTests() {
  console.log('====================================================');
  console.log('🚀 COMPREHENSIVE FUZZY MATCH & WEBSITE SEARCH SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const allCourses = await getAllCourses();
  console.log(`📦 Loaded ${allCourses.length} courses from Database / Storage.\n`);

  for (const t of TEST_CASES) {
    try {
      const res = await askGemini(t.query, []);
      let testPassed = true;
      const reasons: string[] = [];

      // Check success
      if (res.success !== true) {
        testPassed = false;
        reasons.push(`Response success was ${res.success}`);
      }

      // Check false failure
      if (res.answer.includes("I'm unable to answer right now") || res.answer.includes("I'm unable to process your question right now")) {
        testPassed = false;
        reasons.push(`Returned false failure message`);
      }

      // Rejection check for unrelated query (e.g. xyzabc)
      if (t.expectRejection) {
        if (res.results && res.results.length > 0) {
          testPassed = false;
          reasons.push(`Expected 0 results for unrelated query, got ${res.results.length}`);
        }
        if (!res.answer.toLowerCase().includes("couldn't find") && !res.answer.toLowerCase().includes("not found")) {
          testPassed = false;
          reasons.push(`Did not return polite not-found message`);
        }
      }

      // Check min results
      if (t.expectMinResults !== undefined) {
        const count = res.results?.length || 0;
        if (count < t.expectMinResults) {
          testPassed = false;
          reasons.push(`Expected >= ${t.expectMinResults} results, got ${count}`);
        }
      }

      // Check keyword in title or answer
      if (t.expectKeywordInTitleOrAnswer) {
        const inAnswer = res.answer.toLowerCase().includes(t.expectKeywordInTitleOrAnswer.toLowerCase());
        const inResults = res.results?.some((r) =>
          r.title.toLowerCase().includes(t.expectKeywordInTitleOrAnswer!.toLowerCase()) ||
          r.category.toLowerCase().includes(t.expectKeywordInTitleOrAnswer!.toLowerCase()) ||
          r.url.toLowerCase().includes(t.expectKeywordInTitleOrAnswer!.toLowerCase())
        );
        if (!inAnswer && !inResults) {
          testPassed = false;
          reasons.push(`Keyword "${t.expectKeywordInTitleOrAnswer}" not in answer or results`);
        }
      }

      // Check URL match
      if (t.expectUrl) {
        const matched = res.results?.some((r) => r.url === t.expectUrl) || res.answer.includes(t.expectUrl);
        if (!matched) {
          testPassed = false;
          reasons.push(`Expected URL "${t.expectUrl}" not found`);
        }
      }

      if (testPassed) {
        console.log(`✅ [TEST ${t.id}] PASS: "${t.query}" -> ${res.results?.length || 0} results (${res.source})`);
        passed++;
      } else {
        console.error(`❌ [TEST ${t.id}] FAIL: "${t.query}" -> Reasons: ${reasons.join(', ')}`);
        console.error(`   Answer preview: ${res.answer.slice(0, 140)}...`);
        failed++;
      }
    } catch (err: any) {
      console.error(`❌ [TEST ${t.id}] ERROR: "${t.query}" -> Exception: ${err.message}`);
      failed++;
    }
  }

  console.log('\n====================================================');
  console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (Total: ${passed + failed})`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test runner error:', e);
  process.exit(1);
});
