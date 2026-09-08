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

// Middleware to ensure DB is initialized on incoming requests (essential for Vercel Serverless)
app.use(async (_req, _res, next) => {
  try {
    await ensureDbInitialized();
  } catch (err) {
    console.error('Failed to ensure database initialization:', err);
  }
  next();
});

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Edqoo API Server',
    time: new Date().toISOString(),
    database: getDbStatus()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/enquiries', enquiriesRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
