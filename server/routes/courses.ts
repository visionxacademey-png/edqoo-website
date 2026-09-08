import { Router, Response } from 'express';
import { query, isNeonConnected, mockStore } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import type { Course } from '../../src/types';

const router = Router();

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

// GET /api/courses - Public list
router.get('/', async (req, res) => {
  try {
    const { category, level, status, search, featured } = req.query;

    if (isNeonConnected) {
      let sql = 'SELECT * FROM courses';
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (category && category !== 'all') {
        params.push(category);
        whereClauses.push(`LOWER(category) = LOWER($${params.length})`);
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
        whereClauses.push(`(LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      sql += ' ORDER BY created_at DESC';

      const result = await query(sql, params);
      const courses: Course[] = result.rows.map(row => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category,
        description: row.description,
        image: row.image,
        price: Number(row.price),
        originalPrice: Number(row.original_price),
        duration: row.duration,
        lessons: Number(row.lessons),
        level: row.level,
        rating: Number(row.rating),
        students: Number(row.students),
        status: row.status,
        featured: Boolean(row.featured),
        skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills || [],
        modules: typeof row.modules === 'string' ? JSON.parse(row.modules) : row.modules || [],
        requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements) : row.requirements || [],
        whoIsItFor: typeof row.who_is_it_for === 'string' ? JSON.parse(row.who_is_it_for) : row.who_is_it_for || []
      }));

      return res.json(courses);
    } else {
      let result = [...mockStore.courses];

      if (category && category !== 'all') {
        result = result.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
      }
      if (level && level !== 'all') {
        result = result.filter(c => c.level.toLowerCase() === (level as string).toLowerCase());
      }
      if (status && status !== 'all') {
        result = result.filter(c => c.status === status);
      }
      if (featured === 'true') {
        result = result.filter(c => c.featured);
      }
      if (search) {
        const s = (search as string).toLowerCase();
        result = result.filter(c => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
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
    const { slug } = req.params;

    if (isNeonConnected) {
      const result = await query('SELECT * FROM courses WHERE slug = $1 OR id = $1', [slug]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const row = result.rows[0];
      const course: Course = {
        id: row.id,
        slug: row.slug,
        title: row.title,
        category: row.category,
        description: row.description,
        image: row.image,
        price: Number(row.price),
        originalPrice: Number(row.original_price),
        duration: row.duration,
        lessons: Number(row.lessons),
        level: row.level,
        rating: Number(row.rating),
        students: Number(row.students),
        status: row.status,
        featured: Boolean(row.featured),
        skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills || [],
        modules: typeof row.modules === 'string' ? JSON.parse(row.modules) : row.modules || [],
        requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements) : row.requirements || [],
        whoIsItFor: typeof row.who_is_it_for === 'string' ? JSON.parse(row.who_is_it_for) : row.who_is_it_for || []
      };

      return res.json(course);
    } else {
      const course = mockStore.courses.find(c => c.slug === slug || c.id === slug);
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
    const {
      title,
      slug: customSlug,
      category,
      description,
      image,
      price,
      originalPrice,
      duration,
      lessons,
      level,
      rating,
      students,
      status,
      featured,
      skills,
      modules,
      requirements,
      whoIsItFor
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required.' });
    }

    const calculatedSlug = customSlug ? slugify(customSlug) : slugify(title);
    const id = `crs-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const courseImage = image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop';

    const newCourse: Course = {
      id,
      slug: calculatedSlug,
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      image: courseImage,
      price: Number(price) || 0,
      originalPrice: Number(originalPrice) || Number(price) || 0,
      duration: duration || '12 Weeks',
      lessons: Number(lessons) || (modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)) || 10,
      level: level || 'Beginner to Advanced',
      rating: Number(rating) || 4.9,
      students: Number(students) || 0,
      status: status === 'coming-soon' ? 'coming-soon' : 'available',
      featured: Boolean(featured),
      skills: Array.isArray(skills) ? skills : [],
      modules: Array.isArray(modules) ? modules : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      whoIsItFor: Array.isArray(whoIsItFor) ? whoIsItFor : []
    };

    if (isNeonConnected) {
      // Check slug uniqueness
      const existingSlug = await query('SELECT id FROM courses WHERE slug = $1', [calculatedSlug]);
      if (existingSlug.rows.length > 0) {
        newCourse.slug = `${calculatedSlug}-${Date.now().toString().slice(-4)}`;
      }

      await query(
        `INSERT INTO courses (
          id, slug, title, category, description, image, price, original_price,
          duration, lessons, level, rating, students, status, featured,
          skills, modules, requirements, who_is_it_for, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())`,
        [
          newCourse.id,
          newCourse.slug,
          newCourse.title,
          newCourse.category,
          newCourse.description,
          newCourse.image,
          newCourse.price,
          newCourse.originalPrice,
          newCourse.duration,
          newCourse.lessons,
          newCourse.level,
          newCourse.rating,
          newCourse.students,
          newCourse.status,
          newCourse.featured,
          JSON.stringify(newCourse.skills),
          JSON.stringify(newCourse.modules),
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
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      description,
      image,
      price,
      originalPrice,
      duration,
      lessons,
      level,
      rating,
      students,
      status,
      featured,
      skills,
      modules,
      requirements,
      whoIsItFor
    } = req.body;

    if (isNeonConnected) {
      const existing = await query('SELECT * FROM courses WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      const row = existing.rows[0];
      const updatedSlug = slug ? slugify(slug) : row.slug;

      const updatedCourse: Course = {
        id,
        slug: updatedSlug,
        title: title || row.title,
        category: category || row.category,
        description: description || row.description,
        image: image || row.image,
        price: price !== undefined ? Number(price) : Number(row.price),
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : Number(row.original_price),
        duration: duration || row.duration,
        lessons: lessons !== undefined ? Number(lessons) : Number(row.lessons),
        level: level || row.level,
        rating: rating !== undefined ? Number(rating) : Number(row.rating),
        students: students !== undefined ? Number(students) : Number(row.students),
        status: status || row.status,
        featured: featured !== undefined ? Boolean(featured) : Boolean(row.featured),
        skills: skills !== undefined ? skills : (typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills),
        modules: modules !== undefined ? modules : (typeof row.modules === 'string' ? JSON.parse(row.modules) : row.modules),
        requirements: requirements !== undefined ? requirements : (typeof row.requirements === 'string' ? JSON.parse(row.requirements) : row.requirements),
        whoIsItFor: whoIsItFor !== undefined ? whoIsItFor : (typeof row.who_is_it_for === 'string' ? JSON.parse(row.who_is_it_for) : row.who_is_it_for)
      };

      await query(
        `UPDATE courses SET
          slug = $1, title = $2, category = $3, description = $4, image = $5,
          price = $6, original_price = $7, duration = $8, lessons = $9, level = $10,
          rating = $11, students = $12, status = $13, featured = $14, skills = $15,
          modules = $16, requirements = $17, who_is_it_for = $18, updated_at = NOW()
        WHERE id = $19`,
        [
          updatedCourse.slug,
          updatedCourse.title,
          updatedCourse.category,
          updatedCourse.description,
          updatedCourse.image,
          updatedCourse.price,
          updatedCourse.originalPrice,
          updatedCourse.duration,
          updatedCourse.lessons,
          updatedCourse.level,
          updatedCourse.rating,
          updatedCourse.students,
          updatedCourse.status,
          updatedCourse.featured,
          JSON.stringify(updatedCourse.skills),
          JSON.stringify(updatedCourse.modules),
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
      const updated: Course = {
        ...existing,
        title: title || existing.title,
        slug: slug ? slugify(slug) : existing.slug,
        category: category || existing.category,
        description: description || existing.description,
        image: image || existing.image,
        price: price !== undefined ? Number(price) : existing.price,
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice,
        duration: duration || existing.duration,
        lessons: lessons !== undefined ? Number(lessons) : existing.lessons,
        level: level || existing.level,
        rating: rating !== undefined ? Number(rating) : existing.rating,
        students: students !== undefined ? Number(students) : existing.students,
        status: status || existing.status,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        skills: skills !== undefined ? skills : existing.skills,
        modules: modules !== undefined ? modules : existing.modules,
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
    const { id } = _req.params;

    if (isNeonConnected) {
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
