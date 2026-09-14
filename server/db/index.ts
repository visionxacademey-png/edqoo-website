import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
import { courses as initialCourses } from '../../src/data/courses.js';

dotenv.config();

// Global Neon WebSocket configuration for Node.js
neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const DATABASE_URL = (rawDbUrl && rawDbUrl !== 'YOUR_NEON_DATABASE_URL_HERE') ? rawDbUrl : DEFAULT_NEON_URL;

let pool: Pool | null = null;
let isNeonConnected = false;
let connectionError: string | null = null;

// In-Memory Fallback Store for seamless local operation when DATABASE_URL is not set
export interface MockUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  device_info?: any;
  last_ip?: string;
  last_device_id?: string;
  last_device_type?: string;
  last_os?: string;
  last_browser?: string;
  last_timezone?: string;
}

export interface MockSession {
  id: string;
  user_id: string;
  email: string;
  token_hash: string;
  ip_address: string;
  user_agent: string;
  device_id?: string;
  device_type?: string;
  os?: string;
  os_version?: string;
  browser?: string;
  browser_version?: string;
  device_model?: string;
  screen_resolution?: string;
  language?: string;
  timezone?: string;
  fingerprint?: string;
  device_info?: any;
  is_active: boolean;
  created_at: string;
  last_active_at: string;
  expires_at: string;
}

export const mockStore = {
  users: [] as MockUser[],
  sessions: [] as MockSession[],
  courses: [...initialCourses],
  enquiries: [] as any[]
};

export function isDbConnected(): boolean {
  return isNeonConnected && pool !== null;
}

export const getDbStatus = () => ({
  connected: isNeonConnected && pool !== null,
  type: (isNeonConnected && pool !== null) ? 'neondatabase_postgresql' : 'in_memory_fallback',
  databaseUrlConfigured: !!DATABASE_URL && DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE',
  error: connectionError
});

let initPromise: Promise<void> | null = null;
let dbReady = false;

export function ensureDbInitialized() {
  if (dbReady && isNeonConnected && pool) {
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = initDb()
      .then(() => {
        dbReady = true;
      })
      .catch((err) => {
        console.error('Database initialization error:', err);
        initPromise = null;
      });
  }
  return initPromise;
}

// Eagerly trigger database initialization in background
if (DATABASE_URL && DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE') {
  ensureDbInitialized().catch(() => {});
}

/**
 * Initializes the Neon PostgreSQL pool and creates required tables
 */
