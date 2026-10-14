import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

import { healthRouter } from './server/routes/health.ts';
import { authRouter } from './server/routes/auth.ts';
import { analysesRouter } from './server/routes/analyses.ts';
import { settingsRouter } from './server/routes/settings.ts';
import { aiRouter } from './server/routes/ai.ts';
import { reputationRouter } from './server/routes/reputation.ts';
import { requestIdMiddleware, errorHandler } from './server/middleware/security.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Security Headers (configured safely for development iFrame embedding)
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite inline dev scripts and iFrame embedding support
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS allowlist
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // 3. Request body parsers & limits (10mb for screenshot image uploads)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 4. Request ID & telemetry tagging
  app.use(requestIdMiddleware);

  // 5. Versioned API Endpoints under /api/v1
  app.use('/api/v1', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/analyses', analysesRouter);
  app.use('/api/v1', settingsRouter);
  app.use('/api/v1/ai', aiRouter);
  app.use('/api/v1/reputation', reputationRouter);

  // 6. Serve static public assets explicitly (stickers, icons, images)
  const publicPath = path.resolve(__dirname, 'public');
  app.use('/assets', express.static(path.resolve(publicPath, 'assets')));
  app.use(express.static(publicPath));

  // 7. Vite middleware (dev) vs Static Assets (prod)
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

  // 7. Centralized Error Handler
  app.use(errorHandler);

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScamShield AI] Server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });

  // Graceful shutdown
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
