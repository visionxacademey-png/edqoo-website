import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
import { seedEnglishMirrorCourses } from './seedEnglishMirror.js';
import { seedCategories } from './seedCategories.js';

dotenv.config();

// Global Neon WebSocket configuration for Node.js
neonConfig.webSocketConstructor = ws;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_5gFTKWixPID6@ep-calm-queen-aekocvb3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const DATABASE_URL = (rawDbUrl && rawDbUrl !== 'YOUR_NEON_DATABASE_URL_HERE') ? rawDbUrl : DEFAULT_NEON_URL;

let pool: Pool | null = null;
let isNeonConnected = false;
let connectionError: string | null = null;
let lastDbHost: string = 'unknown';

function getMaskedDbHost(url: string): string {
  try {
    const parsed = new URL(url.replace(/^postgresql:\/\//, 'http://'));
    return parsed.hostname || 'neon.tech';
  } catch {
    return 'neon.tech';
  }
}

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
  courses: [] as any[],
  categories: [] as any[],
  instructors: [] as any[],
  enquiries: [] as any[],
  hiringEnquiries: [] as any[],
  instructorApplications: [] as any[],
  partnerEnquiries: [] as any[],
  leadershipMembers: [] as any[]
};

export function isDbConnected(): boolean {
  return isNeonConnected && pool !== null;
}

export const getDbStatus = () => ({
  connected: isNeonConnected && pool !== null,
  type: (isNeonConnected && pool !== null) ? 'neondatabase_postgresql' : 'in_memory_fallback',
  databaseUrlConfigured: !!DATABASE_URL && DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE',
  databaseHost: lastDbHost,
  error: connectionError
});

let initPromise: Promise<void> | null = null;
let dbReady = false;
let schemaVerified = false;

/**
 * Returns or initializes the shared Neon connection pool with sensible limits and error handling.
 */
export function getOrCreatePool(): Pool {
  if (!pool) {
    lastDbHost = getMaskedDbHost(DATABASE_URL);
    console.log(`⚡ [DB] Initializing NeonDB PostgreSQL connection pool (${lastDbHost})...`);
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000
    });

    pool.on('error', (err: any) => {
      console.warn('⚠️ [DB] Neon pool idle client notice:', err?.message || err);
    });
  }
  return pool;
}

/**
 * Safely tear down and reset the connection pool on broken connections.
 */
export async function resetPool(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
    } catch {
      // ignore errors during teardown
    }
    pool = null;
  }
}

/**
 * Ensures the database is initialized. Single-flight promise pattern prevents duplicate calls.
 */
export function ensureDbInitialized(): Promise<void> {
  if (dbReady && isNeonConnected && pool) {
    return Promise.resolve();
  }
  if (!initPromise) {
    initPromise = initDb()
      .then(() => {
        dbReady = true;
        isNeonConnected = true;
      })
      .catch((err) => {
        console.error('⚠️ [DB] Database initialization error:', err?.message || err);
        // Reset initPromise so subsequent requests can retry
        initPromise = null;
        dbReady = false;
        isNeonConnected = false;
        throw err;
      });
  }
  return initPromise;
}

/**
 * Initializes the Neon PostgreSQL pool and verifies connectivity.
 * Heavy migrations run asynchronously in the background so API startup is near-instant.
 */
export async function initDb(): Promise<void> {
  if (dbReady && isNeonConnected && pool) return;

  // Pre-seed mock store with default administrator and student for local memory fallback
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
  }

  if (!DATABASE_URL || DATABASE_URL === 'YOUR_NEON_DATABASE_URL_HERE') {
    console.log('⚡ [DB] DATABASE_URL not configured. Running in local memory fallback mode.');
    isNeonConnected = false;
    connectionError = 'DATABASE_URL environment variable is not configured.';
    dbReady = true;
    return;
  }

  try {
    const currentPool = getOrCreatePool();

    // 1. Fast connectivity test
    const testResult = await currentPool.query('SELECT NOW()');
    isNeonConnected = true;
    connectionError = null;
    dbReady = true;
    console.log(`✅ [DB] Successfully connected to NeonDB at ${testResult.rows[0].now} (host: ${lastDbHost})`);

    // 2. Perform background schema check and cache sync without blocking API requests
    if (!schemaVerified) {
      runSchemaVerificationAndSync(currentPool).catch((err: any) => {
        console.warn('⚠️ [DB] Background schema verification notice:', err?.message || err);
      });
    }
  } catch (err: any) {
    console.error('⚠️ [DB] NeonDB connection error during initialization:', err?.message || err);
    isNeonConnected = false;
    connectionError = err?.message || 'Database connection error';
    dbReady = false;
    throw err;
  }
}

