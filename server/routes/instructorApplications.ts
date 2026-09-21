import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { InstructorApplication } from '../../src/types/index.js';

const router = Router();

function formatApplicationRow(row: any): InstructorApplication {
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    designation: row.designation || '',
    organization: row.organization || '',
    qualification: row.qualification || '',
    expertise: row.expertise || '',
    experience: row.experience || '',
    linkedin: row.linkedin || undefined,
    portfolio: row.portfolio || undefined,
    courses: row.courses || '',
    teachingExperience: row.teaching_experience || row.teachingExperience || '',
    bio: row.bio || '',
    resume: row.resume || undefined,
    additionalInformation: row.additional_info || row.additionalInformation || undefined,
    status: row.status || 'New',
    notes: row.notes || '',
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined
  };
}

/**
 * POST /api/instructor-applications
 * Public endpoint to submit instructor / faculty applications
 */
router.post('/', async (req, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const {
      name,
      email,
      phone,
      designation,
      organization,
      qualification,
      expertise,
      experience,
      linkedin,
      portfolio,
      courses,
      teachingExperience,
      bio,
      resume,
      additionalInformation
    } = req.body;

    if (!name || !email || !phone || !designation || !organization || !qualification || !expertise || !courses || !bio) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const id = `inst-app-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newApplication: InstructorApplication = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      designation: designation.trim(),
      organization: organization.trim(),
      qualification: qualification.trim(),
      expertise: expertise.trim(),
      experience: experience || '3-5 Years',
      linkedin: linkedin ? linkedin.trim() : undefined,
      portfolio: portfolio ? portfolio.trim() : undefined,
      courses: courses.trim(),
      teachingExperience: teachingExperience || '1-3 Years',
      bio: bio.trim(),
      resume: resume || undefined,
      additionalInformation: additionalInformation ? additionalInformation.trim() : undefined,
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await query(
        `INSERT INTO instructor_applications (
          id, name, email, phone, designation, organization, qualification,
          expertise, experience, linkedin, portfolio, courses,
          teaching_experience, bio, resume, additional_info, status, notes,
          submitted_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())`,
        [
          newApplication.id,
          newApplication.name,
          newApplication.email,
          newApplication.phone,
          newApplication.designation,
          newApplication.organization,
          newApplication.qualification,
          newApplication.expertise,
          newApplication.experience,
          newApplication.linkedin || null,
          newApplication.portfolio || null,
          newApplication.courses,
          newApplication.teachingExperience,
          newApplication.bio,
          newApplication.resume || null,
          newApplication.additionalInformation || null,
          newApplication.status,
          newApplication.notes
        ]
      );
    } else {
      mockStore.instructorApplications.unshift(newApplication);
    }

    return res.status(201).json({
      success: true,
      message: 'Instructor application submitted successfully! Our academic onboarding committee will review your profile.',
      application: newApplication
    });
  } catch (error: any) {
    console.error('Error submitting instructor application:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit application.' });
  }
});

/**
 * GET /api/instructor-applications
 * Admin protected endpoint to fetch all applications
 */
router.get('/', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const result = await query('SELECT * FROM instructor_applications ORDER BY submitted_at DESC');
      return res.json(result.rows.map(formatApplicationRow));
    }
    return res.json(mockStore.instructorApplications);
  } catch (error: any) {
    console.error('Error fetching instructor applications:', error);
    return res.json(mockStore.instructorApplications || []);
  }
});

/**
 * PATCH /api/instructor-applications/:id
 * Admin protected endpoint to update application status and notes
 */
router.patch('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    await ensureDbInitialized().catch(() => {});

    if (isDbConnected()) {
      const result = await query(
        `UPDATE instructor_applications
         SET status = COALESCE($1, status),
             notes = COALESCE($2, notes),
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [status, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }
      return res.json({ success: true, application: formatApplicationRow(result.rows[0]) });
    }

    const index = mockStore.instructorApplications.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    mockStore.instructorApplications[index] = {
      ...mockStore.instructorApplications[index],
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date().toISOString()
    };

    return res.json({ success: true, application: mockStore.instructorApplications[index] });
  } catch (error: any) {
    console.error(`Error updating instructor application ${id}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to update application.' });
  }
});

/**
 * DELETE /api/instructor-applications/:id
 * Admin protected endpoint to delete application
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      await query('DELETE FROM instructor_applications WHERE id = $1', [id]);
    } else {
      mockStore.instructorApplications = mockStore.instructorApplications.filter((e: any) => e.id !== id);
    }
    return res.json({ success: true, message: 'Application deleted.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete application.' });
  }
});

export default router;
