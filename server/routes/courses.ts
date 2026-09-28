import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import { evaluateFuzzyMatch } from '../services/fuzzyMatch.js';
import type { Course } from '../../src/types/index.js';


const router = Router();

// Slug alias map for backwards compatibility of legacy links
const SLUG_ALIASES: Record<string, string> = {
  'master-program-data-science-ai': 'advanced-executive-program-data-science-ai',
  'master-program-python': 'python-programming',
  'master-program-ai-machine-learning': 'advanced-executive-program-data-science-ai',
  'master-program-data-analytics-ai': 'executive-professional-certificate-data-science-ai',
  'python-training-program': 'python-programming',
  'power-bi': 'advance-executive-power-bi',
  'excel': 'advance-executive-excel'
};

// Helper to generate a clean URL slug from title
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Safely parse JSON or return default
function safeJsonParse<T>(val: any, fallback: T): T {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
}

function normalizeCategoryName(cat: string | null | undefined): string {
  if (!cat) return '';
  const trimmed = cat.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower === 'ds & ai' ||
    lower === 'ds and ai' ||
    lower === 'data science & ai' ||
    lower === 'data science and ai' ||
    lower === 'data science' ||
    lower === 'data-science' ||
    lower === 'ds &amp; ai' ||
    lower === 'ds/ai' ||
    lower === 'ds-ai' ||
    lower === 'data-science-and-ai'
  ) {
    return 'Data Science and AI';
  }

  if (
    lower === 'da & ai' ||
    lower === 'da and ai' ||
    lower === 'data analytics & ai' ||
    lower === 'data analytics and ai' ||
    lower === 'data analytics' ||
    lower === 'data-analytics' ||
    lower === 'da &amp; ai' ||
    lower === 'da/ai' ||
    lower === 'da-ai' ||
    lower === 'data-analytics-and-ai'
  ) {
    return 'Data Analytics and AI';
  }

  if (
    lower === 'ai & ml' ||
    lower === 'ai and ml' ||
    lower === 'ai & machine learning' ||
    lower === 'ai and machine learning' ||
    lower === 'machine learning' ||
    lower === 'machine-learning' ||
    lower === 'artificial intelligence' ||
    lower === 'ai' ||
    lower === 'ai &amp; ml' ||
    lower === 'ai/ml' ||
    lower === 'ai-ml' ||
    lower === 'ai-and-machine-learning'
  ) {
    return 'AI and Machine Learning';
  }

  if (
    lower === 'tools & upskills' ||
    lower === 'tools and upskills' ||
    lower === 'tools &amp; upskills' ||
    lower === 'tools-and-upskills' ||
    lower === 'tools' ||
    lower.includes('tools')
  ) {
    return 'Tools and Upskills';
  }

  if (
    lower === 'free learning' ||
    lower === 'free-learning' ||
    lower === 'free' ||
    lower.includes('free learning')
  ) {
    return 'Free Learning';
  }

  return trimmed;
}

// Format DB Row to Course Object
function formatCourseRow(row: any): Course {
  const rawCategories = safeJsonParse<string[]>(row.categories, [row.category]);
  const categoriesList = Array.isArray(rawCategories) && rawCategories.length > 0 ? rawCategories : [row.category];
  const normalizedCategory = normalizeCategoryName(row.category) || 'Tools and Upskills';
  const normalizedCategories = Array.from(new Set(categoriesList.map(normalizeCategoryName).filter(Boolean)));

  const rawTech = safeJsonParse<any[]>(row.technology_stack, []);
  const normalizedTech = Array.isArray(rawTech)
    ? rawTech.map((item) => ({
        ...item,
        category: normalizeCategoryName(item?.category)
      }))
    : rawTech;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: normalizedCategory,
    categories: normalizedCategories.length > 0 ? normalizedCategories : [normalizedCategory],
    shortDescription: row.short_description || undefined,
    description: row.description || '',
    image: row.image,
    price: Number(row.price) || 0,
    originalPrice: Number(row.original_price) || 0,
    duration: row.duration,
    liveHours: row.live_hours || undefined,
    lessons: Number(row.lessons) || 0,
    level: row.level || 'Beginner to Advanced',
    rating: Number(row.rating) || 4.9,
    students: Number(row.students) || 0,
    status: row.status || 'available',
    featured: Boolean(row.featured),
    skills: safeJsonParse<string[]>(row.skills, []),
    curriculum: safeJsonParse<any[]>(row.curriculum, []),
    modules: safeJsonParse<any[]>(row.modules, []),
    technologyStack: normalizedTech,
    projects: safeJsonParse<string[]>(row.projects, []),
    careerReadiness: safeJsonParse<string[]>(row.career_readiness, []),
    outcome: row.outcome || undefined,
    features: safeJsonParse<string[]>(row.features, []),
    requirements: safeJsonParse<string[]>(row.requirements, []),
    whoIsItFor: safeJsonParse<string[]>(row.who_is_it_for, []),
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    seoKeywords: safeJsonParse<string[]>(row.seo_keywords, []),
    createdAt: row.created_at ? new Date(row.created_at).getTime() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined,
    imageUpdatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined
  };
}

