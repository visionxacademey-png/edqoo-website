import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { Instructor } from '../../src/types/index.js';

const router = Router();

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

// Format DB Row to Instructor Object
function formatInstructorRow(row: any): Instructor {
  return {
    id: row.id,
    name: row.name,
    role: row.designation || row.role || '',
    designation: row.designation || row.role || '',
    organization: row.organization || '',
    image: row.image || row.profile_image || '',
    profileImage: row.profile_image || row.image || '',
    shortBio: row.short_bio || '',
    detailedBio: row.detailed_bio || row.short_bio || '',
    qualifications: row.qualifications || '',
    experience: row.experience || '',
    expertise: safeJsonParse<string[]>(row.expertise, []),
    certifications: safeJsonParse<string[]>(row.certifications, []),
    courses: safeJsonParse<string[]>(row.courses, []),
    projects: safeJsonParse<string[]>(row.projects, []),
    linkedin: row.linkedin || undefined,
    email: row.email || undefined,
    teachingExperience: row.teaching_experience || undefined,
    industryExperience: row.industry_experience || undefined
  };
}

/**
 * GET /api/instructors
 * Public endpoint to fetch all instructors
 */
router.get('/', async (_req, res: Response) => {
  try {
    await ensureDbInitialized();

    if (isDbConnected()) {
      const result = await query(
        'SELECT * FROM instructors ORDER BY created_at ASC'
      );
      const instructorsList = result.rows.map(formatInstructorRow);
      return res.json(instructorsList);
    }

    // Memory store fallback
    return res.json(mockStore.instructors);
  } catch (error: any) {
    console.error('Error fetching instructors:', error);
    return res.json(mockStore.instructors);
  }
});

/**
 * GET /api/instructors/:id
 * Public endpoint to fetch single instructor by ID
 */
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;

  try {
    await ensureDbInitialized();

    if (isDbConnected()) {
      const result = await query(
        'SELECT * FROM instructors WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        // Check mock store fallback
        const fallback = mockStore.instructors.find((i) => i.id === id);
        if (fallback) return res.json(fallback);
        return res.status(404).json({ error: 'Instructor not found' });
      }

      return res.json(formatInstructorRow(result.rows[0]));
    }

    const instructor = mockStore.instructors.find((i) => i.id === id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    return res.json(instructor);
  } catch (error: any) {
    console.error(`Error fetching instructor ${id}:`, error);
    const fallback = mockStore.instructors.find((i) => i.id === id);
    if (fallback) return res.json(fallback);
    return res.status(500).json({ error: 'Failed to retrieve instructor' });
  }
});

/**
 * POST /api/instructors
 * Protected Admin endpoint to create new instructor
 */
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.designation) {
      return res.status(400).json({ error: 'Name and designation are required.' });
    }

    const newId = data.id || `inst-${Date.now()}`;
    const newInstructor: Instructor = {
      id: newId,
      name: data.name,
      role: data.designation,
      designation: data.designation,
      organization: data.organization || 'Edqoo Partner',
      image: data.image || data.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      profileImage: data.profileImage || data.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      shortBio: data.shortBio || '',
      detailedBio: data.detailedBio || data.shortBio || '',
      qualifications: data.qualifications || '',
      experience: data.experience || '',
      expertise: Array.isArray(data.expertise) ? data.expertise : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      courses: Array.isArray(data.courses) ? data.courses : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      linkedin: data.linkedin || '',
      email: data.email || '',
      teachingExperience: data.teachingExperience || '',
      industryExperience: data.industryExperience || ''
    };

    if (isDbConnected()) {
      await query(
        `INSERT INTO instructors (
          id, name, designation, organization, image, profile_image, short_bio, detailed_bio,
          qualifications, experience, expertise, certifications, courses, projects,
          linkedin, email, teaching_experience, industry_experience, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, NOW(), NOW()
        )`,
        [
          newInstructor.id,
          newInstructor.name,
          newInstructor.designation,
          newInstructor.organization,
          newInstructor.image,
          newInstructor.profileImage,
          newInstructor.shortBio,
          newInstructor.detailedBio,
          newInstructor.qualifications,
          newInstructor.experience,
          JSON.stringify(newInstructor.expertise),
          JSON.stringify(newInstructor.certifications || []),
          JSON.stringify(newInstructor.courses),
          JSON.stringify(newInstructor.projects || []),
          newInstructor.linkedin || null,
          newInstructor.email || null,
          newInstructor.teachingExperience || null,
          newInstructor.industryExperience || null
        ]
      );
    }

    mockStore.instructors.unshift(newInstructor);
    return res.status(201).json({ success: true, instructor: newInstructor });
  } catch (error: any) {
    console.error('Error creating instructor:', error);
    return res.status(500).json({ error: error.message || 'Failed to create instructor' });
  }
});

/**
 * PUT /api/instructors/:id
 * Protected Admin endpoint to update instructor
 */
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    if (isDbConnected()) {
      const existing = await query('SELECT * FROM instructors WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Instructor not found' });
      }

      const current = formatInstructorRow(existing.rows[0]);
      const updated: Instructor = {
        ...current,
        ...data,
        id,
        role: data.designation || current.designation,
        designation: data.designation || current.designation,
        expertise: data.expertise ? (Array.isArray(data.expertise) ? data.expertise : [data.expertise]) : current.expertise,
        certifications: data.certifications ? (Array.isArray(data.certifications) ? data.certifications : [data.certifications]) : current.certifications,
        courses: data.courses ? (Array.isArray(data.courses) ? data.courses : [data.courses]) : current.courses,
        projects: data.projects ? (Array.isArray(data.projects) ? data.projects : [data.projects]) : current.projects,
      };

      await query(
        `UPDATE instructors SET
          name = $1, designation = $2, organization = $3, image = $4, profile_image = $5,
          short_bio = $6, detailed_bio = $7, qualifications = $8, experience = $9,
          expertise = $10, certifications = $11, courses = $12, projects = $13,
          linkedin = $14, email = $15, teaching_experience = $16, industry_experience = $17,
          updated_at = NOW()
        WHERE id = $18`,
        [
          updated.name,
          updated.designation,
          updated.organization,
          updated.image,
          updated.profileImage || updated.image,
          updated.shortBio,
          updated.detailedBio,
          updated.qualifications,
          updated.experience,
          JSON.stringify(updated.expertise),
          JSON.stringify(updated.certifications || []),
          JSON.stringify(updated.courses),
          JSON.stringify(updated.projects || []),
          updated.linkedin || null,
          updated.email || null,
          updated.teachingExperience || null,
          updated.industryExperience || null,
          id
        ]
      );

      // Update mock store
      const mockIdx = mockStore.instructors.findIndex((i) => i.id === id);
      if (mockIdx >= 0) mockStore.instructors[mockIdx] = updated;

      return res.json({ success: true, instructor: updated });
    }

    // Memory store fallback
    const idx = mockStore.instructors.findIndex((i) => i.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    mockStore.instructors[idx] = {
      ...mockStore.instructors[idx],
      ...data,
      id
    };

    return res.json({ success: true, instructor: mockStore.instructors[idx] });
  } catch (error: any) {
    console.error(`Error updating instructor ${id}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to update instructor' });
  }
});

/**
 * DELETE /api/instructors/:id
 * Protected Admin endpoint to delete instructor
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      await query('DELETE FROM instructors WHERE id = $1', [id]);
    }

    mockStore.instructors = mockStore.instructors.filter((i) => i.id !== id);
    return res.json({ success: true, message: 'Instructor deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting instructor ${id}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to delete instructor' });
  }
});

export default router;
