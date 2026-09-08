import app from './app';
import { initDb } from './db';

const PORT = process.env.PORT || 5000;

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
