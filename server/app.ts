import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { healthRouter } from './routes/health.ts';
import { authRouter } from './routes/auth.ts';
import { analysesRouter } from './routes/analyses.ts';
import { settingsRouter } from './routes/settings.ts';
import { aiRouter } from './routes/ai.ts';
import { reputationRouter } from './routes/reputation.ts';
import { requestIdMiddleware, errorHandler } from './middleware/security.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createExpressApp() {
  const app = express();

  // 1. Security Headers (configured safely for Safari, Chrome, and Netlify)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      xFrameOptions: false,
    })
  );

  // 2. CORS allowlist
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // 3. Request body parsers (10mb for screenshot uploads)
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

  // 6. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
