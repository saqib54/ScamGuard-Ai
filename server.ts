import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { createExpressApp } from './server/app.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createExpressApp();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  // Serve static public assets explicitly (stickers, icons, images, docs)
  const publicPath = path.resolve(__dirname, 'public');
  app.use('/assets', express.static(path.resolve(publicPath, 'assets')));
  app.use('/docs', express.static(path.resolve(publicPath, 'docs')));
  app.use(express.static(publicPath));

  // Vite middleware (dev) vs Static Assets (prod)
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScamShield AI] Server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });

  const shutdown = () => {
    console.log('[ScamShield AI] Shutting down gracefully...');
    server.close(() => {
      console.log('[ScamShield AI] Closed out remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('[ScamShield AI] Fatal error starting server:', err);
  process.exit(1);
});
