import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ensureDbInitialized, getDbStatus } from './db/index.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import coursesRoutes from './routes/courses.js';
import enquiriesRoutes from './routes/enquiries.js';

dotenv.config();

const app = express();

// Security & Body Parsing Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
app.use(['/api/enquiries', '/enquiries'], enquiriesRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
