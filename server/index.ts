import app from './app.js';
import { initDb } from './db/index.js';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.error('🔥 [Server] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 [Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 [Server] Edqoo API Server is running on http://localhost:${PORT}`);
    console.log(`🔒 [Security] Protected Admin routes active at /api/admin/*`);
  });

  // Initialize DB connection in background without blocking port binding
  initDb().catch((err) => {
    console.error('⚠️ [DB] Background database init note:', err.message);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ [Server] Port ${PORT} is already in use. Retrying or active.`);
    } else {
      console.error('⚠️ [Server] Server error:', err);
    }
  });
}

startServer();