// GET /api/courses - Public list
router.get('/', async (req, res) => {
  try {
    await ensureDbInitialized();
    const { category, level, status, search, featured } = req.query;

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let sql = 'SELECT * FROM courses';
    const params: any[] = [];
    const whereClauses: string[] = [];

    if (category && category !== 'all' && category !== 'All Categories') {
      const normCat = normalizeCategoryName(category as string) || (category as string);
      params.push(normCat);
      const idx1 = params.length;
      params.push(`%${normCat}%`);
      const idx2 = params.length;
      whereClauses.push(`(LOWER(category) = LOWER($${idx1}) OR categories::text ILIKE $${idx2})`);
    }

    if (level && level !== 'all') {
      params.push(level);
      whereClauses.push(`LOWER(level) = LOWER($${params.length})`);
    }

    if (status && status !== 'all') {
      params.push(status);
      whereClauses.push(`status = $${params.length}`);
    }

    if (featured === 'true') {
      whereClauses.push(`featured = true`);
    }

    if (search) {
      const rawSearch = String(search).trim();
      const searchTerms = rawSearch.split(/\s+/).filter(Boolean);
      const strippedSearch = rawSearch.replace(/\b(course|courses|program|programs|training|classes|class|track|tracks)\b/gi, '').trim();

      const searchClauses: string[] = [];

      // 1. Full phrase match
      params.push(`%${rawSearch}%`);
      const pIdx = params.length;
      searchClauses.push(`LOWER(title) LIKE $${pIdx}`);
      searchClauses.push(`LOWER(description) LIKE $${pIdx}`);
      searchClauses.push(`LOWER(COALESCE(short_description, '')) LIKE $${pIdx}`);
      searchClauses.push(`skills::text ILIKE $${pIdx}`);
      searchClauses.push(`curriculum::text ILIKE $${pIdx}`);
      searchClauses.push(`category ILIKE $${pIdx}`);

      // 2. Stripped noise-words phrase match (e.g. "HTML course" -> "HTML")
      if (strippedSearch && strippedSearch.toLowerCase() !== rawSearch.toLowerCase()) {
        params.push(`%${strippedSearch}%`);
        const strIdx = params.length;
        searchClauses.push(`LOWER(title) LIKE $${strIdx}`);
        searchClauses.push(`LOWER(description) LIKE $${strIdx}`);
        searchClauses.push(`LOWER(COALESCE(short_description, '')) LIKE $${strIdx}`);
        searchClauses.push(`skills::text ILIKE $${strIdx}`);
        searchClauses.push(`curriculum::text ILIKE $${strIdx}`);
      }

      // 3. Multi-token conjunction match (all tokens match somewhere in course)
      if (searchTerms.length > 1) {
        const tokenChecks = searchTerms.map((term) => {
          params.push(`%${term}%`);
          const tIdx = params.length;
          return `(
            LOWER(title) LIKE $${tIdx} OR
            LOWER(description) LIKE $${tIdx} OR
            LOWER(COALESCE(short_description, '')) LIKE $${tIdx} OR
            skills::text ILIKE $${tIdx} OR
            curriculum::text ILIKE $${tIdx} OR
            category ILIKE $${tIdx}
          )`;
        });
        searchClauses.push(`(${tokenChecks.join(' AND ')})`);
      }

      whereClauses.push(`(${searchClauses.join(' OR ')})`);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sql += ' ORDER BY created_at DESC, id ASC';

    const result = await query(sql, params);
    let courses: Course[] = result.rows.map(formatCourseRow);

    if (search && courses.length === 0) {
      // Fallback to fuzzy search in case of typos (e.g. "ptyhon", "data scince")
      const allRes = await query('SELECT * FROM courses ORDER BY created_at DESC');
      const allCourses: Course[] = allRes.rows.map(formatCourseRow);
      const searchStr = String(search);
      courses = allCourses
        .map((c) => {
          const dynamicAliases = [c.slug, ...(c.skills || [])];
          const match = evaluateFuzzyMatch(searchStr, c.title, dynamicAliases);
          return { course: c, score: match.rankScore };
        })
        .filter((m) => m.score >= 450)
        .sort((a, b) => b.score - a.score)
        .map((m) => m.course);
    }

    console.log(`[COURSES] Query executed successfully. Returned ${courses.length} courses from Neon DB.`);
    return res.json(courses);
  } catch (err: any) {
    console.error('🔥 [COURSES] Error fetching courses from database:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch courses from database.' });
  }
});

