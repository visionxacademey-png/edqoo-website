import { Router, type Response } from 'express';
import { query, isDbConnected, ensureDbInitialized, mockStore } from '../db/index.js';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth.js';
import type { PartnerEnquiry } from '../../src/types/index.js';

const router = Router();

function formatPartnerRow(row: any): PartnerEnquiry {
  return {
    id: row.id,
    organizationName: row.organization_name || row.organizationName || '',
    contactPerson: row.contact_person || row.contactPerson || '',
    designation: row.designation || '',
    email: row.email || '',
    phone: row.phone || '',
    organizationType: row.organization_type || row.organizationType || 'Company',
    partnershipArea: row.partnership_area || row.partnershipArea || '',
    website: row.website || undefined,
    location: row.location || '',
    proposal: row.proposal || '',
    additionalInformation: row.additional_info || row.additionalInformation || undefined,
    status: row.status || 'New',
    notes: row.notes || '',
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined
  };
}

/**
 * POST /api/partner-enquiries
 * Public endpoint to submit partnership proposals
 */
router.post('/', async (req, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    const {
      organizationName,
      contactPerson,
      designation,
      email,
      phone,
      organizationType,
      partnershipArea,
      website,
      location,
      proposal,
      additionalInformation
    } = req.body;

    if (!organizationName || !contactPerson || !designation || !email || !phone || !organizationType || !partnershipArea || !proposal) {
      return res.status(400).json({ error: 'Please provide all required fields for your partnership request.' });
    }

    const id = `ptnr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newEnquiry: PartnerEnquiry = {
      id,
      organizationName: organizationName.trim(),
      contactPerson: contactPerson.trim(),
      designation: designation.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      organizationType: organizationType || 'Company',
      partnershipArea: partnershipArea.trim(),
      website: website ? website.trim() : undefined,
      location: location || '',
      proposal: proposal.trim(),
      additionalInformation: additionalInformation ? additionalInformation.trim() : undefined,
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      await query(
        `INSERT INTO partner_enquiries (
          id, organization_name, contact_person, designation, email, phone,
          organization_type, partnership_area, website, location, proposal,
          additional_info, status, notes, submitted_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
        [
          newEnquiry.id,
          newEnquiry.organizationName,
          newEnquiry.contactPerson,
          newEnquiry.designation,
          newEnquiry.email,
          newEnquiry.phone,
          newEnquiry.organizationType,
          newEnquiry.partnershipArea,
          newEnquiry.website || null,
          newEnquiry.location,
          newEnquiry.proposal,
          newEnquiry.additionalInformation || null,
          newEnquiry.status,
          newEnquiry.notes
        ]
      );
    } else {
      mockStore.partnerEnquiries.unshift(newEnquiry);
    }

    return res.status(201).json({
      success: true,
      message: 'Partnership request submitted successfully! Our strategic alliances team will be in touch.',
      enquiry: newEnquiry
    });
  } catch (error: any) {
    console.error('Error submitting partner enquiry:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit partnership request.' });
  }
});

/**
 * GET /api/partner-enquiries
 * Admin protected endpoint to fetch all partnership requests
 */
router.get('/', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      const result = await query('SELECT * FROM partner_enquiries ORDER BY submitted_at DESC');
      return res.json(result.rows.map(formatPartnerRow));
    }
    return res.json(mockStore.partnerEnquiries);
  } catch (error: any) {
    console.error('Error fetching partner enquiries:', error);
    return res.json(mockStore.partnerEnquiries || []);
  }
});

/**
 * PATCH /api/partner-enquiries/:id
 * Admin protected endpoint to update partnership status and notes
 */
router.patch('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    await ensureDbInitialized().catch(() => {});

    if (isDbConnected()) {
      const result = await query(
        `UPDATE partner_enquiries
         SET status = COALESCE($1, status),
             notes = COALESCE($2, notes),
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [status, notes, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Partnership enquiry not found' });
      }
      return res.json({ success: true, enquiry: formatPartnerRow(result.rows[0]) });
    }

    const index = mockStore.partnerEnquiries.findIndex((e: any) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Partnership enquiry not found' });
    }

    mockStore.partnerEnquiries[index] = {
      ...mockStore.partnerEnquiries[index],
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date().toISOString()
    };

    return res.json({ success: true, enquiry: mockStore.partnerEnquiries[index] });
  } catch (error: any) {
    console.error(`Error updating partner enquiry ${id}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to update partner enquiry.' });
  }
});

/**
 * DELETE /api/partner-enquiries/:id
 * Admin protected endpoint to delete partner enquiry
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await ensureDbInitialized().catch(() => {});
    if (isDbConnected()) {
      await query('DELETE FROM partner_enquiries WHERE id = $1', [id]);
    } else {
      mockStore.partnerEnquiries = mockStore.partnerEnquiries.filter((e: any) => e.id !== id);
    }
    return res.json({ success: true, message: 'Partnership enquiry deleted.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete partner enquiry.' });
  }
});

export default router;
