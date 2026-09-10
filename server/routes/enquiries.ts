import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, isNeonConnected, mockStore, type MockUser } from '../db/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import type { Enquiry } from '../../src/types/index.js';

const router = Router();

// Helper to get client IP and device info
function getClientMeta(req: any) {
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1').toString();
  const userAgent = (req.headers['user-agent'] || 'Unknown Browser / Device').toString();
  return { ip, userAgent };
}

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

    const normalizedEmail = email.trim().toLowerCase();
    const id = `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const { ip, userAgent } = getClientMeta(req);
    const sessionId = `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    let assignedUserId = userId || `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newEnquiry: Enquiry = {
      id,
      userId: assignedUserId,
      name: name.trim(),
      email: normalizedEmail,
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
      // 1. Check if user already exists
      const userRes = await query('SELECT id, phone FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
      if (userRes.rows.length === 0) {
        // Insert candidate as user in users table
        const defaultHash = await bcrypt.hash('Student@123456', 10);
        const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';
        await query(
          `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
           ON CONFLICT (email) DO UPDATE SET phone = EXCLUDED.phone, name = EXCLUDED.name, last_login_at = NOW()`,
          [assignedUserId, name.trim(), normalizedEmail, defaultHash, phone.trim(), avatar, 'user']
        );
      } else {
        assignedUserId = userRes.rows[0].id;
        newEnquiry.userId = assignedUserId;
        await query('UPDATE users SET last_login_at = NOW(), phone = COALESCE(NULLIF($1, \'\'), phone), name = COALESCE(NULLIF($2, \'\'), name) WHERE id = $3', [phone.trim(), name.trim(), assignedUserId]);
      }

      // 2. Insert Session in user_sessions
      await query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW(), NOW() + INTERVAL '30 days')`,
        [sessionId, assignedUserId, normalizedEmail, sessionId, ip, userAgent]
      );

      // 3. Insert Enquiry
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
      // Mock Store
      const existingUser = mockStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!existingUser) {
        const defaultHash = await bcrypt.hash('Student@123456', 10);
        const newUser: MockUser = {
          id: assignedUserId,
          name: name.trim(),
          email: normalizedEmail,
          password_hash: defaultHash,
          phone: phone.trim(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          role: 'user',
          is_active: true,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        };
        mockStore.users.unshift(newUser);
      } else {
        existingUser.last_login_at = new Date().toISOString();
        if (phone) existingUser.phone = phone.trim();
        assignedUserId = existingUser.id;
        newEnquiry.userId = assignedUserId;
      }

      mockStore.sessions.unshift({
        id: sessionId,
        user_id: assignedUserId,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
      });

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
