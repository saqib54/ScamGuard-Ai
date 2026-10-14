import { Router, type Request, type Response } from 'express';

export const healthRouter = Router();

// GET /api/v1/health
healthRouter.get('/health', (_req: Request, res: Response) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    process.env.GEMINI_API_KEY.trim() !== ''
  );

  res.json({
    status: 'ok',
    service: 'ScamShield AI Analysis Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    features: {
      database: 'connected',
      heuristics: 'active',
      geminiEngine: hasGeminiKey ? 'configured' : 'fallback-mode',
      languages: ['en', 'ur', 'ru'],
      ssrfProtection: 'active',
    },
  });
});
