import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isNeonConnected, query, mockStore } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'edqoo_super_secure_jwt_secret_key_2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  sessionId?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  sessionId?: string;
}

export function generateToken(payload: { id: string; email: string; role: 'admin' | 'user'; name: string }, sessionId: string) {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      sessionId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    
    // Validate session in DB / mock store
    if (decoded.sessionId) {
      if (isNeonConnected) {
        const sessionRes = await query('SELECT is_active FROM user_sessions WHERE id = $1', [decoded.sessionId]);
        if (sessionRes.rows.length === 0 || !sessionRes.rows[0].is_active) {
          return res.status(401).json({ error: 'Session has been revoked or expired.' });
        }
        // Update last_active_at timestamp
        await query('UPDATE user_sessions SET last_active_at = NOW() WHERE id = $1', [decoded.sessionId]);
      } else {
        const session = mockStore.sessions.find(s => s.id === decoded.sessionId);
        if (!session || !session.is_active) {
          return res.status(401).json({ error: 'Session has been revoked or expired.' });
        }
        session.last_active_at = new Date().toISOString();
      }
    }

    req.user = decoded;
    req.sessionId = decoded.sessionId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  next();
}
