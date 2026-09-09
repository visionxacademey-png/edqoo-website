import app from './app';
import { initDb } from './db';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.error('🔥 [Server] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 [Server] Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  await initDb();

  const server = app.listen(PORT, () => {
    console.log(`🚀 [Server] Edqoo API Server is running on http://localhost:${PORT}`);
    console.log(`🔒 [Security] Protected Admin routes active at /api/admin/*`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ [Server] Port ${PORT} is already in use. Retrying or active.`);
    } else {
      console.error('⚠️ [Server] Server error:', err);
    }
  });
}

startServer().catch(err => {
  console.error('Fatal startup error:', err);
});

