import { Router, type Request, type Response } from 'express';
import { query, isNeonConnected } from '../db/index.js';

const router = Router();
const SITE_URL = 'https://edqoo.com';

const fallbackCourseSlugs = [
  'advanced-executive-program-data-science-ai',
  'advanced-executive-program-data-science-ai-python',
  'advanced-executive-program-data-science-ai-machine-learning',
  'executive-professional-certificate-data-science-ai',
  'python-programming',
  'prompt-engineering',
  'data-analytics-excel-power-bi',
  'advanced-executive-python',
  'advanced-executive-excel',
  'advanced-executive-power-bi',
  'advanced-executive-ms-office',
  'advanced-executive-prompt-engineering',
  'html',
  'css',
  'sql'
];

const blogSlugs = [
  'what-is-data-science',
  'how-to-learn-python',
  'python-vs-sql',
  'what-is-machine-learning',
  'what-is-generative-ai',
  'what-is-data-analytics',
  'power-bi-for-beginners',
  'sql-for-data-analysis',
  'ai-career-skills',
  'data-science-career-roadmap',
  'machine-learning-roadmap',
  'data-analyst-roadmap',
  'python-projects-for-beginners'
];

router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    let courseSlugs: string[] = [];

    if (isNeonConnected) {
      try {
        const result = await query(
          'SELECT slug FROM courses WHERE is_active = true OR is_active IS NULL'
        );
        if (result && result.rows && result.rows.length > 0) {
          courseSlugs = result.rows.map((r: any) => r.slug).filter(Boolean);
        }
      } catch (dbErr) {
        console.warn('Failed to query courses for sitemap, falling back:', dbErr);
      }
    }

    if (courseSlugs.length === 0) {
      courseSlugs = fallbackCourseSlugs;
    }

    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
      { loc: `${SITE_URL}/courses`, changefreq: 'daily', priority: '0.9' },
      { loc: `${SITE_URL}/programs`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/programs/data-science-and-ai`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/programs/python`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/programs/ai-and-machine-learning`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/programs/data-analytics-and-ai`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/tools-and-upskills`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.9' },
      { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/instructors`, changefreq: 'weekly', priority: '0.8' },
      { loc: `${SITE_URL}/hire-from-us`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${SITE_URL}/become-an-instructor`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/become-a-partner`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/leadership-council`, changefreq: 'monthly', priority: '0.7' },
      { loc: `${SITE_URL}/terms-and-conditions`, changefreq: 'yearly', priority: '0.4' },
      { loc: `${SITE_URL}/privacy-policy`, changefreq: 'yearly', priority: '0.4' }
    ];

    const courseUrls = courseSlugs.map((slug) => ({
      loc: `${SITE_URL}/courses/${slug}`,
      changefreq: 'weekly',
      priority: '0.9'
    }));

    const blogUrls = blogSlugs.map((slug) => ({
      loc: `${SITE_URL}/blog/${slug}`,
      changefreq: 'monthly',
      priority: '0.8'
    }));

    const allEntries = [...staticUrls, ...courseUrls, ...blogUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=86400');
    return res.send(xml);
  } catch (err) {
    console.error('Failed to generate dynamic sitemap:', err);
    return res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (_req: Request, res: Response) => {
  const robots = `# Production Robots.txt for Edqoo
User-agent: *
Allow: /
Allow: /courses
Allow: /programs/
Allow: /tools-and-upskills
Allow: /blog
Allow: /instructors
Allow: /about
Allow: /contact
Allow: /hire-from-us
Allow: /become-an-instructor
Allow: /become-a-partner
Allow: /leadership-council
Allow: /terms-and-conditions
Allow: /privacy-policy

# Disallow private and administrative areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /mentor/
Disallow: /student/
Disallow: /api/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /404

# Sitemap reference
Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  return res.send(robots);
});

export default router;
