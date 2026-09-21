import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { Course } from '../../src/types/index.js';

const router = Router();

// Slug alias map for backwards compatibility
const SLUG_ALIASES: Record<string, string> = {
  'master-program-data-science-ai': 'advanced-executive-program-data-science-ai',
  'master-program-python': 'advance-executive-python',
  'master-program-ai-machine-learning': 'advanced-executive-program-data-science-ai',
  'master-program-data-analytics-ai': 'executive-professional-certificate-data-science-ai'
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
    lower === 'ds &amp; ai' ||
    lower === 'ds/ai' ||
    lower === 'ds-ai'
  ) {
    return 'Data Science and AI';
  }

  if (
    lower === 'da & ai' ||
    lower === 'da and ai' ||
    lower === 'data analytics & ai' ||
    lower === 'data analytics and ai' ||
    lower === 'da &amp; ai' ||
    lower === 'da/ai' ||
    lower === 'da-ai'
  ) {
    return 'Data Analytics and AI';
  }

  if (
    lower === 'ai & ml' ||
    lower === 'ai and ml' ||
    lower === 'ai & machine learning' ||
    lower === 'ai and machine learning' ||
    lower === 'ai &amp; ml' ||
    lower === 'ai/ml' ||
    lower === 'ai-ml'
  ) {
    return 'AI and Machine Learning';
  }

  if (
    lower === 'tools & upskills' ||
    lower === 'tools and upskills' ||
    lower === 'tools &amp; upskills' ||
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
    whoIsItFor: safeJsonParse<string[]>(row.who_is_it_for, [])
  };
}

// GET /api/courses - Public list
router.get('/', async (req, res) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const { category, level, status, search, featured } = req.query;

    if (isDbConnected()) {
      let sql = 'SELECT * FROM courses';
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (category && category !== 'all' && category !== 'All Categories') {
        params.push(category);
        const idx1 = params.length;
        params.push(`%"${category}"%`);
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
        params.push(`%${search}%`);
        const sIdx = params.length;
        whereClauses.push(`(
          LOWER(title) LIKE $${sIdx} OR
          LOWER(description) LIKE $${sIdx} OR
          skills::text ILIKE $${sIdx} OR
          curriculum::text ILIKE $${sIdx}
        )`);
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      sql += ' ORDER BY created_at DESC';

      const result = await query(sql, params);
      const courses: Course[] = result.rows.map(formatCourseRow);

      return res.json(courses);
    } else {
      let result = [...mockStore.courses];

      if (category && category !== 'all' && category !== 'All Categories') {
        const catTarget = (category as string).toLowerCase().trim();
        result = result.filter(c =>
          (c.categories || [c.category]).some(cat => cat.toLowerCase().trim() === catTarget)
        );
      }
      if (level && level !== 'all') {
        result = result.filter(c => c.level.toLowerCase().includes((level as string).toLowerCase()));
      }
      if (status && status !== 'all') {
        result = result.filter(c => c.status === status);
      }
      if (featured === 'true') {
        result = result.filter(c => c.featured);
      }
      if (search) {
        const s = (search as string).toLowerCase().trim();
        result = result.filter(c => {
          if (c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)) return true;
          if (c.skills?.some(sk => sk.toLowerCase().includes(s))) return true;
          if (c.curriculum?.some(sec => sec.title.toLowerCase().includes(s) || sec.topics.some(t => t.toLowerCase().includes(s)))) return true;
          return false;
        });
      }

      return res.json(result);
    }
  } catch (err: any) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch courses.' });
  }
});