/**
 * Background schema verification and memory cache sync.
 * Skips redundant DDL migrations if core tables are already present.
 */
async function runSchemaVerificationAndSync(poolInstance: Pool) {
  const adminPasswordHash = '$2a$10$tZ8V4K9y6t4X0V1b8G4D4eYd0oV.5YtY3wN2qG6K8mP0uL2rS4t';
  try {
    // Check if core tables already exist
    const tablesCheck = await poolInstance.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('courses', 'users', 'categories')
    `);
    const foundTables = new Set(tablesCheck.rows.map((r: any) => r.table_name));

    if (!foundTables.has('courses') || !foundTables.has('users') || !foundTables.has('categories')) {
      console.log('🔄 [DB] Creating core tables and running safe migrations...');
      await poolInstance.query(`
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
        supporting_text TEXT,
        highlight_text TEXT,
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

      ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_id VARCHAR(100);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_ids JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS short_description TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS live_hours VARCHAR(100);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS technology_stack JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS career_readiness JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS outcome TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS who_is_it_for JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS hero_image TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS preview_video TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS admissions_info TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS program_highlights JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS seo_description TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS seo_keywords JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS supporting_text TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS highlight_text TEXT;

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

      CREATE TABLE IF NOT EXISTS instructors (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        image TEXT,
        profile_image TEXT,
        short_bio TEXT,
        detailed_bio TEXT,
        qualifications VARCHAR(255),
        experience VARCHAR(100),
        expertise JSONB DEFAULT '[]'::jsonb,
        certifications JSONB DEFAULT '[]'::jsonb,
        courses JSONB DEFAULT '[]'::jsonb,
        projects JSONB DEFAULT '[]'::jsonb,
        linkedin VARCHAR(255),
        email VARCHAR(255),
        teaching_experience TEXT,
        industry_experience TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS hiring_enquiries (
        id VARCHAR(100) PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        job_role VARCHAR(255) NOT NULL,
        openings VARCHAR(100),
        required_skills TEXT,
        experience VARCHAR(100),
        location VARCHAR(255),
        work_mode VARCHAR(50) DEFAULT 'Remote',
        additional_requirements TEXT,
        status VARCHAR(50) DEFAULT 'New',
        notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS instructor_applications (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        qualification VARCHAR(255) NOT NULL,
        expertise TEXT NOT NULL,
        experience VARCHAR(100) NOT NULL,
        linkedin VARCHAR(255),
        portfolio VARCHAR(255),
        courses TEXT NOT NULL,
        teaching_experience VARCHAR(100),
        bio TEXT NOT NULL,
        resume TEXT,
        additional_info TEXT,
        status VARCHAR(50) DEFAULT 'New',
        notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS partner_enquiries (
        id VARCHAR(100) PRIMARY KEY,
        organization_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        organization_type VARCHAR(100) NOT NULL,
        partnership_area VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        location VARCHAR(255),
        proposal TEXT NOT NULL,
        additional_info TEXT,
        status VARCHAR(50) DEFAULT 'New',
        notes TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS leadership_members (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        profile_image TEXT,
        designation VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        qualification VARCHAR(255),
        experience VARCHAR(100),
        expertise JSONB DEFAULT '[]'::jsonb,
        short_bio TEXT NOT NULL,
        detailed_bio TEXT,
        leadership_experience TEXT,
        achievements JSONB DEFAULT '[]'::jsonb,
        publications JSONB DEFAULT '[]'::jsonb,
        linkedin VARCHAR(255),
        website VARCHAR(255),
        email VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        subtitle TEXT,
        icon VARCHAR(100) DEFAULT 'layers',
        hero_image TEXT,
        hero_badge VARCHAR(255),
        highlights JSONB DEFAULT '[]'::jsonb,
        curriculum_pillars JSONB DEFAULT '[]'::jsonb,
        faqs JSONB DEFAULT '[]'::jsonb,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        is_partner BOOLEAN DEFAULT false,
        badge VARCHAR(100),
        seo_title VARCHAR(255),
        seo_description TEXT,
        meta_keywords JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id VARCHAR(100);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_slug VARCHAR(255);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS course_details JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS key_highlights JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS learning_benefits JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS batch_timings JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS learning_format VARCHAR(255);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS supporting_text VARCHAR(255);
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS highlight_text VARCHAR(255);
      CREATE UNIQUE INDEX IF NOT EXISTS categories_name_lower_idx ON categories (LOWER(TRIM(name)));
    `);

      console.log('✅ [DB] NeonDB core tables created successfully.');
    } else {
      console.log('✅ [DB] NeonDB core tables verified (existing schema intact).');
    }
    schemaVerified = true;

    // 3. Check and seed default administrator if missing
    try {
      const adminCheck = await poolInstance.query('SELECT id FROM users WHERE email = $1', ['admin@edqoo.com']);
      if (adminCheck.rows.length === 0) {
        await poolInstance.query(
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
        console.log('👑 [DB] Seeded default administrator account: admin@edqoo.com');
      }
    } catch (adminErr: any) {
      console.warn('Admin seed notice:', adminErr.message);
    }

    // 4. Check total user count in production database
    try {
      const userCountRes = await poolInstance.query('SELECT COUNT(*) FROM users');
      console.log(`📊 [DB] Total registered production users: ${userCountRes.rows[0].count}`);
    } catch (countErr: any) {
      console.warn('User count query notice:', countErr.message);
    }

    // 5. Sync live database records into in-memory store for instant memory cache
    try {
      const liveCourses = await poolInstance.query('SELECT * FROM courses ORDER BY created_at ASC');
      if (liveCourses.rows.length > 0) {
        mockStore.courses = liveCourses.rows.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          category: row.category,
          categories: typeof row.categories === 'string' ? JSON.parse(row.categories) : (row.categories || [row.category]),
          shortDescription: row.short_description,
          description: row.description || '',
          image: row.image,
          price: Number(row.price),
          originalPrice: Number(row.original_price),
          duration: row.duration,
          liveHours: row.live_hours,
          lessons: Number(row.lessons),
          level: row.level,
          rating: Number(row.rating),
          students: Number(row.students),
          status: row.status,
          featured: Boolean(row.featured),
          skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : (row.skills || []),
          curriculum: typeof row.curriculum === 'string' ? JSON.parse(row.curriculum) : (row.curriculum || []),
          modules: typeof row.modules === 'string' ? JSON.parse(row.modules) : (row.modules || []),
          technologyStack: typeof row.technology_stack === 'string' ? JSON.parse(row.technology_stack) : (row.technology_stack || []),
          projects: typeof row.projects === 'string' ? JSON.parse(row.projects) : (row.projects || []),
          careerReadiness: typeof row.career_readiness === 'string' ? JSON.parse(row.career_readiness) : (row.career_readiness || []),
          outcome: row.outcome,
          features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
          requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements) : (row.requirements || []),
          whoIsItFor: typeof row.who_is_it_for === 'string' ? JSON.parse(row.who_is_it_for) : (row.who_is_it_for || []),
          seoTitle: row.seo_title,
          seoDescription: row.seo_description,
          seoKeywords: typeof row.seo_keywords === 'string' ? JSON.parse(row.seo_keywords) : (row.seo_keywords || []),
          createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
          updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
          imageUpdatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now()
        }));
      }

      const liveInstructors = await poolInstance.query('SELECT * FROM instructors ORDER BY created_at ASC');
      if (liveInstructors.rows.length > 0) {
        mockStore.instructors = liveInstructors.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          role: row.designation,
          designation: row.designation,
          organization: row.organization,
          image: row.image,
          profileImage: row.profile_image || row.image,
          shortBio: row.short_bio,
          detailedBio: row.detailed_bio,
          qualifications: row.qualifications,
          experience: row.experience,
          expertise: typeof row.expertise === 'string' ? JSON.parse(row.expertise) : (row.expertise || []),
          certifications: typeof row.certifications === 'string' ? JSON.parse(row.certifications) : (row.certifications || []),
          courses: typeof row.courses === 'string' ? JSON.parse(row.courses) : (row.courses || []),
          projects: typeof row.projects === 'string' ? JSON.parse(row.projects) : (row.projects || []),
          linkedin: row.linkedin,
          email: row.email,
          teachingExperience: row.teaching_experience,
          industryExperience: row.industry_experience,
          updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
          imageUpdatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now()
        }));
      }

      const liveLeadership = await poolInstance.query('SELECT * FROM leadership_members ORDER BY display_order ASC, created_at ASC');
      if (liveLeadership.rows.length > 0) {
        mockStore.leadershipMembers = liveLeadership.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          profileImage: row.profile_image,
          designation: row.designation,
          organization: row.organization,
          qualification: row.qualification,
          experience: row.experience,
          expertise: typeof row.expertise === 'string' ? JSON.parse(row.expertise) : (row.expertise || []),
          shortBio: row.short_bio,
          detailedBio: row.detailed_bio,
          leadershipExperience: row.leadership_experience,
          achievements: typeof row.achievements === 'string' ? JSON.parse(row.achievements) : (row.achievements || []),
          publications: typeof row.publications === 'string' ? JSON.parse(row.publications) : (row.publications || []),
          linkedin: row.linkedin,
          website: row.website,
          email: row.email,
          displayOrder: row.display_order,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }

      const liveCategories = await poolInstance.query('SELECT * FROM categories ORDER BY display_order ASC, created_at ASC');
      if (liveCategories.rows.length > 0) {
        mockStore.categories = liveCategories.rows.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          title: row.title,
          description: row.description,
          subtitle: row.subtitle,
          icon: row.icon || 'layers',
          heroImage: row.hero_image,
          heroBadge: row.hero_badge,
          highlights: typeof row.highlights === 'string' ? JSON.parse(row.highlights) : (row.highlights || []),
          curriculumPillars: typeof row.curriculum_pillars === 'string' ? JSON.parse(row.curriculum_pillars) : (row.curriculum_pillars || []),
          faqs: typeof row.faqs === 'string' ? JSON.parse(row.faqs) : (row.faqs || []),
          displayOrder: Number(row.display_order) || 0,
          isActive: Boolean(row.is_active),
          isPartner: Boolean(row.is_partner),
          badge: row.badge,
          seoTitle: row.seo_title,
          seoDescription: row.seo_description,
          metaKeywords: typeof row.meta_keywords === 'string' ? JSON.parse(row.meta_keywords) : (row.meta_keywords || []),
          parentId: row.parent_id || undefined,
          parentSlug: row.parent_slug || undefined,
          features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
          courseDetails: typeof row.course_details === 'string' ? JSON.parse(row.course_details) : (row.course_details || {}),
          keyHighlights: typeof row.key_highlights === 'string' ? JSON.parse(row.key_highlights) : (row.key_highlights || []),
          learningBenefits: typeof row.learning_benefits === 'string' ? JSON.parse(row.learning_benefits) : (row.learning_benefits || []),
          batchTimings: typeof row.batch_timings === 'string' ? JSON.parse(row.batch_timings) : (row.batch_timings || []),
          learningFormat: row.learning_format || undefined,
          supportingText: row.supporting_text || undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
      }
    } catch (mockSyncErr: any) {
      console.warn('[DB] Live memory store sync notice:', mockSyncErr.message);
    }

    // Check total course count; only seed categories & English Mirror if DB courses are empty
    try {
      const courseCountRes = await poolInstance.query('SELECT count(*) FROM courses');
      const courseCount = Number(courseCountRes.rows[0]?.count || 0);
      console.log(`📊 [DB] Total registered production courses: ${courseCount}`);

      if (courseCount === 0) {
        console.log('🌱 [DB] Courses table is empty, seeding categories & English Mirror courses...');
        await seedCategories(poolInstance, mockStore);
        await seedEnglishMirrorCourses(poolInstance, mockStore);
      }
    } catch (seedErr: any) {
      console.warn('⚠️ [DB] Seeding notice:', seedErr.message);
    }
  } catch (err: any) {
    console.warn('⚠️ [DB] Schema verification notice:', err?.message || err);
  }
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

function isTransientDbError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = err.code;
  return (
    msg.includes('connection terminated') ||
    msg.includes('timeout') ||
    msg.includes('connection closed') ||
    msg.includes('econnreset') ||
    msg.includes('websocket is not open') ||
    msg.includes('client has encountered a connection error') ||
    msg.includes('neon') ||
    code === '57P01' ||
    code === '57P02' ||
    code === '57P03' ||
    code === '08006' ||
    code === '08001' ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT'
  );
}

/**
 * Universal query runner with bounded retries and exponential backoff
 */
export async function query(text: string, params: any[] = []) {
  if (!dbReady || !isNeonConnected || !pool) {
    try {
      await ensureDbInitialized();
    } catch (initErr: any) {
      throw new Error(`NeonDB is offline: ${initErr?.message || 'Database unavailable'}`);
    }
  }

  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const currentPool = getOrCreatePool();
      return await currentPool.query(text, params);
    } catch (err: any) {
      lastError = err;
      console.warn(`⚠️ [DB] Query attempt ${attempt}/${MAX_RETRIES} encountered error:`, err.message);

      if (attempt < MAX_RETRIES && isTransientDbError(err)) {
        if (
          err.message?.includes('Connection terminated') ||
          err.message?.includes('WebSocket is not open') ||
          err.message?.includes('connection error')
        ) {
          try {
            await resetPool();
          } catch {}
        }
        const delayMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.log(`🔄 [DB] Retrying database query in ${delayMs}ms (attempt ${attempt + 1})...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        break;
      }
    }
  }

  isNeonConnected = false;
  connectionError = lastError?.message || 'Query failed after retries';
  throw lastError;
}

export { pool, isNeonConnected };

