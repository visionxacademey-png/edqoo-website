import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'crypto';
import { query, isNeonConnected, mockStore, MockUser, MockSession } from '../db';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to get client IP and device info
function getClientMeta(req: any) {
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1').toString();
  const userAgent = (req.headers['user-agent'] || 'Unknown Browser / Device').toString();
  return { ip, userAgent };
}

// Generate unique ID helper
function generateId(prefix: string = 'usr') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
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

    if (isNeonConnected) {
      // Check existing email
      const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      // Insert User
      await query(
        `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [userId, name.trim(), normalizedEmail, passwordHash, phone || '', avatar, role, true]
      );

      // Insert Session
      await query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW() + INTERVAL '7 days')`,
        [sessionId, userId, normalizedEmail, sessionId, ip, userAgent, true]
      );
    } else {
      // Mock store
      const existing = mockStore.users.find(u => u.email === normalizedEmail);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const newUser: MockUser = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        phone: phone || '',
        avatar,
        role,
        is_active: true,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      };
      mockStore.users.push(newUser);

      const newSession: MockSession = {
        id: sessionId,
        user_id: userId,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 7).toISOString()
      };
      mockStore.sessions.push(newSession);
    }

    const token = generateToken({ id: userId, email: normalizedEmail, role, name }, sessionId);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone || '',
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

    const normalizedEmail = email.toLowerCase().trim();
    let userRecord: any = null;

    if (isNeonConnected) {
      const result = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      userRecord = result.rows[0];
    } else {
      userRecord = mockStore.users.find(u => u.email === normalizedEmail);
      if (!userRecord) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    }

    if (!userRecord.is_active) {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact administrator.' });
    }

    const passwordMatches = await bcrypt.compare(password, userRecord.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const sessionId = generateId('sess');
    const { ip, userAgent } = getClientMeta(req);

    if (isNeonConnected) {
      // Update last_login_at
      await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userRecord.id]);

      // Create new active session record
      await query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW() + INTERVAL '7 days')`,
        [sessionId, userRecord.id, normalizedEmail, sessionId, ip, userAgent, true]
      );
    } else {
      userRecord.last_login_at = new Date().toISOString();
      mockStore.sessions.push({
        id: sessionId,
        user_id: userRecord.id,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        created_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000 * 7).toISOString()
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
    const sessionId = req.sessionId;
    if (sessionId) {
      if (isNeonConnected) {
        await query('UPDATE user_sessions SET is_active = false WHERE id = $1', [sessionId]);
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

    let user: any = null;
    if (isNeonConnected) {
      const result = await query(
        'SELECT id, name, email, phone, avatar, role, is_active, created_at, last_login_at FROM users WHERE id = $1',
        [req.user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user = result.rows[0];
    } else {
      user = mockStore.users.find(u => u.id === req.user?.id);
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

export default router;