// GET /api/courses/:slug - Public single course
router.get('/:slug', async (req, res) => {
  try {
    await ensureDbInitialized();
    const rawSlug = req.params.slug;
    const slug = SLUG_ALIASES[rawSlug] || rawSlug;

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const result = await query(
      'SELECT * FROM courses WHERE slug = $1 OR id = $1 OR slug = $2 OR id = $2 ORDER BY CASE WHEN slug = $1 THEN 1 WHEN id = $1 THEN 2 ELSE 3 END LIMIT 1',
      [rawSlug, slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const course = formatCourseRow(result.rows[0]);
    console.log(`[PUBLIC_COURSE_FETCH] courseId: ${course.id}, slug: ${course.slug}, title: "${course.title}"`);
    return res.json(course);
  } catch (err: any) {
    console.error('🔥 [COURSES] Error fetching single course from database:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch course details.' });
  }
});

function logCourseWrite(info: {
  courseId: string;
  courseName: string;
  oldImage?: string | null;
  newImage?: string | null;
  request: string;
  source: string;
  timestamp?: string;
}) {
  console.log(
    `\n[COURSE_WRITE]\ncourseId: ${info.courseId}\ncourseName: ${info.courseName}\noldImage: ${info.oldImage || 'N/A'}\nnewImage: ${info.newImage || 'N/A'}\nrequest: ${info.request}\nsource: ${info.source}\ntimestamp: ${info.timestamp || new Date().toISOString()}\n`
  );
}

// POST /api/courses - Admin: Create new course
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const {
      title,
      slug: customSlug,
      category,
      categories,
      shortDescription,
      description,
      image,
      price,
      originalPrice,
      duration,
      liveHours,
      lessons,
      level,
      rating,
      students,
      status,
      featured,
      skills,
      curriculum,
      modules,
      technologyStack,
      projects,
      careerReadiness,
      outcome,
      features,
      requirements,
      whoIsItFor,
      seoTitle,
      seoDescription,
      seoKeywords
    } = req.body;

    if (!title || (!category && (!categories || categories.length === 0)) || !description) {
      return res.status(400).json({ error: 'Title, category/categories, and description are required.' });
    }

    const calculatedSlug = customSlug ? slugify(customSlug) : slugify(title);
    const id = `crs-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const courseImage = (typeof image === 'string' && image.trim().length > 0)
      ? image.trim()
      : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';
    const assignedCategories: string[] = Array.isArray(categories) && categories.length > 0 
      ? categories 
      : [category || 'Tools and Upskills'];

    const newCourse: Course = {
      id,
      slug: calculatedSlug,
      title: title.trim(),
      category: assignedCategories[0] || 'Tools and Upskills',
      categories: assignedCategories,
      shortDescription: shortDescription?.trim(),
      description: description.trim(),
      image: courseImage,
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price) || 0,
      duration: duration || 'Flexible duration',
      liveHours: liveHours || undefined,
      lessons: Number(lessons) || (modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)) || 10,
      level: level || 'Beginner to Advanced',
      rating: Number(rating) || 4.9,
      students: Number(students) || 0,
      status: status === 'coming-soon' ? 'coming-soon' : 'available',
      featured: Boolean(featured),
      skills: Array.isArray(skills) ? skills : [],
      curriculum: Array.isArray(curriculum) ? curriculum : [],
      modules: Array.isArray(modules) ? modules : [],
      technologyStack: Array.isArray(technologyStack) ? technologyStack : [],
      projects: Array.isArray(projects) ? projects : [],
      careerReadiness: Array.isArray(careerReadiness) ? careerReadiness : [],
      outcome: outcome || undefined,
      features: Array.isArray(features) ? features : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      whoIsItFor: Array.isArray(whoIsItFor) ? whoIsItFor : [],
      seoTitle: seoTitle?.trim() || undefined,
      seoDescription: seoDescription?.trim() || undefined,
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : []
    };

    if (isDbConnected()) {
      // Check slug uniqueness
      const existingSlug = await query('SELECT id FROM courses WHERE slug = $1', [calculatedSlug]);
      if (existingSlug.rows.length > 0) {
        newCourse.slug = `${calculatedSlug}-${Date.now().toString().slice(-4)}`;
      }

      await query(
        `INSERT INTO courses (
          id, slug, title, category, categories, short_description, description, image, price, original_price,
          duration, live_hours, lessons, level, rating, students, status, featured,
          skills, curriculum, modules, technology_stack, projects, career_readiness, outcome, features, requirements, who_is_it_for,
          seo_title, seo_description, seo_keywords, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31, NOW(), NOW()
        )`,
        [
          newCourse.id,
          newCourse.slug,
          newCourse.title,
          newCourse.category,
          JSON.stringify(newCourse.categories),
          newCourse.shortDescription || null,
          newCourse.description,
          newCourse.image,
          newCourse.price,
          newCourse.originalPrice,
          newCourse.duration,
          newCourse.liveHours || null,
          newCourse.lessons,
          newCourse.level,
          newCourse.rating,
          newCourse.students,
          newCourse.status,
          newCourse.featured,
          JSON.stringify(newCourse.skills),
          JSON.stringify(newCourse.curriculum),
          JSON.stringify(newCourse.modules),
          JSON.stringify(newCourse.technologyStack),
          JSON.stringify(newCourse.projects),
          JSON.stringify(newCourse.careerReadiness),
          newCourse.outcome || null,
          JSON.stringify(newCourse.features),
          JSON.stringify(newCourse.requirements),
          JSON.stringify(newCourse.whoIsItFor),
          newCourse.seoTitle || null,
          newCourse.seoDescription || null,
          JSON.stringify(newCourse.seoKeywords || [])
        ]
      );

      logCourseWrite({
        courseId: newCourse.id,
        courseName: newCourse.title,
        oldImage: 'NONE',
        newImage: newCourse.image,
        request: 'POST /api/courses',
        source: 'ADMIN_CREATE',
        timestamp: new Date().toISOString()
      });
    } else {
      mockStore.courses.unshift(newCourse);
      logCourseWrite({
        courseId: newCourse.id,
        courseName: newCourse.title,
        oldImage: 'NONE',
        newImage: newCourse.image,
        request: 'POST /api/courses',
        source: 'ADMIN_CREATE_FALLBACK',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(201).json({ success: true, course: newCourse });
  } catch (err: any) {
    console.error('Error creating course:', err);
    return res.status(500).json({ error: err.message || 'Failed to create course.' });
  }
});

// PUT /api/courses/:id - Admin: Complete course update
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      categories,
      shortDescription,
      description,
      image,
      price,
      originalPrice,
      duration,
      liveHours,
      lessons,
      level,
      rating,
      students,
      status,
      featured,
      skills,
      curriculum,
      modules,
      technologyStack,
      projects,
      careerReadiness,
      outcome,
      features,
      requirements,
      whoIsItFor,
      seoTitle,
      seoDescription,
      seoKeywords
    } = req.body;

    if (isDbConnected()) {
      const existing = await query('SELECT * FROM courses WHERE id = $1 OR slug = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const row = existing.rows[0];
      const targetDbId = row.id;
      const updatedSlug = slug ? slugify(slug) : row.slug;
      const categoryStr = typeof category === 'string' ? category : undefined;
      const assignedCategories: string[] = Array.isArray(categories) && categories.length > 0
        ? categories
        : (categoryStr ? [categoryStr] : safeJsonParse<string[]>(row.categories, [row.category]));

      // Never overwrite existing image with an empty or undefined string
      const cleanImage = (typeof image === 'string' && image.trim().length > 0)
        ? image.trim()
        : row.image;

      logCourseWrite({
        courseId: targetDbId,
        courseName: typeof title === 'string' ? title : row.title,
        oldImage: row.image,
        newImage: cleanImage,
        request: `PUT /api/courses/${id}`,
        source: 'ADMIN_UPDATE',
        timestamp: new Date().toISOString()
      });

      const updatedCourse: Course = {
        id: targetDbId,
        slug: updatedSlug,
        title: typeof title === 'string' ? title : row.title,
        category: categoryStr || assignedCategories[0] || row.category,
        categories: assignedCategories,
        shortDescription: shortDescription !== undefined ? shortDescription : row.short_description,
        description: typeof description === 'string' ? description : (row.description || ''),
        image: cleanImage,
        price: price !== undefined ? Number(price) : Number(row.price),
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : Number(row.original_price),
        duration: typeof duration === 'string' ? duration : row.duration,
        liveHours: liveHours !== undefined ? liveHours : row.live_hours,
        lessons: lessons !== undefined ? Number(lessons) : Number(row.lessons),
        level: typeof level === 'string' ? level : row.level,
        rating: rating !== undefined ? Number(rating) : Number(row.rating),
        students: students !== undefined ? Number(students) : Number(row.students),
        status: status === 'coming-soon' ? 'coming-soon' : (row.status === 'coming-soon' ? 'coming-soon' : 'available'),
        featured: featured !== undefined ? Boolean(featured) : Boolean(row.featured),
        skills: skills !== undefined ? skills : safeJsonParse(row.skills, []),
        curriculum: curriculum !== undefined ? curriculum : safeJsonParse(row.curriculum, []),
        modules: modules !== undefined ? modules : safeJsonParse(row.modules, []),
        technologyStack: technologyStack !== undefined ? technologyStack : safeJsonParse(row.technology_stack, []),
        projects: projects !== undefined ? projects : safeJsonParse(row.projects, []),
        careerReadiness: careerReadiness !== undefined ? careerReadiness : safeJsonParse(row.career_readiness, []),
        outcome: outcome !== undefined ? outcome : row.outcome,
        features: features !== undefined ? features : safeJsonParse(row.features, []),
        requirements: requirements !== undefined ? requirements : safeJsonParse(row.requirements, []),
        whoIsItFor: whoIsItFor !== undefined ? whoIsItFor : safeJsonParse(row.who_is_it_for, []),
        seoTitle: seoTitle !== undefined ? seoTitle : row.seo_title,
        seoDescription: seoDescription !== undefined ? seoDescription : row.seo_description,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : safeJsonParse(row.seo_keywords, []),
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
        updatedAt: Date.now(),
        imageUpdatedAt: Date.now()
      };

      await query(
        `UPDATE courses SET
          slug = $1, title = $2, category = $3, categories = $4, short_description = $5, description = $6, image = $7,
          price = $8, original_price = $9, duration = $10, live_hours = $11, lessons = $12, level = $13,
          rating = $14, students = $15, status = $16, featured = $17, skills = $18,
          curriculum = $19, modules = $20, technology_stack = $21, projects = $22,
          career_readiness = $23, outcome = $24, features = $25, requirements = $26, who_is_it_for = $27,
          seo_title = $28, seo_description = $29, seo_keywords = $30, updated_at = NOW()
        WHERE id = $31`,
        [
          updatedCourse.slug,
          updatedCourse.title,
          updatedCourse.category,
          JSON.stringify(updatedCourse.categories),
          updatedCourse.shortDescription || null,
          updatedCourse.description,
          updatedCourse.image,
          updatedCourse.price,
          updatedCourse.originalPrice,
          updatedCourse.duration,
          updatedCourse.liveHours || null,
          updatedCourse.lessons,
          updatedCourse.level,
          updatedCourse.rating,
          updatedCourse.students,
          updatedCourse.status,
          updatedCourse.featured,
          JSON.stringify(updatedCourse.skills),
          JSON.stringify(updatedCourse.curriculum),
          JSON.stringify(updatedCourse.modules),
          JSON.stringify(updatedCourse.technologyStack),
          JSON.stringify(updatedCourse.projects),
          JSON.stringify(updatedCourse.careerReadiness),
          updatedCourse.outcome || null,
          JSON.stringify(updatedCourse.features),
          JSON.stringify(updatedCourse.requirements),
          JSON.stringify(updatedCourse.whoIsItFor),
          updatedCourse.seoTitle || null,
          updatedCourse.seoDescription || null,
          JSON.stringify(updatedCourse.seoKeywords || []),
          targetDbId
        ]
      );

      // Verify database record immediately
      const verifyRes = await query('SELECT id, slug, title, image, updated_at FROM courses WHERE id = $1', [targetDbId]);
      const verifiedRow = verifyRes.rows[0];
      console.log(`[COURSE_WRITE_VERIFY]\nrecordId: ${verifiedRow?.id}\ntitle: ${verifiedRow?.title}\nimage: ${verifiedRow?.image}\nupdatedAt: ${verifiedRow?.updated_at}`);

      // Keep mock store in sync
      const mockIdx = mockStore.courses.findIndex(c => c.id === targetDbId || c.slug === updatedCourse.slug);
      if (mockIdx >= 0) mockStore.courses[mockIdx] = updatedCourse;

      return res.json({ success: true, course: updatedCourse });
    } else {
      const idx = mockStore.courses.findIndex(c => c.id === id || c.slug === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const existing = mockStore.courses[idx];
      const categoryStr = typeof category === 'string' ? category : undefined;
      const assignedCategories: string[] = Array.isArray(categories) && categories.length > 0
        ? categories
        : (categoryStr ? [categoryStr] : existing.categories || [existing.category]);

      const cleanImage = (typeof image === 'string' && image.trim().length > 0)
        ? image.trim()
        : existing.image;

      logCourseWrite({
        courseId: existing.id,
        courseName: typeof title === 'string' ? title : existing.title,
        oldImage: existing.image,
        newImage: cleanImage,
        request: `PUT /api/courses/${id}`,
        source: 'ADMIN_UPDATE_FALLBACK',
        timestamp: new Date().toISOString()
      });

      const updated: Course = {
        ...existing,
        title: typeof title === 'string' ? title : existing.title,
        slug: slug ? slugify(slug) : existing.slug,
        category: categoryStr || assignedCategories[0] || existing.category,
        categories: assignedCategories,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        description: typeof description === 'string' ? description : existing.description,
        image: cleanImage,
        price: price !== undefined ? Number(price) : existing.price,
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice,
        duration: typeof duration === 'string' ? duration : existing.duration,
        liveHours: liveHours !== undefined ? liveHours : existing.liveHours,
        lessons: lessons !== undefined ? Number(lessons) : existing.lessons,
        level: typeof level === 'string' ? level : existing.level,
        rating: rating !== undefined ? Number(rating) : existing.rating,
        students: students !== undefined ? Number(students) : existing.students,
        status: status === 'coming-soon' ? 'coming-soon' : (existing.status === 'coming-soon' ? 'coming-soon' : 'available'),
        featured: featured !== undefined ? Boolean(featured) : Boolean(existing.featured),
        skills: skills !== undefined ? skills : existing.skills,
        curriculum: curriculum !== undefined ? curriculum : existing.curriculum,
        modules: modules !== undefined ? modules : existing.modules,
        technologyStack: technologyStack !== undefined ? technologyStack : existing.technologyStack,
        projects: projects !== undefined ? projects : existing.projects,
        careerReadiness: careerReadiness !== undefined ? careerReadiness : existing.careerReadiness,
        outcome: outcome !== undefined ? outcome : existing.outcome,
        features: features !== undefined ? features : existing.features,
        requirements: requirements !== undefined ? requirements : existing.requirements,
        whoIsItFor: whoIsItFor !== undefined ? whoIsItFor : existing.whoIsItFor,
        seoTitle: seoTitle !== undefined ? seoTitle : existing.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existing.seoDescription,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : existing.seoKeywords,
        updatedAt: Date.now(),
        imageUpdatedAt: Date.now()
      };

      mockStore.courses[idx] = updated;
      return res.json({ success: true, course: updated });
    }
  } catch (err: any) {
    console.error('Error updating course:', err);
    return res.status(500).json({ error: err.message || 'Failed to update course.' });
  }
});

// PATCH /api/courses/:id - Admin: Partial course update
router.patch('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const { id } = req.params;
    const updates = req.body || {};

    if (isDbConnected()) {
      const existing = await query('SELECT * FROM courses WHERE id = $1 OR slug = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const row = existing.rows[0];
      const targetDbId = row.id;

      const setClauses: string[] = [];
      const values: any[] = [];

      const addField = (col: string, val: any) => {
        values.push(val);
        setClauses.push(`${col} = $${values.length}`);
      };

      if (updates.title !== undefined) addField('title', String(updates.title).trim());
      if (updates.slug !== undefined) addField('slug', slugify(updates.slug));
      if (updates.category !== undefined) addField('category', String(updates.category).trim());
      if (updates.categories !== undefined) addField('categories', JSON.stringify(Array.isArray(updates.categories) ? updates.categories : [updates.category]));
      if (updates.shortDescription !== undefined) addField('short_description', updates.shortDescription);
      if (updates.description !== undefined) addField('description', updates.description);
      if (updates.image !== undefined && typeof updates.image === 'string' && updates.image.trim().length > 0) {
        addField('image', updates.image.trim());
      }
      if (updates.price !== undefined) addField('price', Number(updates.price));
      if (updates.originalPrice !== undefined) addField('original_price', Number(updates.originalPrice));
      if (updates.duration !== undefined) addField('duration', String(updates.duration));
      if (updates.liveHours !== undefined) addField('live_hours', updates.liveHours);
      if (updates.lessons !== undefined) addField('lessons', Number(updates.lessons));
      if (updates.level !== undefined) addField('level', String(updates.level));
      if (updates.rating !== undefined) addField('rating', Number(updates.rating));
      if (updates.students !== undefined) addField('students', Number(updates.students));
      if (updates.status !== undefined) addField('status', updates.status === 'coming-soon' ? 'coming-soon' : 'available');
      if (updates.featured !== undefined) addField('featured', Boolean(updates.featured));
      if (updates.skills !== undefined) addField('skills', JSON.stringify(updates.skills));
      if (updates.curriculum !== undefined) addField('curriculum', JSON.stringify(updates.curriculum));
      if (updates.modules !== undefined) addField('modules', JSON.stringify(updates.modules));
      if (updates.technologyStack !== undefined) addField('technology_stack', JSON.stringify(updates.technologyStack));
      if (updates.projects !== undefined) addField('projects', JSON.stringify(updates.projects));
      if (updates.careerReadiness !== undefined) addField('career_readiness', JSON.stringify(updates.careerReadiness));
      if (updates.outcome !== undefined) addField('outcome', updates.outcome);
      if (updates.features !== undefined) addField('features', JSON.stringify(updates.features));
      if (updates.requirements !== undefined) addField('requirements', JSON.stringify(updates.requirements));
      if (updates.whoIsItFor !== undefined) addField('who_is_it_for', JSON.stringify(updates.whoIsItFor));
      if (updates.seoTitle !== undefined) addField('seo_title', updates.seoTitle);
      if (updates.seoDescription !== undefined) addField('seo_description', updates.seoDescription);
      if (updates.seoKeywords !== undefined) addField('seo_keywords', JSON.stringify(updates.seoKeywords));

      if (setClauses.length === 0) {
        return res.json({ success: true, course: formatCourseRow(row) });
      }

      setClauses.push('updated_at = NOW()');
      values.push(targetDbId);
      const updateQuery = `UPDATE courses SET ${setClauses.join(', ')} WHERE id = $${values.length}`;

      logCourseWrite({
        courseId: targetDbId,
        courseName: updates.title || row.title,
        oldImage: row.image,
        newImage: updates.image || row.image,
        request: `PATCH /api/courses/${id}`,
        source: updates.source || (updates.image ? 'IMAGE_UPLOAD' : updates.status !== undefined ? 'STATUS_TOGGLE' : updates.featured !== undefined ? 'FEATURED_TOGGLE' : 'COURSE_PATCH'),
        timestamp: new Date().toISOString()
      });

      await query(updateQuery, values);

      const verifyRes = await query('SELECT * FROM courses WHERE id = $1', [targetDbId]);
      const verifiedRow = verifyRes.rows[0];
      const updatedCourse = formatCourseRow(verifiedRow);
      console.log(`[COURSE_WRITE_VERIFY]\nrecordId: ${verifiedRow?.id}\ntitle: ${verifiedRow?.title}\nimage: ${verifiedRow?.image}\nupdatedAt: ${verifiedRow?.updated_at}`);

      // Keep mock store in sync
      const mockIdx = mockStore.courses.findIndex(c => c.id === targetDbId || c.slug === updatedCourse.slug);
      if (mockIdx >= 0) mockStore.courses[mockIdx] = updatedCourse;

      return res.json({ success: true, course: updatedCourse });
    } else {
      const idx = mockStore.courses.findIndex(c => c.id === id || c.slug === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const existing = mockStore.courses[idx];
      const cleanImage = (typeof updates.image === 'string' && updates.image.trim().length > 0)
        ? updates.image.trim()
        : existing.image;

      logCourseWrite({
        courseId: existing.id,
        courseName: updates.title || existing.title,
        oldImage: existing.image,
        newImage: cleanImage,
        request: `PATCH /api/courses/${id}`,
        source: updates.source || 'COURSE_PATCH_FALLBACK',
        timestamp: new Date().toISOString()
      });

      const updated: Course = {
        ...existing,
        ...updates,
        image: cleanImage,
        updatedAt: Date.now(),
        imageUpdatedAt: Date.now()
      };

      mockStore.courses[idx] = updated;
      return res.json({ success: true, course: updated });
    }
  } catch (err: any) {
    console.error('Error patching course:', err);
    return res.status(500).json({ error: err.message || 'Failed to patch course.' });
  }
});

// DELETE /api/courses/:id - Admin: Delete course
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  console.log('\n[DELETE COURSE]');
  console.log(`Course ID: ${id}`);
  console.log('Database: Neon');
  console.log('Table: courses');

  try {
    await ensureDbInitialized().catch(() => {});

    if (isDbConnected()) {
      // 1. Check if record exists before attempting deletion
      const checkRes = await query('SELECT id, slug, title FROM courses WHERE id = $1 OR slug = $1', [id]);
      const recordFound = checkRes.rows.length > 0;
      console.log(`Record found: ${recordFound}`);

      if (!recordFound) {
        console.warn(`[DELETE COURSE] Course "${id}" not found in Neon database.`);
        return res.status(404).json({
          success: false,
          message: `Course with identifier "${id}" not found in database.`
        });
      }

      const targetDbId = checkRes.rows[0].id;
      const targetDbTitle = checkRes.rows[0].title;

      // 2. Perform actual SQL DELETE
      const result = await query('DELETE FROM courses WHERE id = $1 RETURNING id', [targetDbId]);
      const rowsDeleted = result.rowCount ?? result.rows.length;
      console.log('Delete executed: true');
      console.log(`Rows deleted: ${rowsDeleted}`);

      if (rowsDeleted === 0) {
        return res.status(404).json({
          success: false,
          message: 'Course could not be deleted or was already removed.'
        });
      }

      // Keep mock store in sync
      const mockIdx = mockStore.courses.findIndex(c => c.id === targetDbId || c.slug === id);
      if (mockIdx >= 0) {
        mockStore.courses.splice(mockIdx, 1);
      }

      console.log(`✅ [DELETE COURSE] Successfully removed "${targetDbTitle}" (ID: ${targetDbId}) from Neon database.\n`);

      return res.json({
        success: true,
        message: `Course "${targetDbTitle}" deleted successfully.`,
        courseId: targetDbId,
        rowsDeleted
      });
    } else {
      const idx = mockStore.courses.findIndex(c => c.id === id || c.slug === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Course not found in fallback store.' });
      }
      const title = mockStore.courses[idx].title;
      mockStore.courses.splice(idx, 1);
      console.log(`[DELETE COURSE] Course "${title}" (ID: ${id}) deleted from fallback store.`);
      return res.json({
        success: true,
        message: `Course "${title}" deleted successfully.`,
        courseId: id,
        rowsDeleted: 1
      });
    }
  } catch (err: any) {
    console.error('[DELETE COURSE ERROR]');
    console.error(`Course ID: ${id}`);
    console.error('Error:', err.message || err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete course from database.'
    });
  }
});

export default router;
