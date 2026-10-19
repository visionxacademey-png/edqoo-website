import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { Category } from '../../src/types/index.js';

const router = Router();

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

function formatCategoryRow(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title || row.name,
    description: row.description || '',
    subtitle: row.subtitle || row.description || '',
    icon: row.icon || 'layers',
    heroImage: row.hero_image || undefined,
    heroBadge: row.hero_badge || undefined,
    highlights: safeJsonParse<string[]>(row.highlights, []),
    curriculumPillars: safeJsonParse<Array<{ title: string; desc: string }>>(row.curriculum_pillars, []),
    faqs: safeJsonParse<Array<{ question: string; answer: string }>>(row.faqs, []),
    displayOrder: Number(row.display_order) || 0,
    isActive: Boolean(row.is_active),
    isPartner: Boolean(row.is_partner),
    badge: row.badge || undefined,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    metaKeywords: safeJsonParse<string[]>(row.meta_keywords, []),
    parentId: row.parent_id || undefined,
    parentSlug: row.parent_slug || undefined,
    features: safeJsonParse<any[]>(row.features, []),
    courseDetails: safeJsonParse<any>(row.course_details, {}),
    keyHighlights: safeJsonParse<string[]>(row.key_highlights, []),
    learningBenefits: safeJsonParse<string[]>(row.learning_benefits, []),
    batchTimings: safeJsonParse<any[]>(row.batch_timings, []),
    learningFormat: row.learning_format || undefined,
    supportingText: row.supporting_text || undefined,
    highlightText: row.highlight_text || undefined,
    courseCount: row.course_count !== undefined ? Number(row.course_count) : undefined,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined
  };
}

// GET /api/categories - Public list of active categories in database order
router.get('/', async (_req, res) => {
  try {
    await ensureDbInitialized();

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (isDbConnected()) {
      const sql = `
        SELECT c.*, 
               COALESCE((
                 SELECT COUNT(*) 
                 FROM courses cr 
                 WHERE (LOWER(cr.category) = LOWER(c.name) OR cr.category_id = c.id OR cr.categories::text ILIKE '%' || c.name || '%')
                   AND cr.status != 'inactive'
               ), 0) as course_count
        FROM categories c
        WHERE c.is_active = true
        ORDER BY c.display_order ASC, c.created_at ASC
      `;
      const result = await query(sql);
      const categories = result.rows.map(formatCategoryRow);
      return res.json(categories);
    } else {
      const active = (mockStore.categories || [])
        .filter((c: any) => c.isActive !== false && c.is_active !== false)
        .sort((a: any, b: any) => (a.displayOrder || a.display_order || 0) - (b.displayOrder || b.display_order || 0));
      return res.json(active);
    }
  } catch (err: any) {
    console.error('🔥 [CATEGORIES] Error fetching categories:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch categories from database.' });
  }
});

// GET /api/categories/all - Admin: All categories including inactive
router.get('/all', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized();

    if (isDbConnected()) {
      const sql = `
        SELECT c.*, 
               COALESCE((
                 SELECT COUNT(*) 
                 FROM courses cr 
                 WHERE (LOWER(cr.category) = LOWER(c.name) OR cr.category_id = c.id OR cr.categories::text ILIKE '%' || c.name || '%')
               ), 0) as course_count
        FROM categories c
        ORDER BY c.display_order ASC, c.created_at ASC
      `;
      const result = await query(sql);
      const categories = result.rows.map(formatCategoryRow);
      return res.json(categories);
    } else {
      const all = [...(mockStore.categories || [])].sort(
        (a: any, b: any) => (a.displayOrder || a.display_order || 0) - (b.displayOrder || b.display_order || 0)
      );
      return res.json(all);
    }
  } catch (err: any) {
    console.error('🔥 [ADMIN CATEGORIES] Error fetching all categories:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch categories.' });
  }
});