export async function initDb() {
  if (dbReady && isNeonConnected) return;

  // Pre-seed mock store with default administrator
  const adminPasswordHash = '$2a$10$tZ8V4K9y6t4X0V1b8G4D4eYd0oV.5YtY3wN2qG6K8mP0uL2rS4t';
  const studentPasswordHash = '$2a$10$tZ8V4K9y6t4X0V1b8G4D4eYd0oV.5YtY3wN2qG6K8mP0uL2rS4t';

  if (mockStore.users.length === 0) {
    mockStore.users.push(
      {
        id: 'usr-admin-01',
        name: 'System Administrator',
        email: 'admin@edqoo.com',
        password_hash: adminPasswordHash,
        phone: '+91 90744 50935',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        last_ip: '127.0.0.1',
        last_device_id: 'dev-adm-win11-8f2e',
        last_device_type: 'Desktop',
        last_os: 'Windows',
        last_browser: 'Google Chrome',
        last_timezone: 'Asia/Kolkata (UTC+05:30)',
        device_info: {
          deviceId: 'dev-adm-win11-8f2e',
          deviceType: 'Desktop',
          os: 'Windows',
          osVersion: '11 Pro',
          browser: 'Google Chrome',
          browserVersion: '122.0.6261.129',
          deviceModel: 'Windows Workstation PC',
          screenResolution: '1920 × 1080 (1.25x DPR, 24-bit)',
          language: 'en-IN',
          timezone: 'Asia/Kolkata (UTC+05:30)',
          fingerprint: 'fp-8f2e91ca-1b4d'
        }
      },
      {
        id: 'usr-student-01',
        name: 'Alex Morgan',
        email: 'alex.student@edqoo.com',
        password_hash: studentPasswordHash,
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        role: 'user',
        is_active: true,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        last_login_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        last_ip: '103.212.144.52',
        last_device_id: 'dev-stu-macbook-3c9a',
        last_device_type: 'Laptop',
        last_os: 'macOS',
        last_browser: 'Apple Safari',
        last_timezone: 'Asia/Kolkata (UTC+05:30)',
        device_info: {
          deviceId: 'dev-stu-macbook-3c9a',
          deviceType: 'Laptop',
          os: 'macOS',
          osVersion: '14.4 (Sonoma)',
          browser: 'Apple Safari',
          browserVersion: '17.4',
          deviceModel: 'MacBook Pro 16"',
          screenResolution: '2560 × 1440 (2x Retina, 30-bit)',
          language: 'en-US',
          timezone: 'Asia/Kolkata (UTC+05:30)',
          fingerprint: 'fp-3c9a72df-8e10'
        }
      }
    );

    // Initial session for demonstration
    mockStore.sessions.push({
      id: 'sess-demo-01',
      user_id: 'usr-admin-01',
      email: 'admin@edqoo.com',
      token_hash: 'init_token_hash_admin',
      ip_address: '127.0.0.1 (Localhost)',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      device_id: 'dev-adm-win11-8f2e',
      device_type: 'Desktop',
      os: 'Windows',
      os_version: '11 Pro',
      browser: 'Google Chrome',
      browser_version: '122.0.6261.129',
      device_model: 'Windows Workstation PC',
      screen_resolution: '1920 × 1080 (1.25x DPR, 24-bit)',
      language: 'en-IN',
      timezone: 'Asia/Kolkata (UTC+05:30)',
      fingerprint: 'fp-8f2e91ca-1b4d',
      device_info: {
        deviceId: 'dev-adm-win11-8f2e',
        deviceType: 'Desktop',
        os: 'Windows',
        osVersion: '11 Pro',
        browser: 'Google Chrome',
        browserVersion: '122.0.6261.129',
        deviceModel: 'Windows Workstation PC',
        screenResolution: '1920 × 1080 (1.25x DPR, 24-bit)',
        language: 'en-IN',
        timezone: 'Asia/Kolkata (UTC+05:30)',
        fingerprint: 'fp-8f2e91ca-1b4d'
      },
      is_active: true,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 86400000 * 7).toISOString()
    });
  }

  if (!DATABASE_URL || DATABASE_URL === 'YOUR_NEON_DATABASE_URL_HERE') {
    console.log('⚡ [DB] DATABASE_URL not configured. Running in local memory fallback mode.');
    isNeonConnected = false;
    connectionError = 'DATABASE_URL environment variable is not configured.';
    dbReady = true;
    return;
  }

  try {
    if (!pool) {
      console.log('⚡ [DB] Connecting to NeonDB PostgreSQL...');
      pool = new Pool({
        connectionString: DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
      });
    }

    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    isNeonConnected = true;
    connectionError = null;
    dbReady = true;
    console.log(`✅ [DB] Successfully connected to NeonDB at ${testResult.rows[0].now}`);

    // Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        avatar TEXT,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        device_info JSONB DEFAULT '{}'::jsonb,
        last_ip VARCHAR(100),
        last_device_id VARCHAR(100),
        last_device_type VARCHAR(50),
        last_os VARCHAR(100),
        last_browser VARCHAR(100),
        last_timezone VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        token_hash VARCHAR(255),
        ip_address VARCHAR(100),
        user_agent TEXT,
        device_id VARCHAR(100),
        device_type VARCHAR(50),
        os VARCHAR(100),
        os_version VARCHAR(100),
        browser VARCHAR(100),
        browser_version VARCHAR(100),
        device_model VARCHAR(100),
        screen_resolution VARCHAR(100),
        language VARCHAR(50),
        timezone VARCHAR(100),
        fingerprint VARCHAR(100),
        device_info JSONB DEFAULT '{}'::jsonb,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        categories JSONB DEFAULT '[]'::jsonb,
        short_description TEXT,
        description TEXT,
        image TEXT,
        price NUMERIC DEFAULT 0,
        original_price NUMERIC DEFAULT 0,
        duration VARCHAR(100),
        live_hours VARCHAR(100),
        lessons INTEGER DEFAULT 0,
        level VARCHAR(100),
        rating NUMERIC DEFAULT 4.8,
        students INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'available',
        featured BOOLEAN DEFAULT false,
        skills JSONB DEFAULT '[]'::jsonb,
        curriculum JSONB DEFAULT '[]'::jsonb,
        modules JSONB DEFAULT '[]'::jsonb,
        technology_stack JSONB DEFAULT '[]'::jsonb,
        projects JSONB DEFAULT '[]'::jsonb,
        career_readiness JSONB DEFAULT '[]'::jsonb,
        outcome TEXT,
        features JSONB DEFAULT '[]'::jsonb,
        requirements JSONB DEFAULT '[]'::jsonb,
        who_is_it_for JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Safe column additions for existing tables
      ALTER TABLE users ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ip VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_device_id VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_device_type VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_os VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_browser VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_timezone VARCHAR(100);

      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_id VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_type VARCHAR(50);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS os VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS os_version VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS browser VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS browser_version VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_model VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS screen_resolution VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS language VARCHAR(50);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS timezone VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS fingerprint VARCHAR(100);
      ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}'::jsonb;

      ALTER TABLE courses ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS short_description TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS live_hours VARCHAR(100);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS technology_stack JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS career_readiness JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS outcome TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        program VARCHAR(255),
        course_id VARCHAR(100),
        category VARCHAR(100),
        source VARCHAR(100),
        lead_status VARCHAR(50) DEFAULT 'New',
        experience_level VARCHAR(100),
        learning_mode VARCHAR(100),
        location VARCHAR(100),
        preferred_contact_method VARCHAR(100),
        preferred_callback_time VARCHAR(100),
        message TEXT,
        status VARCHAR(100) DEFAULT 'Submitted',
        notes TEXT,
        gender VARCHAR(50),
        date_of_birth VARCHAR(50),
        country VARCHAR(100),
        pincode VARCHAR(50),
        state VARCHAR(100),
        city VARCHAR(100),
        profession VARCHAR(100),
        highest_qualification VARCHAR(100),
        year_of_graduation VARCHAR(50),
        apaar_abc_status VARCHAR(100),
        apaar_id VARCHAR(100),
        ktu_id VARCHAR(100),
        swayam_chapter VARCHAR(50),
        college_state VARCHAR(100),
        college_name VARCHAR(255),
        university_name VARCHAR(255),
        roll_number VARCHAR(100),
        highest_academic_level VARCHAR(100),
        academic_area VARCHAR(100),
        study_year VARCHAR(50),
        organization VARCHAR(255),
        designation VARCHAR(255),
        years_of_experience VARCHAR(100),
        department VARCHAR(255),
        details JSONB DEFAULT '{}'::jsonb,
        last_contacted_date TIMESTAMP WITH TIME ZONE,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS course_id VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS category VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS source VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS lead_status VARCHAR(50) DEFAULT 'New';
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS country VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS pincode VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS state VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS profession VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS highest_qualification VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS year_of_graduation VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS apaar_abc_status VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS apaar_id VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS ktu_id VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS swayam_chapter VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS college_state VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS college_name VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS university_name VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS roll_number VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS highest_academic_level VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS academic_area VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS study_year VARCHAR(50);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS organization VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS designation VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS years_of_experience VARCHAR(100);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS department VARCHAR(255);
      ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'::jsonb;
    `);

    console.log('✅ [DB] NeonDB tables verified / created successfully.');

    // Check and seed default accounts in NeonDB
    const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@edqoo.com']);
    if (adminCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          'usr-admin-01',
          'System Administrator',
          'admin@edqoo.com',
          adminPasswordHash,
          '+91 90744 50935',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
          'admin',
          true
        ]
      );
      console.log('👑 [DB] Seeded default administrator account: admin@edqoo.com / Admin@123456');
    }

    // Seed student users in NeonDB
    const studentCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['alex.student@edqoo.com']);
    if (studentCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '3 days', NOW() - INTERVAL '20 minutes'),
          ($9, $10, $11, $12, $13, $14, $15, $16, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours')`,
        [
          'usr-student-01',
          'Alex Morgan',
          'alex.student@edqoo.com',
          studentPasswordHash,
          '+91 98765 43210',
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
          'user',
          true,
          'usr-student-02',
          'Sarah Jenkins',
          'sarah.j@example.com',
          studentPasswordHash,
          '+91 90744 50935',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
          'user',
          true
        ]
      );
      console.log('🎓 [DB] Seeded demo student accounts into NeonDB');
    }

    // Seed initial active sessions in user_sessions if empty
    const sessionCount = await pool.query('SELECT COUNT(*) FROM user_sessions WHERE is_active = true');
    if (parseInt(sessionCount.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO user_sessions (id, user_id, email, token_hash, ip_address, user_agent, is_active, created_at, last_active_at, expires_at)
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 minutes', NOW() + INTERVAL '7 days'),
          ($8, $9, $10, $11, $12, $13, $14, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '20 minutes', NOW() + INTERVAL '7 days')`,
        [
          'sess-admin-live-01',
          'usr-admin-01',
          'admin@edqoo.com',
          'sess-admin-token-hash',
          '127.0.0.1 (Admin Console)',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
          true,
          'sess-student-live-02',
          'usr-student-01',
          'alex.student@edqoo.com',
          'sess-student-token-hash',
          '103.212.144.52 (Web Client)',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
          true
        ]
      );
      console.log('⚡ [DB] Seeded initial active telemetry sessions into NeonDB');
    }

    // Sync any enquired candidates into users table
    await pool.query(`
      INSERT INTO users (id, name, email, password_hash, phone, avatar, role, is_active, created_at, last_login_at)
      SELECT 
        'usr-enq-' || substr(md5(email), 1, 8),
        name,
        LOWER(email),
        $1,
        phone,
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        'user',
        true,
        submitted_at,
        submitted_at
      FROM enquiries
      ON CONFLICT (email) DO NOTHING;
    `, [studentPasswordHash]).catch((e) => console.warn('Enquiry user sync note:', e.message));

    // Ensure all legacy categories in database are updated to new global standards
    await pool.query(`
      UPDATE courses SET category = 'Data Science and AI' WHERE category IN ('DS & AI', 'Data Science & AI', 'DS and AI');
      UPDATE courses SET category = 'Data Analytics and AI' WHERE category IN ('DA & AI', 'Data Analytics & AI', 'DA and AI');
      UPDATE courses SET category = 'AI and Machine Learning' WHERE category IN ('AI & ML', 'AI & Machine Learning', 'AI and ML');

      UPDATE courses SET categories = REPLACE(categories::text, '"DS & AI"', '"Data Science and AI"')::json WHERE categories::text LIKE '%"DS & AI"%';
      UPDATE courses SET categories = REPLACE(categories::text, '"Data Science & AI"', '"Data Science and AI"')::json WHERE categories::text LIKE '%"Data Science & AI"%';
      UPDATE courses SET categories = REPLACE(categories::text, '"DA & AI"', '"Data Analytics and AI"')::json WHERE categories::text LIKE '%"DA & AI"%';
      UPDATE courses SET categories = REPLACE(categories::text, '"Data Analytics & AI"', '"Data Analytics and AI"')::json WHERE categories::text LIKE '%"Data Analytics & AI"%';
      UPDATE courses SET categories = REPLACE(categories::text, '"AI & ML"', '"AI and Machine Learning"')::json WHERE categories::text LIKE '%"AI & ML"%';
      UPDATE courses SET categories = REPLACE(categories::text, '"AI & Machine Learning"', '"AI and Machine Learning"')::json WHERE categories::text LIKE '%"AI & Machine Learning"%';

      UPDATE enquiries SET category = 'Data Science and AI' WHERE category IN ('DS & AI', 'Data Science & AI', 'DS and AI');
      UPDATE enquiries SET category = 'Data Analytics and AI' WHERE category IN ('DA & AI', 'Data Analytics & AI', 'DA and AI');
      UPDATE enquiries SET category = 'AI and Machine Learning' WHERE category IN ('AI & ML', 'AI & Machine Learning', 'AI and ML');
    `).catch((err) => console.warn('[DB] Category migration notice:', err.message));

    // Synchronize full course catalog with exact global category names into NeonDB
    console.log('📚 [DB] Synchronizing course catalog into NeonDB...');
    for (const course of initialCourses) {
      await pool.query(
        `INSERT INTO courses (
          id, slug, title, category, categories, short_description, description, image, price, original_price,
          duration, live_hours, lessons, level, rating, students, status, featured,
          skills, curriculum, modules, technology_stack, projects, career_readiness, outcome, features, requirements, who_is_it_for, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          categories = EXCLUDED.categories,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          image = EXCLUDED.image,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          duration = EXCLUDED.duration,
          live_hours = EXCLUDED.live_hours,
          lessons = EXCLUDED.lessons,
          level = EXCLUDED.level,
          skills = EXCLUDED.skills,
          curriculum = EXCLUDED.curriculum,
          modules = EXCLUDED.modules,
          technology_stack = EXCLUDED.technology_stack,
          projects = EXCLUDED.projects,
          career_readiness = EXCLUDED.career_readiness,
          outcome = EXCLUDED.outcome,
          features = EXCLUDED.features,
          requirements = EXCLUDED.requirements,
          who_is_it_for = EXCLUDED.who_is_it_for,
          updated_at = NOW()`,
        [
          course.id,
          course.slug,
          course.title,
          course.category,
          JSON.stringify(course.categories || [course.category]),
          course.shortDescription || null,
          course.description,
          course.image,
          course.price,
          course.originalPrice,
          course.duration,
          course.liveHours || null,
          course.lessons,
          course.level,
          course.rating,
          course.students,
          course.status,
          course.featured,
          JSON.stringify(course.skills || []),
          JSON.stringify(course.curriculum || []),
          JSON.stringify(course.modules || []),
          JSON.stringify(course.technologyStack || []),
          JSON.stringify(course.projects || []),
          JSON.stringify(course.careerReadiness || []),
          course.outcome || null,
          JSON.stringify(course.features || []),
          JSON.stringify(course.requirements || []),
          JSON.stringify(course.whoIsItFor || [])
        ]
      );
    }
    console.log(`✅ [DB] Synced ${initialCourses.length} courses into NeonDB.`);
  } catch (err: any) {
    console.error('⚠️ [DB] NeonDB connection or migration error:', err.message);
    isNeonConnected = false;
    connectionError = err.message;
  }
}

/**
 * Universal query runner: Uses Neon PostgreSQL when connected
 */
export async function query(text: string, params: any[] = []) {
  if (!dbReady || !isNeonConnected) {
    await ensureDbInitialized();
  }
  if (isNeonConnected && pool) {
    return pool.query(text, params);
  }
  throw new Error('NeonDB is offline. Handled by fallback.');
}

export { pool, isNeonConnected };
