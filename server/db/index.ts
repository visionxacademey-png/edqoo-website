import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { courses as initialCourses } from '../../src/data/courses';

dotenv.config();

// Global Neon WebSocket configuration for Node.js
neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL || '';

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
}

export interface MockSession {
  id: string;
  user_id: string;
  email: string;
  token_hash: string;
  ip_address: string;
  user_agent: string;
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

export const getDbStatus = () => ({
  connected: isNeonConnected,
  type: isNeonConnected ? 'neondatabase_postgresql' : 'in_memory_fallback',
  databaseUrlConfigured: !!DATABASE_URL && DATABASE_URL !== 'YOUR_NEON_DATABASE_URL_HERE',
  error: connectionError
});

let initPromise: Promise<void> | null = null;

export function ensureDbInitialized() {
  if (!initPromise) {
    initPromise = initDb().catch((err) => {
      console.error('Database initialization error:', err);
      initPromise = null;
    });
  }
  return initPromise;
}

/**
 * Initializes the Neon PostgreSQL pool and creates required tables
 */
export async function initDb() {
  // Pre-seed mock store with default administrator
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123456', 10);

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
        last_login_at: new Date().toISOString()
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
        last_login_at: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    );

    // Initial session for demonstration
    mockStore.sessions.push({
      id: 'sess-demo-01',
      user_id: 'usr-admin-01',
      email: 'admin@edqoo.com',
      token_hash: 'init_token_hash_admin',
      ip_address: '127.0.0.1 (Localhost)',
      user_agent: 'Chrome 122.0.0 / Windows 11',
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
    return;
  }

  try {
    console.log('⚡ [DB] Connecting to NeonDB PostgreSQL...');
    pool = new Pool({ connectionString: DATABASE_URL, connectionTimeoutMillis: 5000 });

    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    isNeonConnected = true;
    connectionError = null;
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
        description TEXT,
        image TEXT,
        price NUMERIC DEFAULT 0,
        original_price NUMERIC DEFAULT 0,
        duration VARCHAR(100),
        lessons INTEGER DEFAULT 0,
        level VARCHAR(100),
        rating NUMERIC DEFAULT 4.8,
        students INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'available',
        featured BOOLEAN DEFAULT false,
        skills JSONB DEFAULT '[]'::jsonb,
        modules JSONB DEFAULT '[]'::jsonb,
        requirements JSONB DEFAULT '[]'::jsonb,
        who_is_it_for JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        program VARCHAR(255),
        experience_level VARCHAR(100),
        learning_mode VARCHAR(100),
        location VARCHAR(100),
        preferred_contact_method VARCHAR(100),
        preferred_callback_time VARCHAR(100),
        message TEXT,
        status VARCHAR(100) DEFAULT 'Submitted',
        notes TEXT,
        last_contacted_date TIMESTAMP WITH TIME ZONE,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ [DB] NeonDB tables verified / created successfully.');

    // Check if admin user exists in NeonDB, if not seed it
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

    // Check if courses exist in NeonDB, if not seed initial courses
    const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
    if (parseInt(courseCount.rows[0].count, 10) === 0) {
      console.log('📚 [DB] Seeding initial course catalog into NeonDB...');
      for (const course of initialCourses) {
        await pool.query(
          `INSERT INTO courses (
            id, slug, title, category, description, image, price, original_price,
            duration, lessons, level, rating, students, status, featured,
            skills, modules, requirements, who_is_it_for, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING`,
          [
            course.id,
            course.slug,
            course.title,
            course.category,
            course.description,
            course.image,
            course.price,
            course.originalPrice,
            course.duration,
            course.lessons,
            course.level,
            course.rating,
            course.students,
            course.status,
            course.featured,
            JSON.stringify(course.skills || []),
            JSON.stringify(course.modules || []),
            JSON.stringify(course.requirements || []),
            JSON.stringify(course.whoIsItFor || [])
          ]
        );
      }
      console.log(`✅ [DB] Seeded ${initialCourses.length} courses into NeonDB.`);
    }
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
  if (isNeonConnected && pool) {
    return pool.query(text, params);
  }
  throw new Error('NeonDB is offline. Handled by fallback.');
}

export { pool, isNeonConnected };
