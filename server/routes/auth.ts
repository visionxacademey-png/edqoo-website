import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, isDbConnected, ensureDbInitialized, mockStore, type MockUser, type MockSession } from '../db/index.js';
import { generateToken, authenticateToken, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Helper to get client IP and parse complete device information
function parseDeviceInfo(bodyDeviceInfo: any, req: any) {
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1').toString().split(',')[0].trim();
  const userAgent = (req.headers['user-agent'] || 'Modern Web Browser / Client').toString();

  const d = bodyDeviceInfo || {};
  
  let deviceType = d.deviceType;
  let os = d.os;
  let osVersion = d.osVersion || '';
  let browser = d.browser;
  let browserVersion = d.browserVersion || '';
  let deviceModel = d.deviceModel || '';
  let screenResolution = d.screenResolution || '1920 × 1080 (1.25x DPR)';
  let language = d.language || (req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en-US');
  let timezone = d.timezone || 'Asia/Kolkata (UTC+05:30)';
  let deviceId = d.deviceId || `dev-${Math.random().toString(36).substring(2, 9)}`;
  let fingerprint = d.fingerprint || `fp-${Math.random().toString(36).substring(2, 10)}`;

  // Heuristic fallbacks from User-Agent if not sent by client
  if (!os) {
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';
    else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'macOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else os = 'Unknown OS';
  }

  if (!deviceType) {
    if (/iPad|Tablet/i.test(userAgent)) deviceType = 'Tablet';
    else if (/Mobile|Android|iPhone/i.test(userAgent)) deviceType = 'Mobile';
    else if (os === 'macOS' || /Windows/i.test(userAgent)) deviceType = 'Laptop';
    else deviceType = 'Desktop';
  }

  if (!browser) {
    if (/Edg/i.test(userAgent)) browser = 'Microsoft Edge';
    else if (/Chrome/i.test(userAgent)) browser = 'Google Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Mozilla Firefox';
    else if (/Safari/i.test(userAgent)) browser = 'Apple Safari';
    else browser = 'Web Browser';
  }

  const completeDeviceInfo = {
    deviceId,
    deviceType,
    os,
    osVersion,
    browser,
    browserVersion,
    deviceModel,
    screenResolution,
    language,
    timezone,
    fingerprint,
    platform: d.platform || os
  };

  return {
    ip,
    userAgent,
    deviceId,
    deviceType,
    os,
    osVersion,
    browser,
    browserVersion,
    deviceModel,
    screenResolution,
    language,
    timezone,
    fingerprint,
    deviceInfo: completeDeviceInfo
  };
}

// Generate unique ID helper
function generateId(prefix: string = 'usr') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    await ensureDbInitialized();
    const { name, email, phone, password, deviceInfo: rawDeviceInfo } = req.body;

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
    const meta = parseDeviceInfo(rawDeviceInfo, req);
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
        
        // Update existing record with device metadata
        await query(
          `UPDATE users SET
            name = $1,
            password_hash = $2,
            phone = COALESCE(NULLIF($3, ''), phone),
            device_info = $4,
            last_ip = $5,
            last_device_id = $6,
            last_device_type = $7,
            last_os = $8,
            last_browser = $9,
            last_timezone = $10,
            is_active = true,
            last_login_at = NOW()
           WHERE id = $11`,
          [
            name.trim(),
            passwordHash,
            cleanPhone,
            JSON.stringify(meta.deviceInfo),
            meta.ip,
            meta.deviceId,
            meta.deviceType,
            meta.os,
            meta.browser,
            meta.timezone,
            finalUserId
          ]
        );
      } else {
        // Insert new user into NeonDB users table with device info
        await query(
          `INSERT INTO users (
            id, name, email, password_hash, phone, avatar, role,
            device_info, last_ip, last_device_id, last_device_type, last_os, last_browser, last_timezone,
            is_active, created_at, last_login_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, NOW(), NOW())`,
          [
            finalUserId,
            name.trim(),
            normalizedEmail,
            passwordHash,
            cleanPhone,
            avatar,
            role,
            JSON.stringify(meta.deviceInfo),
            meta.ip,
            meta.deviceId,
            meta.deviceType,
            meta.os,
            meta.browser,
            meta.timezone
          ]
        );
      }

      // Insert active session in user_sessions with device attributes
      await query(
        `INSERT INTO user_sessions (
          id, user_id, email, token_hash, ip_address, user_agent,
          device_id, device_type, os, os_version, browser, browser_version, device_model,
          screen_resolution, language, timezone, fingerprint, device_info,
          is_active, created_at, last_active_at, expires_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18,
          true, NOW(), NOW(), NOW() + INTERVAL '30 days'
        )
        ON CONFLICT (id) DO UPDATE SET is_active = true, last_active_at = NOW()`,
        [
          sessionId,
          finalUserId,
          normalizedEmail,
          sessionId,
          meta.ip,
          meta.userAgent,
          meta.deviceId,
          meta.deviceType,
          meta.os,
          meta.osVersion,
          meta.browser,
          meta.browserVersion,
          meta.deviceModel,
          meta.screenResolution,
          meta.language,
          meta.timezone,
          meta.fingerprint,
          JSON.stringify(meta.deviceInfo)
        ]
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
        existing.device_info = meta.deviceInfo;
        existing.last_ip = meta.ip;
        existing.last_device_id = meta.deviceId;
        existing.last_device_type = meta.deviceType;
        existing.last_os = meta.os;
        existing.last_browser = meta.browser;
        existing.last_timezone = meta.timezone;
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
          last_login_at: new Date().toISOString(),
          device_info: meta.deviceInfo,
          last_ip: meta.ip,
          last_device_id: meta.deviceId,
          last_device_type: meta.deviceType,
          last_os: meta.os,
          last_browser: meta.browser,
          last_timezone: meta.timezone
        };
        mockStore.users.unshift(newUser);
      }

      const newSession: MockSession = {
        id: sessionId,
        user_id: finalUserId,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: meta.ip,
        user_agent: meta.userAgent,
        device_id: meta.deviceId,
        device_type: meta.deviceType,
        os: meta.os,
        os_version: meta.osVersion,
        browser: meta.browser,
        browser_version: meta.browserVersion,
        device_model: meta.deviceModel,
        screen_resolution: meta.screenResolution,
        language: meta.language,
        timezone: meta.timezone,
        fingerprint: meta.fingerprint,
        device_info: meta.deviceInfo,
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
        deviceInfo: meta.deviceInfo,
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
    const { email, password, deviceInfo: rawDeviceInfo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    await ensureDbInitialized();
    const normalizedEmail = email.toLowerCase().trim();
    const meta = parseDeviceInfo(rawDeviceInfo, req);
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
          `INSERT INTO users (
            id, name, email, password_hash, phone, avatar, role,
            device_info, last_ip, last_device_id, last_device_type, last_os, last_browser, last_timezone,
            is_active, created_at, last_login_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, NOW(), NOW())`,
          [
            userId,
            defaultName,
            normalizedEmail,
            passwordHash,
            '',
            avatar,
            role,
            JSON.stringify(meta.deviceInfo),
            meta.ip,
            meta.deviceId,
            meta.deviceType,
            meta.os,
            meta.browser,
            meta.timezone
          ]
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
        const isEnquiryAccount = userRecord.id?.startsWith('usr-enq-') || (userRecord.password_hash && userRecord.password_hash.length < 10);

        if (!passwordMatches && !isDemoStudent && !isDemoAdmin && !isEnquiryAccount) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // If enquiry account or first login, update their password hash to the newly chosen password
        if (isEnquiryAccount && password.length >= 6) {
          const newHash = await bcrypt.hash(password, 10);
          await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userRecord.id]);
        }
      }

      // Update last_login_at and device telemetry in NeonDB
      await query(
        `UPDATE users SET
          last_login_at = NOW(),
          is_active = true,
          device_info = $1,
          last_ip = $2,
          last_device_id = $3,
          last_device_type = $4,
          last_os = $5,
          last_browser = $6,
          last_timezone = $7
         WHERE id = $8`,
        [
          JSON.stringify(meta.deviceInfo),
          meta.ip,
          meta.deviceId,
          meta.deviceType,
          meta.os,
          meta.browser,
          meta.timezone,
          userRecord.id
        ]
      );

      // Create new active session in user_sessions with device telemetry
      await query(
        `INSERT INTO user_sessions (
          id, user_id, email, token_hash, ip_address, user_agent,
          device_id, device_type, os, os_version, browser, browser_version, device_model,
          screen_resolution, language, timezone, fingerprint, device_info,
          is_active, created_at, last_active_at, expires_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18,
          true, NOW(), NOW(), NOW() + INTERVAL '30 days'
        )
        ON CONFLICT (id) DO UPDATE SET is_active = true, last_active_at = NOW()`,
        [
          sessionId,
          userRecord.id,
          normalizedEmail,
          sessionId,
          meta.ip,
          meta.userAgent,
          meta.deviceId,
          meta.deviceType,
          meta.os,
          meta.osVersion,
          meta.browser,
          meta.browserVersion,
          meta.deviceModel,
          meta.screenResolution,
          meta.language,
          meta.timezone,
          meta.fingerprint,
          JSON.stringify(meta.deviceInfo)
        ]
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
          last_login_at: new Date().toISOString(),
          device_info: meta.deviceInfo,
          last_ip: meta.ip,
          last_device_id: meta.deviceId,
          last_device_type: meta.deviceType,
          last_os: meta.os,
          last_browser: meta.browser,
          last_timezone: meta.timezone
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
      userRecord.device_info = meta.deviceInfo;
      userRecord.last_ip = meta.ip;
      userRecord.last_device_id = meta.deviceId;
      userRecord.last_device_type = meta.deviceType;
      userRecord.last_os = meta.os;
      userRecord.last_browser = meta.browser;
      userRecord.last_timezone = meta.timezone;

      mockStore.sessions.unshift({
        id: sessionId,
        user_id: userRecord.id,
        email: normalizedEmail,
        token_hash: sessionId,
        ip_address: meta.ip,
        user_agent: meta.userAgent,
        device_id: meta.deviceId,
        device_type: meta.deviceType,
        os: meta.os,
        os_version: meta.osVersion,
        browser: meta.browser,
        browser_version: meta.browserVersion,
        device_model: meta.deviceModel,
        screen_resolution: meta.screenResolution,
        language: meta.language,
        timezone: meta.timezone,
        fingerprint: meta.fingerprint,
        device_info: meta.deviceInfo,
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
        deviceInfo: meta.deviceInfo,
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
        'SELECT id, name, email, phone, avatar, role, is_active, created_at, last_login_at, device_info, last_ip, last_device_id, last_device_type, last_os, last_browser, last_timezone FROM users WHERE id = $1 OR LOWER(email) = LOWER($2)',
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

    const parsedDeviceInfo = typeof user.device_info === 'string'
      ? (user.device_info.startsWith('{') ? JSON.parse(user.device_info) : undefined)
      : user.device_info;

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
      deviceInfo: parsedDeviceInfo,
      lastIp: user.last_ip,
      lastDeviceId: user.last_device_id,
      lastDeviceType: user.last_device_type,
      lastOs: user.last_os,
      lastBrowser: user.last_browser,
      lastTimezone: user.last_timezone
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch current user.' });
  }
});

// POST /api/auth/ping-session (Heartbeat / telemetry keep-alive)
router.post('/ping-session', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = req.sessionId;
    const meta = parseDeviceInfo(req.body?.deviceInfo, req);
    await ensureDbInitialized();
    if (sessionId && isDbConnected()) {
      await query(
        `UPDATE user_sessions SET
          last_active_at = NOW(),
          is_active = true,
          ip_address = $1,
          user_agent = $2,
          device_id = COALESCE($3, device_id),
          device_type = COALESCE($4, device_type),
          os = COALESCE($5, os),
          screen_resolution = COALESCE($6, screen_resolution),
          timezone = COALESCE($7, timezone),
          fingerprint = COALESCE($8, fingerprint),
          device_info = COALESCE($9, device_info)
         WHERE id = $10`,
        [
          meta.ip,
          meta.userAgent,
          meta.deviceId,
          meta.deviceType,
          meta.os,
          meta.screenResolution,
          meta.timezone,
          meta.fingerprint,
          JSON.stringify(meta.deviceInfo),
          sessionId
        ]
      ).catch(() => {});
    }
    return res.json({ success: true });
  } catch {
    return res.json({ success: true });
  }
});

export default router;

