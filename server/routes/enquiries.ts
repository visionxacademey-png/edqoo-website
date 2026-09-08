import { Router } from 'express';
import { query, isNeonConnected, mockStore } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import type { Enquiry } from '../../src/types';

const router = Router();

// POST /api/enquiries - Public / Authenticated submit enquiry
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      program,
      experienceLevel,
      learningMode,
      location,
      preferredContactMethod,
      preferredCallbackTime,
      message
    } = req.body;

    if (!name || !email || !phone || !program) {
      return res.status(400).json({ error: 'Name, email, phone, and program are required.' });
    }

    const id = `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newEnquiry: Enquiry = {
      id,
      userId: userId || undefined,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      program,
      experienceLevel: experienceLevel || 'Beginner',
      learningMode: learningMode || 'Online Live',
      location: location || '',
      preferredContactMethod: preferredContactMethod || 'WhatsApp',
      preferredCallbackTime: preferredCallbackTime || 'Flexible',
      message: message || '',
      status: 'Submitted',
      notes: '',
      submittedAt: new Date().toISOString()
    };

    if (isNeonConnected) {
      await query(
        `INSERT INTO enquiries (
          id, user_id, name, email, phone, program, experience_level,
          learning_mode, location, preferred_contact_method, preferred_callback_time,
          message, status, notes, submitted_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())`,
        [
          newEnquiry.id,
          newEnquiry.userId || null,
          newEnquiry.name,
          newEnquiry.email,
          newEnquiry.phone,
          newEnquiry.program,
          newEnquiry.experienceLevel,
          newEnquiry.learningMode,
          newEnquiry.location,
          newEnquiry.preferredContactMethod,
          newEnquiry.preferredCallbackTime,
          newEnquiry.message,
          newEnquiry.status,
          newEnquiry.notes
        ]
      );
    } else {
      mockStore.enquiries.unshift(newEnquiry);
    }

    return res.status(201).json({ success: true, enquiry: newEnquiry });
  } catch (err: any) {
    console.error('Error submitting enquiry:', err);
    return res.status(500).json({ error: err.message || 'Failed to submit enquiry.' });
  }
});

// GET /api/enquiries - Admin: fetch all leads
router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    if (isNeonConnected) {
      const result = await query('SELECT * FROM enquiries ORDER BY submitted_at DESC');
      const formatted: Enquiry[] = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        program: row.program,
        experienceLevel: row.experience_level,
        learningMode: row.learning_mode,
        location: row.location,
        preferredContactMethod: row.preferred_contact_method,
        preferredCallbackTime: row.preferred_callback_time,
        message: row.message,
        status: row.status,
        notes: row.notes,
        lastContactedDate: row.last_contacted_date,
        submittedAt: row.submitted_at,
        updatedAt: row.updated_at
      }));
      return res.json(formatted);
    } else {
      return res.json(mockStore.enquiries);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch enquiries.' });
  }
});

// PUT /api/enquiries/:id - Admin: update enquiry status & notes
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, lastContactedDate } = req.body;

    if (isNeonConnected) {
      const result = await query(
        `UPDATE enquiries SET
          status = COALESCE($1, status),
          notes = COALESCE($2, notes),
          last_contacted_date = COALESCE($3, last_contacted_date),
          updated_at = NOW()
        WHERE id = $4
        RETURNING *`,
        [status, notes, lastContactedDate, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const row = result.rows[0];
      const updated: Enquiry = {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        program: row.program,
        experienceLevel: row.experience_level,
        learningMode: row.learning_mode,
        location: row.location,
        preferredContactMethod: row.preferred_contact_method,
        preferredCallbackTime: row.preferred_callback_time,
        message: row.message,
        status: row.status,
        notes: row.notes,
        lastContactedDate: row.last_contacted_date,
        submittedAt: row.submitted_at,
        updatedAt: row.updated_at
      };

      return res.json({ success: true, enquiry: updated });
    } else {
      const idx = mockStore.enquiries.findIndex(e => e.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      const existing = mockStore.enquiries[idx];
      const updated = {
        ...existing,
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        lastContactedDate: lastContactedDate || existing.lastContactedDate,
        updatedAt: new Date().toISOString()
      };
      mockStore.enquiries[idx] = updated;

      return res.json({ success: true, enquiry: updated });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update enquiry.' });
  }
});

export default router;
