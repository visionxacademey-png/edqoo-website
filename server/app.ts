import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ensureDbInitialized, getDbStatus } from './db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import coursesRoutes from './routes/courses';
import enquiriesRoutes from './routes/enquiries';

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
  // Normalize URL when invoked through Vercel Serverless Function rewrites
  const vercelMatched = (req.headers['x-vercel-matched-path'] || req.headers['x-matched-path'] || req.headers['x-forwarded-uri']) as string;
  if (vercelMatched && vercelMatched.startsWith('/api')) {
    req.url = vercelMatched;
  } else if (req.query && typeof req.query['0'] === 'string' && !req.url.includes('/api/')) {
    req.url = `/api/${req.query['0']}`;
  }

  try {
    await ensureDbInitialized();
  } catch (err) {
    console.error('Failed to ensure database initialization:', err);
  }
  next();
});

// Health Check
app.get(['/api/health', '/health'], (_req, res) => {
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