// GET /api/courses/:slug - Public single course
router.get('/:slug', async (req, res) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const rawSlug = req.params.slug;
    const slug = SLUG_ALIASES[rawSlug] || rawSlug;

    if (isDbConnected()) {
      const result = await query('SELECT * FROM courses WHERE slug = $1 OR id = $1 OR slug = $2', [slug, rawSlug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const course = formatCourseRow(result.rows[0]);
      return res.json(course);
    } else {
      const course = mockStore.courses.find(c => c.slug === slug || c.id === slug || c.slug === rawSlug || c.id === rawSlug);
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      return res.json(course);
    }
  } catch (err: any) {
    console.error('Error fetching course:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch course details.' });
  }
});

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
      whoIsItFor
    } = req.body;

    if (!title || (!category && (!categories || categories.length === 0)) || !description) {
      return res.status(400).json({ error: 'Title, category/categories, and description are required.' });
    }

    const calculatedSlug = customSlug ? slugify(customSlug) : slugify(title);
    const id = `crs-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const courseImage = image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';
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
      whoIsItFor: Array.isArray(whoIsItFor) ? whoIsItFor : []
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
          skills, curriculum, modules, technology_stack, projects, career_readiness, outcome, features, requirements, who_is_it_for, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, NOW(), NOW()
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
          JSON.stringify(newCourse.whoIsItFor)
        ]
      );
    } else {
      mockStore.courses.unshift(newCourse);
    }

    return res.status(201).json({ success: true, course: newCourse });
  } catch (err: any) {
    console.error('Error creating course:', err);
    return res.status(500).json({ error: err.message || 'Failed to create course.' });
  }
});

// PUT /api/courses/:id - Admin: Update course
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
      whoIsItFor
    } = req.body;

    if (isDbConnected()) {
      const existing = await query('SELECT * FROM courses WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const row = existing.rows[0];
      const updatedSlug = slug ? slugify(slug) : row.slug;
      const categoryStr = typeof category === 'string' ? category : undefined;
      const assignedCategories: string[] = Array.isArray(categories) && categories.length > 0
        ? categories
        : (categoryStr ? [categoryStr] : safeJsonParse<string[]>(row.categories, [row.category]));

      const courseId = String(id);
      const updatedCourse: Course = {
        id: courseId,
        slug: updatedSlug,
        title: typeof title === 'string' ? title : row.title,
        category: categoryStr || assignedCategories[0] || row.category,
        categories: assignedCategories,
        shortDescription: shortDescription !== undefined ? shortDescription : row.short_description,
        description: typeof description === 'string' ? description : (row.description || ''),
        image: typeof image === 'string' ? image : row.image,
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
        whoIsItFor: whoIsItFor !== undefined ? whoIsItFor : safeJsonParse(row.who_is_it_for, [])
      };

      await query(
        `UPDATE courses SET
          slug = $1, title = $2, category = $3, categories = $4, short_description = $5, description = $6, image = $7,
          price = $8, original_price = $9, duration = $10, live_hours = $11, lessons = $12, level = $13,
          rating = $14, students = $15, status = $16, featured = $17, skills = $18,
          curriculum = $19, modules = $20, technology_stack = $21, projects = $22,
          career_readiness = $23, outcome = $24, features = $25, requirements = $26, who_is_it_for = $27, updated_at = NOW()
        WHERE id = $28`,
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
          id
        ]
      );

      return res.json({ success: true, course: updatedCourse });
    } else {
      const idx = mockStore.courses.findIndex(c => c.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const existing = mockStore.courses[idx];
      const categoryStr = typeof category === 'string' ? category : undefined;
      const assignedCategories: string[] = Array.isArray(categories) && categories.length > 0
        ? categories
        : (categoryStr ? [categoryStr] : existing.categories || [existing.category]);

      const updated: Course = {
        ...existing,
        title: typeof title === 'string' ? title : existing.title,
        slug: slug ? slugify(slug) : existing.slug,
        category: categoryStr || assignedCategories[0] || existing.category,
        categories: assignedCategories,
        shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
        description: typeof description === 'string' ? description : existing.description,
        image: typeof image === 'string' ? image : existing.image,
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
        whoIsItFor: whoIsItFor !== undefined ? whoIsItFor : existing.whoIsItFor
      };

      mockStore.courses[idx] = updated;
      return res.json({ success: true, course: updated });
    }
  } catch (err: any) {
    console.error('Error updating course:', err);
    return res.status(500).json({ error: err.message || 'Failed to update course.' });
  }
});

// DELETE /api/courses/:id - Admin: Delete course
router.delete('/:id', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const { id } = _req.params;

    if (isDbConnected()) {
      const result = await query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      return res.json({ success: true, message: 'Course deleted successfully.' });
    } else {
      const idx = mockStore.courses.findIndex(c => c.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      mockStore.courses.splice(idx, 1);
      return res.json({ success: true, message: 'Course deleted successfully.' });
    }
  } catch (err: any) {
    console.error('Error deleting course:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete course.' });
  }
});

export default router;
