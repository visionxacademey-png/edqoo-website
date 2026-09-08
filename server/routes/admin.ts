import { Router, Response } from 'express';
import { query, isNeonConnected, mockStore, getDbStatus } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply security middlewares: All admin routes require valid JWT AND admin role!
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/db-status
router.get('/db-status', async (_req, res) => {
  return res.json(getDbStatus());
});

// GET /api/admin/stats
router.get('/stats', async (_req, res) => {
  try {
    if (isNeonConnected) {
      const usersRes = await query('SELECT COUNT(*) FROM users');
      const activeSessionsRes = await query('SELECT COUNT(*) FROM user_sessions WHERE is_active = true');
      const coursesRes = await query('SELECT COUNT(*) FROM courses');
      const enquiriesRes = await query('SELECT COUNT(*) FROM enquiries');
      const adminsRes = await query("SELECT COUNT(*) FROM users WHERE role = 'admin'");

      return res.json({
        totalUsers: parseInt(usersRes.rows[0].count, 10),
        activeSessions: parseInt(activeSessionsRes.rows[0].count, 10),
        totalCourses: parseInt(coursesRes.rows[0].count, 10),
        totalEnquiries: parseInt(enquiriesRes.rows[0].count, 10),
        adminCount: parseInt(adminsRes.rows[0].count, 10),
        dbType: 'neondb_postgresql'
      });
    } else {
      const totalUsers = mockStore.users.length;
      const activeSessions = mockStore.sessions.filter(s => s.is_active).length;
      const totalCourses = mockStore.courses.length;
      const totalEnquiries = mockStore.enquiries.length;
      const adminCount = mockStore.users.filter(u => u.role === 'admin').length;

      return res.json({
        totalUsers,
        activeSessions,
        totalCourses,
        totalEnquiries,
        adminCount,
        dbType: 'in_memory_fallback'
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch admin statistics.' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const searchTerm = (req.query.search as string || '').toLowerCase().trim();
    const roleFilter = (req.query.role as string || 'all').toLowerCase();

    if (isNeonConnected) {
      let sql = `
        SELECT u.id, u.name, u.email, u.phone, u.avatar, u.role, u.is_active, u.created_at, u.last_login_at,
               COUNT(s.id) FILTER (WHERE s.is_active = true) as active_sessions_count
        FROM users u
        LEFT JOIN user_sessions s ON u.id = s.user_id
      `;
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (roleFilter !== 'all') {
        params.push(roleFilter);
        whereClauses.push(`u.role = $${params.length}`);
      }

      if (searchTerm) {
        params.push(`%${searchTerm}%`);
        whereClauses.push(`(LOWER(u.name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length} OR u.phone LIKE $${params.length})`);
      }

      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      sql += ` GROUP BY u.id ORDER BY u.created_at DESC`;

      const result = await query(sql, params);
      const formatted = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        avatar: row.avatar,
        role: row.role,
        isActive: row.is_active,
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
        activeSessionsCount: parseInt(row.active_sessions_count || '0', 10)
      }));

      return res.json(formatted);
    } else {
      let filtered = mockStore.users.filter(u => {
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const matchesSearch = !searchTerm ||
          u.name.toLowerCase().includes(searchTerm) ||
          u.email.toLowerCase().includes(searchTerm) ||
          (u.phone && u.phone.includes(searchTerm));
        return matchesRole && matchesSearch;
      });

      const formatted = filtered.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        role: u.role,
        isActive: u.is_active,
        createdAt: u.created_at,
        lastLoginAt: u.last_login_at,
        activeSessionsCount: mockStore.sessions.filter(s => s.user_id === u.id && s.is_active).length
      }));

      return res.json(formatted);
    }
  } catch (err: any) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch users.' });
  }
});

// GET /api/admin/sessions - See Logged In Users & Active Sessions
router.get('/sessions', async (_req, res) => {
  try {
    if (isNeonConnected) {
      const sql = `
        SELECT s.id, s.user_id, s.email, s.ip_address, s.user_agent, s.is_active,
               s.created_at, s.last_active_at, s.expires_at,
               u.name as user_name, u.role as user_role, u.avatar as user_avatar
        FROM user_sessions s
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY s.last_active_at DESC
        LIMIT 100
      `;
      const result = await query(sql);
      const formatted = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        userName: row.user_name || row.email.split('@')[0],
        email: row.email,
        userRole: row.user_role || 'user',
        avatar: row.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        ipAddress: row.ip_address || '127.0.0.1',
        userAgent: row.user_agent || 'Unknown Client',
        isActive: row.is_active,
        createdAt: row.created_at,
        lastActiveAt: row.last_active_at,
        expiresAt: row.expires_at
      }));

      return res.json(formatted);
    } else {
      const formatted = mockStore.sessions.map(s => {
        const u = mockStore.users.find(usr => usr.id === s.user_id || usr.email === s.email);
        return {
          id: s.id,
          userId: s.user_id,
          userName: u ? u.name : s.email.split('@')[0],
          email: s.email,
          userRole: u ? u.role : 'user',
          avatar: u?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          ipAddress: s.ip_address,
          userAgent: s.user_agent,
          isActive: s.is_active,
          createdAt: s.created_at,
          lastActiveAt: s.last_active_at,
          expiresAt: s.expires_at
        };
      }).sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());

      return res.json(formatted);
    }
  } catch (err: any) {
    console.error('Error fetching sessions:', err);
    return res.status(500).json({ error: err.message || 'Failed to fetch sessions.' });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Valid role (admin or user) is required.' });
    }

    // Protect self-demotion if current user is demoting themselves
    if (req.user?.id === id && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own administrator privileges.' });
    }

    if (isNeonConnected) {
      const result = await query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
        [role, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.json({ success: true, user: result.rows[0] });
    } else {
      const user = mockStore.users.find(u => u.id === id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user.role = role;
      return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update user role.' });
  }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean.' });
    }

    if (req.user?.id === id && !isActive) {
      return res.status(400).json({ error: 'You cannot deactivate your own account.' });
    }

    if (isNeonConnected) {
      const result = await query(
        'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, email, is_active',
        [isActive, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // If deactivated, revoke all their active sessions
      if (!isActive) {
        await query('UPDATE user_sessions SET is_active = false WHERE user_id = $1', [id]);
      }

      return res.json({ success: true, user: result.rows[0] });
    } else {
      const user = mockStore.users.find(u => u.id === id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user.is_active = isActive;
      if (!isActive) {
        mockStore.sessions.forEach(s => {
          if (s.user_id === id) s.is_active = false;
        });
      }
      return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, isActive: user.is_active } });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update user status.' });
  }
});

// DELETE /api/admin/sessions/:id - Terminate / Revoke Active Session
router.delete('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNeonConnected) {
      const result = await query(
        'UPDATE user_sessions SET is_active = false WHERE id = $1 RETURNING id',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Session not found.' });
      }
      return res.json({ success: true, message: 'Session revoked successfully.' });
    } else {
      const session = mockStore.sessions.find(s => s.id === id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found.' });
      }
      session.is_active = false;
      return res.json({ success: true, message: 'Session revoked successfully.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to revoke session.' });
  }
});

export default router;
