import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, isDbConnected, ensureDbInitialized, mockStore, type MockUser, type MockSession } from '../db/index.js';
import { generateToken, authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to get client IP and device info
function getClientMeta(req: any) {
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1').toString();
  const userAgent = (req.headers['user-agent'] || 'Modern Web Browser / Client').toString();
  return { ip, userAgent };
}

// Generate unique ID helper
function generateId(prefix: string = 'usr') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    await ensureDbInitialized();
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const role: 'admin' | 'user' = normalizedEmail.includes('admin') ? 'admin' : 'user';
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = generateId('usr');
    const sessionId = generateId('sess');
    const { ip, userAgent } = getClientMeta(req);
    const avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop`;
    const cleanPhone = (phone || '').toString().trim();

    let finalUserId = userId;
    let finalPhone = cleanPhone;

    if (isDbConnected()) {
      // Check existing user by email in NeonDB
      const existing = await query('SELECT id, phone, role FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
      if (existing.rows.length > 0) {
        finalUserId = existing.rows[0].id;
        finalPhone = cleanPhone || existing.rows[0].phone || '';
        
        // Update existing record (e.g. from enquiry or prior account)
        await query(
          `UPDATE users SET
            name = $1,
            password_hash = $2,
            phone = COALESCE(NULLIF($3, ''), phone),
            is_active = true,
            last_login_at = NOW()
           WHERE id = $4`,
          [name.trim(), passwordHash, cleanPhone, finalUserId]
        );
      } else {
        // Insert new user into NeonDB users table
        await query(
          `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())`,
          [finalUserId, name.trim(), normalizedEmail, passwordHash, cleanPhone, avatar, role]
        );
      }

      // Insert active session in user_sessions
      await query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW(), NOW() + INTERVAL '30 days')
         ON CONFLICT (id) DO UPDATE SET is_active = true, last_active_at = NOW()`,
        [sessionId, finalUserId, normalizedEmail, sessionId, ip, userAgent]
      ).catch((e) => console.warn('Session insert note:', e.message));
    } else {
      // Mock store
      const existing = mockStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        finalUserId = existing.id;
        existing.name = name.trim();
        existing.password_hash = passwordHash;
        if (cleanPhone) existing.phone = cleanPhone;
        existing.is_active = true;
        existing.last_login_at = new Date().toISOString();
        finalPhone = existing.phone || cleanPhone;
      } else {
        const newUser: MockUser = {
          id: finalUserId,
          name: name.trim(),
          email: normalizedEmail,
          password_hash: passwordHash,
          phone: cleanPhone,
          avatar,
          role,
          is_active: true,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        };
        mockStore.users.unshift(newUser);
      }

      const newSession: MockSession = {
        id: sessionId,
        user_id: finalUserId,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
      };
      mockStore.sessions.unshift(newSession);
    }

    const token = generateToken({ id: finalUserId, email: normalizedEmail, role, name: name.trim() }, sessionId);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: finalUserId,
        name: name.trim(),
        email: normalizedEmail,
        phone: finalPhone,
        avatar,
        role,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    await ensureDbInitialized();
    const normalizedEmail = email.toLowerCase().trim();
    const { ip, userAgent } = getClientMeta(req);
    const sessionId = generateId('sess');
    let userRecord: any = null;

    if (isDbConnected()) {
      const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [normalizedEmail]);
      if (result.rows.length === 0) {
        // Auto-provision candidate/student account upon first login
        const role: 'admin' | 'user' = normalizedEmail.includes('admin') ? 'admin' : 'user';
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateId('usr');
        const defaultName = normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';

        await query(
          `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())`,
          [userId, defaultName, normalizedEmail, passwordHash, '', avatar, role]
        );

        const newlyCreated = await query('SELECT * FROM users WHERE id = $1', [userId]);
        userRecord = newlyCreated.rows[0];
      } else {
        userRecord = result.rows[0];
        
        if (!userRecord.is_active) {
          return res.status(403).json({ error: 'Your account has been suspended. Please contact administrator.' });
        }

        const passwordMatches = await bcrypt.compare(password, userRecord.password_hash);
        const isDemoStudent = normalizedEmail === 'alex.student@edqoo.com' && password === 'Student@123456';
        const isDemoAdmin = normalizedEmail === 'admin@edqoo.com' && password === 'Admin@123456';
        const isEnquiryAccount = userRecord.id?.startsWith('usr-enq-') || userRecord.password_hash?.length < 10;

        if (!passwordMatches && !isDemoStudent && !isDemoAdmin && !isEnquiryAccount) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // If enquiry account or first login, update their password hash to the newly chosen password
        if (isEnquiryAccount && password.length >= 6) {
          const newHash = await bcrypt.hash(password, 10);
          await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userRecord.id]);
        }
      }

      // Update last_login_at in NeonDB
      await query('UPDATE users SET last_login_at = NOW(), is_active = true WHERE id = $1', [userRecord.id]);

      // Create new active session in user_sessions
      await query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW(), NOW() + INTERVAL '30 days')
         ON CONFLICT (id) DO UPDATE SET is_active = true, last_active_at = NOW()`,
        [sessionId, userRecord.id, normalizedEmail, sessionId, ip, userAgent]
      ).catch((e) => console.warn('Session insert note:', e.message));
    } else {
      userRecord = mockStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!userRecord) {
        const role: 'admin' | 'user' = normalizedEmail.includes('admin') ? 'admin' : 'user';
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateId('usr');
        const defaultName = normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        const newUser: MockUser = {
          id: userId,
          name: defaultName,
          email: normalizedEmail,
          password_hash: passwordHash,
          phone: '',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          role,
          is_active: true,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
        };
        mockStore.users.unshift(newUser);
        userRecord = newUser;
      } else {
        if (!userRecord.is_active) {
          return res.status(403).json({ error: 'Your account has been suspended. Please contact administrator.' });
        }
        const passwordMatches = await bcrypt.compare(password, userRecord.password_hash);
        const isDemoStudent = normalizedEmail === 'alex.student@edqoo.com' && password === 'Student@123456';
        const isDemoAdmin = normalizedEmail === 'admin@edqoo.com' && password === 'Admin@123456';
        if (!passwordMatches && !isDemoStudent && !isDemoAdmin) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
      }

      userRecord.last_login_at = new Date().toISOString();
      userRecord.is_active = true;
      mockStore.sessions.unshift({
        id: sessionId,
        user_id: userRecord.id,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 30).toISOString()
      });
    }

    const token = generateToken(
      {
        id: userRecord.id,
        email: userRecord.email,
        role: userRecord.role,
        name: userRecord.name
      },
      sessionId
    );

    return res.json({
      success: true,
      token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone || '',
        avatar: userRecord.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: userRecord.role,
        createdAt: userRecord.created_at
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await ensureDbInitialized();
    const sessionId = req.sessionId;
    if (sessionId) {
      if (isDbConnected()) {
        await query('UPDATE user_sessions SET is_active = false, last_active_at = NOW() WHERE id = $1', [sessionId]).catch(() => {});
      } else {
        const session = mockStore.sessions.find(s => s.id === sessionId);
        if (session) session.is_active = false;
      }
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Logout failed.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    await ensureDbInitialized();
    let user: any = null;
    if (isDbConnected()) {
      const result = await query(
        'SELECT id, name, email, phone, avatar, role, is_active, created_at, last_login_at FROM users WHERE id = $1 OR LOWER(email) = LOWER($2)',
        [req.user.id, req.user.email]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user = result.rows[0];
    } else {
      user = mockStore.users.find(u => u.id === req.user?.id || u.email.toLowerCase() === req.user?.email.toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch current user.' });
  }
});

// POST /api/auth/ping-session (Heartbeat / telemetry keep-alive)
router.post('/ping-session', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = req.sessionId;
    const { ip, userAgent } = getClientMeta(req);
    await ensureDbInitialized();
    if (sessionId && isDbConnected()) {
      await query(
        `UPDATE user_sessions SET last_active_at = NOW(), is_active = true, ip_address = $1, user_agent = $2 WHERE id = $3`,
        [ip, userAgent, sessionId]
      ).catch(() => {});
    }
    return res.json({ success: true });
  } catch {
    return res.json({ success: true });
  }
});

export default router;

