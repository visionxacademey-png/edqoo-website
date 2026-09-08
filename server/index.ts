import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, getDbStatus } from './db';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import coursesRoutes from './routes/courses';
import enquiriesRoutes from './routes/enquiries';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & Root
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

// Initialize database and start server
async function startServer() {
  await initDb();
  
  app.listen(PORT, () => {
    console.log(`🚀 [Server] Edqoo API Server is running on http://localhost:${PORT}`);
    console.log(`🔒 [Security] Protected Admin routes active at /api/admin/*`);
  });
}

startServer().catch(err => {
  console.error('Fatal startup error:', err);
});