// GET /api/categories/:slugOrId - Public single category details
router.get('/:slugOrId', async (req, res) => {
  try {
    await ensureDbInitialized();
    const slugOrId = req.params.slugOrId;

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (isDbConnected()) {
      const sql = `
        SELECT c.*, 
               COALESCE((
                 SELECT COUNT(*) 
                 FROM courses cr 
                 WHERE (LOWER(cr.category) = LOWER(c.name) OR cr.category_id = c.id OR cr.categories::text ILIKE '%' || c.name || '%')
                   AND cr.status != 'inactive'
               ), 0) as course_count
        FROM categories c
        WHERE c.slug = $1 OR c.id = $1 OR LOWER(c.name) = LOWER($1)
           OR ($1 IN ('english-mirror', 'spoken-english', 'spoken-tutorial') AND c.slug IN ('spoken-tutorial', 'spoken-english'))
        ORDER BY (CASE WHEN c.slug = $1 OR c.id = $1 THEN 0 ELSE 1 END) ASC
        LIMIT 1
      `;
      const result = await query(sql, [slugOrId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      return res.json(formatCategoryRow(result.rows[0]));
    } else {
      const found = (mockStore.categories || []).find(
        (c: any) => c.slug === slugOrId || c.id === slugOrId || c.name?.toLowerCase() === slugOrId.toLowerCase() ||
          ((slugOrId === 'english-mirror' || slugOrId === 'spoken-english' || slugOrId === 'spoken-tutorial') && (c.slug === 'spoken-tutorial' || c.slug === 'spoken-english'))
      );
      if (!found) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      return res.json(found);
    }
  } catch (err: any) {
    console.error('🔥 [CATEGORIES] Error fetching single category:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch category details.' });
  }
});

// POST /api/categories - Admin create category
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized();
    const {
      name,
      slug: customSlug,
      title,
      description,
      subtitle,
      icon,
      heroImage,
      heroBadge,
      highlights,
      curriculumPillars,
      faqs,
      displayOrder,
      isActive = true,
      isPartner = false,
      badge,
      seoTitle,
      seoDescription,
      metaKeywords,
      parentId,
      parentSlug,
      features,
      courseDetails,
      keyHighlights,
      learningBenefits,
      batchTimings,
      learningFormat,
      supportingText
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const trimmedName = name.trim();
    const calculatedSlug = customSlug ? slugify(customSlug) : slugify(trimmedName);
    const id = `cat-${calculatedSlug || Date.now().toString(36)}`;

    if (isDbConnected()) {
      // Prevent duplicate category by normalized name or slug
      const dupCheck = await query(
        'SELECT id, name, slug FROM categories WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) OR slug = $2',
        [trimmedName, calculatedSlug]
      );
      if (dupCheck.rows.length > 0) {
        return res.status(409).json({
          error: `A category with the name "${dupCheck.rows[0].name}" or slug "${calculatedSlug}" already exists.`
        });
      }

      const insertSql = `
        INSERT INTO categories (
          id, slug, name, title, description, subtitle, icon,
          hero_image, hero_badge, highlights, curriculum_pillars, faqs,
          display_order, is_active, is_partner, badge, seo_title, seo_description, meta_keywords,
          parent_id, parent_slug, features, course_details, key_highlights, learning_benefits,
          batch_timings, learning_format, supporting_text,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10::jsonb, $11::jsonb, $12::jsonb,
          $13, $14, $15, $16, $17, $18, $19::jsonb,
          $20, $21, $22::jsonb, $23::jsonb, $24::jsonb, $25::jsonb,
          $26::jsonb, $27, $28,
          NOW(), NOW()
        ) RETURNING *
      `;
      const result = await query(insertSql, [
        id,
        calculatedSlug,
        name.trim(),
        title?.trim() || name.trim(),
        description?.trim() || '',
        subtitle?.trim() || '',
        icon || 'layers',
        heroImage || null,
        heroBadge || null,
        JSON.stringify(highlights || []),
        JSON.stringify(curriculumPillars || []),
        JSON.stringify(faqs || []),
        Number(displayOrder) || 99,
        Boolean(isActive),
        Boolean(isPartner),
        badge || null,
        seoTitle || null,
        seoDescription || null,
        JSON.stringify(metaKeywords || []),
        parentId || null,
        parentSlug || null,
        JSON.stringify(features || []),
        JSON.stringify(courseDetails || {}),
        JSON.stringify(keyHighlights || []),
        JSON.stringify(learningBenefits || []),
        JSON.stringify(batchTimings || []),
        learningFormat || null,
        supportingText || null
      ]);

      const created = formatCategoryRow(result.rows[0]);
      return res.status(201).json({ success: true, category: created });
    } else {
      const trimmedNameLower = trimmedName.toLowerCase();
      const exists = (mockStore.categories || []).some(
        (c: any) => c.name?.toLowerCase().trim() === trimmedNameLower || c.slug === calculatedSlug
      );
      if (exists) {
        return res.status(409).json({ error: `A category with this name or slug already exists.` });
      }

      const newCat: Category = {
        id,
        slug: calculatedSlug,
        name: name.trim(),
        title: title?.trim() || name.trim(),
        description: description?.trim() || '',
        subtitle: subtitle?.trim() || '',
        icon: icon || 'layers',
        heroImage,
        heroBadge,
        highlights: highlights || [],
        curriculumPillars: curriculumPillars || [],
        faqs: faqs || [],
        displayOrder: Number(displayOrder) || 99,
        isActive: Boolean(isActive),
        isPartner: Boolean(isPartner),
        badge,
        seoTitle,
        seoDescription,
        metaKeywords: metaKeywords || [],
        parentId,
        parentSlug,
        features: features || [],
        courseDetails: courseDetails || {},
        keyHighlights: keyHighlights || [],
        learningBenefits: learningBenefits || [],
        batchTimings: batchTimings || [],
        learningFormat,
        supportingText,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      mockStore.categories.push(newCat);
      return res.status(201).json({ success: true, category: newCat });
    }
  } catch (err: any) {
    console.error('🔥 [CATEGORIES] Error creating category:', err);
    return res.status(500).json({ error: err.message || 'Failed to create category.' });
  }
});

