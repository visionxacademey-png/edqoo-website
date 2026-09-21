import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { HiringEnquiry } from '../../src/types/index.js';

const router = Router();

function formatHiringRow(row: any): HiringEnquiry {
  return {
    id: row.id,
    companyName: row.company_name || row.companyName || '',
    contactPerson: row.contact_person || row.contactPerson || '',
    email: row.email || '',
    phone: row.phone || '',
    jobRole: row.job_role || row.jobRole || '',
    openings: row.openings || '1-5',
    requiredSkills: row.required_skills || row.requiredSkills || '',
    experience: row.experience || '1-3 Years',
    location: row.location || '',
    workMode: row.work_mode || row.workMode || 'Remote',
    additionalRequirements: row.additional_requirements || row.additionalRequirements || '',
    status: row.status || 'New',
    notes: row.notes || '',
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined
  };
}

/**
 * POST /api/hiring-enquiries
 * Public endpoint to submit corporate hiring requirements
 */
router.post('/', async (req, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const {
      companyName,
      contactPerson,
      email,
      phone,
      jobRole,
      openings,
      requiredSkills,
      experience,
      location,
      workMode,
      additionalRequirements
    } = req.body;

    if (!companyName || !contactPerson || !email || !phone || !jobRole) {
      return res.status(400).json({ error: 'Company name, contact person, email, phone, and job role are required.' });
    }

    const id = `hire-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newEnquiry: HiringEnquiry = {
      id,
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      jobRole: jobRole.trim(),
      openings: openings || '1-5',
      requiredSkills: requiredSkills || '',
      experience: experience || '1-3 Years',
      location: location || '',
      workMode: workMode || 'Remote',
      additionalRequirements: additionalRequirements || '',
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await query(
        `INSERT INTO hiring_enquiries (
          id, company_name, contact_person, email, phone, job_role,
          openings, required_skills, experience, location, work_mode,
          additional_requirements, status, notes, submitted_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
        [
          newEnquiry.id,
          newEnquiry.companyName,
          newEnquiry.contactPerson,
          newEnquiry.email,
          newEnquiry.phone,
          newEnquiry.jobRole,
          newEnquiry.openings,
          newEnquiry.requiredSkills,
          newEnquiry.experience,
          newEnquiry.location,
          newEnquiry.workMode,
          newEnquiry.additionalRequirements,
          newEnquiry.status,
          newEnquiry.notes
        ]
      );
    } else {
      mockStore.hiringEnquiries.unshift(newEnquiry);
    }

    return res.status(201).json({
      success: true,
      message: 'Hiring requirement submitted successfully. Our corporate talent team will connect with you shortly.',
      enquiry: newEnquiry
    });
  } catch (error: any) {
    console.error('Error creating hiring enquiry:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit hiring enquiry.' });
  }
});

/**
 * GET /api/hiring-enquiries
 * Admin protected endpoint to fetch all hiring requests
 */
router.get('/', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const result = await query('SELECT * FROM hiring_enquiries ORDER BY submitted_at DESC');
      return res.json(result.rows.map(formatHiringRow));
    }
    return res.json(mockStore.hiringEnquiries);
  } catch (error: any) {
    console.error('Error fetching hiring enquiries:', error);
    return res.json(mockStore.hiringEnquiries || []);
  }
});

/**
 * PATCH /api/hiring-enquiries/:id
 * Admin protected endpoint to update status and notes
 */
router.patch('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    await ensureDbInitialized().catch(() => {});

    if (isDbConnected()) {
      const result = await query(
        `UPDATE hiring_enquiries
         SET status = COALESCE($1, status),
             notes = COALESCE($2, notes),
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [status, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Hiring enquiry not found' });
      }
      return res.json({ success: true, enquiry: formatHiringRow(result.rows[0]) });
    }

    const index = mockStore.hiringEnquiries.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Hiring enquiry not found' });
    }

    mockStore.hiringEnquiries[index] = {
      ...mockStore.hiringEnquiries[index],
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date().toISOString()
    };

    return res.json({ success: true, enquiry: mockStore.hiringEnquiries[index] });
  } catch (error: any) {
    console.error(`Error updating hiring enquiry ${id}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to update hiring enquiry.' });
  }
});

/**
 * DELETE /api/hiring-enquiries/:id
 * Admin protected endpoint to delete hiring enquiry
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      await query('DELETE FROM hiring_enquiries WHERE id = $1', [id]);
    } else {
      mockStore.hiringEnquiries = mockStore.hiringEnquiries.filter((e: any) => e.id !== id);
    }
    return res.json({ success: true, message: 'Hiring enquiry deleted.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete hiring enquiry.' });
  }
});

export default router;
