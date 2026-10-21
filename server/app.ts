import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ensureDbInitialized, getDbStatus, query } from './db/index.js';
import { generalLimiter } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import coursesRoutes from './routes/courses.js';
import enquiriesRoutes from './routes/enquiries.js';
import instructorsRoutes from './routes/instructors.js';
import hiringRoutes from './routes/hiring.js';
import instructorApplicationsRoutes from './routes/instructorApplications.js';
import partnersRoutes from './routes/partners.js';
import leadershipRoutes from './routes/leadership.js';
import chatRoutes from './routes/chat.js';
import categoriesRoutes from './routes/categories.js';
import sitemapRoutes from './routes/sitemap.js';

dotenv.config();

const app = express();

// 1. HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Let React SPA fetch external fonts and media assets safely
  crossOriginEmbedderPolicy: false
}));

// 2. Strict CORS Configuration
const ALLOWED_ORIGINS = [
  'https://www.edqoo.com',
  'https://edqoo.com',
  'http://localhost:5173',
  'http://localhost:5001',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5001'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (tools, serverless rewrites, curl)
    if (!origin) return callback(null, true);
    if (
      ALLOWED_ORIGINS.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.edqoo.com')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Cross-Origin Request Blocked by Security Policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 3. Body parsers with sensible limits to prevent payload exhaustion attacks
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 4. General Rate Limiter on API requests
app.use(['/api', '/api/'], generalLimiter);


// Middleware to normalize Vercel serverless request URLs and ensure DB readiness
app.use(async (req, _res, next) => {
  // Extract original URL if invoked via Vercel Serverless Function rewrites
  const forwardedUri = (req.headers['x-forwarded-uri'] || req.headers['x-invoke-path'] || req.headers['x-vercel-invoke-path']) as string;
  
  if (forwardedUri && forwardedUri !== '/api' && forwardedUri !== '/api/' && (forwardedUri.startsWith('/api/') || forwardedUri.startsWith('/'))) {
    req.url = forwardedUri;
  } else if (req.query && typeof req.query['0'] === 'string') {
    // Wildcard rewrite from vercel.json: /api/(.*) -> destination /api passes subpath in req.query['0']
    const subPath = req.query['0'];
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== '0' && typeof value === 'string') {
        queryParams.set(key, value);
      }
    }
    const qs = queryParams.toString();
    req.url = `/api/${subPath.replace(/^\/+/, '')}${qs ? `?${qs}` : ''}`;
  }

  try {
    await ensureDbInitialized();
  } catch (err) {
    console.error('Failed to ensure database initialization:', err);
  }
  next();
});

// Diagnostic Database Endpoint (Disabled in production to prevent information disclosure)
app.get(['/api/debug/database', '/debug/database'], async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  try {

    await ensureDbInitialized();
    const timeRes = await query('SELECT NOW()');
    const countRes = await query('SELECT COUNT(*) FROM courses');
    const coursesCount = parseInt(countRes.rows[0].count, 10);
    const sampleRes = await query('SELECT id, slug, title, category, status FROM courses ORDER BY created_at DESC LIMIT 10');
    
    console.log('[DB DEBUG]');
    console.log(`Database host: ${getDbStatus().databaseHost}`);
    console.log(`Database name: neondb`);
    console.log(`Course count from DB: ${coursesCount}`);

    return res.json({
      databaseConnected: true,
      courseCount: coursesCount,
      databaseHost: getDbStatus().databaseHost,
      dbTime: timeRes.rows[0].now,
      sampleCourses: sampleRes.rows
    });
  } catch (err: any) {
    console.error('🔥 [DB DEBUG] Diagnostic query failed:', err);
    return res.status(500).json({
      databaseConnected: false,
      courseCount: 0,
      error: err.message,
      databaseHost: getDbStatus().databaseHost
    });
  }
});

// Health & Root Status Checks
app.get(['/api/health', '/health', '/api', '/'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Edqoo API Server',
    time: new Date().toISOString(),
    database: getDbStatus()
  });
});

// Mount Routes (support both /api/... and /... for Vercel Serverless Function invocations)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/courses', '/courses'], coursesRoutes);
app.use(['/api/categories', '/categories'], categoriesRoutes);
app.use(['/api/enquiries', '/enquiries', '/api/contact', '/contact'], enquiriesRoutes);
app.use(['/api/instructors', '/instructors'], instructorsRoutes);
app.use(['/api/hiring-enquiries', '/hiring-enquiries'], hiringRoutes);
app.use(['/api/instructor-applications', '/instructor-applications'], instructorApplicationsRoutes);
app.use(['/api/partner-enquiries', '/partner-enquiries'], partnersRoutes);
app.use(['/api/leadership', '/leadership'], leadershipRoutes);
app.use(['/api/chat', '/chat'], chatRoutes);
app.use(['/api', '/'], sitemapRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