// PUT /api/categories/:id - Admin update category
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized();
    const id = req.params.id;
    const {
      name,
      slug: customSlug,
      title,
      description,
      subtitle,
      icon,
      heroImage,
      heroBadge,
      highlights,
      curriculumPillars,
      faqs,
      displayOrder,
      isActive,
      isPartner,
      badge,
      seoTitle,
      seoDescription,
      metaKeywords,
      parentId,
      parentSlug,
      features,
      courseDetails,
      keyHighlights,
      learningBenefits,
      batchTimings,
      learningFormat,
      supportingText
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const trimmedName = name.trim();
    const calculatedSlug = customSlug ? slugify(customSlug) : slugify(trimmedName);

    if (isDbConnected()) {
      // Prevent updating to a duplicate category name or slug that belongs to another category
      const dupCheck = await query(
        'SELECT id, name, slug FROM categories WHERE (LOWER(TRIM(name)) = LOWER(TRIM($1)) OR slug = $2) AND id != $3',
        [trimmedName, calculatedSlug, id]
      );
      if (dupCheck.rows.length > 0) {
        return res.status(409).json({
          error: `Another category with the name "${dupCheck.rows[0].name}" or slug "${calculatedSlug}" already exists.`
        });
      }

      const updateSql = `
        UPDATE categories SET
          slug = $1,
          name = $2,
          title = $3,
          description = $4,
          subtitle = $5,
          icon = $6,
          hero_image = $7,
          hero_badge = $8,
          highlights = $9::jsonb,
          curriculum_pillars = $10::jsonb,
          faqs = $11::jsonb,
          display_order = $12,
          is_active = $13,
          is_partner = $14,
          badge = $15,
          seo_title = $16,
          seo_description = $17,
          meta_keywords = $18::jsonb,
          parent_id = $19,
          parent_slug = $20,
          features = $21::jsonb,
          course_details = $22::jsonb,
          key_highlights = $23::jsonb,
          learning_benefits = $24::jsonb,
          batch_timings = $25::jsonb,
          learning_format = $26,
          supporting_text = $27,
          updated_at = NOW()
        WHERE id = $28 OR slug = $28
        RETURNING *
      `;
      const result = await query(updateSql, [
        calculatedSlug,
        name.trim(),
        title?.trim() || name.trim(),
        description?.trim() || '',
        subtitle?.trim() || '',
        icon || 'layers',
        heroImage || null,
        heroBadge || null,
        JSON.stringify(highlights || []),
        JSON.stringify(curriculumPillars || []),
        JSON.stringify(faqs || []),
        Number(displayOrder) || 0,
        isActive !== undefined ? Boolean(isActive) : true,
        Boolean(isPartner),
        badge || null,
        seoTitle || null,
        seoDescription || null,
        JSON.stringify(metaKeywords || []),
        parentId || null,
        parentSlug || null,
        JSON.stringify(features || []),
        JSON.stringify(courseDetails || {}),
        JSON.stringify(keyHighlights || []),
        JSON.stringify(learningBenefits || []),
        JSON.stringify(batchTimings || []),
        learningFormat || null,
        supportingText || null,
        id
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      const updated = formatCategoryRow(result.rows[0]);
      return res.json({ success: true, category: updated });
    } else {
      const idx = (mockStore.categories || []).findIndex((c: any) => c.id === id || c.slug === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      const mockDup = (mockStore.categories || []).find(
        (c: any) =>
          c.id !== id &&
          (c.name.trim().toLowerCase() === trimmedName.toLowerCase() || c.slug === calculatedSlug)
      );
      if (mockDup) {
        return res.status(409).json({
          error: `Another category with the name "${mockDup.name}" or slug "${calculatedSlug}" already exists.`
        });
      }
      mockStore.categories[idx] = {
        ...mockStore.categories[idx],
        ...req.body,
        slug: calculatedSlug,
        updatedAt: Date.now()
      };
      return res.json({ success: true, category: mockStore.categories[idx] });
    }
  } catch (err: any) {
    console.error('🔥 [CATEGORIES] Error updating category:', err);
    return res.status(500).json({ error: err.message || 'Failed to update category.' });
  }
});

// PATCH /api/categories/reorder - Admin update display orders in bulk
router.patch('/reorder', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized();
    const { orders } = req.body; // Array of { id: string, displayOrder: number }

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'orders array is required' });
    }

    if (isDbConnected()) {
      for (const item of orders) {
        if (item.id && typeof item.displayOrder === 'number') {
          await query('UPDATE categories SET display_order = $1, updated_at = NOW() WHERE id = $2 OR slug = $2', [
            item.displayOrder,
            item.id
          ]);
        }
      }
    } else {
      for (const item of orders) {
        const cat = (mockStore.categories || []).find((c: any) => c.id === item.id || c.slug === item.id);
        if (cat) cat.displayOrder = item.displayOrder;
      }
    }

    return res.json({ success: true, message: 'Category orders updated successfully.' });
  } catch (err: any) {
    console.error('🔥 [CATEGORIES] Error reordering categories:', err);
    return res.status(500).json({ error: err.message || 'Failed to reorder categories.' });
  }
});

// DELETE /api/categories/:id - Admin delete category
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized();
    const id = req.params.id;

    if (isDbConnected()) {
      const result = await query('DELETE FROM categories WHERE id = $1 OR slug = $1 RETURNING id, name', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      return res.json({ success: true, message: `Category "${result.rows[0].name}" deleted successfully.` });
    } else {
      const idx = (mockStore.categories || []).findIndex((c: any) => c.id === id || c.slug === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Category not found.' });
      }
      const removed = mockStore.categories.splice(idx, 1)[0];
      return res.json({ success: true, message: `Category "${removed.name}" deleted successfully.` });
    }
  } catch (err: any) {
    console.error('🔥 [CATEGORIES] Error deleting category:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete category.' });
  }
});

export default router;
